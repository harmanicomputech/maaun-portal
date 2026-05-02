import { Router } from "express";
import { eq, and, desc, inArray } from "drizzle-orm";
import {
  db, studentsTable, usersTable,
  disciplinaryCasesTable, disciplinaryActionsTable, disciplinaryFlagsTable,
  activityLogsTable,
} from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth-middleware";
import { createNotification } from "../lib/notification-helper";

const router = Router();

// ─── Sanction engine ──────────────────────────────────────────────────────────
const FLAG_MAP: Record<string, Array<"academic_hold" | "hostel_block" | "graduation_block" | "account_disabled">> = {
  warning:     [],
  suspension:  ["academic_hold", "graduation_block"],
  restriction: ["hostel_block"],
  expulsion:   ["academic_hold", "hostel_block", "graduation_block", "account_disabled"],
};

async function applyFlags(studentId: number, caseId: number, actionType: string) {
  const flags = FLAG_MAP[actionType] ?? [];
  for (const flagType of flags) {
    const [existing] = await db.select()
      .from(disciplinaryFlagsTable)
      .where(and(eq(disciplinaryFlagsTable.studentId, studentId), eq(disciplinaryFlagsTable.flagType, flagType), eq(disciplinaryFlagsTable.active, true)))
      .limit(1);
    if (!existing) {
      await db.insert(disciplinaryFlagsTable).values({ studentId, flagType, active: true, relatedCaseId: caseId });
    }
  }
}

async function liftFlagsForCase(caseId: number) {
  await db.update(disciplinaryFlagsTable)
    .set({ active: false })
    .where(and(eq(disciplinaryFlagsTable.relatedCaseId, caseId), eq(disciplinaryFlagsTable.active, true)));
}

// ─── Helper: full case with actions + flags ───────────────────────────────────
async function buildCaseDetail(caseId: number) {
  const [c] = await db.select({
    id: disciplinaryCasesTable.id,
    studentId: disciplinaryCasesTable.studentId,
    title: disciplinaryCasesTable.title,
    description: disciplinaryCasesTable.description,
    severity: disciplinaryCasesTable.severity,
    status: disciplinaryCasesTable.status,
    resolutionNote: disciplinaryCasesTable.resolutionNote,
    createdAt: disciplinaryCasesTable.createdAt,
    updatedAt: disciplinaryCasesTable.updatedAt,
    studentName: usersTable.name,
    matricNumber: studentsTable.matricNumber,
    department: studentsTable.department,
    level: studentsTable.level,
  })
    .from(disciplinaryCasesTable)
    .innerJoin(studentsTable, eq(disciplinaryCasesTable.studentId, studentsTable.id))
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(disciplinaryCasesTable.id, caseId))
    .limit(1);

  if (!c) return null;

  const actions = await db.select({
    id: disciplinaryActionsTable.id,
    caseId: disciplinaryActionsTable.caseId,
    actionType: disciplinaryActionsTable.actionType,
    startDate: disciplinaryActionsTable.startDate,
    endDate: disciplinaryActionsTable.endDate,
    remarks: disciplinaryActionsTable.remarks,
    appliedAt: disciplinaryActionsTable.appliedAt,
    appliedByName: usersTable.name,
  })
    .from(disciplinaryActionsTable)
    .innerJoin(usersTable, eq(disciplinaryActionsTable.appliedBy, usersTable.id))
    .where(eq(disciplinaryActionsTable.caseId, caseId))
    .orderBy(desc(disciplinaryActionsTable.appliedAt));

  const flags = await db.select()
    .from(disciplinaryFlagsTable)
    .where(eq(disciplinaryFlagsTable.relatedCaseId, caseId));

  return { ...c, actions, flags };
}

// ─── Student: own cases ───────────────────────────────────────────────────────
router.get("/disciplinary/my-cases", requireAuth, requireRole("student"), async (req, res) => {
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.userId, req.user!.userId)).limit(1);
  if (!student) return res.status(404).json({ error: "Student profile not found" });

  const cases = await db.select({
    id: disciplinaryCasesTable.id,
    title: disciplinaryCasesTable.title,
    severity: disciplinaryCasesTable.severity,
    status: disciplinaryCasesTable.status,
    createdAt: disciplinaryCasesTable.createdAt,
    updatedAt: disciplinaryCasesTable.updatedAt,
  })
    .from(disciplinaryCasesTable)
    .where(eq(disciplinaryCasesTable.studentId, student.id))
    .orderBy(desc(disciplinaryCasesTable.createdAt));

  const caseIds = cases.map(c => c.id);
  const actions = caseIds.length > 0
    ? await db.select({
        caseId: disciplinaryActionsTable.caseId,
        actionType: disciplinaryActionsTable.actionType,
        startDate: disciplinaryActionsTable.startDate,
        endDate: disciplinaryActionsTable.endDate,
        remarks: disciplinaryActionsTable.remarks,
        appliedAt: disciplinaryActionsTable.appliedAt,
      }).from(disciplinaryActionsTable).where(inArray(disciplinaryActionsTable.caseId, caseIds))
    : [];

  const flags = await db.select()
    .from(disciplinaryFlagsTable)
    .where(and(eq(disciplinaryFlagsTable.studentId, student.id), eq(disciplinaryFlagsTable.active, true)));

  const actMap = new Map<number, typeof actions>();
  for (const a of actions) {
    if (!actMap.has(a.caseId)) actMap.set(a.caseId, []);
    actMap.get(a.caseId)!.push(a);
  }

  return res.json({ cases: cases.map(c => ({ ...c, actions: actMap.get(c.id) ?? [] })), activeFlags: flags });
});

// ─── Admin: list all cases ────────────────────────────────────────────────────
router.get("/disciplinary/admin/cases", requireAuth, requireRole("admin"), async (req, res) => {
  const cases = await db.select({
    id: disciplinaryCasesTable.id,
    studentId: disciplinaryCasesTable.studentId,
    title: disciplinaryCasesTable.title,
    severity: disciplinaryCasesTable.severity,
    status: disciplinaryCasesTable.status,
    createdAt: disciplinaryCasesTable.createdAt,
    updatedAt: disciplinaryCasesTable.updatedAt,
    studentName: usersTable.name,
    matricNumber: studentsTable.matricNumber,
    department: studentsTable.department,
    level: studentsTable.level,
  })
    .from(disciplinaryCasesTable)
    .innerJoin(studentsTable, eq(disciplinaryCasesTable.studentId, studentsTable.id))
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .orderBy(desc(disciplinaryCasesTable.createdAt));

  const caseIds = cases.map(c => c.id);
  const actions = caseIds.length > 0
    ? await db.select().from(disciplinaryActionsTable).where(inArray(disciplinaryActionsTable.caseId, caseIds))
    : [];

  const actMap = new Map<number, typeof actions>();
  for (const a of actions) {
    if (!actMap.has(a.caseId)) actMap.set(a.caseId, []);
    actMap.get(a.caseId)!.push(a);
  }

  return res.json(cases.map(c => ({ ...c, actions: actMap.get(c.id) ?? [] })));
});

// ─── Admin: single case detail ────────────────────────────────────────────────
router.get("/disciplinary/admin/cases/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const detail = await buildCaseDetail(id);
  if (!detail) return res.status(404).json({ error: "Case not found" });
  return res.json(detail);
});

// ─── Admin: active flags ──────────────────────────────────────────────────────
router.get("/disciplinary/admin/flags", requireAuth, requireRole("admin"), async (req, res) => {
  const flags = await db.select({
    id: disciplinaryFlagsTable.id,
    studentId: disciplinaryFlagsTable.studentId,
    flagType: disciplinaryFlagsTable.flagType,
    active: disciplinaryFlagsTable.active,
    relatedCaseId: disciplinaryFlagsTable.relatedCaseId,
    createdAt: disciplinaryFlagsTable.createdAt,
    studentName: usersTable.name,
    matricNumber: studentsTable.matricNumber,
  })
    .from(disciplinaryFlagsTable)
    .innerJoin(studentsTable, eq(disciplinaryFlagsTable.studentId, studentsTable.id))
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(disciplinaryFlagsTable.active, true))
    .orderBy(desc(disciplinaryFlagsTable.createdAt));
  return res.json(flags);
});

// ─── Admin: create case ───────────────────────────────────────────────────────
router.post("/disciplinary/admin/cases", requireAuth, requireRole("admin"), async (req, res) => {
  const { studentId, title, description, severity } = req.body;
  if (!studentId || !title || !description || !severity) {
    return res.status(400).json({ error: "studentId, title, description, severity required" });
  }

  const [student] = await db.select({ userId: studentsTable.userId, matricNumber: studentsTable.matricNumber })
    .from(studentsTable).where(eq(studentsTable.id, studentId)).limit(1);
  if (!student) return res.status(404).json({ error: "Student not found" });

  const [c] = await db.insert(disciplinaryCasesTable).values({
    studentId, reportedBy: req.user!.userId, title, description, severity, status: "open",
  }).returning();

  await createNotification(student.userId, "Disciplinary Case Opened", `A disciplinary case has been opened against your record: "${title}". Please check your student portal.`, "warning");

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "DISCIPLINARY_CASE_CREATED", model: "disciplinary_cases", modelId: c.id,
    newData: { title, severity, studentId, ip },
  });

  return res.status(201).json(c);
});

// ─── Admin: update case status ────────────────────────────────────────────────
router.patch("/disciplinary/admin/cases/:id/status", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { status, resolutionNote } = req.body;
  if (!status) return res.status(400).json({ error: "status required" });

  const [existing] = await db.select().from(disciplinaryCasesTable).where(eq(disciplinaryCasesTable.id, id)).limit(1);
  if (!existing) return res.status(404).json({ error: "Case not found" });

  const [updated] = await db.update(disciplinaryCasesTable)
    .set({ status, resolutionNote: resolutionNote ?? existing.resolutionNote, updatedAt: new Date() })
    .where(eq(disciplinaryCasesTable.id, id))
    .returning();

  // If resolving or dismissing, lift all flags tied to this case
  if (status === "resolved" || status === "dismissed") {
    await liftFlagsForCase(id);
  }

  const [student] = await db.select({ userId: studentsTable.userId })
    .from(studentsTable).where(eq(studentsTable.id, existing.studentId)).limit(1);

  const statusMsg: Record<string, string> = {
    under_review: "Your disciplinary case is now under review.",
    resolved:     "Your disciplinary case has been resolved.",
    dismissed:    "Your disciplinary case has been dismissed. All associated restrictions have been lifted.",
  };
  if (student && statusMsg[status]) {
    await createNotification(student.userId, "Disciplinary Case Update", statusMsg[status], status === "resolved" || status === "dismissed" ? "success" : "warning");
  }

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "DISCIPLINARY_STATUS_CHANGED", model: "disciplinary_cases", modelId: id,
    newData: { from: existing.status, to: status, ip },
  });

  return res.json(updated);
});

// ─── Admin: apply action/sanction ─────────────────────────────────────────────
router.post("/disciplinary/admin/cases/:id/action", requireAuth, requireRole("admin"), async (req, res) => {
  const caseId = parseInt(req.params.id);
  const { actionType, startDate, endDate, remarks } = req.body;
  if (!actionType || !startDate) return res.status(400).json({ error: "actionType and startDate required" });

  const [c] = await db.select().from(disciplinaryCasesTable).where(eq(disciplinaryCasesTable.id, caseId)).limit(1);
  if (!c) return res.status(404).json({ error: "Case not found" });

  const [action] = await db.insert(disciplinaryActionsTable).values({
    caseId, actionType, startDate, endDate: endDate ?? null, remarks: remarks ?? null, appliedBy: req.user!.userId,
  }).returning();

  // Apply flags based on action type
  await applyFlags(c.studentId, caseId, actionType);

  // Move case to under_review if still open
  if (c.status === "open") {
    await db.update(disciplinaryCasesTable)
      .set({ status: "under_review", updatedAt: new Date() })
      .where(eq(disciplinaryCasesTable.id, caseId));
  }

  const [student] = await db.select({ userId: studentsTable.userId })
    .from(studentsTable).where(eq(studentsTable.id, c.studentId)).limit(1);

  const actionMsg: Record<string, string> = {
    warning:     `A formal warning has been issued against your record for case: "${c.title}".`,
    suspension:  `A suspension sanction has been applied to your account for case: "${c.title}". Course registration is temporarily blocked.`,
    restriction: `A hostel restriction has been applied to your account for case: "${c.title}".`,
    expulsion:   `An expulsion sanction has been applied to your account for case: "${c.title}". Your access has been restricted. Please contact the registry.`,
  };
  if (student && actionMsg[actionType]) {
    await createNotification(student.userId, "Disciplinary Sanction Applied", actionMsg[actionType], "warning");
  }

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "DISCIPLINARY_ACTION_APPLIED", model: "disciplinary_actions", modelId: action.id,
    newData: { caseId, actionType, ip },
  });

  return res.status(201).json(action);
});

// ─── Admin: lift specific flag ────────────────────────────────────────────────
router.patch("/disciplinary/admin/flags/:id/lift", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const [flag] = await db.update(disciplinaryFlagsTable).set({ active: false }).where(eq(disciplinaryFlagsTable.id, id)).returning();
  if (!flag) return res.status(404).json({ error: "Flag not found" });

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "DISCIPLINARY_FLAG_LIFTED", model: "disciplinary_flags", modelId: id,
    newData: { flagType: flag.flagType, ip },
  });

  return res.json(flag);
});

export default router;
