import { Router } from "express";
import { ilike, or, eq } from "drizzle-orm";
import {
  db,
  usersTable,
  studentsTable,
  lecturersTable,
  coursesTable,
  announcementsTable,
  welfareCasesTable,
  disciplinaryCasesTable,
} from "@workspace/db";
import { requireAuth } from "../lib/auth-middleware";

const router = Router();
const LIMIT = 5;
const MIN_QUERY_LEN = 2;

export type SearchResultType =
  | "student"
  | "course"
  | "announcement"
  | "welfare"
  | "disciplinary"
  | "lecturer";

export interface SearchResult {
  type: SearchResultType;
  id: number;
  title: string;
  subtitle: string;
  route: string;
}

// ── Role permission helpers ───────────────────────────────────────────────────

function canSee(role: string, ...allowed: string[]): boolean {
  return allowed.includes(role);
}

function staffRoute(role: string, path: string): string {
  if (["admin", "super_admin"].includes(role)) return `/admin/${path}`;
  return `/${role}/${path}`;
}

// ── GET /api/search?q= ────────────────────────────────────────────────────────

router.get("/search", requireAuth, async (req, res) => {
  const { q } = req.query;

  if (!q || typeof q !== "string" || q.trim().length < MIN_QUERY_LEN) {
    return res.json({ results: [] });
  }

  const raw = q.trim();
  const pattern = `%${raw}%`;
  const { role } = req.user!;
  const results: SearchResult[] = [];

  // ── 1. Students ─────────────────────────────────────────────────────────────
  if (canSee(role, "admin", "super_admin", "hod", "dean", "registrar", "lecturer", "bursar", "counsellor")) {
    const rows = await db
      .select({
        id: studentsTable.id,
        name: usersTable.name,
        matricNumber: studentsTable.matricNumber,
        department: studentsTable.department,
        level: studentsTable.level,
      })
      .from(studentsTable)
      .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
      .where(
        or(
          ilike(usersTable.name, pattern),
          ilike(studentsTable.matricNumber, pattern),
          ilike(studentsTable.department, pattern),
        ),
      )
      .limit(LIMIT);

    const base = canSee(role, "admin", "super_admin") ? "/admin" : `/${role}`;
    results.push(
      ...rows.map(s => ({
        type: "student" as const,
        id: s.id,
        title: s.name,
        subtitle: `${s.matricNumber} · ${s.department} · Level ${s.level}`,
        route: `${base}/students`,
      })),
    );
  }

  // ── 2. Courses — visible to all roles ────────────────────────────────────────
  {
    const rows = await db
      .select({
        id: coursesTable.id,
        courseCode: coursesTable.courseCode,
        title: coursesTable.title,
        department: coursesTable.department,
        level: coursesTable.level,
        semester: coursesTable.semester,
      })
      .from(coursesTable)
      .where(
        or(
          ilike(coursesTable.title, pattern),
          ilike(coursesTable.courseCode, pattern),
          ilike(coursesTable.department, pattern),
        ),
      )
      .limit(LIMIT);

    const courseRoute =
      role === "student"   ? "/student/courses"   :
      role === "lecturer"  ? "/lecturer/courses"  :
      role === "hod"       ? "/hod/courses"       :
      "/admin/courses";

    results.push(
      ...rows.map(c => ({
        type: "course" as const,
        id: c.id,
        title: `${c.courseCode} – ${c.title}`,
        subtitle: `${c.department} · Level ${c.level} · ${c.semester} semester`,
        route: courseRoute,
      })),
    );
  }

  // ── 3. Announcements — filtered by role ──────────────────────────────────────
  {
    const rows = await db
      .select({
        id: announcementsTable.id,
        title: announcementsTable.title,
        targetRoles: announcementsTable.targetRoles,
        isPinned: announcementsTable.isPinned,
        createdAt: announcementsTable.createdAt,
      })
      .from(announcementsTable)
      .where(ilike(announcementsTable.title, pattern))
      .limit(LIMIT * 2);

    const visible = rows
      .filter(a => (a.targetRoles as string[]).includes(role))
      .slice(0, LIMIT);

    const annRoute = canSee(role, "admin", "super_admin")
      ? "/admin/announcements"
      : "/announcements";

    results.push(
      ...visible.map(a => ({
        type: "announcement" as const,
        id: a.id,
        title: a.title,
        subtitle: `Announcement${a.isPinned ? " · 📌 Pinned" : ""} · ${new Date(a.createdAt).toLocaleDateString()}`,
        route: annRoute,
      })),
    );
  }

  // ── 4. Welfare cases ─────────────────────────────────────────────────────────
  if (canSee(role, "admin", "super_admin", "counsellor")) {
    const rows = await db
      .select({
        id: welfareCasesTable.id,
        title: welfareCasesTable.title,
        status: welfareCasesTable.status,
        priority: welfareCasesTable.priority,
        studentName: usersTable.name,
      })
      .from(welfareCasesTable)
      .innerJoin(studentsTable, eq(welfareCasesTable.studentId, studentsTable.id))
      .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
      .where(
        or(
          ilike(welfareCasesTable.title, pattern),
          ilike(usersTable.name, pattern),
        ),
      )
      .limit(LIMIT);

    const welfRoute = role === "counsellor" ? "/counsellor/welfare" : "/admin/welfare";
    results.push(
      ...rows.map(w => ({
        type: "welfare" as const,
        id: w.id,
        title: w.title,
        subtitle: `${w.studentName} · ${w.priority} priority · ${w.status}`,
        route: welfRoute,
      })),
    );
  }

  // ── 5. Disciplinary cases ────────────────────────────────────────────────────
  if (canSee(role, "admin", "super_admin", "dean", "counsellor")) {
    const rows = await db
      .select({
        id: disciplinaryCasesTable.id,
        title: disciplinaryCasesTable.title,
        severity: disciplinaryCasesTable.severity,
        status: disciplinaryCasesTable.status,
        studentName: usersTable.name,
      })
      .from(disciplinaryCasesTable)
      .innerJoin(studentsTable, eq(disciplinaryCasesTable.studentId, studentsTable.id))
      .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
      .where(
        or(
          ilike(disciplinaryCasesTable.title, pattern),
          ilike(usersTable.name, pattern),
        ),
      )
      .limit(LIMIT);

    const discRoute = canSee(role, "admin", "super_admin")
      ? "/admin/disciplinary"
      : `/${role}/disciplinary`;

    results.push(
      ...rows.map(d => ({
        type: "disciplinary" as const,
        id: d.id,
        title: d.title,
        subtitle: `${d.studentName} · ${d.severity} · ${d.status}`,
        route: discRoute,
      })),
    );
  }

  // ── 6. Lecturers ─────────────────────────────────────────────────────────────
  if (canSee(role, "admin", "super_admin", "hod", "dean", "registrar")) {
    const rows = await db
      .select({
        id: lecturersTable.id,
        name: usersTable.name,
        staffId: lecturersTable.staffId,
        department: lecturersTable.department,
        designation: lecturersTable.designation,
      })
      .from(lecturersTable)
      .innerJoin(usersTable, eq(lecturersTable.userId, usersTable.id))
      .where(
        or(
          ilike(usersTable.name, pattern),
          ilike(lecturersTable.staffId, pattern),
          ilike(lecturersTable.department, pattern),
        ),
      )
      .limit(LIMIT);

    results.push(
      ...rows.map(l => ({
        type: "lecturer" as const,
        id: l.id,
        title: l.name,
        subtitle: `${l.staffId} · ${l.department} · ${l.designation}`,
        route: staffRoute(role, "lecturers"),
      })),
    );
  }

  return res.json({ results });
});

export default router;
