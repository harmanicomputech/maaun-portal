import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, resultsTable, coursesTable, studentsTable, lecturersTable, usersTable } from "@workspace/db";
import { SubmitResultBody, UpdateResultBody } from "@workspace/api-zod";
import { requireAuth } from "../lib/auth-middleware";
import { logActivity } from "../lib/activity-logger";
import { createNotification } from "../lib/notification-helper";

const router = Router();

function calculateGrade(total: number): { grade: string; gradePoint: number } {
  if (total >= 70) return { grade: "A", gradePoint: 5.0 };
  if (total >= 60) return { grade: "B", gradePoint: 4.0 };
  if (total >= 50) return { grade: "C", gradePoint: 3.0 };
  if (total >= 45) return { grade: "D", gradePoint: 2.0 };
  if (total >= 40) return { grade: "E", gradePoint: 1.0 };
  return { grade: "F", gradePoint: 0.0 };
}

async function enrichResult(r: typeof resultsTable.$inferSelect) {
  const [course] = await db
    .select({
      id: coursesTable.id, courseCode: coursesTable.courseCode, title: coursesTable.title,
      unit: coursesTable.unit, department: coursesTable.department, faculty: coursesTable.faculty,
      level: coursesTable.level, semester: coursesTable.semester, description: coursesTable.description,
      lecturerId: coursesTable.lecturerId, lecturerName: usersTable.name, createdAt: coursesTable.createdAt,
    })
    .from(coursesTable)
    .leftJoin(lecturersTable, eq(coursesTable.lecturerId, lecturersTable.id))
    .leftJoin(usersTable, eq(lecturersTable.userId, usersTable.id))
    .where(eq(coursesTable.id, r.courseId))
    .limit(1);

  return {
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    course: course ? { ...course, createdAt: course.createdAt.toISOString() } : null,
    student: null,
  };
}

router.get("/results", requireAuth, async (req, res) => {
  const role = req.user?.role;
  const { studentId, courseId, semester, academicYear, status } = req.query;

  // Students can only view their own results — enforce this regardless of query params
  if (role === "student") {
    const [student] = await db.select().from(studentsTable).where(eq(studentsTable.userId, req.user!.userId)).limit(1);
    if (!student) return res.status(403).json({ error: "Student profile not found" });
    let rows = await db.select().from(resultsTable).where(eq(resultsTable.studentId, student.id));
    if (courseId) rows = rows.filter(r => r.courseId === parseInt(courseId as string));
    if (semester) rows = rows.filter(r => r.semester === semester);
    if (academicYear) rows = rows.filter(r => r.academicYear === academicYear);
    if (status) rows = rows.filter(r => r.status === status);
    return res.json(await Promise.all(rows.map(enrichResult)));
  }

  // Staff roles: fetch all results (with optional filters)
  let rows = await db.select().from(resultsTable);
  if (studentId) rows = rows.filter(r => r.studentId === parseInt(studentId as string));
  if (courseId) rows = rows.filter(r => r.courseId === parseInt(courseId as string));
  if (semester) rows = rows.filter(r => r.semester === semester);
  if (academicYear) rows = rows.filter(r => r.academicYear === academicYear);
  if (status) rows = rows.filter(r => r.status === status);
  return res.json(await Promise.all(rows.map(enrichResult)));
});

router.post("/results", requireAuth, async (req, res) => {
  const role = req.user?.role;
  if (role !== "lecturer" && role !== "admin") return res.status(403).json({ error: "Forbidden" });

  const parsed = SubmitResultBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", message: parsed.error.message });

  const { studentId, courseId, semester, academicYear, caScore, examScore } = parsed.data;
  const ca = caScore ?? 0, ex = examScore ?? 0, total = ca + ex;
  const { grade, gradePoint } = calculateGrade(total);

  const existing = await db.select().from(resultsTable).where(
    and(eq(resultsTable.studentId, studentId), eq(resultsTable.courseId, courseId),
      eq(resultsTable.semester, semester), eq(resultsTable.academicYear, academicYear))
  ).limit(1);

  let result;
  if (existing[0]) {
    if (existing[0].status === "locked") return res.status(403).json({ error: "Locked", message: "This result is locked." });
    [result] = await db.update(resultsTable).set({
      caScore: ca, examScore: ex, totalScore: total, grade, gradePoint, status: "draft", updatedAt: new Date(),
    }).where(eq(resultsTable.id, existing[0].id)).returning();
    await logActivity(req.user!.userId, "update_result", "result", result.id, existing[0], result);
  } else {
    [result] = await db.insert(resultsTable).values({
      studentId, courseId, semester, academicYear, caScore: ca, examScore: ex, totalScore: total, grade, gradePoint, status: "draft",
    }).returning();
    await logActivity(req.user!.userId, "create_result", "result", result.id, null, result);
  }
  return res.status(201).json(await enrichResult(result));
});

router.put("/results/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const parsed = UpdateResultBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", message: parsed.error.message });

  const [existing] = await db.select().from(resultsTable).where(eq(resultsTable.id, id)).limit(1);
  if (!existing) return res.status(404).json({ error: "Not found" });
  if (existing.status === "locked") return res.status(403).json({ error: "Locked", message: "This result is locked." });

  const ca = parsed.data.caScore ?? existing.caScore ?? 0;
  const ex = parsed.data.examScore ?? existing.examScore ?? 0;
  const total = ca + ex;
  const { grade, gradePoint } = calculateGrade(total);

  const [result] = await db.update(resultsTable).set({
    caScore: ca, examScore: ex, totalScore: total, grade, gradePoint, updatedAt: new Date(),
  }).where(eq(resultsTable.id, id)).returning();
  await logActivity(req.user!.userId, "update_result", "result", id, existing, result);
  return res.json(await enrichResult(result));
});

router.put("/results/:id/submit", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const [existing] = await db.select().from(resultsTable).where(eq(resultsTable.id, id)).limit(1);
  if (!existing) return res.status(404).json({ error: "Not found" });
  if (existing.status === "locked") return res.status(403).json({ error: "Already locked" });
  const [result] = await db.update(resultsTable).set({ status: "submitted", updatedAt: new Date() }).where(eq(resultsTable.id, id)).returning();
  await logActivity(req.user!.userId, "submit_result", "result", id, existing, result);
  return res.json(await enrichResult(result));
});

router.put("/results/:id/approve", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const id = parseInt(req.params.id);
  const [existing] = await db.select().from(resultsTable).where(eq(resultsTable.id, id)).limit(1);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const [result] = await db.update(resultsTable).set({ status: "approved", updatedAt: new Date() }).where(eq(resultsTable.id, id)).returning();
  await logActivity(req.user!.userId, "approve_result", "result", id, existing, result);
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, result.studentId)).limit(1);
  if (student) {
    const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, result.courseId)).limit(1);
    await createNotification(student.userId, "Result Approved", `Your result for ${course?.courseCode || "a course"} has been approved. Grade: ${result.grade}`, "result");
  }
  return res.json(await enrichResult(result));
});

router.put("/results/:id/lock", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const id = parseInt(req.params.id);
  const [existing] = await db.select().from(resultsTable).where(eq(resultsTable.id, id)).limit(1);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const [result] = await db.update(resultsTable).set({ status: "locked", updatedAt: new Date() }).where(eq(resultsTable.id, id)).returning();
  await logActivity(req.user!.userId, "lock_result", "result", id, existing, result);
  return res.json(await enrichResult(result));
});

router.post("/results/bulk-action", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const { action, resultIds } = req.body;
  if (!action || !Array.isArray(resultIds)) return res.status(400).json({ error: "action and resultIds required" });
  const status = action === "approve" ? "approved" : action === "lock" ? "locked" : null;
  if (!status) return res.status(400).json({ error: "Invalid action" });
  for (const id of resultIds) {
    await db.update(resultsTable).set({ status, updatedAt: new Date() }).where(eq(resultsTable.id, id));
  }
  return res.json({ message: `${resultIds.length} results updated to ${status}` });
});

export default router;
