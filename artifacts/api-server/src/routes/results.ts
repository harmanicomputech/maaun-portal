import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, resultsTable, coursesTable, studentsTable, lecturersTable, usersTable } from "@workspace/db";
import { SubmitResultBody, UpdateResultBody } from "@workspace/api-zod";
import { requireAuth } from "../lib/auth-middleware";

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
      id: coursesTable.id,
      courseCode: coursesTable.courseCode,
      title: coursesTable.title,
      unit: coursesTable.unit,
      department: coursesTable.department,
      faculty: coursesTable.faculty,
      level: coursesTable.level,
      semester: coursesTable.semester,
      description: coursesTable.description,
      lecturerId: coursesTable.lecturerId,
      lecturerName: usersTable.name,
      createdAt: coursesTable.createdAt,
    })
    .from(coursesTable)
    .leftJoin(lecturersTable, eq(coursesTable.lecturerId, lecturersTable.id))
    .leftJoin(usersTable, eq(lecturersTable.userId, usersTable.id))
    .where(eq(coursesTable.id, r.courseId))
    .limit(1);

  return {
    ...r,
    createdAt: r.createdAt.toISOString(),
    course: course ? { ...course, createdAt: course.createdAt.toISOString() } : null,
    student: null,
  };
}

router.get("/results", requireAuth, async (req, res) => {
  const { studentId, courseId, semester, academicYear } = req.query;

  let rows = await db.select().from(resultsTable);
  if (studentId) rows = rows.filter(r => r.studentId === parseInt(studentId as string));
  if (courseId) rows = rows.filter(r => r.courseId === parseInt(courseId as string));
  if (semester) rows = rows.filter(r => r.semester === semester);
  if (academicYear) rows = rows.filter(r => r.academicYear === academicYear);

  const enriched = await Promise.all(rows.map(enrichResult));
  return res.json(enriched);
});

router.post("/results", requireAuth, async (req, res) => {
  const parsed = SubmitResultBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", message: parsed.error.message });
  }

  const { studentId, courseId, semester, academicYear, caScore, examScore } = parsed.data;

  const caScoreNum = caScore ?? 0;
  const examScoreNum = examScore ?? 0;
  const totalScore = caScoreNum + examScoreNum;
  const { grade, gradePoint } = calculateGrade(totalScore);

  // Upsert
  const existing = await db.select().from(resultsTable).where(
    and(
      eq(resultsTable.studentId, studentId),
      eq(resultsTable.courseId, courseId),
      eq(resultsTable.semester, semester),
      eq(resultsTable.academicYear, academicYear),
    )
  ).limit(1);

  let result;
  if (existing[0]) {
    [result] = await db.update(resultsTable).set({
      caScore: caScoreNum,
      examScore: examScoreNum,
      totalScore,
      grade,
      gradePoint,
      updatedAt: new Date(),
    }).where(eq(resultsTable.id, existing[0].id)).returning();
  } else {
    [result] = await db.insert(resultsTable).values({
      studentId,
      courseId,
      semester,
      academicYear,
      caScore: caScoreNum,
      examScore: examScoreNum,
      totalScore,
      grade,
      gradePoint,
    }).returning();
  }

  const enriched = await enrichResult(result);
  return res.status(201).json(enriched);
});

router.put("/results/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const parsed = UpdateResultBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", message: parsed.error.message });
  }

  const [existing] = await db.select().from(resultsTable).where(eq(resultsTable.id, id)).limit(1);
  if (!existing) return res.status(404).json({ error: "Not found", message: "Result not found." });

  const caScoreNum = parsed.data.caScore ?? existing.caScore ?? 0;
  const examScoreNum = parsed.data.examScore ?? existing.examScore ?? 0;
  const totalScore = caScoreNum + examScoreNum;
  const { grade, gradePoint } = calculateGrade(totalScore);

  const [result] = await db.update(resultsTable).set({
    caScore: caScoreNum,
    examScore: examScoreNum,
    totalScore,
    grade,
    gradePoint,
    updatedAt: new Date(),
  }).where(eq(resultsTable.id, id)).returning();

  const enriched = await enrichResult(result);
  return res.json(enriched);
});

export default router;
