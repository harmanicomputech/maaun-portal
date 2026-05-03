import { Router } from "express";
import { eq, and, gte, lte, or } from "drizzle-orm";
import {
  db,
  timetablesTable, coursesTable, lecturersTable, usersTable, venuesTable,
  studentsTable, enrollmentsTable,
  announcementsTable,
  paymentsTable, feesTable,
  disciplinaryCasesTable, disciplinaryActionsTable,
  hostelApplicationsTable, hostelAllocationsTable, bedSpacesTable, roomsTable, hostelsTable,
  graduationApplicationsTable,
  welfareCasesTable,
} from "@workspace/db";
import { requireAuth } from "../lib/auth-middleware";

const router = Router();

// ── Shared types ──────────────────────────────────────────────────────────────

export type CalendarEventType =
  | "class"
  | "announcement"
  | "payment"
  | "disciplinary"
  | "graduation"
  | "welfare"
  | "hostel";

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  startDate: string; // ISO
  endDate?: string;  // ISO
  location?: string;
  route: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const DOW_INDEX: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6,
};

/** Expand a recurring weekly timetable entry into concrete dates for the month */
function expandTimetable(
  entries: Array<{
    id: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    courseCode: string;
    courseTitle: string;
    venueName: string;
    venueLocation: string | null;
    route: string;
  }>,
  year: number,
  month: number, // 0-indexed
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dow = date.getDay(); // 0=Sun … 6=Sat

    for (const e of entries) {
      if (DOW_INDEX[e.dayOfWeek] !== dow) continue;

      const [sh = 0, sm = 0] = e.startTime.split(":").map(Number);
      const [eh = 0, em = 0] = e.endTime.split(":").map(Number);

      const start = new Date(year, month, day, sh, sm);
      const end   = new Date(year, month, day, eh, em);

      events.push({
        id: `timetable-${e.id}-${year}-${month}-${day}`,
        title: `${e.courseCode} – ${e.courseTitle}`,
        type: "class",
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        location: e.venueLocation ?? e.venueName,
        route: e.route,
      });
    }
  }
  return events;
}

/** Fetch all timetable rows with joins */
async function fetchAllTimetables() {
  return db
    .select({
      id: timetablesTable.id,
      dayOfWeek: timetablesTable.dayOfWeek,
      startTime: timetablesTable.startTime,
      endTime: timetablesTable.endTime,
      courseCode: coursesTable.courseCode,
      courseTitle: coursesTable.title,
      courseId: coursesTable.id,
      department: coursesTable.department,
      lecturerId: lecturersTable.id,
      lecturerUserId: lecturersTable.userId,
      venueName: venuesTable.name,
      venueLocation: venuesTable.location,
    })
    .from(timetablesTable)
    .innerJoin(coursesTable, eq(timetablesTable.courseId, coursesTable.id))
    .innerJoin(lecturersTable, eq(timetablesTable.lecturerId, lecturersTable.id))
    .innerJoin(venuesTable, eq(timetablesTable.venueId, venuesTable.id));
}

// ── GET /api/calendar ─────────────────────────────────────────────────────────

router.get("/calendar", requireAuth, async (req, res) => {
  const { month: monthParam } = req.query; // e.g. "2025-05"
  const { role, userId } = req.user!;

  // Parse month or default to current
  let year: number;
  let month: number; // 0-indexed
  if (typeof monthParam === "string" && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [y, m] = monthParam.split("-").map(Number);
    year = y;
    month = m - 1;
  } else {
    const now = new Date();
    year  = now.getFullYear();
    month = now.getMonth();
  }

  const monthStart = new Date(year, month, 1);
  const monthEnd   = new Date(year, month + 1, 0, 23, 59, 59);

  const events: CalendarEvent[] = [];

  // ── 1. Timetable (class events) ──────────────────────────────────────────────

  if (["admin", "super_admin", "hod", "dean", "registrar"].includes(role)) {
    // All entries
    const rows = await fetchAllTimetables();
    events.push(...expandTimetable(
      rows.map(r => ({ ...r, route: role === "admin" || role === "super_admin" ? "/admin/timetable" : `/${role}/timetable` })),
      year, month,
    ));

  } else if (role === "lecturer") {
    const [lec] = await db.select({ id: lecturersTable.id })
      .from(lecturersTable).where(eq(lecturersTable.userId, userId)).limit(1);
    if (lec) {
      const rows = await fetchAllTimetables();
      const mine = rows.filter(r => r.lecturerId === lec.id);
      events.push(...expandTimetable(mine.map(r => ({ ...r, route: "/lecturer/timetable" })), year, month));
    }

  } else if (role === "student") {
    const [stu] = await db.select({ id: studentsTable.id })
      .from(studentsTable).where(eq(studentsTable.userId, userId)).limit(1);
    if (stu) {
      const enrollments = await db
        .select({ courseId: enrollmentsTable.courseId })
        .from(enrollmentsTable)
        .where(and(eq(enrollmentsTable.studentId, stu.id), eq(enrollmentsTable.status, "active")));
      const enrolledIds = new Set(enrollments.map(e => e.courseId));
      const rows = await fetchAllTimetables();
      const mine = rows.filter(r => enrolledIds.has(r.courseId));
      events.push(...expandTimetable(mine.map(r => ({ ...r, route: "/student/timetable" })), year, month));
    }
  }

  // ── 2. Announcements with expiry dates ───────────────────────────────────────

  {
    const rows = await db
      .select({
        id: announcementsTable.id,
        title: announcementsTable.title,
        targetRoles: announcementsTable.targetRoles,
        expiresAt: announcementsTable.expiresAt,
        createdAt: announcementsTable.createdAt,
        isPinned: announcementsTable.isPinned,
      })
      .from(announcementsTable);

    const annRoute = ["admin", "super_admin"].includes(role) ? "/admin/announcements" : "/announcements";

    for (const a of rows) {
      const roles = a.targetRoles as string[];
      if (!roles.includes(role)) continue;

      // Event for announcement creation date (if within month)
      if (a.createdAt >= monthStart && a.createdAt <= monthEnd) {
        events.push({
          id: `ann-created-${a.id}`,
          title: `📢 ${a.title}`,
          type: "announcement",
          startDate: a.createdAt.toISOString(),
          route: annRoute,
        });
      }

      // Event for expiry date (if set and within month)
      if (a.expiresAt && a.expiresAt >= monthStart && a.expiresAt <= monthEnd) {
        events.push({
          id: `ann-expires-${a.id}`,
          title: `⏳ Expires: ${a.title}`,
          type: "announcement",
          startDate: a.expiresAt.toISOString(),
          route: annRoute,
        });
      }
    }
  }

  // ── 3. Payments (student + bursar + admin) ───────────────────────────────────

  if (["student", "bursar", "admin", "super_admin"].includes(role)) {
    const rows = await db
      .select({
        id: paymentsTable.id,
        amount: paymentsTable.amount,
        status: paymentsTable.status,
        paidAt: paymentsTable.paidAt,
        createdAt: paymentsTable.createdAt,
        feeName: feesTable.name,
        payUserId: paymentsTable.userId,
      })
      .from(paymentsTable)
      .innerJoin(feesTable, eq(paymentsTable.feeId, feesTable.id));

    const relevant = role === "student"
      ? rows.filter(r => r.payUserId === userId)
      : rows;

    const payRoute = role === "student" ? "/student/payments"
      : role === "bursar" ? "/bursar/payments"
      : "/admin/payments";

    for (const p of relevant) {
      const dateToUse = p.paidAt ?? p.createdAt;
      if (dateToUse >= monthStart && dateToUse <= monthEnd) {
        events.push({
          id: `payment-${p.id}`,
          title: `${p.status === "success" ? "✅" : "⏳"} ${p.feeName} – ₦${(p.amount / 100).toLocaleString()}`,
          type: "payment",
          startDate: dateToUse.toISOString(),
          route: payRoute,
        });
      }
    }
  }

  // ── 4. Disciplinary actions (student, admin, dean, counsellor) ───────────────

  if (["student", "admin", "super_admin", "dean", "counsellor"].includes(role)) {
    const rows = await db
      .select({
        id: disciplinaryActionsTable.id,
        caseId: disciplinaryActionsTable.caseId,
        actionType: disciplinaryActionsTable.actionType,
        startDate: disciplinaryActionsTable.startDate,
        endDate: disciplinaryActionsTable.endDate,
        studentId: disciplinaryCasesTable.studentId,
        caseTitle: disciplinaryCasesTable.title,
        studentUserId: studentsTable.userId,
      })
      .from(disciplinaryActionsTable)
      .innerJoin(disciplinaryCasesTable, eq(disciplinaryActionsTable.caseId, disciplinaryCasesTable.id))
      .innerJoin(studentsTable, eq(disciplinaryCasesTable.studentId, studentsTable.id));

    const relevant = role === "student"
      ? rows.filter(r => r.studentUserId === userId)
      : rows;

    const discRoute = ["admin", "super_admin"].includes(role) ? "/admin/disciplinary"
      : role === "student" ? "/student/disciplinary"
      : `/${role}/disciplinary`;

    for (const d of relevant) {
      const startDate = new Date(d.startDate);
      if (startDate >= monthStart && startDate <= monthEnd) {
        events.push({
          id: `disc-start-${d.id}`,
          title: `⚠️ ${d.actionType}: ${d.caseTitle}`,
          type: "disciplinary",
          startDate: startDate.toISOString(),
          endDate: d.endDate ? new Date(d.endDate).toISOString() : undefined,
          route: discRoute,
        });
      }
    }
  }

  // ── 5. Graduation applications ───────────────────────────────────────────────

  if (["student", "admin", "super_admin", "registrar", "dean"].includes(role)) {
    const rows = await db
      .select({
        id: graduationApplicationsTable.id,
        status: graduationApplicationsTable.status,
        createdAt: graduationApplicationsTable.createdAt,
        reviewedAt: graduationApplicationsTable.reviewedAt,
        studentId: graduationApplicationsTable.studentId,
        studentUserId: studentsTable.userId,
        studentName: usersTable.name,
      })
      .from(graduationApplicationsTable)
      .innerJoin(studentsTable, eq(graduationApplicationsTable.studentId, studentsTable.id))
      .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id));

    const relevant = role === "student"
      ? rows.filter(r => r.studentUserId === userId)
      : rows;

    const gradRoute = role === "student" ? "/student/graduation"
      : role === "registrar" ? "/registrar/graduation"
      : role === "dean" ? "/dean/graduation"
      : "/admin/graduation";

    for (const g of relevant) {
      if (g.createdAt >= monthStart && g.createdAt <= monthEnd) {
        const label = role === "student" ? "Your graduation application" : `${g.studentName} applied for graduation`;
        events.push({
          id: `grad-applied-${g.id}`,
          title: `🎓 ${label}`,
          type: "graduation",
          startDate: g.createdAt.toISOString(),
          route: gradRoute,
        });
      }
      if (g.reviewedAt && g.reviewedAt >= monthStart && g.reviewedAt <= monthEnd) {
        events.push({
          id: `grad-reviewed-${g.id}`,
          title: `🎓 Graduation ${g.status}: ${role === "student" ? "Your application" : g.studentName}`,
          type: "graduation",
          startDate: g.reviewedAt.toISOString(),
          route: gradRoute,
        });
      }
    }
  }

  // ── 6. Welfare case updates (student, counsellor, admin) ─────────────────────

  if (["student", "counsellor", "admin", "super_admin"].includes(role)) {
    const rows = await db
      .select({
        id: welfareCasesTable.id,
        title: welfareCasesTable.title,
        status: welfareCasesTable.status,
        createdAt: welfareCasesTable.createdAt,
        updatedAt: welfareCasesTable.updatedAt,
        studentUserId: studentsTable.userId,
      })
      .from(welfareCasesTable)
      .innerJoin(studentsTable, eq(welfareCasesTable.studentId, studentsTable.id));

    const relevant = role === "student"
      ? rows.filter(r => r.studentUserId === userId)
      : rows;

    const welfRoute = role === "student" ? "/student/welfare"
      : role === "counsellor" ? "/counsellor/welfare"
      : "/admin/welfare";

    for (const w of relevant) {
      if (w.createdAt >= monthStart && w.createdAt <= monthEnd) {
        events.push({
          id: `welfare-created-${w.id}`,
          title: `💙 Case opened: ${w.title}`,
          type: "welfare",
          startDate: w.createdAt.toISOString(),
          route: welfRoute,
        });
      }
    }
  }

  // ── 7. Hostel allocation dates ────────────────────────────────────────────────

  if (["student", "admin", "super_admin"].includes(role)) {
    const rows = await db
      .select({
        id: hostelAllocationsTable.id,
        allocatedAt: hostelAllocationsTable.allocatedAt,
        studentUserId: studentsTable.userId,
        hostelName: hostelsTable.name,
        roomNumber: roomsTable.roomNumber,
      })
      .from(hostelAllocationsTable)
      .innerJoin(studentsTable, eq(hostelAllocationsTable.studentId, studentsTable.id))
      .innerJoin(bedSpacesTable, eq(hostelAllocationsTable.bedSpaceId, bedSpacesTable.id))
      .innerJoin(roomsTable, eq(bedSpacesTable.roomId, roomsTable.id))
      .innerJoin(hostelsTable, eq(roomsTable.hostelId, hostelsTable.id));

    const relevant = role === "student"
      ? rows.filter(r => r.studentUserId === userId)
      : rows;

    const hostelRoute = role === "student" ? "/student/hostel" : "/admin/hostel";

    for (const h of relevant) {
      if (h.allocatedAt >= monthStart && h.allocatedAt <= monthEnd) {
        events.push({
          id: `hostel-alloc-${h.id}`,
          title: `🏠 Hostel allocated: ${h.hostelName} Room ${h.roomNumber}`,
          type: "hostel",
          startDate: h.allocatedAt.toISOString(),
          location: `${h.hostelName}, Room ${h.roomNumber}`,
          route: hostelRoute,
        });
      }
    }
  }

  // ── Sort + return ─────────────────────────────────────────────────────────────

  events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return res.json({ events, month: `${year}-${String(month + 1).padStart(2, "0")}` });
});

export default router;
