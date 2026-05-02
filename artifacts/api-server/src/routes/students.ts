import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable, usersTable, resultsTable, coursesTable } from "@workspace/db";
import { UpdateStudentBody } from "@workspace/api-zod";
import { requireAuth } from "../lib/auth-middleware";

const router = Router();

router.get("/students", requireAuth, async (req, res) => {
  const { department, level } = req.query;

  const rows = await db
    .select({
      id: studentsTable.id,
      userId: studentsTable.userId,
      name: usersTable.name,
      email: usersTable.email,
      matricNumber: studentsTable.matricNumber,
      department: studentsTable.department,
      faculty: studentsTable.faculty,
      level: studentsTable.level,
      cgpa: studentsTable.cgpa,
      enrollmentYear: studentsTable.enrollmentYear,
      createdAt: studentsTable.createdAt,
    })
    .from(studentsTable)
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id));

  let filtered = rows;
  if (department) filtered = filtered.filter(s => s.department === department);
  if (level) filtered = filtered.filter(s => s.level === level);

  return res.json(filtered.map(s => ({ ...s, createdAt: s.createdAt.toISOString() })));
});

router.get("/students/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);

  const [student] = await db
    .select({
      id: studentsTable.id,
      userId: studentsTable.userId,
      name: usersTable.name,
      email: usersTable.email,
      matricNumber: studentsTable.matricNumber,
      department: studentsTable.department,
      faculty: studentsTable.faculty,
      level: studentsTable.level,
      cgpa: studentsTable.cgpa,
      enrollmentYear: studentsTable.enrollmentYear,
      createdAt: studentsTable.createdAt,
    })
    .from(studentsTable)
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(studentsTable.id, id))
    .limit(1);

  if (!student) return res.status(404).json({ error: "Not found", message: "Student not found." });
  return res.json({ ...student, createdAt: student.createdAt.toISOString() });
});

router.put("/students/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const parsed = UpdateStudentBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", message: parsed.error.message });
  }

  const updates: Record<string, string> = {};
  if (parsed.data.department) updates.department = parsed.data.department;
  if (parsed.data.faculty) updates.faculty = parsed.data.faculty;
  if (parsed.data.level) updates.level = parsed.data.level;

  const [student] = await db.update(studentsTable).set({ ...updates, updatedAt: new Date() }).where(eq(studentsTable.id, id)).returning();
  if (!student) return res.status(404).json({ error: "Not found", message: "Student not found." });

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, student.userId)).limit(1);
  return res.json({ ...student, name: user.name, email: user.email, createdAt: student.createdAt.toISOString() });
});

router.get("/students/:id/cgpa", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);

  const results = await db
    .select({
      semester: resultsTable.semester,
      academicYear: resultsTable.academicYear,
      gradePoint: resultsTable.gradePoint,
      grade: resultsTable.grade,
      unit: coursesTable.unit,
    })
    .from(resultsTable)
    .innerJoin(coursesTable, eq(resultsTable.courseId, coursesTable.id))
    .where(eq(resultsTable.studentId, id));

  const passedResults = results.filter(r => r.gradePoint !== null && r.grade !== "F");

  let totalQualityPoints = 0;
  let totalUnits = 0;

  // Group by semester/year for breakdown
  const semesterMap: Record<string, { gpa: number; unitsAttempted: number; qualityPoints: number }> = {};

  for (const r of results) {
    if (r.gradePoint === null) continue;
    const key = `${r.academicYear}-${r.semester}`;
    if (!semesterMap[key]) semesterMap[key] = { gpa: 0, unitsAttempted: 0, qualityPoints: 0 };
    semesterMap[key].unitsAttempted += r.unit;
    semesterMap[key].qualityPoints += r.gradePoint * r.unit;
  }

  for (const key in semesterMap) {
    const s = semesterMap[key];
    s.gpa = s.unitsAttempted > 0 ? parseFloat((s.qualityPoints / s.unitsAttempted).toFixed(2)) : 0;
    totalQualityPoints += s.qualityPoints;
    totalUnits += s.unitsAttempted;
  }

  const cgpa = totalUnits > 0 ? parseFloat((totalQualityPoints / totalUnits).toFixed(2)) : 0;

  // Update student CGPA
  await db.update(studentsTable).set({ cgpa, updatedAt: new Date() }).where(eq(studentsTable.id, id));

  const semesterBreakdown = Object.entries(semesterMap).map(([key, val]) => {
    const [academicYear, semester] = key.split("-first").length > 1
      ? [key.replace("-first", ""), "first"]
      : [key.replace("-second", ""), "second"];
    return {
      semester,
      academicYear,
      gpa: val.gpa,
      unitsAttempted: val.unitsAttempted,
      qualityPoints: val.qualityPoints,
    };
  });

  return res.json({
    studentId: id,
    cgpa,
    totalUnitsAttempted: totalUnits,
    totalQualityPoints,
    semesterBreakdown,
  });
});

export default router;
