import { eq, and, or } from "drizzle-orm";
import {
  db, resultsTable, coursesTable, studentsTable, usersTable,
  academicStandingsTable,
} from "@workspace/db";

export type Classification =
  | "First Class Honours"
  | "Second Class Honours (Upper Division)"
  | "Second Class Honours (Lower Division)"
  | "Third Class Honours"
  | "Pass"
  | "Fail"
  | "Insufficient Credits";

export type AcademicStatus = "good" | "probation" | "withdrawal_risk";

export interface SemesterGPA {
  academicYear: string;
  semester: string;
  unitsAttempted: number;
  qualityPoints: number;
  gpa: number;
}

export interface AcademicStandingResult {
  studentId: number;
  studentName: string;
  matricNumber: string;
  department: string;
  faculty: string;
  level: string;
  enrollmentYear: string;
  cgpa: number;
  classification: Classification;
  status: AcademicStatus;
  totalUnitsAttempted: number;
  totalQualityPoints: number;
  semesterBreakdown: SemesterGPA[];
  carryoverCourses: { courseCode: string; title: string; grade: string; semester: string; academicYear: string }[];
  generatedAt: string;
}

export function getClassification(cgpa: number, totalUnits: number): Classification {
  if (totalUnits < 30) return "Insufficient Credits";
  if (cgpa >= 4.50) return "First Class Honours";
  if (cgpa >= 3.50) return "Second Class Honours (Upper Division)";
  if (cgpa >= 2.40) return "Second Class Honours (Lower Division)";
  if (cgpa >= 1.50) return "Third Class Honours";
  if (cgpa >= 1.00) return "Pass";
  return "Fail";
}

export function getAcademicStatus(
  cgpa: number,
  semesterBreakdown: SemesterGPA[]
): AcademicStatus {
  if (cgpa < 1.0) {
    // Check if 2+ consecutive semesters below 1.0
    const lowSemesters = semesterBreakdown.filter(s => s.gpa < 1.0);
    if (lowSemesters.length >= 2) return "withdrawal_risk";
    return "probation";
  }
  if (cgpa < 2.0) return "probation";
  return "good";
}

export async function calculateAcademicStanding(studentId: number): Promise<AcademicStandingResult | null> {
  // Fetch student info
  const [student] = await db
    .select({
      id: studentsTable.id,
      name: usersTable.name,
      matricNumber: studentsTable.matricNumber,
      department: studentsTable.department,
      faculty: studentsTable.faculty,
      level: studentsTable.level,
      enrollmentYear: studentsTable.enrollmentYear,
    })
    .from(studentsTable)
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(studentsTable.id, studentId))
    .limit(1);

  if (!student) return null;

  // Fetch only approved/locked results with course data
  const results = await db
    .select({
      id: resultsTable.id,
      courseId: resultsTable.courseId,
      semester: resultsTable.semester,
      academicYear: resultsTable.academicYear,
      grade: resultsTable.grade,
      gradePoint: resultsTable.gradePoint,
      status: resultsTable.status,
      unit: coursesTable.unit,
      courseCode: coursesTable.courseCode,
      title: coursesTable.title,
    })
    .from(resultsTable)
    .innerJoin(coursesTable, eq(resultsTable.courseId, coursesTable.id))
    .where(
      and(
        eq(resultsTable.studentId, studentId),
        or(eq(resultsTable.status, "approved"), eq(resultsTable.status, "locked"))
      )
    );

  // Group by semester
  const semMap = new Map<string, typeof results>();
  for (const r of results) {
    const key = `${r.academicYear}__${r.semester}`;
    if (!semMap.has(key)) semMap.set(key, []);
    semMap.get(key)!.push(r);
  }

  const semesterBreakdown: SemesterGPA[] = [];
  let totalQP = 0;
  let totalUnits = 0;

  for (const [key, rows] of semMap.entries()) {
    const [academicYear, semester] = key.split("__");
    let semQP = 0, semUnits = 0;
    for (const r of rows) {
      if (r.gradePoint !== null && r.gradePoint !== undefined) {
        semQP += r.gradePoint * r.unit;
        semUnits += r.unit;
      }
    }
    const gpa = semUnits > 0 ? parseFloat((semQP / semUnits).toFixed(2)) : 0;
    semesterBreakdown.push({ academicYear, semester, unitsAttempted: semUnits, qualityPoints: parseFloat(semQP.toFixed(2)), gpa });
    totalQP += semQP;
    totalUnits += semUnits;
  }

  // Sort semesters chronologically
  semesterBreakdown.sort((a, b) => {
    const ay = a.academicYear.localeCompare(b.academicYear);
    if (ay !== 0) return ay;
    return a.semester === "first" ? -1 : 1;
  });

  const cgpa = totalUnits > 0 ? parseFloat((totalQP / totalUnits).toFixed(2)) : 0;
  const classification = getClassification(cgpa, totalUnits);
  const status = getAcademicStatus(cgpa, semesterBreakdown);

  // Carryover courses (grade F in approved/locked results)
  const carryoverCourses = results
    .filter(r => r.grade === "F")
    .map(r => ({
      courseCode: r.courseCode,
      title: r.title,
      grade: r.grade!,
      semester: r.semester,
      academicYear: r.academicYear,
    }));

  // Persist to academic_standings table
  await db.insert(academicStandingsTable).values({
    studentId,
    cgpa,
    classification,
    status,
    totalUnitsAttempted: totalUnits,
    totalQualityPoints: parseFloat(totalQP.toFixed(2)),
  }).onConflictDoNothing();

  return {
    studentId: student.id,
    studentName: student.name,
    matricNumber: student.matricNumber,
    department: student.department,
    faculty: student.faculty,
    level: student.level,
    enrollmentYear: student.enrollmentYear,
    cgpa,
    classification,
    status,
    totalUnitsAttempted: totalUnits,
    totalQualityPoints: parseFloat(totalQP.toFixed(2)),
    semesterBreakdown,
    carryoverCourses,
    generatedAt: new Date().toISOString(),
  };
}
