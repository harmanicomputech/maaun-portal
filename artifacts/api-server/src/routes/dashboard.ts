import { Router } from "express";
import { eq, count } from "drizzle-orm";
import { db, usersTable, studentsTable, lecturersTable, coursesTable, enrollmentsTable, resultsTable, paymentsTable, notificationsTable } from "@workspace/db";
import { requireAuth, AuthRequest } from "../lib/auth-middleware";

const router = Router();

router.get("/dashboard/student", requireAuth, async (req: AuthRequest, res) => {
  const [student] = await db
    .select({
      id: studentsTable.id, userId: studentsTable.userId, name: usersTable.name, email: usersTable.email,
      matricNumber: studentsTable.matricNumber, department: studentsTable.department, faculty: studentsTable.faculty,
      level: studentsTable.level, cgpa: studentsTable.cgpa, enrollmentYear: studentsTable.enrollmentYear, createdAt: studentsTable.createdAt,
    })
    .from(studentsTable).innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(studentsTable.userId, req.user!.userId)).limit(1);

  if (!student) return res.status(404).json({ error: "Not found", message: "Student profile not found." });

  const [enrolledCourses, recentResults, allResultsWithUnits, dbNotifs] = await Promise.all([
    db.select().from(enrollmentsTable).where(eq(enrollmentsTable.studentId, student.id)),
    db.select().from(resultsTable).where(eq(resultsTable.studentId, student.id)).limit(5),
    db.select({ gradePoint: resultsTable.gradePoint, unit: coursesTable.unit, status: resultsTable.status })
      .from(resultsTable).innerJoin(coursesTable, eq(resultsTable.courseId, coursesTable.id))
      .where(eq(resultsTable.studentId, student.id)),
    db.select().from(notificationsTable).where(eq(notificationsTable.userId, req.user!.userId)).limit(10),
  ]);

  // Only count approved/locked results for CGPA (Phase 14)
  let totalQP = 0, totalUnits = 0;
  const carryovers: string[] = [];
  for (const r of allResultsWithUnits) {
    if (r.gradePoint !== null && (r.status === "approved" || r.status === "locked")) {
      totalQP += r.gradePoint * r.unit;
      totalUnits += r.unit;
    }
    if (r.gradePoint === 0) carryovers.push("course");
  }
  const cgpa = totalUnits > 0 ? parseFloat((totalQP / totalUnits).toFixed(2)) : null;
  const onProbation = cgpa !== null && cgpa < 1.0;

  const currentYear = new Date().getFullYear();
  const currentCourses = enrolledCourses.filter(e =>
    e.academicYear === `${currentYear}/${currentYear + 1}` || e.academicYear === `${currentYear - 1}/${currentYear}`
  );

  const notifications = dbNotifs.map(n => ({
    id: n.id, message: n.message, type: n.type, createdAt: n.createdAt.toISOString(), isRead: n.isRead, title: n.title,
  }));

  return res.json({
    student: { ...student, createdAt: student.createdAt.toISOString() },
    cgpa,
    onProbation,
    carryoverCount: carryovers.length,
    totalCourses: enrolledCourses.length,
    currentSemesterCourses: currentCourses.length,
    totalUnits,
    recentResults: recentResults.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(), course: null, student: null })),
    enrolledCourses: enrolledCourses.map(e => ({ ...e, enrolledAt: e.enrolledAt.toISOString(), course: null, student: null })),
    notifications,
  });
});

router.get("/dashboard/admin", requireAuth, async (req: AuthRequest, res) => {
  const [studentsCount, lecturersCount, coursesCount, enrollmentsCount, totalRevenue] = await Promise.all([
    db.select({ count: count() }).from(studentsTable).then(r => r[0]),
    db.select({ count: count() }).from(lecturersTable).then(r => r[0]),
    db.select({ count: count() }).from(coursesTable).then(r => r[0]),
    db.select({ count: count() }).from(enrollmentsTable).then(r => r[0]),
    db.select().from(paymentsTable).where(eq(paymentsTable.status, "success")).then(rows => rows.reduce((s, r) => s + r.amount, 0)),
  ]);

  const [students, courses, recentEnrollments] = await Promise.all([
    db.select({ department: studentsTable.department }).from(studentsTable),
    db.select({ faculty: coursesTable.faculty }).from(coursesTable),
    db.select().from(enrollmentsTable).limit(5),
  ]);

  const deptMap: Record<string, number> = {};
  for (const s of students) deptMap[s.department] = (deptMap[s.department] || 0) + 1;
  const studentsByDepartment = Object.entries(deptMap).map(([department, count]) => ({ department, count }));

  const facultyMap: Record<string, number> = {};
  for (const c of courses) facultyMap[c.faculty] = (facultyMap[c.faculty] || 0) + 1;
  const coursesByFaculty = Object.entries(facultyMap).map(([faculty, count]) => ({ faculty, count }));

  return res.json({
    totalStudents: studentsCount.count,
    totalLecturers: lecturersCount.count,
    totalCourses: coursesCount.count,
    totalEnrollments: enrollmentsCount.count,
    totalRevenue,
    studentsByDepartment,
    recentEnrollments: recentEnrollments.map(e => ({ ...e, enrolledAt: e.enrolledAt.toISOString(), course: null, student: null })),
    coursesByFaculty,
  });
});

router.get("/dashboard/lecturer", requireAuth, async (req: AuthRequest, res) => {
  const [lecturer] = await db
    .select({
      id: lecturersTable.id, userId: lecturersTable.userId, name: usersTable.name, email: usersTable.email,
      staffId: lecturersTable.staffId, department: lecturersTable.department, faculty: lecturersTable.faculty,
      designation: lecturersTable.designation, createdAt: lecturersTable.createdAt,
    })
    .from(lecturersTable).innerJoin(usersTable, eq(lecturersTable.userId, usersTable.id))
    .where(eq(lecturersTable.userId, req.user!.userId)).limit(1);

  if (!lecturer) return res.status(404).json({ error: "Not found", message: "Lecturer profile not found." });

  const assignedCourses = await db.select().from(coursesTable).where(eq(coursesTable.lecturerId, lecturer.id));
  const courseIds = assignedCourses.map(c => c.id);

  const [enrollments, pendingResultsList] = await Promise.all([
    courseIds.length > 0 ? db.select().from(enrollmentsTable) : Promise.resolve([]),
    courseIds.length > 0
      ? db.select().from(resultsTable).where(eq(resultsTable.status, "submitted"))
      : Promise.resolve([]),
  ]);

  const recentResults = await db.select().from(resultsTable).limit(5);

  return res.json({
    lecturer: { ...lecturer, createdAt: lecturer.createdAt.toISOString() },
    assignedCourses: assignedCourses.length,
    totalStudentsTeaching: enrollments.length,
    pendingResults: pendingResultsList.length,
    courses: assignedCourses.map(c => ({ ...c, createdAt: c.createdAt.toISOString(), lecturerName: lecturer.name })),
    recentResults: recentResults.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(), course: null, student: null })),
  });
});

export default router;
