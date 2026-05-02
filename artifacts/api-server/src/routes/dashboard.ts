import { Router } from "express";
import { eq, count, sql } from "drizzle-orm";
import { db, usersTable, studentsTable, lecturersTable, coursesTable, enrollmentsTable, resultsTable } from "@workspace/db";
import { requireAuth, AuthRequest } from "../lib/auth-middleware";

const router = Router();

router.get("/dashboard/student", requireAuth, async (req: AuthRequest, res) => {
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
    .where(eq(studentsTable.userId, req.user!.userId))
    .limit(1);

  if (!student) return res.status(404).json({ error: "Not found", message: "Student profile not found." });

  const currentYear = new Date().getFullYear().toString();
  const currentSemester = "first";

  const enrolledCourses = await db
    .select()
    .from(enrollmentsTable)
    .where(eq(enrollmentsTable.studentId, student.id));

  const currentCourses = enrolledCourses.filter(
    e => e.academicYear === `${currentYear}/${parseInt(currentYear) + 1}` || e.academicYear === currentYear
  );

  const recentResults = await db
    .select()
    .from(resultsTable)
    .where(eq(resultsTable.studentId, student.id))
    .limit(5);

  // Calculate CGPA
  const allResults = await db
    .select({ gradePoint: resultsTable.gradePoint, unit: coursesTable.unit })
    .from(resultsTable)
    .innerJoin(coursesTable, eq(resultsTable.courseId, coursesTable.id))
    .where(eq(resultsTable.studentId, student.id));

  let totalQP = 0, totalUnits = 0;
  for (const r of allResults) {
    if (r.gradePoint !== null) {
      totalQP += r.gradePoint * r.unit;
      totalUnits += r.unit;
    }
  }
  const cgpa = totalUnits > 0 ? parseFloat((totalQP / totalUnits).toFixed(2)) : null;

  const notifications = [
    { id: 1, message: "Course registration for 2024/2025 first semester is now open.", type: "info", createdAt: new Date().toISOString() },
    { id: 2, message: "Result for CSC 301 has been released.", type: "success", createdAt: new Date().toISOString() },
  ];

  return res.json({
    student: { ...student, createdAt: student.createdAt.toISOString() },
    cgpa,
    totalCourses: enrolledCourses.length,
    currentSemesterCourses: currentCourses.length,
    totalUnits,
    recentResults: recentResults.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), course: null, student: null })),
    enrolledCourses: enrolledCourses.map(e => ({ ...e, enrolledAt: e.enrolledAt.toISOString(), course: null, student: null })),
    notifications,
  });
});

router.get("/dashboard/admin", requireAuth, async (req: AuthRequest, res) => {
  const [studentsCount] = await db.select({ count: count() }).from(studentsTable);
  const [lecturersCount] = await db.select({ count: count() }).from(lecturersTable);
  const [coursesCount] = await db.select({ count: count() }).from(coursesTable);
  const [enrollmentsCount] = await db.select({ count: count() }).from(enrollmentsTable);

  const students = await db
    .select({ department: studentsTable.department })
    .from(studentsTable);

  const deptMap: Record<string, number> = {};
  for (const s of students) {
    deptMap[s.department] = (deptMap[s.department] || 0) + 1;
  }
  const studentsByDepartment = Object.entries(deptMap).map(([department, count]) => ({ department, count }));

  const courses = await db.select({ faculty: coursesTable.faculty }).from(coursesTable);
  const facultyMap: Record<string, number> = {};
  for (const c of courses) {
    facultyMap[c.faculty] = (facultyMap[c.faculty] || 0) + 1;
  }
  const coursesByFaculty = Object.entries(facultyMap).map(([faculty, count]) => ({ faculty, count }));

  const recentEnrollments = await db.select().from(enrollmentsTable).limit(5);

  return res.json({
    totalStudents: studentsCount.count,
    totalLecturers: lecturersCount.count,
    totalCourses: coursesCount.count,
    totalEnrollments: enrollmentsCount.count,
    studentsByDepartment,
    recentEnrollments: recentEnrollments.map(e => ({ ...e, enrolledAt: e.enrolledAt.toISOString(), course: null, student: null })),
    coursesByFaculty,
  });
});

router.get("/dashboard/lecturer", requireAuth, async (req: AuthRequest, res) => {
  const [lecturer] = await db
    .select({
      id: lecturersTable.id,
      userId: lecturersTable.userId,
      name: usersTable.name,
      email: usersTable.email,
      staffId: lecturersTable.staffId,
      department: lecturersTable.department,
      faculty: lecturersTable.faculty,
      designation: lecturersTable.designation,
      createdAt: lecturersTable.createdAt,
    })
    .from(lecturersTable)
    .innerJoin(usersTable, eq(lecturersTable.userId, usersTable.id))
    .where(eq(lecturersTable.userId, req.user!.userId))
    .limit(1);

  if (!lecturer) return res.status(404).json({ error: "Not found", message: "Lecturer profile not found." });

  const assignedCourses = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.lecturerId, lecturer.id));

  const courseIds = assignedCourses.map(c => c.id);

  const enrollments = courseIds.length > 0
    ? await db.select().from(enrollmentsTable)
    : [];

  const recentResults = await db.select().from(resultsTable).limit(5);

  return res.json({
    lecturer: { ...lecturer, createdAt: lecturer.createdAt.toISOString() },
    assignedCourses: assignedCourses.length,
    totalStudentsTeaching: enrollments.length,
    pendingResults: 0,
    courses: assignedCourses.map(c => ({ ...c, createdAt: c.createdAt.toISOString(), lecturerName: lecturer.name })),
    recentResults: recentResults.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), course: null, student: null })),
  });
});

export default router;
