import { Router } from "express";
import { eq, and, desc } from "drizzle-orm";
import {
  db, venuesTable, timetablesTable, coursesTable, lecturersTable,
  usersTable, studentsTable, enrollmentsTable, academicSessionsTable,
  academicSemestersTable, notificationsTable,
} from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth-middleware";
import { createNotification } from "../lib/notification-helper";

const router = Router();

function timesOverlap(s1: string, e1: string, s2: string, e2: string): boolean {
  return s1 < e2 && s2 < e1;
}

// ─── Venues CRUD ──────────────────────────────────────────────────────────────
router.get("/venues", requireAuth, async (_req, res) => {
  const rows = await db.select().from(venuesTable).orderBy(venuesTable.name);
  return res.json(rows);
});

router.post("/venues", requireAuth, requireRole("admin"), async (req, res) => {
  const { name, capacity, location } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  const [v] = await db.insert(venuesTable).values({ name, capacity: capacity ? parseInt(capacity) : 50, location }).returning();
  return res.status(201).json(v);
});

router.put("/venues/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, capacity, location } = req.body;
  const [v] = await db.update(venuesTable).set({ name, capacity: parseInt(capacity), location }).where(eq(venuesTable.id, id)).returning();
  return res.json(v);
});

router.delete("/venues/:id", requireAuth, requireRole("admin"), async (req, res) => {
  await db.delete(venuesTable).where(eq(venuesTable.id, parseInt(req.params.id)));
  return res.json({ message: "Venue deleted" });
});

// ─── Full timetable with joins ────────────────────────────────────────────────
async function fetchTimetables(filters: Record<string, any> = {}) {
  const rows = await db
    .select({
      id: timetablesTable.id,
      dayOfWeek: timetablesTable.dayOfWeek,
      startTime: timetablesTable.startTime,
      endTime: timetablesTable.endTime,
      sessionId: timetablesTable.sessionId,
      semesterId: timetablesTable.semesterId,
      createdAt: timetablesTable.createdAt,
      courseId: coursesTable.id,
      courseCode: coursesTable.courseCode,
      courseTitle: coursesTable.title,
      department: coursesTable.department,
      faculty: coursesTable.faculty,
      level: coursesTable.level,
      semester: coursesTable.semester,
      lecturerId: lecturersTable.id,
      lecturerUserId: lecturersTable.userId,
      lecturerName: usersTable.name,
      lecturerDept: lecturersTable.department,
      venueId: venuesTable.id,
      venueName: venuesTable.name,
      venueCapacity: venuesTable.capacity,
      venueLocation: venuesTable.location,
    })
    .from(timetablesTable)
    .innerJoin(coursesTable, eq(timetablesTable.courseId, coursesTable.id))
    .innerJoin(lecturersTable, eq(timetablesTable.lecturerId, lecturersTable.id))
    .innerJoin(usersTable, eq(lecturersTable.userId, usersTable.id))
    .innerJoin(venuesTable, eq(timetablesTable.venueId, venuesTable.id))
    .orderBy(timetablesTable.dayOfWeek, timetablesTable.startTime);

  return rows;
}

// ─── GET /timetables — all (admin) ───────────────────────────────────────────
router.get("/timetables", requireAuth, async (req, res) => {
  const rows = await fetchTimetables();
  return res.json(rows);
});

// ─── GET /timetables/my — lecturer's own ─────────────────────────────────────
router.get("/timetables/my", requireAuth, requireRole("lecturer"), async (req, res) => {
  const [lec] = await db.select().from(lecturersTable).where(eq(lecturersTable.userId, req.user!.userId)).limit(1);
  if (!lec) return res.status(404).json({ error: "Lecturer profile not found" });

  const rows = await fetchTimetables();
  return res.json(rows.filter(r => r.lecturerId === lec.id));
});

// ─── GET /timetables/student — enrolled student's timetable ──────────────────
router.get("/timetables/student", requireAuth, requireRole("student"), async (req, res) => {
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.userId, req.user!.userId)).limit(1);
  if (!student) return res.status(404).json({ error: "Student profile not found" });

  const enrollments = await db
    .select({ courseId: enrollmentsTable.courseId })
    .from(enrollmentsTable)
    .where(and(eq(enrollmentsTable.studentId, student.id), eq(enrollmentsTable.status, "active")));

  const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));
  if (enrolledCourseIds.size === 0) return res.json([]);

  const rows = await fetchTimetables();
  return res.json(rows.filter(r => enrolledCourseIds.has(r.courseId)));
});

// ─── POST /timetables — create with constraint check ─────────────────────────
router.post("/timetables", requireAuth, requireRole("lecturer", "admin"), async (req, res) => {
  const { courseId, lecturerId, venueId, dayOfWeek, startTime, endTime, sessionId, semesterId } = req.body;
  if (!courseId || !lecturerId || !venueId || !dayOfWeek || !startTime || !endTime) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (startTime >= endTime) {
    return res.status(400).json({ error: "End time must be after start time" });
  }

  const existing = await fetchTimetables();

  // 1. Lecturer conflict
  const lecturerClash = existing.find(r =>
    r.lecturerId === parseInt(lecturerId) &&
    r.dayOfWeek === dayOfWeek &&
    timesOverlap(startTime, endTime, r.startTime, r.endTime)
  );
  if (lecturerClash) {
    return res.status(409).json({
      error: "Lecturer conflict",
      message: `${lecturerClash.lecturerName} already has ${lecturerClash.courseCode} on ${dayOfWeek} from ${lecturerClash.startTime}–${lecturerClash.endTime}.`,
    });
  }

  // 2. Venue conflict
  const venueClash = existing.find(r =>
    r.venueId === parseInt(venueId) &&
    r.dayOfWeek === dayOfWeek &&
    timesOverlap(startTime, endTime, r.startTime, r.endTime)
  );
  if (venueClash) {
    return res.status(409).json({
      error: "Venue conflict",
      message: `${venueClash.venueName} is already booked for ${venueClash.courseCode} on ${dayOfWeek} from ${venueClash.startTime}–${venueClash.endTime}.`,
    });
  }

  // 3. Course duplicate in same semester
  const courseClash = existing.find(r =>
    r.courseId === parseInt(courseId) &&
    r.dayOfWeek === dayOfWeek &&
    timesOverlap(startTime, endTime, r.startTime, r.endTime)
  );
  if (courseClash) {
    return res.status(409).json({
      error: "Course conflict",
      message: `${courseClash.courseCode} is already scheduled on ${dayOfWeek} at an overlapping time.`,
    });
  }

  const [entry] = await db.insert(timetablesTable).values({
    courseId: parseInt(courseId),
    lecturerId: parseInt(lecturerId),
    venueId: parseInt(venueId),
    dayOfWeek,
    startTime,
    endTime,
    sessionId: sessionId ? parseInt(sessionId) : null,
    semesterId: semesterId ? parseInt(semesterId) : null,
    createdBy: req.user!.userId,
  }).returning();

  // Notify enrolled students
  try {
    const enrollments = await db
      .select({ studentId: enrollmentsTable.studentId })
      .from(enrollmentsTable)
      .where(and(eq(enrollmentsTable.courseId, parseInt(courseId)), eq(enrollmentsTable.status, "active")));

    const course = await db.select({ courseCode: coursesTable.courseCode, title: coursesTable.title })
      .from(coursesTable).where(eq(coursesTable.id, parseInt(courseId))).limit(1);

    const venue = await db.select({ name: venuesTable.name }).from(venuesTable).where(eq(venuesTable.id, parseInt(venueId))).limit(1);

    if (enrollments.length > 0 && course[0]) {
      const studentUsers = await db
        .select({ userId: studentsTable.userId })
        .from(studentsTable)
        .where(eq(studentsTable.id, enrollments[0].studentId));

      for (const { studentId } of enrollments) {
        const [stu] = await db.select({ userId: studentsTable.userId }).from(studentsTable).where(eq(studentsTable.id, studentId)).limit(1);
        if (stu) {
          await createNotification(
            stu.userId,
            "Timetable Updated",
            `${course[0].courseCode} (${course[0].title}) has been scheduled for ${dayOfWeek} ${startTime}–${endTime} at ${venue[0]?.name ?? "TBD"}.`,
            "timetable"
          );
        }
      }
    }
  } catch { /* notifications are best-effort */ }

  return res.status(201).json(entry);
});

// ─── DELETE /timetables/:id ───────────────────────────────────────────────────
router.delete("/timetables/:id", requireAuth, requireRole("lecturer", "admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const existing = await fetchTimetables();
  const entry = existing.find(r => r.id === id);
  if (!entry) return res.status(404).json({ error: "Timetable entry not found" });

  // Lecturers can only delete their own entries
  if (req.user!.role === "lecturer") {
    const [lec] = await db.select().from(lecturersTable).where(eq(lecturersTable.userId, req.user!.userId)).limit(1);
    if (!lec || entry.lecturerId !== lec.id) {
      return res.status(403).json({ error: "Forbidden: you can only remove your own timetable entries" });
    }
  }

  await db.delete(timetablesTable).where(eq(timetablesTable.id, id));
  return res.json({ message: "Deleted" });
});

export default router;
