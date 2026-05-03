import bcrypt from "bcryptjs";
import { sql, eq } from "drizzle-orm";
import {
  db, pool,
  usersTable, studentsTable, lecturersTable,
  coursesTable, enrollmentsTable, resultsTable,
  feesTable, paymentsTable, receiptsTable, financialLedgerTable,
  academicSessionsTable, academicSemestersTable,
  venuesTable, timetablesTable,
  hostelsTable, roomsTable, bedSpacesTable,
  hostelApplicationsTable, hostelAllocationsTable,
  disciplinaryCasesTable, disciplinaryActionsTable, disciplinaryFlagsTable,
  disciplinaryAppealsTable, appealDecisionsTable,
  welfareCasesTable, welfareAssignmentsTable, welfareNotesTable,
  graduationClearancesTable, graduationApplicationsTable,
  transcriptsTable, academicStandingsTable,
  notificationsTable, announcementsTable,
  activityLogsTable,
} from "@workspace/db";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const log = (msg: string) => console.log(`  ${msg}`);
const ok  = (msg: string) => console.log(`  ✔ ${msg}`);

function grade(total: number): { grade: string; gradePoint: number } {
  if (total >= 70) return { grade: "A", gradePoint: 5.0 };
  if (total >= 60) return { grade: "B", gradePoint: 4.0 };
  if (total >= 50) return { grade: "C", gradePoint: 3.0 };
  if (total >= 45) return { grade: "D", gradePoint: 2.0 };
  if (total >= 40) return { grade: "E", gradePoint: 1.0 };
  return { grade: "F", gradePoint: 0.0 };
}

// quality: 1=excellent, 2=good, 3=average, 4=below_avg, 5=failing
function score(quality: number, seed: number): { caScore: number; examScore: number; totalScore: number } {
  const pools = [
    [[36,37,38,39,40],    [54,55,56,57,58,59,60]],  // 1: 90-100
    [[30,31,32,33,34,35], [46,47,48,49,50,51,52]],  // 2: 76-87
    [[24,25,26,27,28,29], [37,38,39,40,41,42]],     // 3: 61-71
    [[16,17,18,19,20,21], [28,29,30,31,32,33]],     // 4: 44-54
    [[7,8,9,10,11,12],   [15,16,17,18,19,20]],      // 5: 22-32
  ];
  const [caPool, exPool] = pools[quality - 1];
  const caScore  = caPool[seed % caPool.length];
  const examScore = exPool[(seed * 3 + 1) % exPool.length];
  return { caScore, examScore, totalScore: caScore + examScore };
}

function refNum(prefix: string, n: number): string {
  return `${prefix}-${String(n).padStart(8, "0")}`;
}

function cgpaOf(rows: { gradePoint: number; unit: number }[]): number {
  const tqp = rows.reduce((s, r) => s + r.gradePoint * r.unit, 0);
  const tu  = rows.reduce((s, r) => s + r.unit, 0);
  return tu === 0 ? 0 : Math.round((tqp / tu) * 100) / 100;
}

function classify(cgpa: number): { classification: string; status: "good"|"probation"|"withdrawal_risk" } {
  if (cgpa >= 4.50) return { classification: "First Class", status: "good" };
  if (cgpa >= 3.50) return { classification: "Second Class Upper", status: "good" };
  if (cgpa >= 2.40) return { classification: "Second Class Lower", status: "good" };
  if (cgpa >= 1.50) return { classification: "Third Class", status: "probation" };
  if (cgpa >= 1.00) return { classification: "Pass", status: "probation" };
  return { classification: "Fail", status: "withdrawal_risk" };
}

// ─── CLEAR ────────────────────────────────────────────────────────────────────

async function clearAll() {
  log("Clearing all tables...");
  await db.execute(sql`
    TRUNCATE TABLE
      announcements, activity_logs, notifications,
      academic_standings, transcripts,
      graduation_applications, graduation_clearances,
      welfare_notes, welfare_assignments, welfare_cases,
      appeal_decisions, disciplinary_appeals,
      disciplinary_flags, disciplinary_actions, disciplinary_cases,
      hostel_allocations, bed_spaces, rooms, hostel_applications, hostels,
      timetables, venues,
      financial_ledger, receipts, payments, fees,
      results, enrollments, courses,
      students, lecturers,
      academic_semesters, academic_sessions,
      users
    RESTART IDENTITY CASCADE
  `);
  ok("All tables cleared");
}

// ─── SESSIONS ─────────────────────────────────────────────────────────────────

async function seedSessions() {
  const sessionData = [
    { name: "2021/2022", isActive: false },
    { name: "2022/2023", isActive: false },
    { name: "2023/2024", isActive: false },
    { name: "2024/2025", isActive: true },
  ];
  const sessions = await db.insert(academicSessionsTable).values(sessionData).returning();

  const semData = sessions.flatMap(s => [
    { name: "First Semester" as const,  sessionId: s.id, isActive: s.name === "2024/2025" },
    { name: "Second Semester" as const, sessionId: s.id, isActive: false },
  ]);
  const semesters = await db.insert(academicSemestersTable).values(semData).returning();

  ok(`Sessions: ${sessions.map(s => s.name).join(", ")}`);
  return { sessions, semesters };
}

// ─── USERS ────────────────────────────────────────────────────────────────────

async function seedUsers(pwHash: string) {
  const data = [
    // super_admin
    { name: "Dr. Aminu Kano",           email: "admin@maaun.edu.ng",                  role: "super_admin" as const },
    // admins
    { name: "Prof. Halima Ibrahim",      email: "halima.ibrahim@maaun.edu.ng",          role: "admin" as const },
    { name: "Dr. Hadiza Musa",           email: "hadiza.musa@maaun.edu.ng",             role: "admin" as const },
    // dean
    { name: "Prof. Abubakar Shehu",      email: "abubakar.shehu@maaun.edu.ng",          role: "dean" as const },
    // registrar
    { name: "Mr. Samuel Okafor",         email: "samuel.okafor@maaun.edu.ng",           role: "registrar" as const },
    // bursar
    { name: "Mrs. Fatima Bello",         email: "fatima.bello@maaun.edu.ng",            role: "bursar" as const },
    // hods
    { name: "Prof. Ahmad Usman",         email: "ahmad.usman@maaun.edu.ng",             role: "hod" as const },
    { name: "Dr. Kemi Adesanya",         email: "kemi.adesanya@maaun.edu.ng",           role: "hod" as const },
    { name: "Prof. Garba Idris",         email: "garba.idris@maaun.edu.ng",             role: "hod" as const },
    // counsellors
    { name: "Miss Amina Danladi",        email: "amina.danladi@maaun.edu.ng",           role: "counsellor" as const },
    { name: "Mr. Chukwudi Eze",          email: "chukwudi.eze@maaun.edu.ng",            role: "counsellor" as const },
    // CS lecturers
    { name: "Prof. Ibrahim Musa",        email: "ibrahim.musa@maaun.edu.ng",            role: "lecturer" as const },
    { name: "Dr. Fatima Al-Rashid",      email: "fatima.rashid@maaun.edu.ng",           role: "lecturer" as const },
    // BA lecturers
    { name: "Prof. Sule Adamu",          email: "sule.adamu@maaun.edu.ng",              role: "lecturer" as const },
    { name: "Dr. Chioma Obi",            email: "chioma.obi@maaun.edu.ng",              role: "lecturer" as const },
    // MC lecturers
    { name: "Mr. Emeka Nwosu",           email: "emeka.nwosu@maaun.edu.ng",             role: "lecturer" as const },
    { name: "Mrs. Ngozi Adeyemi",        email: "ngozi.adeyemi@maaun.edu.ng",           role: "lecturer" as const },
    // students
    { name: "Aisha Mohammed",            email: "aisha.mohammed@student.maaun.edu.ng",  role: "student" as const },
    { name: "Usman Bello",               email: "usman.bello@student.maaun.edu.ng",     role: "student" as const },
    { name: "Fatima Abdullahi",          email: "fatima.abdullahi@student.maaun.edu.ng",role: "student" as const },
    { name: "Kabiru Hassan",             email: "kabiru.hassan@student.maaun.edu.ng",   role: "student" as const },
    { name: "Maryam Sani",              email: "maryam.sani@student.maaun.edu.ng",     role: "student" as const },
    { name: "Chukwuemeka Obi",           email: "chukwuemeka.obi@student.maaun.edu.ng", role: "student" as const },
    { name: "Amina Yusuf",              email: "amina.yusuf@student.maaun.edu.ng",     role: "student" as const },
    { name: "Ibrahim Lawal",             email: "ibrahim.lawal@student.maaun.edu.ng",   role: "student" as const },
    { name: "Zainab Aliyu",              email: "zainab.aliyu@student.maaun.edu.ng",    role: "student" as const },
    { name: "Mustapha Garba",            email: "mustapha.garba@student.maaun.edu.ng",  role: "student" as const },
    { name: "Blessing Okonkwo",          email: "blessing.okonkwo@student.maaun.edu.ng",role: "student" as const },
    { name: "Yakubu Danladi",            email: "yakubu.danladi@student.maaun.edu.ng",  role: "student" as const },
    { name: "Ramatu Shehu",             email: "ramatu.shehu@student.maaun.edu.ng",    role: "student" as const },
    { name: "Emmanuel Eze",              email: "emmanuel.eze@student.maaun.edu.ng",    role: "student" as const },
    { name: "Hauwa Ismail",              email: "hauwa.ismail@student.maaun.edu.ng",    role: "student" as const },
    { name: "Tunde Adebayo",             email: "tunde.adebayo@student.maaun.edu.ng",   role: "student" as const },
    { name: "Grace Nwosu",              email: "grace.nwosu@student.maaun.edu.ng",     role: "student" as const },
    { name: "Mohammed Bashir",           email: "mohammed.bashir@student.maaun.edu.ng", role: "student" as const },
    { name: "Ngozi Okafor",              email: "ngozi.okafor@student.maaun.edu.ng",    role: "student" as const },
    { name: "Abdullahi Musa",            email: "abdullahi.musa@student.maaun.edu.ng",  role: "student" as const },
  ];
  const users = await db.insert(usersTable).values(
    data.map(u => ({ ...u, passwordHash: pwHash }))
  ).returning();
  ok(`Users: ${users.length} created (${users.filter(u => u.role === "student").length} students, ${users.filter(u => u.role === "lecturer").length} lecturers, ${users.filter(u => !["student","lecturer"].includes(u.role)).length} staff)`);
  return users;
}

// ─── STUDENTS + LECTURERS ─────────────────────────────────────────────────────

async function seedAcademicProfiles(users: any[]) {
  const byEmail = (e: string) => users.find(u => u.email === e)!;

  // Students: [email, matric, dept, faculty, level, enrollYear]
  const studentData = [
    ["aisha.mohammed@student.maaun.edu.ng",  "MAAUN/CS/22/001", "Computer Science",       "Science and Technology",  "300", "2022"],
    ["usman.bello@student.maaun.edu.ng",     "MAAUN/CS/23/002", "Computer Science",       "Science and Technology",  "200", "2023"],
    ["fatima.abdullahi@student.maaun.edu.ng","MAAUN/CS/24/003", "Computer Science",       "Science and Technology",  "100", "2024"],
    ["kabiru.hassan@student.maaun.edu.ng",   "MAAUN/CS/22/004", "Computer Science",       "Science and Technology",  "300", "2022"],
    ["maryam.sani@student.maaun.edu.ng",     "MAAUN/CS/21/005", "Computer Science",       "Science and Technology",  "400", "2021"],
    ["chukwuemeka.obi@student.maaun.edu.ng", "MAAUN/CS/23/006", "Computer Science",       "Science and Technology",  "200", "2023"],
    ["amina.yusuf@student.maaun.edu.ng",     "MAAUN/CS/21/007", "Computer Science",       "Science and Technology",  "400", "2021"],
    ["ibrahim.lawal@student.maaun.edu.ng",   "MAAUN/BA/22/008", "Business Administration", "Management Sciences",    "300", "2022"],
    ["zainab.aliyu@student.maaun.edu.ng",    "MAAUN/BA/24/009", "Business Administration", "Management Sciences",    "100", "2024"],
    ["mustapha.garba@student.maaun.edu.ng",  "MAAUN/BA/23/010", "Business Administration", "Management Sciences",    "200", "2023"],
    ["blessing.okonkwo@student.maaun.edu.ng","MAAUN/BA/21/011", "Business Administration", "Management Sciences",    "400", "2021"],
    ["yakubu.danladi@student.maaun.edu.ng",  "MAAUN/BA/22/012", "Business Administration", "Management Sciences",    "300", "2022"],
    ["ramatu.shehu@student.maaun.edu.ng",    "MAAUN/BA/23/013", "Business Administration", "Management Sciences",    "200", "2023"],
    ["emmanuel.eze@student.maaun.edu.ng",    "MAAUN/BA/24/014", "Business Administration", "Management Sciences",    "100", "2024"],
    ["hauwa.ismail@student.maaun.edu.ng",    "MAAUN/MC/22/015", "Mass Communication",      "Arts and Social Sciences","300", "2022"],
    ["tunde.adebayo@student.maaun.edu.ng",   "MAAUN/MC/23/016", "Mass Communication",      "Arts and Social Sciences","200", "2023"],
    ["grace.nwosu@student.maaun.edu.ng",     "MAAUN/MC/21/017", "Mass Communication",      "Arts and Social Sciences","400", "2021"],
    ["mohammed.bashir@student.maaun.edu.ng", "MAAUN/MC/24/018", "Mass Communication",      "Arts and Social Sciences","100", "2024"],
    ["ngozi.okafor@student.maaun.edu.ng",    "MAAUN/MC/23/019", "Mass Communication",      "Arts and Social Sciences","200", "2023"],
    ["abdullahi.musa@student.maaun.edu.ng",  "MAAUN/MC/22/020", "Mass Communication",      "Arts and Social Sciences","300", "2022"],
  ] as const;

  const students = await db.insert(studentsTable).values(
    studentData.map(([email, matric, dept, faculty, level, year]) => ({
      userId: byEmail(email).id,
      matricNumber: matric,
      department: dept,
      faculty,
      level: level as any,
      enrollmentYear: year,
    }))
  ).returning();

  // Lecturers: [email, staffId, dept, faculty, designation]
  const lecturerData = [
    ["ibrahim.musa@maaun.edu.ng",  "MAAUN/LEC/001", "Computer Science",       "Science and Technology",  "Professor"],
    ["fatima.rashid@maaun.edu.ng", "MAAUN/LEC/002", "Computer Science",       "Science and Technology",  "Senior Lecturer"],
    ["sule.adamu@maaun.edu.ng",    "MAAUN/LEC/003", "Business Administration", "Management Sciences",    "Professor"],
    ["chioma.obi@maaun.edu.ng",    "MAAUN/LEC/004", "Business Administration", "Management Sciences",    "Lecturer I"],
    ["emeka.nwosu@maaun.edu.ng",   "MAAUN/LEC/005", "Mass Communication",      "Arts and Social Sciences","Senior Lecturer"],
    ["ngozi.adeyemi@maaun.edu.ng", "MAAUN/LEC/006", "Mass Communication",      "Arts and Social Sciences","Lecturer I"],
  ];

  const lecturers = await db.insert(lecturersTable).values(
    lecturerData.map(([email, staffId, dept, faculty, designation]) => ({
      userId: byEmail(email).id,
      staffId,
      department: dept,
      faculty,
      designation,
    }))
  ).returning();

  ok(`Students: ${students.length} | Lecturers: ${lecturers.length}`);
  return { students, lecturers };
}

// ─── COURSES ──────────────────────────────────────────────────────────────────

async function seedCourses(lecturers: any[]) {
  const lec = (idx: number) => lecturers[idx].id; // 0=Ibrahim, 1=Fatima, 2=Sule, 3=Chioma, 4=Emeka, 5=Ngozi

  const courseData = [
    // CS (first-sem even idx, second-sem odd idx)
    { courseCode: "CSC101", title: "Programming Fundamentals",  unit: 3, department: "Computer Science", faculty: "Science and Technology", level: "100", semester: "first",  lecturerId: lec(0) },
    { courseCode: "CSC102", title: "Introduction to Databases", unit: 3, department: "Computer Science", faculty: "Science and Technology", level: "100", semester: "second", lecturerId: lec(1) },
    { courseCode: "CSC201", title: "Data Structures & Algorithms",unit: 3, department: "Computer Science", faculty: "Science and Technology", level: "200", semester: "first",  lecturerId: lec(0) },
    { courseCode: "CSC202", title: "Computer Architecture",     unit: 3, department: "Computer Science", faculty: "Science and Technology", level: "200", semester: "second", lecturerId: lec(1) },
    { courseCode: "CSC301", title: "Software Engineering",      unit: 3, department: "Computer Science", faculty: "Science and Technology", level: "300", semester: "first",  lecturerId: lec(0) },
    { courseCode: "CSC302", title: "Operating Systems",         unit: 3, department: "Computer Science", faculty: "Science and Technology", level: "300", semester: "second", lecturerId: lec(1) },
    { courseCode: "CSC401", title: "Artificial Intelligence",   unit: 3, department: "Computer Science", faculty: "Science and Technology", level: "400", semester: "first",  lecturerId: lec(0) },
    { courseCode: "CSC402", title: "Final Year Project (CS)",   unit: 6, department: "Computer Science", faculty: "Science and Technology", level: "400", semester: "second", lecturerId: lec(0) },
    // BA
    { courseCode: "BUS101", title: "Principles of Management",  unit: 3, department: "Business Administration", faculty: "Management Sciences", level: "100", semester: "first",  lecturerId: lec(2) },
    { courseCode: "BUS102", title: "Introduction to Accounting",unit: 3, department: "Business Administration", faculty: "Management Sciences", level: "100", semester: "second", lecturerId: lec(3) },
    { courseCode: "BUS201", title: "Organisational Behaviour",  unit: 3, department: "Business Administration", faculty: "Management Sciences", level: "200", semester: "first",  lecturerId: lec(2) },
    { courseCode: "BUS202", title: "Business Finance",          unit: 3, department: "Business Administration", faculty: "Management Sciences", level: "200", semester: "second", lecturerId: lec(3) },
    { courseCode: "BUS301", title: "Strategic Management",      unit: 3, department: "Business Administration", faculty: "Management Sciences", level: "300", semester: "first",  lecturerId: lec(2) },
    { courseCode: "BUS302", title: "Business Law",              unit: 3, department: "Business Administration", faculty: "Management Sciences", level: "300", semester: "second", lecturerId: lec(3) },
    { courseCode: "BUS401", title: "Business Policy",           unit: 3, department: "Business Administration", faculty: "Management Sciences", level: "400", semester: "first",  lecturerId: lec(2) },
    { courseCode: "BUS402", title: "Final Year Project (BA)",   unit: 6, department: "Business Administration", faculty: "Management Sciences", level: "400", semester: "second", lecturerId: lec(2) },
    // MC
    { courseCode: "MCM101", title: "Intro to Mass Communication",unit: 3, department: "Mass Communication", faculty: "Arts and Social Sciences", level: "100", semester: "first",  lecturerId: lec(4) },
    { courseCode: "MCM102", title: "Media Writing",             unit: 3, department: "Mass Communication", faculty: "Arts and Social Sciences", level: "100", semester: "second", lecturerId: lec(5) },
    { courseCode: "MCM201", title: "Broadcast Journalism",      unit: 3, department: "Mass Communication", faculty: "Arts and Social Sciences", level: "200", semester: "first",  lecturerId: lec(4) },
    { courseCode: "MCM202", title: "Media Ethics",              unit: 3, department: "Mass Communication", faculty: "Arts and Social Sciences", level: "200", semester: "second", lecturerId: lec(5) },
    { courseCode: "MCM301", title: "Digital Media Production",  unit: 3, department: "Mass Communication", faculty: "Arts and Social Sciences", level: "300", semester: "first",  lecturerId: lec(4) },
    { courseCode: "MCM302", title: "Public Relations",          unit: 3, department: "Mass Communication", faculty: "Arts and Social Sciences", level: "300", semester: "second", lecturerId: lec(5) },
    { courseCode: "MCM401", title: "Media Research Methods",    unit: 3, department: "Mass Communication", faculty: "Arts and Social Sciences", level: "400", semester: "first",  lecturerId: lec(4) },
    { courseCode: "MCM402", title: "Final Year Project (MC)",   unit: 6, department: "Mass Communication", faculty: "Arts and Social Sciences", level: "400", semester: "second", lecturerId: lec(4) },
    // General Studies
    { courseCode: "GST101", title: "Use of English I",          unit: 2, department: "General Studies", faculty: "General Studies", level: "100", semester: "first",  lecturerId: lec(0) },
    { courseCode: "GST102", title: "Nigerian History & Culture",unit: 2, department: "General Studies", faculty: "General Studies", level: "100", semester: "second", lecturerId: lec(1) },
    { courseCode: "GST201", title: "Philosophy & Logic",        unit: 2, department: "General Studies", faculty: "General Studies", level: "200", semester: "first",  lecturerId: lec(2) },
    { courseCode: "GST202", title: "Leadership & Ethics",       unit: 2, department: "General Studies", faculty: "General Studies", level: "200", semester: "second", lecturerId: lec(3) },
    { courseCode: "GST301", title: "Research Skills",           unit: 2, department: "General Studies", faculty: "General Studies", level: "300", semester: "first",  lecturerId: lec(4) },
    { courseCode: "GST302", title: "Innovation & Society",      unit: 2, department: "General Studies", faculty: "General Studies", level: "300", semester: "second", lecturerId: lec(5) },
    { courseCode: "GST401", title: "Community Development",     unit: 2, department: "General Studies", faculty: "General Studies", level: "400", semester: "first",  lecturerId: lec(0) },
    { courseCode: "GST402", title: "Sustainable Development",   unit: 2, department: "General Studies", faculty: "General Studies", level: "400", semester: "second", lecturerId: lec(1) },
  ];

  const courses = await db.insert(coursesTable).values(courseData as any).returning();
  ok(`Courses: ${courses.length} created across CS, BA, MC + General Studies`);
  return courses;
}

// ─── ENROLLMENTS + RESULTS ────────────────────────────────────────────────────

// Returns course id by code
function cById(courses: any[], code: string) { return courses.find(c => c.courseCode === code)!.id; }

// student enrollment plan: [email, [[academicYear, semester, courseCode, quality, seed?][]]]
// quality per course (can override for specific failing courses)
async function seedEnrollmentsAndResults(students: any[], courses: any[], sessions: any[], semesters: any[]) {
  const byMatric = (m: string) => students.find(s => s.matricNumber === m)!;
  const cid = (code: string) => cById(courses, code);
  const courseUnit = (code: string) => courses.find(c => c.courseCode === code)!.unit;

  // plan: studentIndex, quality, history of [year, sem, courses]
  type EnrollPlan = {
    matric: string;
    quality: number;
    history: [string, "first"|"second", string[]][];
    overrides?: Record<string, number>; // courseCode -> quality override
  };

  const plans: EnrollPlan[] = [
    // CS 300L
    { matric: "MAAUN/CS/22/001", quality: 2, history: [
      ["2022/2023","first", ["CSC101","GST101"]], ["2022/2023","second",["CSC102","GST102"]],
      ["2023/2024","first", ["CSC201","GST201"]], ["2023/2024","second",["CSC202","GST202"]],
      ["2024/2025","first", ["CSC301","GST301"]],
    ]},
    // CS 200L (excellent)
    { matric: "MAAUN/CS/23/002", quality: 1, history: [
      ["2023/2024","first", ["CSC101","GST101"]], ["2023/2024","second",["CSC102","GST102"]],
      ["2024/2025","first", ["CSC201","GST201"]],
    ]},
    // CS 100L (good)
    { matric: "MAAUN/CS/24/003", quality: 2, history: [
      ["2024/2025","first", ["CSC101","GST101"]],
    ]},
    // CS 300L Kabiru (below_average, has F in CSC201)
    { matric: "MAAUN/CS/22/004", quality: 4, history: [
      ["2022/2023","first", ["CSC101","GST101"]], ["2022/2023","second",["CSC102","GST102"]],
      ["2023/2024","first", ["CSC201","GST201"]], ["2023/2024","second",["CSC202","GST202"]],
      ["2024/2025","first", ["CSC301","GST301","CSC201"]], // CSC201 retake
    ], overrides: { "CSC201_2023/2024_first": 5, "CSC201_2024/2025_first": 3 }},
    // CS 400L Maryam (excellent, eligible graduation)
    { matric: "MAAUN/CS/21/005", quality: 1, history: [
      ["2021/2022","first", ["CSC101","GST101"]], ["2021/2022","second",["CSC102","GST102"]],
      ["2022/2023","first", ["CSC201","GST201"]], ["2022/2023","second",["CSC202","GST202"]],
      ["2023/2024","first", ["CSC301","GST301"]], ["2023/2024","second",["CSC302","GST302"]],
      ["2024/2025","first", ["CSC401","GST401"]], ["2024/2025","second",["CSC402","GST402"]],
    ]},
    // CS 200L Chukwuemeka (average)
    { matric: "MAAUN/CS/23/006", quality: 3, history: [
      ["2023/2024","first", ["CSC101","GST101"]], ["2023/2024","second",["CSC102","GST102"]],
      ["2024/2025","first", ["CSC201","GST201"]],
    ]},
    // CS 400L Amina (failing, carryovers, ineligible graduation)
    { matric: "MAAUN/CS/21/007", quality: 5, history: [
      ["2021/2022","first", ["CSC101","GST101"]], ["2021/2022","second",["CSC102","GST102"]],
      ["2022/2023","first", ["CSC201","GST201"]], ["2022/2023","second",["CSC202","GST202"]],
      ["2023/2024","first", ["CSC301","GST301","CSC201"]], ["2023/2024","second",["CSC302","GST302","CSC202"]],
      ["2024/2025","first", ["CSC401","GST401","CSC301"]], // CSC301 retake (still failing)
    ], overrides: { "CSC201_2022/2023_first": 5, "CSC202_2022/2023_second": 5, "CSC301_2023/2024_first": 5 }},
    // BA 300L Ibrahim (good)
    { matric: "MAAUN/BA/22/008", quality: 2, history: [
      ["2022/2023","first", ["BUS101","GST101"]], ["2022/2023","second",["BUS102","GST102"]],
      ["2023/2024","first", ["BUS201","GST201"]], ["2023/2024","second",["BUS202","GST202"]],
      ["2024/2025","first", ["BUS301","GST301"]],
    ]},
    // BA 100L Zainab (excellent)
    { matric: "MAAUN/BA/24/009", quality: 1, history: [
      ["2024/2025","first", ["BUS101","GST101"]],
    ]},
    // BA 200L Mustapha (average)
    { matric: "MAAUN/BA/23/010", quality: 3, history: [
      ["2023/2024","first", ["BUS101","GST101"]], ["2023/2024","second",["BUS102","GST102"]],
      ["2024/2025","first", ["BUS201","GST201"]],
    ]},
    // BA 400L Blessing (good, eligible graduation)
    { matric: "MAAUN/BA/21/011", quality: 2, history: [
      ["2021/2022","first", ["BUS101","GST101"]], ["2021/2022","second",["BUS102","GST102"]],
      ["2022/2023","first", ["BUS201","GST201"]], ["2022/2023","second",["BUS202","GST202"]],
      ["2023/2024","first", ["BUS301","GST301"]], ["2023/2024","second",["BUS302","GST302"]],
      ["2024/2025","first", ["BUS401","GST401"]], ["2024/2025","second",["BUS402","GST402"]],
    ]},
    // BA 300L Yakubu (below_average, welfare case)
    { matric: "MAAUN/BA/22/012", quality: 4, history: [
      ["2022/2023","first", ["BUS101","GST101"]], ["2022/2023","second",["BUS102","GST102"]],
      ["2023/2024","first", ["BUS201","GST201"]], ["2023/2024","second",["BUS202","GST202"]],
      ["2024/2025","first", ["BUS301","GST301"]],
    ]},
    // BA 200L Ramatu (average)
    { matric: "MAAUN/BA/23/013", quality: 3, history: [
      ["2023/2024","first", ["BUS101","GST101"]], ["2023/2024","second",["BUS102","GST102"]],
      ["2024/2025","first", ["BUS201","GST201"]],
    ]},
    // BA 100L Emmanuel (good)
    { matric: "MAAUN/BA/24/014", quality: 2, history: [
      ["2024/2025","first", ["BUS101","GST101"]],
    ]},
    // MC 300L Hauwa (excellent)
    { matric: "MAAUN/MC/22/015", quality: 1, history: [
      ["2022/2023","first", ["MCM101","GST101"]], ["2022/2023","second",["MCM102","GST102"]],
      ["2023/2024","first", ["MCM201","GST201"]], ["2023/2024","second",["MCM202","GST202"]],
      ["2024/2025","first", ["MCM301","GST301"]],
    ]},
    // MC 200L Tunde (average)
    { matric: "MAAUN/MC/23/016", quality: 3, history: [
      ["2023/2024","first", ["MCM101","GST101"]], ["2023/2024","second",["MCM102","GST102"]],
      ["2024/2025","first", ["MCM201","GST201"]],
    ]},
    // MC 400L Grace (average, marginal graduation)
    { matric: "MAAUN/MC/21/017", quality: 3, history: [
      ["2021/2022","first", ["MCM101","GST101"]], ["2021/2022","second",["MCM102","GST102"]],
      ["2022/2023","first", ["MCM201","GST201"]], ["2022/2023","second",["MCM202","GST202"]],
      ["2023/2024","first", ["MCM301","GST301"]], ["2023/2024","second",["MCM302","GST302"]],
      ["2024/2025","first", ["MCM401","GST401"]], ["2024/2025","second",["MCM402","GST402"]],
    ]},
    // MC 100L Mohammed (below_average)
    { matric: "MAAUN/MC/24/018", quality: 4, history: [
      ["2024/2025","first", ["MCM101","GST101"]],
    ]},
    // MC 200L Ngozi (good)
    { matric: "MAAUN/MC/23/019", quality: 2, history: [
      ["2023/2024","first", ["MCM101","GST101"]], ["2023/2024","second",["MCM102","GST102"]],
      ["2024/2025","first", ["MCM201","GST201"]],
    ]},
    // MC 300L Abdullahi (failing, withdrawal risk)
    { matric: "MAAUN/MC/22/020", quality: 5, history: [
      ["2022/2023","first", ["MCM101","GST101"]], ["2022/2023","second",["MCM102","GST102"]],
      ["2023/2024","first", ["MCM201","GST201"]], ["2023/2024","second",["MCM202","GST202"]],
      ["2024/2025","first", ["MCM301","GST301","MCM201"]], // MCM201 retake (still failing)
    ], overrides: { "MCM201_2023/2024_first": 5, "MCM201_2024/2025_first": 5 }},
  ];

  let totalEnrollments = 0;
  let totalResults = 0;
  const cgpaMap: Record<number, { rows: { gradePoint: number; unit: number }[] }> = {};

  for (const plan of plans) {
    const student = byMatric(plan.matric);
    cgpaMap[student.id] = { rows: [] };
    let seed = 0;

    for (const [year, sem, courseCodes] of plan.history) {
      for (const code of courseCodes) {
        const courseId = cid(code);
        const unit = courseUnit(code);
        const overrideKey = `${code}_${year}_${sem}`;
        const q = plan.overrides?.[overrideKey] ?? plan.quality;
        const { caScore, examScore, totalScore } = score(q, seed++);
        const g = grade(totalScore);

        // Enrollment
        const isCurrentSem = year === "2024/2025" && sem === "first";
        const enrollStatus = isCurrentSem ? "active" : "completed";

        await db.insert(enrollmentsTable).values({
          studentId: student.id,
          courseId,
          semester: sem,
          academicYear: year,
          status: enrollStatus,
        }).onConflictDoNothing();
        totalEnrollments++;

        // Result (past semesters locked/approved, current drafted or submitted)
        const resultStatus = isCurrentSem ? "submitted" : "locked";
        await db.insert(resultsTable).values({
          studentId: student.id,
          courseId,
          semester: sem,
          academicYear: year,
          caScore,
          examScore,
          totalScore,
          grade: g.grade,
          gradePoint: g.gradePoint,
          status: resultStatus,
        }).onConflictDoNothing();
        totalResults++;

        if (!isCurrentSem) {
          cgpaMap[student.id].rows.push({ gradePoint: g.gradePoint, unit });
        }
      }
    }

    // Update student CGPA
    const cgpa = cgpaOf(cgpaMap[student.id].rows);
    await db.update(studentsTable).set({ cgpa }).where(eq(studentsTable.id, student.id));
  }

  ok(`Enrollments: ${totalEnrollments} | Results: ${totalResults}`);
  return cgpaMap;
}

// ─── FEES + PAYMENTS + RECEIPTS + LEDGER ──────────────────────────────────────

async function seedFinance(students: any[], users: any[], cgpaMap: any) {
  // Fees
  const feeRows = await db.insert(feesTable).values([
    { name: "Tuition Fee 2024/2025",    amount: 200000, description: "Annual tuition fee" },
    { name: "Registration Fee 2024/2025", amount: 10000, description: "Course registration fee" },
    { name: "Library Levy 2024/2025",   amount:  5000, description: "Library access levy" },
    { name: "Hostel Fee 2024/2025",     amount: 50000, description: "Hostel accommodation fee" },
  ]).returning();

  const [tuitionFee, regFee, libFee, hostelFee] = feeRows;
  const bursar = users.find(u => u.email === "fatima.bello@maaun.edu.ng")!;
  const adminUser = users.find(u => u.email === "admin@maaun.edu.ng")!;

  // Payment scenarios:
  // Fully paid: indices 0,1,2,4,5,7,8,9,10,12,13,14,15,17,18 (15 students)
  // Partially paid: indices 3(Kabiru),11(Yakubu),16(Grace)
  // Unpaid: indices 6(Amina),19(Abdullahi)

  const fullyPaid = [
    "MAAUN/CS/22/001","MAAUN/CS/23/002","MAAUN/CS/24/003","MAAUN/CS/21/005",
    "MAAUN/CS/23/006","MAAUN/BA/22/008","MAAUN/BA/24/009","MAAUN/BA/23/010",
    "MAAUN/BA/21/011","MAAUN/BA/23/013","MAAUN/BA/24/014","MAAUN/MC/22/015",
    "MAAUN/MC/23/016","MAAUN/MC/24/018","MAAUN/MC/23/019",
  ];
  const partiallyPaid = ["MAAUN/CS/22/004","MAAUN/BA/22/012","MAAUN/MC/21/017"];
  const unpaid = ["MAAUN/CS/21/007","MAAUN/MC/22/020"];

  let payCount = 0, receiptCount = 0;
  const paidAt = new Date("2024-08-15");

  for (const student of students) {
    const user = users.find(u => u.id === student.userId)!;

    if (fullyPaid.includes(student.matricNumber)) {
      // Tuition + Registration + Library
      for (const fee of [tuitionFee, regFee, libFee]) {
        const ref = refNum("PAY", ++payCount * 100 + student.id);
        const [payment] = await db.insert(paymentsTable).values({
          userId: user.id, feeId: fee.id, reference: ref,
          amount: fee.amount, status: "success", paidAt,
        }).returning();

        const receiptRef = refNum("RCP", ++receiptCount * 100 + student.id);
        const [receipt] = await db.insert(receiptsTable).values({
          paymentId: payment.id, userId: user.id,
          referenceNumber: receiptRef, amount: fee.amount,
          feeName: fee.name, status: "confirmed",
          issuedBy: bursar.id, issuedAt: paidAt,
          ipAddress: "41.58.100.12",
        }).returning();

        await db.insert(financialLedgerTable).values({
          userId: user.id, type: "credit", amount: fee.amount,
          description: `Payment for ${fee.name}`,
          relatedPaymentId: payment.id, relatedReceiptId: receipt.id,
          balanceAfter: fee.amount,
        });
      }
    } else if (partiallyPaid.includes(student.matricNumber)) {
      // Registration only
      const ref = refNum("PAY", ++payCount * 100 + student.id);
      const [payment] = await db.insert(paymentsTable).values({
        userId: user.id, feeId: regFee.id, reference: ref,
        amount: regFee.amount, status: "success", paidAt,
      }).returning();
      const receiptRef = refNum("RCP", ++receiptCount * 100 + student.id);
      const [receipt] = await db.insert(receiptsTable).values({
        paymentId: payment.id, userId: user.id,
        referenceNumber: receiptRef, amount: regFee.amount,
        feeName: regFee.name, status: "confirmed",
        issuedBy: bursar.id, issuedAt: paidAt, ipAddress: "41.58.100.12",
      }).returning();
      await db.insert(financialLedgerTable).values({
        userId: user.id, type: "credit", amount: regFee.amount,
        description: `Payment for ${regFee.name}`,
        relatedPaymentId: payment.id, relatedReceiptId: receipt.id,
        balanceAfter: regFee.amount,
      });

      // Failed/pending tuition attempt
      const failRef = refNum("PAY", ++payCount * 100 + student.id + 5000);
      await db.insert(paymentsTable).values({
        userId: user.id, feeId: tuitionFee.id, reference: failRef,
        amount: tuitionFee.amount, status: "failed", paidAt: undefined,
      });
    }
    // unpaid: no payment records
  }

  // One reversed payment (Kabiru Hassan)
  const kabiruStudent = students.find(s => s.matricNumber === "MAAUN/CS/22/004")!;
  const kabiruUser = users.find(u => u.id === kabiruStudent.userId)!;
  const libRef = refNum("PAY", 99901);
  const [reversedPayment] = await db.insert(paymentsTable).values({
    userId: kabiruUser.id, feeId: libFee.id,
    reference: libRef, amount: libFee.amount, status: "success",
    paidAt: new Date("2024-09-01"),
  }).returning();
  const revReceiptRef = refNum("RCP", 99901);
  const [reversedReceipt] = await db.insert(receiptsTable).values({
    paymentId: reversedPayment.id, userId: kabiruUser.id,
    referenceNumber: revReceiptRef, amount: libFee.amount,
    feeName: libFee.name, status: "reversed",
    issuedBy: bursar.id, issuedAt: new Date("2024-09-01"),
    reversedAt: new Date("2024-09-10"),
    reversalReason: "Duplicate payment — student paid twice. Refund issued.",
    ipAddress: "41.58.100.12",
  }).returning();
  await db.insert(financialLedgerTable).values([
    { userId: kabiruUser.id, type: "credit", amount: libFee.amount,
      description: `Payment for ${libFee.name}`,
      relatedPaymentId: reversedPayment.id, relatedReceiptId: reversedReceipt.id, balanceAfter: libFee.amount },
    { userId: kabiruUser.id, type: "debit", amount: libFee.amount,
      description: `Reversal: ${libFee.name} — duplicate payment`,
      relatedPaymentId: reversedPayment.id, relatedReceiptId: reversedReceipt.id, balanceAfter: 0 },
  ]);

  ok(`Fees: ${feeRows.length} | Payments: ${payCount} | Receipts: ${receiptCount} (1 reversed)`);
  return feeRows;
}

// ─── VENUES + TIMETABLE ───────────────────────────────────────────────────────

async function seedTimetable(courses: any[], lecturers: any[], sessions: any[], semesters: any[]) {
  const venueRows = await db.insert(venuesTable).values([
    { name: "Lecture Hall 101", capacity: 120, location: "Main Academic Block, Ground Floor" },
    { name: "Lecture Hall 102", capacity: 80,  location: "Main Academic Block, Ground Floor" },
    { name: "Lecture Hall 201", capacity: 100, location: "Management Block, First Floor" },
    { name: "Lecture Hall 202", capacity: 60,  location: "Management Block, First Floor" },
    { name: "Lecture Hall 301", capacity: 80,  location: "Arts Block, Second Floor" },
    { name: "Computer Lab 1",   capacity: 40,  location: "ICT Centre, Ground Floor" },
    { name: "Main Auditorium",  capacity: 400, location: "Student Union Building" },
  ]).returning();

  const cid = (code: string) => courses.find(c => c.courseCode === code)!.id;
  const lid = (email: string) => lecturers.find(l => l.staffId.includes("001") ? "ibrahim.musa@maaun.edu.ng" === email :
    l.staffId.includes("002") ? "fatima.rashid@maaun.edu.ng" === email :
    l.staffId.includes("003") ? "sule.adamu@maaun.edu.ng" === email :
    l.staffId.includes("004") ? "chioma.obi@maaun.edu.ng" === email :
    l.staffId.includes("005") ? "emeka.nwosu@maaun.edu.ng" === email :
    "ngozi.adeyemi@maaun.edu.ng" === email)!.id;

  // Use actual lecturer IDs from courses
  const lec = (idx: number) => lecturers[idx].id;
  const session = sessions.find(s => s.name === "2024/2025")!;
  const semester = semesters.find(s => s.sessionId === session.id && s.name === "First Semester")!;
  const vid = (i: number) => venueRows[i].id;

  const slots = [
    { courseCode:"CSC101",day:"Monday",   start:"08:00",end:"10:00", venueIdx:0, lecIdx:0 },
    { courseCode:"CSC201",day:"Tuesday",  start:"08:00",end:"10:00", venueIdx:0, lecIdx:0 },
    { courseCode:"CSC301",day:"Wednesday",start:"08:00",end:"10:00", venueIdx:5, lecIdx:0 },
    { courseCode:"CSC401",day:"Thursday", start:"08:00",end:"10:00", venueIdx:5, lecIdx:0 },
    { courseCode:"BUS101",day:"Monday",   start:"10:00",end:"12:00", venueIdx:2, lecIdx:2 },
    { courseCode:"BUS201",day:"Tuesday",  start:"10:00",end:"12:00", venueIdx:2, lecIdx:2 },
    { courseCode:"BUS301",day:"Wednesday",start:"10:00",end:"12:00", venueIdx:2, lecIdx:2 },
    { courseCode:"BUS401",day:"Thursday", start:"10:00",end:"12:00", venueIdx:3, lecIdx:2 },
    { courseCode:"MCM101",day:"Monday",   start:"12:00",end:"14:00", venueIdx:4, lecIdx:4 },
    { courseCode:"MCM201",day:"Tuesday",  start:"12:00",end:"14:00", venueIdx:4, lecIdx:4 },
    { courseCode:"MCM301",day:"Wednesday",start:"12:00",end:"14:00", venueIdx:4, lecIdx:4 },
    { courseCode:"MCM401",day:"Thursday", start:"12:00",end:"14:00", venueIdx:4, lecIdx:4 },
    { courseCode:"GST101",day:"Friday",   start:"08:00",end:"10:00", venueIdx:6, lecIdx:0 },
    { courseCode:"GST201",day:"Friday",   start:"10:00",end:"12:00", venueIdx:6, lecIdx:2 },
    { courseCode:"GST301",day:"Friday",   start:"12:00",end:"14:00", venueIdx:6, lecIdx:4 },
    { courseCode:"GST401",day:"Friday",   start:"14:00",end:"16:00", venueIdx:6, lecIdx:0 },
  ];

  await db.insert(timetablesTable).values(slots.map(s => ({
    courseId: cid(s.courseCode),
    lecturerId: lec(s.lecIdx),
    venueId: vid(s.venueIdx),
    dayOfWeek: s.day as any,
    startTime: s.start,
    endTime: s.end,
    sessionId: session.id,
    semesterId: semester.id,
    createdBy: 1,
  })));

  ok(`Venues: ${venueRows.length} | Timetable: ${slots.length} slots (Mon–Fri schedule)`);
  return venueRows;
}

// ─── HOSTELS ──────────────────────────────────────────────────────────────────

async function seedHostels(students: any[], users: any[], sessions: any[]) {
  const adminUser = users.find(u => u.email === "admin@maaun.edu.ng")!;
  const session = sessions.find(s => s.name === "2024/2025")!;

  const [maleHostel, femaleHostel] = await db.insert(hostelsTable).values([
    { name: "Al-Amin Hall", gender: "male",   totalRooms: 10, location: "North Campus",  description: "Male students hostel, single and double occupancy rooms." },
    { name: "Khadija Hall", gender: "female", totalRooms: 10, location: "South Campus", description: "Female students hostel, modern facilities with 24h security." },
  ]).returning();

  // Create rooms (5 rooms per hostel, 4 beds each)
  const maleRooms = await db.insert(roomsTable).values(
    Array.from({ length: 5 }, (_, i) => ({
      hostelId: maleHostel.id, roomNumber: `A${i + 101}`,
      capacity: 4, status: "available" as const, floor: Math.floor(i / 3) + 1,
    }))
  ).returning();

  const femaleRooms = await db.insert(roomsTable).values(
    Array.from({ length: 5 }, (_, i) => ({
      hostelId: femaleHostel.id, roomNumber: `B${i + 101}`,
      capacity: 4, status: "available" as const, floor: Math.floor(i / 3) + 1,
    }))
  ).returning();

  // Bed spaces
  const maleBeds: any[] = [];
  for (const room of maleRooms) {
    const beds = await db.insert(bedSpacesTable).values(
      ["A","B","C","D"].map(label => ({ roomId: room.id, bedLabel: label, status: "vacant" as const }))
    ).returning();
    maleBeds.push(...beds);
  }

  const femaleBeds: any[] = [];
  for (const room of femaleRooms) {
    const beds = await db.insert(bedSpacesTable).values(
      ["A","B","C","D"].map(label => ({ roomId: room.id, bedLabel: label, status: "vacant" as const }))
    ).returning();
    femaleBeds.push(...beds);
  }

  // Male students to apply
  const maleMatrics = ["MAAUN/CS/23/002","MAAUN/CS/22/004","MAAUN/CS/23/006","MAAUN/BA/22/008","MAAUN/BA/23/010","MAAUN/BA/22/012","MAAUN/BA/24/014","MAAUN/MC/23/016","MAAUN/MC/24/018","MAAUN/MC/22/020"];
  // Kabiru (004) → rejected (disciplinary block), Yakubu (012) → rejected (partial payment), Abdullahi (020) → rejected (disciplinary)
  const maleAllocate = ["MAAUN/CS/23/002","MAAUN/CS/23/006","MAAUN/BA/22/008","MAAUN/BA/23/010","MAAUN/BA/24/014","MAAUN/MC/23/016","MAAUN/MC/24/018"];
  const maleReject   = ["MAAUN/CS/22/004","MAAUN/BA/22/012","MAAUN/MC/22/020"];

  const femaleMatrics = ["MAAUN/CS/22/001","MAAUN/CS/24/003","MAAUN/CS/21/005","MAAUN/CS/21/007","MAAUN/BA/24/009","MAAUN/BA/21/011","MAAUN/BA/23/013","MAAUN/MC/22/015","MAAUN/MC/21/017","MAAUN/MC/23/019"];
  // Amina (007) → rejected (unpaid + failing), Grace (017) → rejected (partial payment)
  const femaleAllocate = ["MAAUN/CS/22/001","MAAUN/CS/24/003","MAAUN/CS/21/005","MAAUN/BA/24/009","MAAUN/BA/21/011","MAAUN/BA/23/013","MAAUN/MC/22/015","MAAUN/MC/23/019"];
  const femaleReject   = ["MAAUN/CS/21/007","MAAUN/MC/21/017"];

  let bedIdx = 0;
  let appCount = 0;
  let allocCount = 0;

  // Male applications + allocations
  for (const matric of maleMatrics) {
    const student = students.find(s => s.matricNumber === matric)!;
    const isAllocated = maleAllocate.includes(matric);
    const isRejected  = maleReject.includes(matric);
    const appStatus = isAllocated ? "allocated" : isRejected ? "rejected" : "applied";
    const rejectionReason = matric === "MAAUN/CS/22/004" ? "Active disciplinary block prevents hostel allocation." :
      matric === "MAAUN/BA/22/012" ? "Outstanding tuition fees must be cleared before allocation." :
      matric === "MAAUN/MC/22/020" ? "Graduation block and poor academic standing disqualify applicant." : undefined;

    const [app] = await db.insert(hostelApplicationsTable).values({
      studentId: student.id, sessionId: session.id,
      status: appStatus, priorityScore: isAllocated ? 75 : 30,
      preferredGender: "male",
      rejectionReason: rejectionReason ?? null,
      reviewedBy: adminUser.id, reviewedAt: new Date("2024-08-20"),
    }).returning();
    appCount++;

    if (isAllocated && bedIdx < maleBeds.length) {
      const bed = maleBeds[bedIdx++];
      await db.insert(hostelAllocationsTable).values({
        studentId: student.id, bedSpaceId: bed.id,
        allocatedBy: adminUser.id, status: "active",
      });
      await db.update(bedSpacesTable).set({ status: "occupied", studentId: student.id }).where(eq(bedSpacesTable.id, bed.id));
      allocCount++;
    }
  }

  // Female applications + allocations
  bedIdx = 0;
  for (const matric of femaleMatrics) {
    const student = students.find(s => s.matricNumber === matric)!;
    const isAllocated = femaleAllocate.includes(matric);
    const isRejected  = femaleReject.includes(matric);
    const appStatus = isAllocated ? "allocated" : isRejected ? "rejected" : "applied";
    const rejectionReason = matric === "MAAUN/CS/21/007" ? "Outstanding tuition fees and active academic carryovers prevent allocation." :
      matric === "MAAUN/MC/21/017" ? "Partial fee payment — full tuition clearance required for hostel allocation." : undefined;

    await db.insert(hostelApplicationsTable).values({
      studentId: student.id, sessionId: session.id,
      status: appStatus, priorityScore: isAllocated ? 70 : 25,
      preferredGender: "female",
      rejectionReason: rejectionReason ?? null,
      reviewedBy: adminUser.id, reviewedAt: new Date("2024-08-20"),
    });
    appCount++;

    if (isAllocated && bedIdx < femaleBeds.length) {
      const bed = femaleBeds[bedIdx++];
      await db.insert(hostelAllocationsTable).values({
        studentId: student.id, bedSpaceId: bed.id,
        allocatedBy: adminUser.id, status: "active",
      });
      await db.update(bedSpacesTable).set({ status: "occupied", studentId: student.id }).where(eq(bedSpacesTable.id, bed.id));
      allocCount++;
    }
  }

  ok(`Hostels: 2 (Al-Amin Hall ♂, Khadija Hall ♀) | Rooms: ${maleRooms.length + femaleRooms.length} | Applications: ${appCount} | Allocated: ${allocCount} | Rejected: ${maleReject.length + femaleReject.length}`);
}

// ─── DISCIPLINARY ─────────────────────────────────────────────────────────────

async function seedDisciplinary(students: any[], users: any[]) {
  const adminUser  = users.find(u => u.email === "admin@maaun.edu.ng")!;
  const halima     = users.find(u => u.email === "halima.ibrahim@maaun.edu.ng")!;
  const kabiruS    = students.find(s => s.matricNumber === "MAAUN/CS/22/004")!;
  const abdullahiS = students.find(s => s.matricNumber === "MAAUN/MC/22/020")!;
  const emmanuelS  = students.find(s => s.matricNumber === "MAAUN/BA/24/014")!;
  const mohammedS  = students.find(s => s.matricNumber === "MAAUN/MC/24/018")!;
  const yakubuS    = students.find(s => s.matricNumber === "MAAUN/BA/22/012")!;

  const cases = await db.insert(disciplinaryCasesTable).values([
    { studentId: kabiruS.id,    reportedBy: halima.id,    title: "Examination Malpractice — Unauthorized Material",
      description: "Student was found with unauthorized notes during the CSC301 mid-semester examination. Invigilator confiscated the material and reported immediately.",
      severity: "major", status: "resolved", resolutionNote: "Case reviewed by Dean. Suspension applied." },
    { studentId: abdullahiS.id, reportedBy: adminUser.id, title: "Physical Assault on Fellow Student",
      description: "Student physically assaulted a fellow student outside the library on 2nd October 2024 resulting in injuries requiring medical attention. CCTV evidence confirmed.",
      severity: "critical", status: "resolved", resolutionNote: "University Senate upheld expulsion recommendation after appeal review." },
    { studentId: emmanuelS.id,  reportedBy: halima.id,    title: "Persistent Lateness to Lectures",
      description: "Student has been consistently late to 60% of lectures in BUS101 over four weeks. Lecturer filed formal complaint after verbal warnings failed.",
      severity: "minor", status: "resolved", resolutionNote: "Warning issued and acknowledged by student." },
    { studentId: mohammedS.id,  reportedBy: halima.id,    title: "Disruptive Behaviour in Lecture Hall",
      description: "Student repeatedly disrupted MCM101 lectures by talking loudly, using mobile phone, and ignoring instructor's warnings.",
      severity: "moderate", status: "under_review", resolutionNote: null },
    { studentId: yakubuS.id,    reportedBy: halima.id,    title: "Habitual Absenteeism",
      description: "Student has exceeded the allowed 30% absenteeism threshold in BUS301. Attendance records show 65% absence across October–November 2024.",
      severity: "minor", status: "resolved", resolutionNote: "Student counselled and issued attendance warning." },
  ]).returning();

  // Actions
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const twoWeeksAgo = new Date(today); twoWeeksAgo.setDate(today.getDate() - 14);
  const twoWeeksLater = new Date(today); twoWeeksLater.setDate(today.getDate() + 14);

  await db.insert(disciplinaryActionsTable).values([
    { caseId: cases[0].id, actionType: "suspension", startDate: fmt(twoWeeksAgo), endDate: fmt(twoWeeksLater),
      remarks: "Two-week suspension from all academic activities and hostel access. To be reviewed after suspension period.",
      appliedBy: adminUser.id },
    { caseId: cases[1].id, actionType: "expulsion", startDate: fmt(twoWeeksAgo), endDate: null,
      remarks: "Student expelled from MAAUN effective immediately. All academic records frozen pending final processing.",
      appliedBy: adminUser.id },
    { caseId: cases[2].id, actionType: "warning", startDate: fmt(today), endDate: null,
      remarks: "Official written warning issued. Further violations will result in escalated action.",
      appliedBy: halima.id },
    { caseId: cases[3].id, actionType: "restriction", startDate: fmt(today), endDate: fmt(twoWeeksLater),
      remarks: "Student restricted to front-row seating and must surrender phone to invigilator at start of each lecture.",
      appliedBy: halima.id },
    { caseId: cases[4].id, actionType: "warning", startDate: fmt(today), endDate: null,
      remarks: "Counselling session attended. Attendance contract signed. Academic advisor assigned.",
      appliedBy: adminUser.id },
  ]);

  // Flags
  await db.insert(disciplinaryFlagsTable).values([
    { studentId: kabiruS.id,    flagType: "hostel_block",      active: true,  relatedCaseId: cases[0].id },
    { studentId: abdullahiS.id, flagType: "graduation_block",  active: true,  relatedCaseId: cases[1].id },
    { studentId: abdullahiS.id, flagType: "hostel_block",      active: true,  relatedCaseId: cases[1].id },
    { studentId: abdullahiS.id, flagType: "academic_hold",     active: true,  relatedCaseId: cases[1].id },
  ]);

  ok(`Disciplinary cases: ${cases.length} (minor→critical, all with actions) | Flags: 4 active`);
  return cases;
}

// ─── APPEALS ──────────────────────────────────────────────────────────────────

async function seedAppeals(students: any[], users: any[], cases: any[]) {
  const adminUser  = users.find(u => u.email === "admin@maaun.edu.ng")!;
  const halima     = users.find(u => u.email === "halima.ibrahim@maaun.edu.ng")!;
  const kabiruS    = students.find(s => s.matricNumber === "MAAUN/CS/22/004")!;
  const abdullahiS = students.find(s => s.matricNumber === "MAAUN/MC/22/020")!;

  const appeals = await db.insert(disciplinaryAppealsTable).values([
    { caseId: cases[0].id, studentId: kabiruS.id,
      reason: "I strongly contest the allegation of examination malpractice. The notes found were pre-existing margin notes in my textbook which I inadvertently brought into the exam hall. I had no intention of using them to cheat and deeply regret the misunderstanding.",
      evidence: "My textbook with annotations predating the exam, character references from two lecturers.",
      status: "accepted", reviewedBy: adminUser.id,
      adminResponse: "After reviewing the evidence, the committee acknowledges mitigating circumstances. Suspension reduced from 4 weeks to 2 weeks. Hostel block remains.",
      createdAt: new Date("2024-11-05"), resolvedAt: new Date("2024-11-12"),
    },
    { caseId: cases[1].id, studentId: abdullahiS.id,
      reason: "I accept responsibility for my actions but plead for leniency considering my family circumstances. This was an isolated incident triggered by extreme personal stress and I have since undergone counselling.",
      evidence: "Counselling session certificates, medical report, family financial hardship letter.",
      status: "rejected", reviewedBy: adminUser.id,
      adminResponse: "The severity of the physical assault and clear CCTV evidence leaves no basis for reversal. The University Senate's decision to expel stands. The student may reapply for admission after a minimum of 2 years.",
      createdAt: new Date("2024-11-08"), resolvedAt: new Date("2024-11-20"),
    },
  ]).returning();

  // Appeal decisions
  await db.insert(appealDecisionsTable).values([
    { appealId: appeals[0].id, decision: "modify",
      modifiedAction: "Suspension reduced to 2 weeks. Hostel block retained. Academic restriction lifted after suspension.",
      remarks: "Evidence of unintentional misconduct is credible. Sanction modified proportionately.",
      decidedBy: adminUser.id },
    { appealId: appeals[1].id, decision: "dismiss",
      modifiedAction: null,
      remarks: "CCTV footage is conclusive. Physical assault causing injury warrants expulsion per Section 14(b) of the Student Conduct Policy. No grounds for modification.",
      decidedBy: adminUser.id },
  ]);

  // Update Kabiru's suspension action — the 4-week suspension becomes 2-week (already set correctly in disciplinary seeding)
  ok(`Appeals: ${appeals.length} (1 modified/upheld, 1 dismissed)`);
}

// ─── WELFARE ──────────────────────────────────────────────────────────────────

async function seedWelfare(students: any[], users: any[]) {
  const adminUser  = users.find(u => u.email === "admin@maaun.edu.ng")!;
  const counsellor1 = users.find(u => u.email === "amina.danladi@maaun.edu.ng")!;
  const counsellor2 = users.find(u => u.email === "chukwudi.eze@maaun.edu.ng")!;

  const get = (m: string) => students.find(s => s.matricNumber === m)!;

  const welfareCases = await db.insert(welfareCasesTable).values([
    { studentId: get("MAAUN/BA/22/012").id, category: "financial_support",
      title: "Financial Hardship — Cannot Afford Tuition",
      description: "Student reports severe financial hardship following father's job loss. Unable to meet tuition payment deadline. Requests emergency bursary or payment plan.",
      priority: "high", status: "in_progress", isConfidential: false },
    { studentId: get("MAAUN/CS/22/001").id, category: "academic_stress",
      title: "Exam Anxiety and Academic Pressure",
      description: "Student experiencing significant anxiety ahead of 300-level examinations. Reports sleep disruption and inability to concentrate.",
      priority: "medium", status: "resolved", isConfidential: false },
    { studentId: get("MAAUN/MC/22/020").id, category: "mental_health",
      title: "Severe Depression and Social Withdrawal",
      description: "Student reported by roommate as showing signs of severe depression, refusing meals and social interaction for multiple days.",
      priority: "urgent", status: "in_progress", isConfidential: true },
    { studentId: get("MAAUN/CS/21/007").id, category: "financial_support",
      title: "Outstanding Fees — Risk of Withdrawal",
      description: "Student is at risk of being barred from examinations due to outstanding tuition fees. Parents overseas and remittance delayed.",
      priority: "high", status: "submitted", isConfidential: false },
    { studentId: get("MAAUN/MC/21/017").id, category: "harassment",
      title: "Alleged Harassment by Coursemate",
      description: "Student reports persistent unwanted contact and intimidation from a fellow student. Requests formal intervention.",
      priority: "high", status: "assigned", isConfidential: true },
    { studentId: get("MAAUN/CS/22/004").id, category: "mental_health",
      title: "Mental Health Support Post-Disciplinary Action",
      description: "Student referred for counselling following disciplinary case. Showing signs of anxiety and regret.",
      priority: "medium", status: "submitted", isConfidential: false },
  ]).returning();

  // Assignments
  await db.insert(welfareAssignmentsTable).values([
    { caseId: welfareCases[0].id, assignedTo: counsellor1.id, assignedBy: adminUser.id },
    { caseId: welfareCases[1].id, assignedTo: counsellor1.id, assignedBy: adminUser.id },
    { caseId: welfareCases[2].id, assignedTo: counsellor2.id, assignedBy: adminUser.id },
    { caseId: welfareCases[4].id, assignedTo: counsellor2.id, assignedBy: adminUser.id },
    { caseId: welfareCases[5].id, assignedTo: counsellor1.id, assignedBy: adminUser.id },
  ]);

  // Notes
  await db.insert(welfareNotesTable).values([
    { caseId: welfareCases[0].id, authorId: counsellor1.id, isPrivate: false,
      note: "Initial meeting held on 04 Nov 2024. Student confirmed details. Emergency bursary application submitted to finance office. Awaiting approval." },
    { caseId: welfareCases[0].id, authorId: counsellor1.id, isPrivate: true,
      note: "Private: Student also mentioned family tension at home. May need extended emotional support beyond financial assistance." },
    { caseId: welfareCases[1].id, authorId: counsellor1.id, isPrivate: false,
      note: "Three sessions completed. Student reports improved sleep and reduced anxiety after implementing time-management strategies. Case resolved." },
    { caseId: welfareCases[2].id, authorId: counsellor2.id, isPrivate: true,
      note: "Urgent: Contacted student directly — unresponsive initially. Eventually agreed to meeting. CRIS assessment performed (score 12 — moderate risk). Follow-up daily for next 7 days." },
    { caseId: welfareCases[2].id, authorId: counsellor2.id, isPrivate: false,
      note: "Student engaged in first counselling session. Agreed to eat meals in counselling office until stabilized. Referred to university nurse for health assessment." },
    { caseId: welfareCases[4].id, authorId: counsellor2.id, isPrivate: true,
      note: "Confidential: Incident may involve a named perpetrator. Student has declined to disclose name at this stage. Will report to Dean of Students if situation escalates." },
  ]);

  ok(`Welfare cases: ${welfareCases.length} (mental health, financial, harassment) | Assignments: 5 | Notes: 6`);
}

// ─── GRADUATION ───────────────────────────────────────────────────────────────

async function seedGraduation(students: any[], users: any[], sessions: any[]) {
  const adminUser  = users.find(u => u.email === "admin@maaun.edu.ng")!;
  const registrar  = users.find(u => u.email === "samuel.okafor@maaun.edu.ng")!;
  const session    = sessions.find(s => s.name === "2024/2025")!;

  const get = (m: string) => students.find(s => s.matricNumber === m)!;

  // Eligible: Maryam (CS 400L, CGPA ~4.8, fees cleared)
  // Eligible: Blessing (BA 400L, CGPA ~3.6, fees cleared)
  // Borderline: Grace (MC 400L, CGPA ~2.8, partially paid → financial block)
  // Ineligible: Amina (CS 400L, CGPA ~1.2, unpaid + carryovers)

  const clearances = await db.insert(graduationClearancesTable).values([
    { studentId: get("MAAUN/CS/21/005").id, cgpa: 4.76, academicStatus: "passed", financialStatus: "cleared", adminStatus: "cleared",
      overallStatus: "eligible", academicRemarks: "All required courses passed. CGPA: 4.76. First Class.", financialRemarks: "All fees cleared.", adminRemarks: "Records complete.", evaluatedBy: registrar.id },
    { studentId: get("MAAUN/BA/21/011").id, cgpa: 3.62, academicStatus: "passed", financialStatus: "cleared", adminStatus: "cleared",
      overallStatus: "eligible", academicRemarks: "All required courses passed. CGPA: 3.62. Second Class Upper.", financialRemarks: "All fees cleared.", adminRemarks: "Records complete.", evaluatedBy: registrar.id },
    { studentId: get("MAAUN/MC/21/017").id, cgpa: 2.84, academicStatus: "passed", financialStatus: "blocked", adminStatus: "pending",
      overallStatus: "not_eligible", academicRemarks: "Academic requirements met. CGPA: 2.84.", financialRemarks: "Outstanding tuition balance of ₦190,000. Must be cleared before graduation.", adminRemarks: "Pending financial clearance.", evaluatedBy: registrar.id },
    { studentId: get("MAAUN/CS/21/007").id, cgpa: 1.18, academicStatus: "failed", financialStatus: "blocked", adminStatus: "pending",
      overallStatus: "not_eligible", academicRemarks: "Active carryovers in CSC201, CSC202, CSC301. CGPA: 1.18 below minimum 1.50 threshold.", financialRemarks: "No tuition payment recorded.", adminRemarks: "Academic hold prevents graduation processing.", evaluatedBy: registrar.id },
  ]).returning();

  // Applications
  const apps = await db.insert(graduationApplicationsTable).values([
    { studentId: get("MAAUN/CS/21/005").id, sessionId: session.id, status: "approved",
      reviewedBy: adminUser.id, adminOverride: false, reviewedAt: new Date("2024-11-01") },
    { studentId: get("MAAUN/BA/21/011").id, sessionId: session.id, status: "approved",
      reviewedBy: adminUser.id, adminOverride: false, reviewedAt: new Date("2024-11-01") },
    { studentId: get("MAAUN/MC/21/017").id, sessionId: session.id, status: "rejected",
      reviewedBy: adminUser.id, rejectionReason: "Outstanding tuition fees of ₦190,000 must be cleared before graduation can be approved.", reviewedAt: new Date("2024-11-05") },
    // Edge case: Admin override for Grace (approved despite partial payment)
    // Actually let's leave Grace as rejected — and add an override scenario for Blessing with academic override
  ]).returning();

  // Admin override case: imagine one student got manually approved
  ok(`Graduation clearances: ${clearances.length} | Applications: ${apps.length} (2 approved, 1 rejected, 1 no application/ineligible)`);
}

// ─── TRANSCRIPTS ──────────────────────────────────────────────────────────────

async function seedTranscripts(students: any[], users: any[]) {
  const adminUser  = users.find(u => u.email === "admin@maaun.edu.ng")!;
  const registrar  = users.find(u => u.email === "samuel.okafor@maaun.edu.ng")!;
  const get = (m: string) => students.find(s => s.matricNumber === m)!;

  await db.insert(transcriptsTable).values([
    { studentId: get("MAAUN/CS/21/005").id, generatedBy: registrar.id, approvedBy: adminUser.id,
      status: "official", referenceNumber: refNum("TRN", 100001), ipAddress: "105.112.0.1",
      notes: "Official transcript issued for 17th Convocation.", approvedAt: new Date("2024-11-10"), finalizedAt: new Date("2024-11-11") },
    { studentId: get("MAAUN/BA/21/011").id, generatedBy: registrar.id, approvedBy: adminUser.id,
      status: "approved", referenceNumber: refNum("TRN", 100002), ipAddress: "105.112.0.1",
      notes: "Approved for convocation.", approvedAt: new Date("2024-11-10") },
    { studentId: get("MAAUN/CS/22/001").id, generatedBy: registrar.id, approvedBy: null,
      status: "pending", referenceNumber: refNum("TRN", 100003), ipAddress: "41.58.100.12",
      notes: "Student requested transcript for postgraduate application." },
    { studentId: get("MAAUN/MC/22/015").id, generatedBy: registrar.id, approvedBy: null,
      status: "draft", referenceNumber: refNum("TRN", 100004), ipAddress: "41.58.100.12",
      notes: "Draft prepared, awaiting department sign-off." },
  ]);

  ok(`Transcripts: 4 (official, approved, pending, draft)`);
}

// ─── ACADEMIC STANDINGS ───────────────────────────────────────────────────────

async function seedAcademicStandings(students: any[]) {
  // Standings based on known CGPA profiles (approximate from quality tiers)
  const standingData: [string, number, string][] = [
    ["MAAUN/CS/22/001", 3.82, "Second Class Upper"],
    ["MAAUN/CS/23/002", 4.76, "First Class"],
    ["MAAUN/CS/24/003", 4.10, "First Class"],
    ["MAAUN/CS/22/004", 2.14, "Third Class"],
    ["MAAUN/CS/21/005", 4.76, "First Class"],
    ["MAAUN/CS/23/006", 3.12, "Second Class Lower"],
    ["MAAUN/CS/21/007", 1.18, "Pass"],
    ["MAAUN/BA/22/008", 3.71, "Second Class Upper"],
    ["MAAUN/BA/24/009", 4.90, "First Class"],
    ["MAAUN/BA/23/010", 3.14, "Second Class Lower"],
    ["MAAUN/BA/21/011", 3.62, "Second Class Upper"],
    ["MAAUN/BA/22/012", 2.21, "Third Class"],
    ["MAAUN/BA/23/013", 3.08, "Second Class Lower"],
    ["MAAUN/BA/24/014", 4.05, "First Class"],
    ["MAAUN/MC/22/015", 4.61, "First Class"],
    ["MAAUN/MC/23/016", 3.09, "Second Class Lower"],
    ["MAAUN/MC/21/017", 2.84, "Second Class Lower"],
    ["MAAUN/MC/24/018", 2.01, "Third Class"],
    ["MAAUN/MC/23/019", 3.88, "Second Class Upper"],
    ["MAAUN/MC/22/020", 1.02, "Pass"],
  ];

  const standings = standingData.map(([matric, cgpa, classification]) => {
    const student = students.find(s => s.matricNumber === matric)!;
    const { status } = classify(cgpa);
    const units = 20; // approximate
    return {
      studentId: student.id,
      cgpa,
      classification,
      status,
      totalUnitsAttempted: units,
      totalQualityPoints: Math.round(cgpa * units * 100) / 100,
    };
  });

  await db.insert(academicStandingsTable).values(standings);
  // Also update students.cgpa
  for (const [matric, cgpa] of standingData) {
    const student = students.find(s => s.matricNumber === matric)!;
    await db.update(studentsTable).set({ cgpa }).where(eq(studentsTable.id, student.id));
  }

  ok(`Academic standings: ${standings.length} | First Class: ${standings.filter(s => s.classification === "First Class").length} | 2nd Upper: ${standings.filter(s => s.classification === "Second Class Upper").length} | Probation: ${standings.filter(s => s.status === "probation").length} | Withdrawal: ${standings.filter(s => s.status === "withdrawal_risk").length}`);
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

async function seedNotifications(users: any[], students: any[]) {
  const notifData = students.slice(0, 10).map(s => {
    const user = users.find(u => u.id === s.userId)!;
    return [
      { userId: user.id, title: "Course Registration Open", message: "2024/2025 Second Semester course registration is now open. Deadline: January 15, 2025.", type: "enrollment" as const, isRead: false },
      { userId: user.id, title: "Results Published", message: "Your 2024/2025 First Semester results are now available. Log in to view your performance.", type: "result" as const, isRead: true },
    ];
  }).flat();

  await db.insert(notificationsTable).values(notifData);
  ok(`Notifications: ${notifData.length}`);
}

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────

async function seedAnnouncements(users: any[]) {
  const adminUser = users.find(u => u.email === "admin@maaun.edu.ng")!;
  const registrar = users.find(u => u.email === "samuel.okafor@maaun.edu.ng")!;

  await db.insert(announcementsTable).values([
    { title: "2nd Semester Course Registration — Deadline Notice",
      content: "All students are reminded that 2nd semester course registration closes on January 20, 2025. Students who fail to register before the deadline will be unable to attend lectures or sit exams. Log in to the Student Portal > My Enrollments to complete registration. Clearance of outstanding fees is required before registration can proceed.",
      createdBy: adminUser.id, targetRoles: ["student","lecturer"], isPinned: true,
      expiresAt: new Date("2025-01-20") },
    { title: "Second Semester Tuition Fee Payment Deadline",
      content: "The deadline for payment of 2024/2025 Second Semester school fees is February 1, 2025. Students with outstanding balances will be barred from examination halls. Payment can be made through the Paystack portal on the Student Portal. For queries, contact the Bursary office at bursary@maaun.edu.ng.",
      createdBy: adminUser.id, targetRoles: ["student"], isPinned: true },
    { title: "17th Convocation Ceremony — July 12, 2025",
      content: "The 17th Convocation Ceremony for graduating students of the 2020/2021 and 2021/2022 academic sessions is scheduled for Saturday, July 12, 2025, at the MAAUN Main Auditorium. Eligible graduates must collect academic gowns from the Registry (Block B, Room 14) between June 30 and July 8, 2025. Attendance is compulsory. Four (4) guest seats are allocated per graduate.",
      createdBy: adminUser.id, targetRoles: ["student","admin","registrar","dean"], isPinned: true },
    { title: "Library Extended Hours — Examination Period",
      content: "The university library will operate extended hours from Monday to Saturday (7:00 AM – 10:00 PM) throughout the examination period (January 27 – February 20, 2025). Students are advised to bring valid student ID cards. Group study rooms must be booked 24 hours in advance via the library portal.",
      createdBy: adminUser.id, targetRoles: ["student"], isPinned: false },
    { title: "Monthly Staff Senate Meeting — January 2025",
      content: "The January 2025 Staff Senate meeting is scheduled for Wednesday, January 8, 2025 at 2:00 PM in the Senate Chamber, Main Administration Block. All academic staff are required to attend. Items for discussion include examination timetable approval, research grant applications, and 2025/2026 session planning.",
      createdBy: adminUser.id, targetRoles: ["lecturer","admin","hod","dean","registrar"], isPinned: false },
    { title: "New Course Offerings — 2nd Semester 2024/2025",
      content: "The following new elective courses are available for registration in the 2024/2025 Second Semester: CSC Dept — Cloud Computing (CSC410); BA Dept — Digital Marketing (BUS410); MC Dept — Social Media Analytics (MCM410). These courses are open to all 400L students. Enrolment is first-come-first-served with a cap of 30 students each.",
      createdBy: registrar.id, targetRoles: ["student","hod","lecturer"], isPinned: false },
    { title: "MAAUN Merit Scholarship Applications Open",
      content: "Applications for the 2025/2026 MAAUN Merit Scholarship are now open. Eligible students must have a minimum CGPA of 3.50, no outstanding disciplinary record, and at least 3 semesters remaining. The scholarship covers 50% of tuition for one academic year. Submit applications with supporting documents to the Registry by March 15, 2025.",
      createdBy: adminUser.id, targetRoles: ["student"], isPinned: false },
    { title: "IT Week 2025 — Innovation, Code & Career Fair",
      content: "MAAUN IT Week 2025 runs from February 17–21, 2025. Events include a 24-hour Hackathon, Developer Career Fair with 15+ top tech companies, AI/ML Workshop by Google Developer Group, and a CS Project Exhibition. All students and staff are welcome. Registration is free at itweek.maaun.edu.ng. First prize for hackathon: ₦500,000 + internship placement.",
      createdBy: adminUser.id, targetRoles: ["student","lecturer","admin","hod","dean"], isPinned: false },
  ]);

  ok(`Announcements: 8 (3 pinned, 5 regular) — targeting students, staff, and mixed roles`);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║   MAAUN Full Lifecycle Simulation Seeder             ║");
  console.log("║   Maryam Abacha American University of Nigeria       ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  const pwHash = await bcrypt.hash("maaun2024", 10);

  // 1. Clear
  console.log("▶ [1/13] Clearing database...");
  await clearAll();

  // 2. Sessions
  console.log("▶ [2/13] Creating academic sessions...");
  const { sessions, semesters } = await seedSessions();

  // 3. Users
  console.log("▶ [3/13] Creating users...");
  const users = await seedUsers(pwHash);

  // 4. Profiles
  console.log("▶ [4/13] Creating academic profiles...");
  const { students, lecturers } = await seedAcademicProfiles(users);

  // 5. Courses
  console.log("▶ [5/13] Creating courses...");
  const courses = await seedCourses(lecturers);

  // 6. Enrollments + Results
  console.log("▶ [6/13] Generating enrollments and results...");
  await seedEnrollmentsAndResults(students, courses, sessions, semesters);

  // 7. Finance
  console.log("▶ [7/13] Processing fee payments...");
  await seedFinance(students, users, {});

  // 8. Timetable
  console.log("▶ [8/13] Building timetable...");
  await seedTimetable(courses, lecturers, sessions, semesters);

  // 9. Hostels
  console.log("▶ [9/13] Allocating hostel spaces...");
  await seedHostels(students, users, sessions);

  // 10. Disciplinary
  console.log("▶ [10/13] Creating disciplinary cases...");
  const cases = await seedDisciplinary(students, users);

  // 11. Appeals
  console.log("▶ [11/13] Processing appeals...");
  await seedAppeals(students, users, cases);

  // 12. Welfare
  console.log("▶ [11b/13] Creating welfare cases...");
  await seedWelfare(students, users);

  // 13. Graduation
  console.log("▶ [12/13] Evaluating graduation...");
  await seedGraduation(students, users, sessions);

  // Transcripts
  await seedTranscripts(students, users);

  // Academic standings
  await seedAcademicStandings(students);

  // Notifications
  await seedNotifications(users, students);

  // Announcements
  console.log("▶ [13/13] Publishing announcements...");
  await seedAnnouncements(users);

  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║  ✅  MAAUN Seeder Complete — System Ready            ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log("║  Demo Credentials (all password: maaun2024)          ║");
  console.log("║  Super Admin : admin@maaun.edu.ng                    ║");
  console.log("║  Student     : aisha.mohammed@student.maaun.edu.ng   ║");
  console.log("║  Lecturer    : ibrahim.musa@maaun.edu.ng              ║");
  console.log("║  Bursar      : fatima.bello@maaun.edu.ng              ║");
  console.log("║  Registrar   : samuel.okafor@maaun.edu.ng             ║");
  console.log("║  Counsellor  : amina.danladi@maaun.edu.ng             ║");
  console.log("║  Dean        : abubakar.shehu@maaun.edu.ng            ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  await pool.end();
}

main().catch(e => { console.error("❌ Seeder failed:", e); process.exit(1); });
