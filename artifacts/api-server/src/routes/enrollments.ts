import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, enrollmentsTable, coursesTable, studentsTable, lecturersTable, usersTable } from "@workspace/db";
import { EnrollCourseBody } from "@workspace/api-zod";
import { requireAuth, AuthRequest } from "../lib/auth-middleware";

const router = Router();

async function enrichEnrollment(e: typeof enrollmentsTable.$inferSelect) {
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
    .where(eq(coursesTable.id, e.courseId))
    .limit(1);

  return {
    ...e,
    enrolledAt: e.enrolledAt.toISOString(),
    course: course ? { ...course, createdAt: course.createdAt.toISOString() } : null,
    student: null,
  };
}

router.get("/enrollments", requireAuth, async (req: AuthRequest, res) => {
  const { studentId, courseId, semester, academicYear } = req.query;

  let rows = await db.select().from(enrollmentsTable);

  if (studentId) rows = rows.filter(e => e.studentId === parseInt(studentId as string));
  if (courseId) rows = rows.filter(e => e.courseId === parseInt(courseId as string));
  if (semester) rows = rows.filter(e => e.semester === semester);
  if (academicYear) rows = rows.filter(e => e.academicYear === academicYear);

  const enriched = await Promise.all(rows.map(enrichEnrollment));
  return res.json(enriched);
});

router.post("/enrollments", requireAuth, async (req: AuthRequest, res) => {
  const parsed = EnrollCourseBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", message: parsed.error.message });
  }

  const { courseId, semester, academicYear } = parsed.data;

  // Get student id from user
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.userId, req.user!.userId)).limit(1);
  if (!student) {
    return res.status(403).json({ error: "Not a student", message: "Only students can enroll in courses." });
  }

  // Check duplicate
  const [existing] = await db.select().from(enrollmentsTable).where(
    and(
      eq(enrollmentsTable.studentId, student.id),
      eq(enrollmentsTable.courseId, courseId),
      eq(enrollmentsTable.semester, semester),
      eq(enrollmentsTable.academicYear, academicYear),
    )
  ).limit(1);

  if (existing) {
    return res.status(409).json({ error: "Already enrolled", message: "You are already enrolled in this course for this semester." });
  }

  const [enrollment] = await db.insert(enrollmentsTable).values({
    studentId: student.id,
    courseId,
    semester,
    academicYear,
    status: "active",
  }).returning();

  const enriched = await enrichEnrollment(enrollment);
  return res.status(201).json(enriched);
});

router.delete("/enrollments/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  await db.delete(enrollmentsTable).where(eq(enrollmentsTable.id, id));
  return res.json({ message: "Course dropped successfully." });
});

export default router;
