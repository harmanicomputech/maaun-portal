import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable, usersTable } from "@workspace/db";
import { requireAuth } from "../lib/auth-middleware";
import { calculateAcademicStanding, getClassification, getAcademicStatus } from "../lib/academic-standing-service";

const router = Router();

// Student: get own academic standing
router.get("/academic-standing/my", requireAuth, async (req, res) => {
  const [student] = await db
    .select({ id: studentsTable.id })
    .from(studentsTable)
    .where(eq(studentsTable.userId, req.user!.userId))
    .limit(1);

  if (!student) return res.status(404).json({ error: "Student profile not found" });

  const standing = await calculateAcademicStanding(student.id);
  if (!standing) return res.status(404).json({ error: "Could not compute academic standing" });

  return res.json(standing);
});

// Admin/Lecturer: get specific student's academic standing
router.get("/academic-standing/:studentId", requireAuth, async (req, res) => {
  const role = req.user?.role;
  if (role !== "admin" && role !== "lecturer") return res.status(403).json({ error: "Forbidden" });

  const studentId = parseInt(req.params.studentId);
  if (isNaN(studentId)) return res.status(400).json({ error: "Invalid studentId" });

  const standing = await calculateAcademicStanding(studentId);
  if (!standing) return res.status(404).json({ error: "Student not found or no standing data" });

  return res.json(standing);
});

// Admin: get all students' standings (summary)
router.get("/academic-standing", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });

  const students = await db
    .select({ id: studentsTable.id, name: usersTable.name, matricNumber: studentsTable.matricNumber, department: studentsTable.department, level: studentsTable.level })
    .from(studentsTable)
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id));

  const standings = await Promise.all(
    students.map(s => calculateAcademicStanding(s.id))
  );

  return res.json(standings.filter(Boolean));
});

export default router;
