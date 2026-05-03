import { Router } from "express";
import { eq, and, desc, inArray } from "drizzle-orm";
import {
  db, studentsTable, usersTable, resultsTable, coursesTable,
  academicStandingsTable, transcriptsTable, receiptsTable,
  financialLedgerTable, graduationClearancesTable, graduationApplicationsTable,
  activityLogsTable, academicSessionsTable, disciplinaryFlagsTable,
} from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth-middleware";
import { createNotification } from "../lib/notification-helper";

const router = Router();

// ─── Eligibility engine ───────────────────────────────────────────────────────
async function evaluateStudent(studentId: number) {
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId)).limit(1);
  if (!student) throw new Error("Student not found");

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, student.userId)).limit(1);

  // ── Academic check ────────────────────────────────────────────────────────
  const standing = await db.select()
    .from(academicStandingsTable)
    .where(eq(academicStandingsTable.studentId, studentId))
    .orderBy(desc(academicStandingsTable.generatedAt))
    .limit(1);

  const cgpa = standing[0]?.cgpa ?? student.cgpa ?? 0;
  const academicRemarks: string[] = [];
  let academicOk = true;

  if (cgpa < 1.5) {
    academicOk = false;
    academicRemarks.push(`CGPA ${cgpa.toFixed(2)} is below minimum pass of 1.50`);
  }

  // Check for uncleared F grades (carryovers)
  const allResults = await db.select({
    courseId: resultsTable.courseId,
    grade: resultsTable.grade,
    semester: resultsTable.semester,
    academicYear: resultsTable.academicYear,
    courseCode: coursesTable.courseCode,
    status: resultsTable.status,
  }).from(resultsTable)
    .leftJoin(coursesTable, eq(resultsTable.courseId, coursesTable.id))
    .where(eq(resultsTable.studentId, studentId));

  // Find courses with F grade that were never re-passed
  const passed = new Set(allResults.filter(r => r.grade && r.grade !== "F" && (r.status === "approved" || r.status === "locked")).map(r => r.courseId));
  const failed = allResults.filter(r => r.grade === "F" && !passed.has(r.courseId));
  const uniqueCarryovers = [...new Map(failed.map(r => [r.courseId, r])).values()];

  if (uniqueCarryovers.length > 0) {
    academicOk = false;
    const codes = uniqueCarryovers.map(r => r.courseCode ?? `Course#${r.courseId}`).join(", ");
    academicRemarks.push(`${uniqueCarryovers.length} outstanding carryover(s): ${codes}`);
  }

  if (academicOk && academicRemarks.length === 0) {
    academicRemarks.push(`CGPA ${cgpa.toFixed(2)} — ${standing[0]?.classification ?? "Pass"} — No carryovers`);
  }

  // ── Financial check ───────────────────────────────────────────────────────
  const financialRemarks: string[] = [];
  let financialOk = true;

  // Check for pending (unconfirmed) receipts
  const pendingReceipts = await db.select()
    .from(receiptsTable)
    .where(and(eq(receiptsTable.userId, student.userId), eq(receiptsTable.status, "pending")));

  if (pendingReceipts.length > 0) {
    financialOk = false;
    financialRemarks.push(`${pendingReceipts.length} unconfirmed payment receipt(s) pending admin review`);
  }

  // Check for ledger — ensure they've made at least one confirmed payment
  const confirmedReceipts = await db.select()
    .from(receiptsTable)
    .where(and(eq(receiptsTable.userId, student.userId), eq(receiptsTable.status, "confirmed")));

  if (confirmedReceipts.length === 0) {
    financialOk = false;
    financialRemarks.push("No confirmed fee payments on record");
  } else {
    const totalPaid = confirmedReceipts.reduce((s, r) => s + r.amount, 0);
    financialRemarks.push(`${confirmedReceipts.length} confirmed payment(s) — Total: ₦${totalPaid.toLocaleString()}`);
  }

  // ── Admin check ───────────────────────────────────────────────────────────
  const adminRemarks: string[] = [];
  let adminOk = true;

  const officialTranscript = await db.select()
    .from(transcriptsTable)
    .where(and(eq(transcriptsTable.studentId, studentId), eq(transcriptsTable.status, "official")))
    .limit(1);

  if (!officialTranscript[0]) {
    adminOk = false;
    adminRemarks.push("No official transcript issued — pending registrar approval");
  } else {
    adminRemarks.push(`Official transcript issued (Ref: ${officialTranscript[0].referenceNumber})`);
  }

  // ── Disciplinary flag check ───────────────────────────────────────────────
  const [gradBlock] = await db.select()
    .from(disciplinaryFlagsTable)
    .where(and(
      eq(disciplinaryFlagsTable.studentId, studentId),
      eq(disciplinaryFlagsTable.flagType, "graduation_block"),
      eq(disciplinaryFlagsTable.active, true),
    ))
    .limit(1);

  if (gradBlock) {
    adminOk = false;
    adminRemarks.push("Active disciplinary graduation block — contact Dean of Students to resolve");
  }

  const overallStatus = academicOk && financialOk && adminOk ? "eligible" : "not_eligible";

  return {
    studentId,
    student,
    user,
    cgpa,
    academic: { ok: academicOk, remarks: academicRemarks.join("; ") },
    financial: { ok: financialOk, remarks: financialRemarks.join("; ") },
    admin: { ok: adminOk, remarks: adminRemarks.join("; ") },
    overallStatus,
    eligible: overallStatus === "eligible",
  };
}

// ─── Student: evaluate own clearance ─────────────────────────────────────────
router.get("/graduation/my-clearance", requireAuth, requireRole("student"), async (req, res) => {
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.userId, req.user!.userId)).limit(1);
  if (!student) return res.status(404).json({ error: "Student profile not found" });

  const result = await evaluateStudent(student.id);

  // Persist latest evaluation
  await db.delete(graduationClearancesTable).where(eq(graduationClearancesTable.studentId, student.id));
  await db.insert(graduationClearancesTable).values({
    studentId: student.id,
    cgpa: result.cgpa,
    academicStatus: result.academic.ok ? "passed" : "failed",
    financialStatus: result.financial.ok ? "cleared" : "blocked",
    adminStatus: result.admin.ok ? "cleared" : "pending",
    overallStatus: result.overallStatus,
    academicRemarks: result.academic.remarks,
    financialRemarks: result.financial.remarks,
    adminRemarks: result.admin.remarks,
    evaluatedBy: req.user!.userId,
  });

  // Get application if any
  const [application] = await db.select()
    .from(graduationApplicationsTable)
    .where(eq(graduationApplicationsTable.studentId, student.id))
    .orderBy(desc(graduationApplicationsTable.createdAt))
    .limit(1);

  return res.json({ ...result, application: application ?? null });
});

// ─── Student: apply for graduation ───────────────────────────────────────────
router.post("/graduation/apply", requireAuth, requireRole("student"), async (req, res) => {
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.userId, req.user!.userId)).limit(1);
  if (!student) return res.status(404).json({ error: "Student profile not found" });

  const eval_ = await evaluateStudent(student.id);
  if (!eval_.eligible) {
    return res.status(400).json({ error: "Not eligible", message: "You must meet all clearance requirements before applying for graduation." });
  }

  const existing = await db.select()
    .from(graduationApplicationsTable)
    .where(and(eq(graduationApplicationsTable.studentId, student.id), inArray(graduationApplicationsTable.status, ["applied", "under_review", "approved"])))
    .limit(1);

  if (existing[0]) return res.status(409).json({ error: "Already applied", message: "You already have an active graduation application.", application: existing[0] });

  const [activeSession] = await db.select().from(academicSessionsTable).where(eq(academicSessionsTable.isActive, true)).limit(1);

  const [app] = await db.insert(graduationApplicationsTable).values({
    studentId: student.id,
    sessionId: activeSession?.id ?? null,
    status: "applied",
  }).returning();

  // Notify admins — find all admin users
  try {
    const admins = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.role, "admin"));
    for (const admin of admins) {
      await createNotification(admin.id, "Graduation Application Received", `${eval_.user.name} (${student.matricNumber}) has applied for graduation clearance.`, "info");
    }
  } catch { /* best-effort */ }

  return res.status(201).json(app);
});

// ─── Admin: list all graduation data ─────────────────────────────────────────
router.get("/graduation/admin/list", requireAuth, requireRole("admin", "registrar", "dean"), async (req, res) => {
  const students = await db
    .select({
      studentId: studentsTable.id,
      userId: studentsTable.userId,
      matricNumber: studentsTable.matricNumber,
      department: studentsTable.department,
      faculty: studentsTable.faculty,
      level: studentsTable.level,
      cgpa: studentsTable.cgpa,
      enrollmentYear: studentsTable.enrollmentYear,
      studentName: usersTable.name,
      studentEmail: usersTable.email,
    })
    .from(studentsTable)
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .orderBy(studentsTable.matricNumber);

  const clearances = await db.select().from(graduationClearancesTable);
  const applications = await db.select().from(graduationApplicationsTable).orderBy(desc(graduationApplicationsTable.createdAt));

  const clearanceMap = new Map(clearances.map(c => [c.studentId, c]));
  const appMap = new Map(applications.map(a => [a.studentId, a]));

  const result = students.map(s => ({
    ...s,
    clearance: clearanceMap.get(s.studentId) ?? null,
    application: appMap.get(s.studentId) ?? null,
  }));

  return res.json(result);
});

// ─── Admin: evaluate specific student ────────────────────────────────────────
router.post("/graduation/admin/evaluate/:studentId", requireAuth, requireRole("admin", "registrar", "dean"), async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  if (isNaN(studentId)) return res.status(400).json({ error: "Invalid studentId" });

  const result = await evaluateStudent(studentId);

  await db.delete(graduationClearancesTable).where(eq(graduationClearancesTable.studentId, studentId));
  await db.insert(graduationClearancesTable).values({
    studentId,
    cgpa: result.cgpa,
    academicStatus: result.academic.ok ? "passed" : "failed",
    financialStatus: result.financial.ok ? "cleared" : "blocked",
    adminStatus: result.admin.ok ? "cleared" : "pending",
    overallStatus: result.overallStatus,
    academicRemarks: result.academic.remarks,
    financialRemarks: result.financial.remarks,
    adminRemarks: result.admin.remarks,
    evaluatedBy: req.user!.userId,
  });

  return res.json(result);
});

// ─── Admin: approve application ───────────────────────────────────────────────
router.patch("/graduation/applications/:id/approve", requireAuth, requireRole("admin", "registrar", "dean"), async (req, res) => {
  const id = parseInt(req.params.id);
  const [app] = await db.select().from(graduationApplicationsTable).where(eq(graduationApplicationsTable.id, id)).limit(1);
  if (!app) return res.status(404).json({ error: "Application not found" });

  const [updated] = await db.update(graduationApplicationsTable)
    .set({ status: "approved", reviewedBy: req.user!.userId, reviewedAt: new Date() })
    .where(eq(graduationApplicationsTable.id, id))
    .returning();

  const [student] = await db.select({ userId: studentsTable.userId, matricNumber: studentsTable.matricNumber })
    .from(studentsTable).where(eq(studentsTable.id, app.studentId)).limit(1);

  if (student) {
    await createNotification(student.userId, "Graduation Application Approved", "Congratulations! Your graduation application has been approved by the registry.", "success");
  }

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "GRADUATION_APPROVED", model: "graduation_application", modelId: id,
    newData: { status: "approved", ip },
  });

  return res.json(updated);
});

// ─── Admin: reject application ────────────────────────────────────────────────
router.patch("/graduation/applications/:id/reject", requireAuth, requireRole("admin", "registrar", "dean"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { reason } = req.body;
  if (!reason) return res.status(400).json({ error: "Rejection reason is required" });

  const [app] = await db.select().from(graduationApplicationsTable).where(eq(graduationApplicationsTable.id, id)).limit(1);
  if (!app) return res.status(404).json({ error: "Application not found" });

  const [updated] = await db.update(graduationApplicationsTable)
    .set({ status: "rejected", reviewedBy: req.user!.userId, rejectionReason: reason, reviewedAt: new Date() })
    .where(eq(graduationApplicationsTable.id, id))
    .returning();

  const [student] = await db.select({ userId: studentsTable.userId })
    .from(studentsTable).where(eq(studentsTable.id, app.studentId)).limit(1);

  if (student) {
    await createNotification(student.userId, "Graduation Application Rejected", `Your graduation application has been rejected. Reason: ${reason}`, "warning");
  }

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "GRADUATION_REJECTED", model: "graduation_application", modelId: id,
    newData: { reason, ip },
  });

  return res.json(updated);
});

// ─── Admin: override eligibility ──────────────────────────────────────────────
router.post("/graduation/admin/override/:studentId", requireAuth, requireRole("admin", "registrar", "dean"), async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const { reason } = req.body;
  if (!reason) return res.status(400).json({ error: "Override reason is required" });

  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId)).limit(1);
  if (!student) return res.status(404).json({ error: "Student not found" });

  // Force clearance to eligible
  await db.delete(graduationClearancesTable).where(eq(graduationClearancesTable.studentId, studentId));
  await db.insert(graduationClearancesTable).values({
    studentId,
    cgpa: student.cgpa ?? 0,
    academicStatus: "passed",
    financialStatus: "cleared",
    adminStatus: "cleared",
    overallStatus: "eligible",
    academicRemarks: `Admin override: ${reason}`,
    financialRemarks: `Admin override: ${reason}`,
    adminRemarks: `Admin override: ${reason}`,
    evaluatedBy: req.user!.userId,
  });

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "GRADUATION_OVERRIDE", model: "graduation_clearance", modelId: studentId,
    newData: { reason, ip },
  });

  await createNotification(student.userId, "Graduation Override Applied", `An admin has manually cleared your graduation eligibility. Reason: ${reason}`, "success");

  return res.json({ message: "Override applied successfully", overallStatus: "eligible" });
});

export default router;
