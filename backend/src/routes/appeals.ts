import { Router } from "express";
import { eq, and, desc, inArray } from "drizzle-orm";
import {
  db, studentsTable, usersTable,
  disciplinaryCasesTable, disciplinaryActionsTable, disciplinaryFlagsTable,
  disciplinaryAppealsTable, appealDecisionsTable, activityLogsTable,
} from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth-middleware";
import { createNotification } from "../lib/notification-helper";

const router = Router();

// Flag sets per sanction type (used in modify decisions)
const FLAG_MAP: Record<string, Array<"academic_hold" | "hostel_block" | "graduation_block" | "account_disabled">> = {
  warning:     [],
  suspension:  ["academic_hold", "graduation_block"],
  restriction: ["hostel_block"],
  expulsion:   ["academic_hold", "hostel_block", "graduation_block", "account_disabled"],
  none:        [],
};

async function liftAllFlagsForCase(caseId: number) {
  await db.update(disciplinaryFlagsTable)
    .set({ active: false })
    .where(and(eq(disciplinaryFlagsTable.relatedCaseId, caseId), eq(disciplinaryFlagsTable.active, true)));
}

async function applyFlagsForModify(studentId: number, caseId: number, actionType: string) {
  // 1. Lift ALL current flags for this case
  await liftAllFlagsForCase(caseId);
  // 2. Apply new (reduced) flags
  const flags = FLAG_MAP[actionType] ?? [];
  for (const flagType of flags) {
    const [existing] = await db.select()
      .from(disciplinaryFlagsTable)
      .where(and(
        eq(disciplinaryFlagsTable.studentId, studentId),
        eq(disciplinaryFlagsTable.flagType, flagType),
        eq(disciplinaryFlagsTable.active, true),
      ))
      .limit(1);
    if (!existing) {
      await db.insert(disciplinaryFlagsTable).values({ studentId, flagType, active: true, relatedCaseId: caseId });
    }
  }
}

// ─── Student: submit appeal ───────────────────────────────────────────────────
router.post("/appeals/cases/:caseId", requireAuth, requireRole("student"), async (req, res) => {
  const caseId = parseInt(req.params.caseId);
  const { reason, evidence } = req.body;
  if (!reason) return res.status(400).json({ error: "reason is required" });

  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.userId, req.user!.userId)).limit(1);
  if (!student) return res.status(403).json({ error: "Student profile not found" });

  // Verify case belongs to this student
  const [c] = await db.select()
    .from(disciplinaryCasesTable)
    .where(and(eq(disciplinaryCasesTable.id, caseId), eq(disciplinaryCasesTable.studentId, student.id)))
    .limit(1);
  if (!c) return res.status(404).json({ error: "Case not found or does not belong to your account" });

  // Cannot appeal a dismissed case
  if (c.status === "dismissed") {
    return res.status(400).json({ error: "Cannot appeal a dismissed case" });
  }

  // Only one active appeal per case
  const [existing] = await db.select()
    .from(disciplinaryAppealsTable)
    .where(and(
      eq(disciplinaryAppealsTable.caseId, caseId),
      inArray(disciplinaryAppealsTable.status, ["submitted", "under_review"]),
    ))
    .limit(1);
  if (existing) {
    return res.status(409).json({ error: "An active appeal already exists for this case", appealId: existing.id });
  }

  const [appeal] = await db.insert(disciplinaryAppealsTable).values({
    caseId, studentId: student.id, reason, evidence: evidence ?? null, status: "submitted",
  }).returning();

  // Notify all admins
  try {
    const admins = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.role, "admin"));
    for (const admin of admins) {
      await createNotification(admin.id, "Disciplinary Appeal Submitted",
        `A student has submitted an appeal for Case #${caseId}. Please review in the disciplinary panel.`, "warning");
    }
  } catch { /* best-effort */ }

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "APPEAL_SUBMITTED", model: "disciplinary_appeals", modelId: appeal.id,
    newData: { caseId, ip },
  });

  return res.status(201).json(appeal);
});

// ─── Student: my appeals ──────────────────────────────────────────────────────
router.get("/appeals/my-appeals", requireAuth, requireRole("student"), async (req, res) => {
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.userId, req.user!.userId)).limit(1);
  if (!student) return res.status(403).json({ error: "Student profile not found" });

  const appeals = await db.select({
    id: disciplinaryAppealsTable.id,
    caseId: disciplinaryAppealsTable.caseId,
    reason: disciplinaryAppealsTable.reason,
    evidence: disciplinaryAppealsTable.evidence,
    status: disciplinaryAppealsTable.status,
    adminResponse: disciplinaryAppealsTable.adminResponse,
    createdAt: disciplinaryAppealsTable.createdAt,
    resolvedAt: disciplinaryAppealsTable.resolvedAt,
    caseTitle: disciplinaryCasesTable.title,
    caseSeverity: disciplinaryCasesTable.severity,
    caseStatus: disciplinaryCasesTable.status,
  })
    .from(disciplinaryAppealsTable)
    .innerJoin(disciplinaryCasesTable, eq(disciplinaryAppealsTable.caseId, disciplinaryCasesTable.id))
    .where(eq(disciplinaryAppealsTable.studentId, student.id))
    .orderBy(desc(disciplinaryAppealsTable.createdAt));

  // Fetch decisions
  const appealIds = appeals.map(a => a.id);
  const decisions = appealIds.length > 0
    ? await db.select({
        appealId: appealDecisionsTable.appealId,
        decision: appealDecisionsTable.decision,
        modifiedAction: appealDecisionsTable.modifiedAction,
        remarks: appealDecisionsTable.remarks,
        createdAt: appealDecisionsTable.createdAt,
      }).from(appealDecisionsTable).where(inArray(appealDecisionsTable.appealId, appealIds))
    : [];

  const decMap = new Map(decisions.map(d => [d.appealId, d]));
  return res.json(appeals.map(a => ({ ...a, decision: decMap.get(a.id) ?? null })));
});

// ─── Admin: list all appeals ──────────────────────────────────────────────────
router.get("/appeals/admin/all", requireAuth, requireRole("admin"), async (req, res) => {
  const appeals = await db.select({
    id: disciplinaryAppealsTable.id,
    caseId: disciplinaryAppealsTable.caseId,
    studentId: disciplinaryAppealsTable.studentId,
    reason: disciplinaryAppealsTable.reason,
    evidence: disciplinaryAppealsTable.evidence,
    status: disciplinaryAppealsTable.status,
    adminResponse: disciplinaryAppealsTable.adminResponse,
    createdAt: disciplinaryAppealsTable.createdAt,
    resolvedAt: disciplinaryAppealsTable.resolvedAt,
    caseTitle: disciplinaryCasesTable.title,
    caseSeverity: disciplinaryCasesTable.severity,
    caseStatus: disciplinaryCasesTable.status,
    studentName: usersTable.name,
    matricNumber: studentsTable.matricNumber,
    department: studentsTable.department,
  })
    .from(disciplinaryAppealsTable)
    .innerJoin(disciplinaryCasesTable, eq(disciplinaryAppealsTable.caseId, disciplinaryCasesTable.id))
    .innerJoin(studentsTable, eq(disciplinaryAppealsTable.studentId, studentsTable.id))
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .orderBy(desc(disciplinaryAppealsTable.createdAt));

  const appealIds = appeals.map(a => a.id);
  const decisions = appealIds.length > 0
    ? await db.select().from(appealDecisionsTable).where(inArray(appealDecisionsTable.appealId, appealIds))
    : [];
  const decMap = new Map(decisions.map(d => [d.appealId, d]));

  return res.json(appeals.map(a => ({ ...a, decision: decMap.get(a.id) ?? null })));
});

// ─── Admin: single appeal detail (with case actions + flags) ─────────────────
router.get("/appeals/admin/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);

  const [appeal] = await db.select({
    id: disciplinaryAppealsTable.id,
    caseId: disciplinaryAppealsTable.caseId,
    studentId: disciplinaryAppealsTable.studentId,
    reason: disciplinaryAppealsTable.reason,
    evidence: disciplinaryAppealsTable.evidence,
    status: disciplinaryAppealsTable.status,
    adminResponse: disciplinaryAppealsTable.adminResponse,
    createdAt: disciplinaryAppealsTable.createdAt,
    resolvedAt: disciplinaryAppealsTable.resolvedAt,
    caseTitle: disciplinaryCasesTable.title,
    caseDescription: disciplinaryCasesTable.description,
    caseSeverity: disciplinaryCasesTable.severity,
    caseStatus: disciplinaryCasesTable.status,
    studentName: usersTable.name,
    matricNumber: studentsTable.matricNumber,
    department: studentsTable.department,
    level: studentsTable.level,
  })
    .from(disciplinaryAppealsTable)
    .innerJoin(disciplinaryCasesTable, eq(disciplinaryAppealsTable.caseId, disciplinaryCasesTable.id))
    .innerJoin(studentsTable, eq(disciplinaryAppealsTable.studentId, studentsTable.id))
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(disciplinaryAppealsTable.id, id))
    .limit(1);

  if (!appeal) return res.status(404).json({ error: "Appeal not found" });

  const actions = await db.select({
    id: disciplinaryActionsTable.id,
    actionType: disciplinaryActionsTable.actionType,
    startDate: disciplinaryActionsTable.startDate,
    endDate: disciplinaryActionsTable.endDate,
    remarks: disciplinaryActionsTable.remarks,
    appliedAt: disciplinaryActionsTable.appliedAt,
  })
    .from(disciplinaryActionsTable)
    .where(eq(disciplinaryActionsTable.caseId, appeal.caseId))
    .orderBy(desc(disciplinaryActionsTable.appliedAt));

  const flags = await db.select()
    .from(disciplinaryFlagsTable)
    .where(and(
      eq(disciplinaryFlagsTable.relatedCaseId, appeal.caseId),
      eq(disciplinaryFlagsTable.active, true),
    ));

  const [decision] = await db.select().from(appealDecisionsTable)
    .where(eq(appealDecisionsTable.appealId, id)).limit(1);

  return res.json({ ...appeal, actions, activeFlags: flags, decision: decision ?? null });
});

// ─── Admin: mark appeal under review ─────────────────────────────────────────
router.patch("/appeals/admin/:id/review", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const [appeal] = await db.select().from(disciplinaryAppealsTable).where(eq(disciplinaryAppealsTable.id, id)).limit(1);
  if (!appeal) return res.status(404).json({ error: "Appeal not found" });
  if (appeal.status !== "submitted") return res.status(400).json({ error: "Appeal is not in submitted state" });

  const [updated] = await db.update(disciplinaryAppealsTable)
    .set({ status: "under_review", reviewedBy: req.user!.userId })
    .where(eq(disciplinaryAppealsTable.id, id))
    .returning();

  // Notify student
  const [student] = await db.select({ userId: studentsTable.userId })
    .from(studentsTable).where(eq(studentsTable.id, appeal.studentId)).limit(1);
  if (student) {
    await createNotification(student.userId, "Appeal Under Review",
      `Your appeal for Case #${appeal.caseId} is now being reviewed by the administration.`, "info");
  }

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "APPEAL_REVIEW_STARTED", model: "disciplinary_appeals", modelId: id,
    newData: { caseId: appeal.caseId, ip },
  });

  return res.json(updated);
});

// ─── Admin: make decision ─────────────────────────────────────────────────────
router.post("/appeals/admin/:id/decision", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { decision, modifiedAction, remarks, adminResponse } = req.body;
  if (!decision || !remarks) return res.status(400).json({ error: "decision and remarks are required" });
  if (!["uphold", "modify", "dismiss"].includes(decision)) {
    return res.status(400).json({ error: "decision must be uphold, modify, or dismiss" });
  }
  if (decision === "modify" && !modifiedAction) {
    return res.status(400).json({ error: "modifiedAction is required for modify decisions" });
  }

  const [appeal] = await db.select().from(disciplinaryAppealsTable).where(eq(disciplinaryAppealsTable.id, id)).limit(1);
  if (!appeal) return res.status(404).json({ error: "Appeal not found" });
  if (appeal.status === "accepted" || appeal.status === "rejected") {
    return res.status(409).json({ error: "Decision already recorded — decisions are immutable" });
  }

  const [c] = await db.select().from(disciplinaryCasesTable).where(eq(disciplinaryCasesTable.id, appeal.caseId)).limit(1);
  if (!c) return res.status(404).json({ error: "Associated case not found" });

  // Record decision
  const [dec] = await db.insert(appealDecisionsTable).values({
    appealId: id, decision, modifiedAction: modifiedAction ?? null,
    remarks, decidedBy: req.user!.userId,
  }).returning();

  let appealStatus: "accepted" | "rejected" = decision === "uphold" ? "rejected" : "accepted";

  // Process effects
  if (decision === "dismiss") {
    // Lift ALL flags, close the case
    await liftAllFlagsForCase(appeal.caseId);
    await db.update(disciplinaryCasesTable)
      .set({ status: "dismissed", resolutionNote: `Appeal accepted — case dismissed. ${remarks}`, updatedAt: new Date() })
      .where(eq(disciplinaryCasesTable.id, appeal.caseId));
  } else if (decision === "modify") {
    // Adjust flags to match the reduced sanction
    const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, appeal.studentId)).limit(1);
    if (student) {
      await applyFlagsForModify(student.id, appeal.caseId, modifiedAction);
    }
    // Update case to under_review
    await db.update(disciplinaryCasesTable)
      .set({ status: "under_review", updatedAt: new Date() })
      .where(eq(disciplinaryCasesTable.id, appeal.caseId));
  }
  // uphold → no flag changes, case stays as-is

  // Update appeal status + response
  const [updatedAppeal] = await db.update(disciplinaryAppealsTable)
    .set({ status: appealStatus, adminResponse: adminResponse ?? remarks, resolvedAt: new Date(), reviewedBy: req.user!.userId })
    .where(eq(disciplinaryAppealsTable.id, id))
    .returning();

  // Notify student
  const [student] = await db.select({ userId: studentsTable.userId })
    .from(studentsTable).where(eq(studentsTable.id, appeal.studentId)).limit(1);

  const notifyMap: Record<string, { title: string; msg: string; type: "success" | "warning" | "info" }> = {
    uphold:  { title: "Appeal Decision: Upheld",   msg: `Your appeal for Case #${appeal.caseId} has been reviewed. The original sanction has been upheld. Admin note: ${adminResponse ?? remarks}`, type: "warning" },
    modify:  { title: "Appeal Decision: Modified",  msg: `Your appeal for Case #${appeal.caseId} has been accepted with modifications. Sanction reduced to: ${modifiedAction}. Admin note: ${adminResponse ?? remarks}`, type: "info" },
    dismiss: { title: "Appeal Decision: Accepted",  msg: `Your appeal for Case #${appeal.caseId} has been accepted. The case has been dismissed and all restrictions lifted.`, type: "success" },
  };
  const notif = notifyMap[decision];
  if (student && notif) {
    await createNotification(student.userId, notif.title, notif.msg, notif.type);
  }

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "APPEAL_DECISION_MADE", model: "appeal_decisions", modelId: dec.id,
    newData: { appealId: id, caseId: appeal.caseId, decision, modifiedAction, ip },
  });

  return res.status(201).json({ decision: dec, appeal: updatedAppeal });
});

export default router;
