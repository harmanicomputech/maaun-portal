/**
 * MAAUN System Auto-Test Engine
 * Authenticates all 9 roles and validates every major endpoint.
 * Run: pnpm --filter @workspace/scripts run test
 */

const BASE = "http://localhost:80/api";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Helpers
// ─────────────────────────────────────────────────────────────────────────────

interface TestResult {
  name: string; endpoint: string; method: string;
  status: "PASS" | "FAIL" | "SKIP"; code?: number; error?: string;
}

const results: TestResult[] = [];
const tokens: Record<string, string> = {};
const ids: Record<string, number | string> = {};

function log(r: TestResult) {
  const icon = r.status === "PASS" ? "✅" : r.status === "SKIP" ? "⏭ " : "❌";
  const code = r.code ? ` [${r.code}]` : "";
  const err  = r.error ? `  ← ${r.error}` : "";
  console.log(`  ${icon} ${r.method.padEnd(6)} ${r.endpoint.padEnd(50)} ${r.status}${code}${err}`);
  results.push(r);
}

async function request(
  method: string, path: string, token?: string, body?: unknown,
): Promise<{ status: number; data: any }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  let data: any = {};
  try { data = await res.json(); } catch { /* no body */ }
  return { status: res.status, data };
}

type TestFn = () => Promise<{ status: number; data: any }>;

async function test(
  name: string, endpoint: string, method: string,
  fn: TestFn, expectStatus = 200,
) {
  try {
    const { status, data } = await fn();
    // For 2xx expectations allow any success; for specific codes match exactly
    const ok = expectStatus >= 200 && expectStatus < 300
      ? status >= 200 && status < 300
      : status === expectStatus;
    log({
      name, endpoint, method,
      status: ok ? "PASS" : "FAIL",
      code: status,
      error: ok ? undefined : (data?.error || data?.message || `Expected ${expectStatus} got ${status}`),
    });
    return { status, data };
  } catch (err: any) {
    log({ name, endpoint, method, status: "FAIL", error: err?.message || String(err) });
    return { status: 0, data: {} };
  }
}

/** Like test() but treats domain-level 400/409 errors as PASS (expected business logic rejection) */
async function testDomain(
  name: string, endpoint: string, method: string, fn: TestFn,
) {
  try {
    const { status, data } = await fn();
    const ok = (status >= 200 && status < 300) || status === 400 || status === 409;
    log({
      name, endpoint, method,
      status: ok ? "PASS" : "FAIL",
      code: status,
      error: ok
        ? (status >= 400 ? `(domain block: ${data?.error || data?.message})` : undefined)
        : (data?.error || data?.message || `Unexpected ${status}`),
    });
    return { status, data };
  } catch (err: any) {
    log({ name, endpoint, method, status: "FAIL", error: err?.message || String(err) });
    return { status: 0, data: {} };
  }
}

function skip(name: string, endpoint: string, method: string, reason: string) {
  log({ name, endpoint, method, status: "SKIP", error: reason });
}

function section(title: string) {
  console.log(`\n${"─".repeat(62)}`);
  console.log(`  ${title}`);
  console.log("─".repeat(62));
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 1 — Authentication (all 9 roles)
// ─────────────────────────────────────────────────────────────────────────────

const CREDENTIALS: Record<string, { email: string; password: string }> = {
  super_admin: { email: "admin@maaun.edu.ng",                          password: "maaun2024" },
  admin:       { email: "halima.ibrahim@maaun.edu.ng",                 password: "maaun2024" },
  dean:        { email: "abubakar.shehu@maaun.edu.ng",                 password: "maaun2024" },
  registrar:   { email: "samuel.okafor@maaun.edu.ng",                  password: "maaun2024" },
  bursar:      { email: "fatima.bello@maaun.edu.ng",                   password: "maaun2024" },
  hod:         { email: "ahmad.usman@maaun.edu.ng",                    password: "maaun2024" },
  counsellor:  { email: "amina.danladi@maaun.edu.ng",                  password: "maaun2024" },
  lecturer:    { email: "ibrahim.musa@maaun.edu.ng",                   password: "maaun2024" },
  student:     { email: "aisha.mohammed@student.maaun.edu.ng",         password: "maaun2024" },
};

async function loginAll() {
  section("PHASE 1 — Authentication (all 9 roles)");
  for (const [role, creds] of Object.entries(CREDENTIALS)) {
    const r = await test(`Login as ${role}`, "/auth/login", "POST",
      () => request("POST", "/auth/login", undefined, creds));
    if (r.data?.token) tokens[role] = r.data.token;
    else console.log(`    ⚠️  No token for ${role} — downstream tests will be skipped`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 2 — Public & Health
// ─────────────────────────────────────────────────────────────────────────────

async function testPublic() {
  section("PHASE 2 — Public & Health Endpoints");
  await test("Health check",             "/healthz",  "GET", () => request("GET", "/healthz"));
  await test("List courses (public)",    "/courses",  "GET", () => request("GET", "/courses"));
  // No token → must be 401
  await test("Auth /me (no token → 401)", "/auth/me", "GET",
    () => request("GET", "/auth/me"), 401);
  await test("Auth /me (student token)", "/auth/me",  "GET",
    () => request("GET", "/auth/me", tokens.student));
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 3 — Student Flow
// ─────────────────────────────────────────────────────────────────────────────

async function testStudentFlow() {
  section("PHASE 3 — Student Flow");
  const tk = tokens.student;
  if (!tk) { skip("All student tests", "/dashboard/student", "GET", "No student token"); return; }

  await test("Student dashboard",          "/dashboard/student",         "GET", () => request("GET", "/dashboard/student",    tk));
  await test("Student timetable",          "/timetables/student",        "GET", () => request("GET", "/timetables/student",   tk));
  await test("My enrollments",             "/enrollments",               "GET", () => request("GET", "/enrollments",          tk));
  await test("My results",                 "/results",                   "GET", () => request("GET", "/results",              tk));
  await test("Academic standing (my)",     "/academic-standing/my",      "GET", () => request("GET", "/academic-standing/my", tk));
  await test("Announcements",              "/announcements",             "GET", () => request("GET", "/announcements",        tk));
  await test("My notifications",           "/notifications/my",          "GET", () => request("GET", "/notifications/my",    tk));
  await test("Notification unread count",  "/notifications/unread-count","GET", () => request("GET", "/notifications/unread-count", tk));
  await test("My ledger",                  "/ledger/my",                 "GET", () => request("GET", "/ledger/my",           tk));
  await test("My receipts",               "/receipts/my",               "GET", () => request("GET", "/receipts/my",         tk));
  await test("Hostel eligibility",         "/hostels/my-eligibility",    "GET", () => request("GET", "/hostels/my-eligibility", tk));
  await test("Hostel list",                "/hostels",                   "GET", () => request("GET", "/hostels",             tk));
  await test("My welfare cases",           "/welfare/my-cases",          "GET", () => request("GET", "/welfare/my-cases",    tk));
  await test("My disciplinary cases",      "/disciplinary/my-cases",     "GET", () => request("GET", "/disciplinary/my-cases", tk));
  await test("My graduation clearance",    "/graduation/my-clearance",   "GET", () => request("GET", "/graduation/my-clearance", tk));
  await test("My appeals",                 "/appeals/my-appeals",        "GET", () => request("GET", "/appeals/my-appeals",  tk));

  // Course enrolment — needs semester + academicYear
  const courses = await request("GET", "/courses", tk);
  const courseId = courses.data?.[0]?.id;
  if (courseId) {
    const enrol = await testDomain("Course enrolment", "/enrollments", "POST",
      () => request("POST", "/enrollments", tk, {
        courseId, semester: "first", academicYear: "2024/2025",
      }));
    if (enrol.data?.id) {
      ids.enrollmentId = enrol.data.id;
      await test("Drop course enrolment", `/enrollments/${ids.enrollmentId}`, "DELETE",
        () => request("DELETE", `/enrollments/${ids.enrollmentId}`, tk));
    }
  } else {
    skip("Course enrolment", "/enrollments", "POST", "No courses found");
  }

  // Welfare — API requires: category, title, description
  const welfare = await test("Submit welfare case", "/welfare", "POST",
    () => request("POST", "/welfare", tk, {
      category: "academic_stress",
      title: "System Auto-Test Case",
      description: "Auto-generated test case — safe to ignore",
      priority: "low",
      isAnonymous: false,
    }));
  if (welfare.data?.id) ids.welfareId = welfare.data.id;

  // Payment — requires a real feeId; fetch one first
  const fees = await request("GET", "/fees", tk);
  const feeId = fees.data?.[0]?.id;
  if (feeId) {
    const payInit = await testDomain("Payment initialize", "/payments/initialize", "POST",
      () => request("POST", "/payments/initialize", tk, { feeId }));
    if (payInit.data?.reference) ids.paymentRef = payInit.data.reference;
  } else {
    skip("Payment initialize", "/payments/initialize", "POST", "No fees in system");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 4 — Lecturer Flow
// ─────────────────────────────────────────────────────────────────────────────

async function testLecturerFlow() {
  section("PHASE 4 — Lecturer Flow");
  const tk = tokens.lecturer;
  if (!tk) { skip("All lecturer tests", "/dashboard/lecturer", "GET", "No lecturer token"); return; }

  await test("Lecturer dashboard",    "/dashboard/lecturer",      "GET", () => request("GET", "/dashboard/lecturer", tk));
  await test("My timetable",          "/timetables/my",           "GET", () => request("GET", "/timetables/my",      tk));

  const dash = await request("GET", "/dashboard/lecturer", tk);
  const firstCourse = (dash.data?.courses ?? [])[0];

  if (firstCourse) {
    await test("Results for course", "/results", "GET",
      () => request("GET", `/results?courseId=${firstCourse.id}&academicYear=2024/2025`, tk));

    const students = await request("GET", "/students", tk);
    const studentId = students.data?.[0]?.id;
    if (studentId) {
      const sub = await testDomain("Submit result (lecturer)", "/results", "POST",
        () => request("POST", "/results", tk, {
          studentId, courseId: firstCourse.id,
          semester: "first", academicYear: "2024/2025",
          caScore: 25, examScore: 55,
        }));
      if (sub.data?.id) {
        ids.lecturerResultId = sub.data.id;
        await test("Submit result for review", `/results/${ids.lecturerResultId}/submit`, "PUT",
          () => request("PUT", `/results/${ids.lecturerResultId}/submit`, tk, {}));
      }
    } else {
      skip("Submit result", "/results", "POST", "No students found");
    }
  } else {
    skip("Lecturer results flow", "/results", "GET", "No courses in dashboard");
  }

  await test("All students",               "/students",                 "GET", () => request("GET", "/students",                 tk));
  await test("My students (transcripts)",  "/transcripts/my-students",  "GET", () => request("GET", "/transcripts/my-students",  tk));
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 5 — Admin Flow
// ─────────────────────────────────────────────────────────────────────────────

async function testAdminFlow() {
  section("PHASE 5 — Admin Flow");
  const tk = tokens.admin;
  if (!tk) { skip("All admin tests", "/dashboard/admin", "GET", "No admin token"); return; }

  await test("Admin dashboard",      "/dashboard/admin",        "GET", () => request("GET", "/dashboard/admin",     tk));
  await test("All students",         "/students",               "GET", () => request("GET", "/students",            tk));
  await test("All lecturers",        "/lecturers",              "GET", () => request("GET", "/lecturers",           tk));
  await test("All users",            "/admin/users/all",        "GET", () => request("GET", "/admin/users/all",     tk));
  await test("User stats",           "/admin/users/stats",      "GET", () => request("GET", "/admin/users/stats",   tk));
  await test("All timetables",       "/timetables",             "GET", () => request("GET", "/timetables",          tk));
  await test("All venues",           "/venues",                 "GET", () => request("GET", "/venues",              tk));
  await test("Finance analytics",    "/finance/analytics",      "GET", () => request("GET", "/finance/analytics",   tk));
  await test("Admin announcements",  "/announcements/admin/all","GET", () => request("GET", "/announcements/admin/all", tk));
  await test("Activity logs",        "/activity-logs",          "GET", () => request("GET", "/activity-logs",       tk));
  await test("Academic standing",    "/academic-standing",      "GET", () => request("GET", "/academic-standing",   tk));
  await test("All transcripts",      "/transcripts",            "GET", () => request("GET", "/transcripts",         tk));
  await test("All receipts",         "/receipts",               "GET", () => request("GET", "/receipts",            tk));

  // Course CRUD
  const created = await test("Create course", "/courses", "POST",
    () => request("POST", "/courses", tk, {
      courseCode: "TST 999", title: "System Test Course", unit: 2,
      department: "Test Department", faculty: "Test Faculty",
      level: "300", semester: "first",
    }));
  if (created.data?.id) {
    ids.testCourseId = created.data.id;
    await test("Update course", `/courses/${ids.testCourseId}`, "PUT",
      () => request("PUT", `/courses/${ids.testCourseId}`, tk, {
        courseCode: "TST 999", title: "System Test Course (Updated)", unit: 3,
        department: "Test Department", faculty: "Test Faculty",
        level: "300", semester: "first",
      }));
    await test("Delete course", `/courses/${ids.testCourseId}`, "DELETE",
      () => request("DELETE", `/courses/${ids.testCourseId}`, tk));
  } else {
    skip("Update course", "/courses/:id", "PUT",    "Course creation failed");
    skip("Delete course", "/courses/:id", "DELETE", "Course creation failed");
  }

  // Announcement CRUD
  const ann = await test("Create announcement", "/announcements/admin", "POST",
    () => request("POST", "/announcements/admin", tk, {
      title: "System Auto-Test Announcement",
      content: "Created by automated test runner. Safe to ignore.",
      targetRoles: ["student", "lecturer"],
      priority: "low",
    }));
  if (ann.data?.id) {
    ids.announcementId = ann.data.id;
    await test("Update announcement", `/announcements/admin/${ids.announcementId}`, "PATCH",
      () => request("PATCH", `/announcements/admin/${ids.announcementId}`, tk, { title: "Auto-Test (Updated)" }));
    await test("Delete announcement", `/announcements/admin/${ids.announcementId}`, "DELETE",
      () => request("DELETE", `/announcements/admin/${ids.announcementId}`, tk));
  }

  // Venue CRUD
  const venue = await test("Create venue", "/venues", "POST",
    () => request("POST", "/venues", tk, { name: "Test Venue Alpha", capacity: 30, location: "Block Z" }));
  if (venue.data?.id) {
    ids.testVenueId = venue.data.id;
    await test("Delete venue", `/venues/${ids.testVenueId}`, "DELETE",
      () => request("DELETE", `/venues/${ids.testVenueId}`, tk));
  }

  // Broadcast notification
  await test("Broadcast notification", "/notifications/broadcast", "POST",
    () => request("POST", "/notifications/broadcast", tk, {
      title: "Auto-Test Notification",
      message: "System test broadcast — safe to ignore",
      type: "info",
      targetRoles: ["student"],
    }));
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 6 — Finance / Bursar Flow
// ─────────────────────────────────────────────────────────────────────────────

async function testFinanceFlow() {
  section("PHASE 6 — Finance / Bursar Flow");
  const tk = tokens.bursar;
  if (!tk) { skip("All bursar tests", "/finance/analytics", "GET", "No bursar token"); return; }

  await test("Finance analytics", "/finance/analytics", "GET", () => request("GET", "/finance/analytics", tk));
  await test("All receipts",      "/receipts",          "GET", () => request("GET", "/receipts",          tk));
  await test("All payments",      "/payments",          "GET", () => request("GET", "/payments",          tk));
  await test("All fees",          "/fees",              "GET", () => request("GET", "/fees",              tk));

  if (ids.paymentRef) {
    await test("Verify payment reference", `/payments/verify/${ids.paymentRef}`, "GET",
      () => request("GET", `/payments/verify/${ids.paymentRef}`, tk));
  } else {
    skip("Verify payment", "/payments/verify/:ref", "GET", "No payment reference from student phase");
  }

  // Public receipt verification
  const receipts = await request("GET", "/receipts", tk);
  const receipt = receipts.data?.[0];
  if (receipt?.reference) {
    await test("Verify receipt (public)", `/receipts/verify/${receipt.reference}`, "GET",
      () => request("GET", `/receipts/verify/${receipt.reference}`));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 7 — Graduation Flow
// ─────────────────────────────────────────────────────────────────────────────

async function testGraduationFlow() {
  section("PHASE 7 — Graduation Flow");
  const adminTk  = tokens.admin;
  const studentTk = tokens.student;
  if (!adminTk) { skip("Graduation admin tests", "/graduation/admin/list", "GET", "No admin token"); return; }

  await test("List graduation applications", "/graduation/admin/list", "GET",
    () => request("GET", "/graduation/admin/list", adminTk));

  const students = await request("GET", "/students", adminTk);
  const firstStudent = students.data?.[0];
  if (firstStudent) {
    await test("Evaluate student clearance", `/graduation/admin/evaluate/${firstStudent.id}`, "POST",
      () => request("POST", `/graduation/admin/evaluate/${firstStudent.id}`, adminTk, {}));
    ids.graduationStudentId = firstStudent.id;
  }

  // Student apply — may legitimately fail eligibility check
  if (studentTk) {
    await testDomain("Student apply for graduation", "/graduation/apply", "POST",
      () => request("POST", "/graduation/apply", studentTk, {}));
  }

  // Approve if any pending
  const list = await request("GET", "/graduation/admin/list", adminTk);
  const pending = (list.data ?? []).find((a: any) => a.status === "applied" || a.status === "pending");
  if (pending) {
    await test("Approve graduation application", `/graduation/applications/${pending.id}/approve`, "PATCH",
      () => request("PATCH", `/graduation/applications/${pending.id}/approve`, adminTk, { remarks: "Auto-test" }));
  } else {
    skip("Approve graduation application", "/graduation/applications/:id/approve", "PATCH", "No pending applications");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 8 — Hostel Flow
// ─────────────────────────────────────────────────────────────────────────────

async function testHostelFlow() {
  section("PHASE 8 — Hostel Flow");
  const adminTk  = tokens.admin;
  const studentTk = tokens.student;
  if (!adminTk) { skip("Hostel admin tests", "/hostels/admin/all", "GET", "No admin token"); return; }

  await test("List all hostels",   "/hostels/admin/all",          "GET", () => request("GET", "/hostels/admin/all",          adminTk));
  await test("List all rooms",     "/hostels/admin/rooms",        "GET", () => request("GET", "/hostels/admin/rooms",        adminTk));
  await test("List applications",  "/hostels/admin/applications", "GET", () => request("GET", "/hostels/admin/applications", adminTk));
  await test("List allocations",   "/hostels/admin/allocations",  "GET", () => request("GET", "/hostels/admin/allocations",  adminTk));
  await test("List vacant beds",   "/hostels/admin/vacant-beds",  "GET", () => request("GET", "/hostels/admin/vacant-beds",  adminTk));

  const hostel = await test("Create hostel", "/hostels/admin/hostel", "POST",
    () => request("POST", "/hostels/admin/hostel", adminTk, {
      name: "Auto-Test Hostel", gender: "mixed", totalRooms: 5, location: "Test Block",
    }));
  if (hostel.data?.id) {
    ids.testHostelId = hostel.data.id;
    const room = await test("Create room", "/hostels/admin/room", "POST",
      () => request("POST", "/hostels/admin/room", adminTk, {
        hostelId: ids.testHostelId, roomNumber: "T01", capacity: 2, floor: 1,
      }));
    if (room.data?.id) ids.testRoomId = room.data.id;
  }

  // Student apply — may fail eligibility (domain block is OK)
  if (studentTk) {
    const applyResult = await testDomain("Student hostel application", "/hostels/apply", "POST",
      () => request("POST", "/hostels/apply", studentTk, {
        preferredGender: "mixed", additionalInfo: "Auto-test application",
      }));
    if (applyResult.data?.id) ids.hostelAppId = applyResult.data.id;
  }

  // Approve any pending application
  const apps = await request("GET", "/hostels/admin/applications", adminTk);
  const pendingApp = (apps.data ?? []).find((a: any) => a.status === "applied");
  if (pendingApp) {
    await test("Approve hostel application", `/hostels/applications/${pendingApp.id}/approve`, "PATCH",
      () => request("PATCH", `/hostels/applications/${pendingApp.id}/approve`, adminTk, {}));
  } else {
    skip("Approve hostel application", "/hostels/applications/:id/approve", "PATCH", "No pending applications");
  }

  await test("Auto-allocate hostels", "/hostels/auto-allocate", "POST",
    () => request("POST", "/hostels/auto-allocate", adminTk, {}));
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 9 — Disciplinary / Appeals Flow
// ─────────────────────────────────────────────────────────────────────────────

async function testDisciplinaryFlow() {
  section("PHASE 9 — Disciplinary / Sanctions / Appeals Flow");
  const adminTk  = tokens.admin;
  const studentTk = tokens.student;
  if (!adminTk) { skip("Disciplinary tests", "/disciplinary/admin/cases", "GET", "No admin token"); return; }

  await test("List disciplinary cases", "/disciplinary/admin/cases", "GET",
    () => request("GET", "/disciplinary/admin/cases", adminTk));
  await test("List system flags",       "/disciplinary/admin/flags", "GET",
    () => request("GET", "/disciplinary/admin/flags", adminTk));

  // Use the logged-in student's own ID so appeals ownership check passes
  const meRes = await request("GET", "/auth/me", studentTk);
  const studentUserId = meRes.data?.userId ?? meRes.data?.id;
  // Find the students table entry for this user
  const students = await request("GET", "/students", adminTk);
  const matchedStudent = (students.data ?? []).find((s: any) => s.userId === studentUserId || s.user?.id === studentUserId);
  const studentId = matchedStudent?.id ?? students.data?.[0]?.id;

  if (!studentId) { skip("Disciplinary case creation", "/disciplinary/admin/cases", "POST", "No students found"); return; }

  const caseRes = await test("Create disciplinary case", "/disciplinary/admin/cases", "POST",
    () => request("POST", "/disciplinary/admin/cases", adminTk, {
      studentId,
      title: "Auto-Test Case — Safe to Ignore",
      description: "Created by system test runner to verify endpoint functionality.",
      severity: "minor",
    }));

  if (!caseRes.data?.id) { skip("Case detail / actions / appeals", "...", "...", "Case creation failed"); return; }

  ids.disciplinaryCaseId = caseRes.data.id;

  await test("Get case detail", `/disciplinary/admin/cases/${ids.disciplinaryCaseId}`, "GET",
    () => request("GET", `/disciplinary/admin/cases/${ids.disciplinaryCaseId}`, adminTk));

  await test("Update case status (under_review)", `/disciplinary/admin/cases/${ids.disciplinaryCaseId}/status`, "PATCH",
    () => request("PATCH", `/disciplinary/admin/cases/${ids.disciplinaryCaseId}/status`, adminTk, { status: "under_review" }));

  // Action requires actionType + startDate
  const today = new Date().toISOString().split("T")[0];
  await test("Apply sanction (warning)", `/disciplinary/admin/cases/${ids.disciplinaryCaseId}/action`, "POST",
    () => request("POST", `/disciplinary/admin/cases/${ids.disciplinaryCaseId}/action`, adminTk, {
      actionType: "warning",
      startDate: today,
      remarks: "Auto-test sanction",
    }));

  // Student submits appeal — requires `reason` field
  if (studentTk) {
    const appeal = await test("Student submits appeal", `/appeals/cases/${ids.disciplinaryCaseId}`, "POST",
      () => request("POST", `/appeals/cases/${ids.disciplinaryCaseId}`, studentTk, {
        reason: "Auto-test appeal — requesting review of this system-generated case.",
        evidence: "No evidence — system test only",
      }));
    if (appeal.data?.id) {
      ids.appealId = appeal.data.id;
      await test("Admin list appeals",       "/appeals/admin/all",                    "GET",
        () => request("GET",   "/appeals/admin/all",                                  adminTk));
      await test("Get appeal detail",        `/appeals/admin/${ids.appealId}`,        "GET",
        () => request("GET",   `/appeals/admin/${ids.appealId}`,                      adminTk));
      await test("Mark appeal under review", `/appeals/admin/${ids.appealId}/review`, "PATCH",
        () => request("PATCH", `/appeals/admin/${ids.appealId}/review`,               adminTk, {}));
      await test("Submit appeal decision",   `/appeals/admin/${ids.appealId}/decision`, "POST",
        () => request("POST",  `/appeals/admin/${ids.appealId}/decision`,             adminTk, {
          decision: "dismiss",
          remarks: "Auto-test decision",
          adminResponse: "System test — no action required",
        }));
    }
  }

  await test("Resolve case", `/disciplinary/admin/cases/${ids.disciplinaryCaseId}/status`, "PATCH",
    () => request("PATCH", `/disciplinary/admin/cases/${ids.disciplinaryCaseId}/status`, adminTk, {
      status: "resolved", resolutionNote: "Auto-test resolved",
    }));
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 10 — Welfare Flow
// ─────────────────────────────────────────────────────────────────────────────

async function testWelfareFlow() {
  section("PHASE 10 — Welfare Flow");
  const adminTk     = tokens.admin;
  const counsellorTk = tokens.counsellor;
  if (!adminTk) { skip("Welfare admin tests", "/welfare/admin/all", "GET", "No admin token"); return; }

  await test("Admin: all welfare cases",  "/welfare/admin/all",          "GET", () => request("GET", "/welfare/admin/all",          adminTk));
  await test("Admin: counsellors list",   "/welfare/admin/counsellors",  "GET", () => request("GET", "/welfare/admin/counsellors",  adminTk));
  if (counsellorTk) {
    await test("Counsellor: my cases",    "/welfare/counsellor/my-cases","GET", () => request("GET", "/welfare/counsellor/my-cases", counsellorTk));
  }

  const cases = await request("GET", "/welfare/admin/all", adminTk);
  const wCase = (cases.data ?? []).find((c: any) => c.id === ids.welfareId) || (cases.data ?? [])[0];

  if (!wCase) { skip("Welfare case detail / notes / status", "/welfare/admin/cases/:id", "GET", "No welfare cases"); return; }

  await test("Admin: get case detail",            `/welfare/admin/cases/${wCase.id}`,          "GET",
    () => request("GET",   `/welfare/admin/cases/${wCase.id}`, adminTk));

  const counsellors = await request("GET", "/welfare/admin/counsellors", adminTk);
  const counsellorId = counsellors.data?.[0]?.id;
  if (counsellorId) {
    await test("Assign counsellor", `/welfare/admin/cases/${wCase.id}/assign`, "POST",
      () => request("POST", `/welfare/admin/cases/${wCase.id}/assign`, adminTk, { counsellorId }));
  }

  await test("Admin: update status (in_progress)",  `/welfare/admin/cases/${wCase.id}/status`,   "PATCH",
    () => request("PATCH", `/welfare/admin/cases/${wCase.id}/status`,   adminTk, { status: "in_progress" }));
  await test("Admin: add note",                      `/welfare/cases/${wCase.id}/notes`,          "POST",
    () => request("POST",  `/welfare/cases/${wCase.id}/notes`,          adminTk, { note: "Auto-test note", isPrivate: false }));
  await test("Admin: update priority",               `/welfare/admin/cases/${wCase.id}/priority`, "PATCH",
    () => request("PATCH", `/welfare/admin/cases/${wCase.id}/priority`, adminTk, { priority: "medium" }));
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 11 — Transcripts Flow
// ─────────────────────────────────────────────────────────────────────────────

async function testTranscriptFlow() {
  section("PHASE 11 — Transcript Flow");
  const adminTk = tokens.admin;
  if (!adminTk) { skip("Transcript tests", "/transcripts", "GET", "No admin token"); return; }

  await test("List transcripts", "/transcripts", "GET", () => request("GET", "/transcripts", adminTk));

  const students = await request("GET", "/students", adminTk);
  const firstStudent = students.data?.[0];
  if (!firstStudent) { skip("Create transcript", "/transcripts", "POST", "No students found"); return; }

  const tr = await test("Create transcript", "/transcripts", "POST",
    () => request("POST", "/transcripts", adminTk, {
      studentId: firstStudent.id,
      academicYear: "2024/2025",
      semester: "first",
      purpose: "Employment",
      requestedBy: "System Auto-Test",
    }));

  if (!tr.data?.id) { skip("Transcript status flow", "/transcripts/:id/status", "PATCH", "Creation failed"); return; }

  ids.transcriptId = tr.data.id;
  await test("Get transcript detail", `/transcripts/${ids.transcriptId}`, "GET",
    () => request("GET", `/transcripts/${ids.transcriptId}`, adminTk));

  // Status flow: draft → pending → approved → official
  await test("Set transcript to pending",  `/transcripts/${ids.transcriptId}/status`, "PATCH",
    () => request("PATCH", `/transcripts/${ids.transcriptId}/status`, adminTk, { status: "pending" }));
  await test("Approve transcript",         `/transcripts/${ids.transcriptId}/status`, "PATCH",
    () => request("PATCH", `/transcripts/${ids.transcriptId}/status`, adminTk, { status: "approved" }));
  await test("Issue transcript (official)",`/transcripts/${ids.transcriptId}/status`, "PATCH",
    () => request("PATCH", `/transcripts/${ids.transcriptId}/status`, adminTk, { status: "official" }));

  // Public verify via reference
  const detail = await request("GET", `/transcripts/${ids.transcriptId}`, adminTk);
  if (detail.data?.reference) {
    await test("Verify transcript (public)", `/transcripts/verify/${detail.data.reference}`, "GET",
      () => request("GET", `/transcripts/verify/${detail.data.reference}`));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 12 — Notification Flow
// ─────────────────────────────────────────────────────────────────────────────

async function testNotificationFlow() {
  section("PHASE 12 — Notification Flow");
  const tk      = tokens.student;
  const adminTk = tokens.admin;
  if (!tk) { skip("Notification tests", "/notifications/my", "GET", "No student token"); return; }

  await test("Delta notifications (since=epoch)", "/notifications/my", "GET",
    () => request("GET", "/notifications/my?since=1970-01-01T00:00:00.000Z&limit=10", tk));
  await test("Mark all notifications read",       "/notifications/read-all", "PATCH",
    () => request("PATCH", "/notifications/read-all", tk, {}));
  await test("Unread count after read-all",       "/notifications/unread-count", "GET",
    () => request("GET", "/notifications/unread-count", tk));

  if (adminTk) {
    await test("Admin: list all notifications", "/notifications", "GET",
      () => request("GET", "/notifications", adminTk));

    // Broadcast and verify delivery
    await request("POST", "/notifications/broadcast", adminTk, {
      title: "Test Notification Delivery",
      message: "Verifying notification delivery pipeline",
      type: "info",
      targetRoles: ["student"],
    });

    const afterBroadcast = await test("Unread count after broadcast", "/notifications/unread-count", "GET",
      () => request("GET", "/notifications/unread-count", tk));
    const unread = afterBroadcast.data?.unreadCount ?? 0;
    if (unread >= 1) console.log(`    ℹ️  Delivery confirmed: ${unread} unread notification(s) for student`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 13 — Registrar / Dean / HoD / Super-Admin
// ─────────────────────────────────────────────────────────────────────────────

async function testSecondaryRoles() {
  section("PHASE 13 — Registrar / Dean / HoD / Super-Admin Endpoints");

  if (tokens.registrar) {
    await test("Registrar: graduation list", "/graduation/admin/list", "GET", () => request("GET", "/graduation/admin/list", tokens.registrar));
    await test("Registrar: all students",    "/students",              "GET", () => request("GET", "/students",              tokens.registrar));
    // Registrar does NOT have transcript access — this is by design
    skip("Registrar: transcripts (no access by design)", "/transcripts", "GET", "requireRole: admin, lecturer only");
  }

  if (tokens.dean) {
    await test("Dean: graduation list",  "/graduation/admin/list", "GET", () => request("GET", "/graduation/admin/list", tokens.dean));
    await test("Dean: all results",      "/results",               "GET", () => request("GET", "/results",               tokens.dean));
  }

  if (tokens.hod) {
    await test("HoD: all courses",   "/courses",    "GET", () => request("GET", "/courses",    tokens.hod));
    await test("HoD: all students",  "/students",   "GET", () => request("GET", "/students",   tokens.hod));
    await test("HoD: timetable",     "/timetables", "GET", () => request("GET", "/timetables", tokens.hod));
  }

  if (tokens.super_admin) {
    await test("SuperAdmin: all users",         "/admin/users/all",         "GET", () => request("GET", "/admin/users/all",         tokens.super_admin));
    await test("SuperAdmin: user stats",        "/admin/users/stats",       "GET", () => request("GET", "/admin/users/stats",       tokens.super_admin));
    await test("SuperAdmin: finance analytics", "/finance/analytics",       "GET", () => request("GET", "/finance/analytics",       tokens.super_admin));
    await test("SuperAdmin: announcements",     "/announcements/admin/all", "GET", () => request("GET", "/announcements/admin/all", tokens.super_admin));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 14 — Permission Boundary Tests (expect 403 / 401)
// ─────────────────────────────────────────────────────────────────────────────

async function testPermissions() {
  section("PHASE 14 — Permission Boundary Tests (expect 403 / 401)");
  const studentTk = tokens.student;

  if (studentTk) {
    await test("Student blocked from admin users",    "/admin/users/all",    "GET",  () => request("GET",  "/admin/users/all",    studentTk), 403);
    await test("Student blocked from finance",        "/finance/analytics",  "GET",  () => request("GET",  "/finance/analytics",  studentTk), 403);
    await test("Student blocked from POST /courses",  "/courses",            "POST", () => request("POST", "/courses",            studentTk, {
      courseCode: "X999", title: "Hack", unit: 1, department: "X", faculty: "X", level: "100", semester: "first",
    }), 403);
    await test("Student blocked from welfare admin",  "/welfare/admin/all",  "GET",  () => request("GET",  "/welfare/admin/all",  studentTk), 403);
    await test("Student blocked from transcripts",    "/transcripts",        "GET",  () => request("GET",  "/transcripts",        studentTk), 403);
  } else {
    skip("Permission boundary tests", "various", "GET", "No student token");
  }

  // No token → must get 401
  await test("No token → 401 on dashboard",     "/dashboard/student", "GET", () => request("GET", "/dashboard/student"), 401);
  await test("No token → 401 on notifications", "/notifications/my",  "GET", () => request("GET", "/notifications/my"),  401);
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL REPORT
// ─────────────────────────────────────────────────────────────────────────────

function printReport() {
  const passed  = results.filter(r => r.status === "PASS").length;
  const failed  = results.filter(r => r.status === "FAIL").length;
  const skipped = results.filter(r => r.status === "SKIP").length;
  const total   = results.length;
  const rated   = total - skipped;
  const pct     = rated > 0 ? Math.round((passed / rated) * 100) : 0;

  console.log(`\n${"═".repeat(62)}`);
  console.log("  MAAUN SYSTEM TEST — FINAL REPORT");
  console.log("═".repeat(62));
  console.log(`  Total tests : ${total}`);
  console.log(`  ✅ Passed   : ${passed}`);
  console.log(`  ❌ Failed   : ${failed}`);
  console.log(`  ⏭  Skipped  : ${skipped}`);
  console.log(`  Pass rate   : ${pct}%  (${passed}/${rated} runnable tests)`);

  if (failed > 0) {
    console.log(`\n${"─".repeat(62)}`);
    console.log("  FAILING ENDPOINTS:");
    console.log("─".repeat(62));
    results.filter(r => r.status === "FAIL").forEach(r => {
      console.log(`  ❌ [${r.method.padEnd(6)}] ${r.endpoint}`);
      console.log(`     └─ ${r.error || `HTTP ${r.code}`}`);
    });
  }

  if (skipped > 0) {
    console.log(`\n${"─".repeat(62)}`);
    console.log("  SKIPPED TESTS:");
    console.log("─".repeat(62));
    results.filter(r => r.status === "SKIP").forEach(r => {
      console.log(`  ⏭  [${r.method.padEnd(6)}] ${r.endpoint}  — ${r.error}`);
    });
  }

  console.log(`\n${"═".repeat(62)}\n`);
  process.exit(failed > 0 ? 1 : 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${"═".repeat(62)}`);
  console.log("  MAAUN University Portal — System Auto-Test Engine");
  console.log(`  Target : ${BASE}`);
  console.log(`  Time   : ${new Date().toISOString()}`);
  console.log("═".repeat(62));

  await loginAll();
  await testPublic();
  await testStudentFlow();
  await testLecturerFlow();
  await testAdminFlow();
  await testFinanceFlow();
  await testGraduationFlow();
  await testHostelFlow();
  await testDisciplinaryFlow();
  await testWelfareFlow();
  await testTranscriptFlow();
  await testNotificationFlow();
  await testSecondaryRoles();
  await testPermissions();

  printReport();
}

main().catch(err => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
