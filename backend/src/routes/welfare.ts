import { Router } from "express";
import { eq, and, desc, inArray } from "drizzle-orm";
import {
  db, studentsTable, usersTable,
  welfareCasesTable, welfareAssignmentsTable, welfareNotesTable,
  activityLogsTable,
} from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth-middleware";
import { createNotification } from "../lib/notification-helper";

const router = Router();

const SENSITIVE_CATEGORIES = ["mental_health", "harassment"];

function maskCategory(category: string) {
  return SENSITIVE_CATEGORIES.includes(category) ? "[confidential]" : category;
}

async function buildCaseDetail(caseId: number, includePrivateNotes: boolean) {
  const [c] = await db.select({
    id: welfareCasesTable.id,
    studentId: welfareCasesTable.studentId,
    category: welfareCasesTable.category,
    title: welfareCasesTable.title,
    description: welfareCasesTable.description,
    priority: welfareCasesTable.priority,
    status: welfareCasesTable.status,
    isConfidential: welfareCasesTable.isConfidential,
    createdAt: welfareCasesTable.createdAt,
    updatedAt: welfareCasesTable.updatedAt,
    studentName: usersTable.name,
    matricNumber: studentsTable.matricNumber,
    department: studentsTable.department,
    level: studentsTable.level,
  })
    .from(welfareCasesTable)
    .innerJoin(studentsTable, eq(welfareCasesTable.studentId, studentsTable.id))
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(welfareCasesTable.id, caseId))
    .limit(1);

  if (!c) return null;

  const [assignment] = await db.select({
    id: welfareAssignmentsTable.id,
    assignedTo: welfareAssignmentsTable.assignedTo,
    assignedAt: welfareAssignmentsTable.assignedAt,
    counsellorName: usersTable.name,
  })
    .from(welfareAssignmentsTable)
    .innerJoin(usersTable, eq(welfareAssignmentsTable.assignedTo, usersTable.id))
    .where(eq(welfareAssignmentsTable.caseId, caseId))
    .orderBy(desc(welfareAssignmentsTable.assignedAt))
    .limit(1);

  const notesQuery = db.select({
    id: welfareNotesTable.id,
    note: welfareNotesTable.note,
    isPrivate: welfareNotesTable.isPrivate,
    createdAt: welfareNotesTable.createdAt,
    authorName: usersTable.name,
    authorId: welfareNotesTable.authorId,
  })
    .from(welfareNotesTable)
    .innerJoin(usersTable, eq(welfareNotesTable.authorId, usersTable.id))
    .where(
      includePrivateNotes
        ? eq(welfareNotesTable.caseId, caseId)
        : and(eq(welfareNotesTable.caseId, caseId), eq(welfareNotesTable.isPrivate, false))
    )
    .orderBy(welfareNotesTable.createdAt);

  const notes = await notesQuery;

  return { ...c, assignment: assignment ?? null, notes };
}

// ─── Student: submit case ─────────────────────────────────────────────────────
router.post("/welfare", requireAuth, requireRole("student"), async (req, res) => {
  const { category, title, description, priority } = req.body;
  if (!category || !title || !description) {
    return res.status(400).json({ error: "category, title, and description are required" });
  }

  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.userId, req.user!.userId)).limit(1);
  if (!student) return res.status(403).json({ error: "Student profile not found" });

  const isConfidential = SENSITIVE_CATEGORIES.includes(category);

  const [c] = await db.insert(welfareCasesTable).values({
    studentId: student.id, category, title, description,
    priority: priority ?? "medium", status: "submitted", isConfidential,
  }).returning();

  const admins = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.role, "admin"));
  for (const admin of admins) {
    await createNotification(admin.id, "New Welfare Request Submitted",
      `A new welfare case has been submitted${isConfidential ? " (confidential)" : ""}. Please review and assign in the welfare panel.`, "warning");
  }

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "WELFARE_CASE_SUBMITTED", model: "welfare_cases", modelId: c.id,
    newData: { category: maskCategory(category), priority: c.priority, ip },
  });

  return res.status(201).json(c);
});

// ─── Student: own cases ───────────────────────────────────────────────────────
router.get("/welfare/my-cases", requireAuth, requireRole("student"), async (req, res) => {
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.userId, req.user!.userId)).limit(1);
  if (!student) return res.status(403).json({ error: "Student profile not found" });

  const cases = await db.select({
    id: welfareCasesTable.id,
    category: welfareCasesTable.category,
    title: welfareCasesTable.title,
    priority: welfareCasesTable.priority,
    status: welfareCasesTable.status,
    isConfidential: welfareCasesTable.isConfidential,
    createdAt: welfareCasesTable.createdAt,
    updatedAt: welfareCasesTable.updatedAt,
  })
    .from(welfareCasesTable)
    .where(eq(welfareCasesTable.studentId, student.id))
    .orderBy(desc(welfareCasesTable.createdAt));

  const caseIds = cases.map(c => c.id);
  const assignments = caseIds.length
    ? await db.select({
        caseId: welfareAssignmentsTable.caseId,
        counsellorName: usersTable.name,
        assignedAt: welfareAssignmentsTable.assignedAt,
      })
        .from(welfareAssignmentsTable)
        .innerJoin(usersTable, eq(welfareAssignmentsTable.assignedTo, usersTable.id))
        .where(inArray(welfareAssignmentsTable.caseId, caseIds))
        .orderBy(desc(welfareAssignmentsTable.assignedAt))
    : [];

  const assignMap = new Map<number, any>();
  for (const a of assignments) {
    if (!assignMap.has(a.caseId)) assignMap.set(a.caseId, a);
  }

  return res.json(cases.map(c => ({ ...c, assignment: assignMap.get(c.id) ?? null })));
});

// ─── Student: case detail (non-private notes) ─────────────────────────────────
router.get("/welfare/my-cases/:id", requireAuth, requireRole("student"), async (req, res) => {
  const id = parseInt(req.params.id);
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.userId, req.user!.userId)).limit(1);
  if (!student) return res.status(403).json({ error: "Student profile not found" });

  const detail = await buildCaseDetail(id, false);
  if (!detail) return res.status(404).json({ error: "Case not found" });
  if (detail.studentId !== student.id) return res.status(403).json({ error: "Access denied" });

  return res.json(detail);
});

// ─── Admin: list counsellors ──────────────────────────────────────────────────
router.get("/welfare/admin/counsellors", requireAuth, requireRole("admin"), async (req, res) => {
  const counsellors = await db.select({ id: usersTable.id, name: usersTable.name, email: usersTable.email })
    .from(usersTable).where(eq(usersTable.role, "counsellor"));
  return res.json(counsellors);
});

// ─── Admin: all cases ─────────────────────────────────────────────────────────
router.get("/welfare/admin/all", requireAuth, requireRole("admin"), async (req, res) => {
  const { status, category, priority } = req.query;

  let cases = await db.select({
    id: welfareCasesTable.id,
    studentId: welfareCasesTable.studentId,
    category: welfareCasesTable.category,
    title: welfareCasesTable.title,
    priority: welfareCasesTable.priority,
    status: welfareCasesTable.status,
    isConfidential: welfareCasesTable.isConfidential,
    createdAt: welfareCasesTable.createdAt,
    updatedAt: welfareCasesTable.updatedAt,
    studentName: usersTable.name,
    matricNumber: studentsTable.matricNumber,
    department: studentsTable.department,
  })
    .from(welfareCasesTable)
    .innerJoin(studentsTable, eq(welfareCasesTable.studentId, studentsTable.id))
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .orderBy(desc(welfareCasesTable.createdAt));

  if (status) cases = cases.filter(c => c.status === status);
  if (category) cases = cases.filter(c => c.category === category);
  if (priority) cases = cases.filter(c => c.priority === priority);

  const caseIds = cases.map(c => c.id);
  const assignments = caseIds.length
    ? await db.select({
        caseId: welfareAssignmentsTable.caseId,
        counsellorName: usersTable.name,
        assignedAt: welfareAssignmentsTable.assignedAt,
      })
        .from(welfareAssignmentsTable)
        .innerJoin(usersTable, eq(welfareAssignmentsTable.assignedTo, usersTable.id))
        .where(inArray(welfareAssignmentsTable.caseId, caseIds))
        .orderBy(desc(welfareAssignmentsTable.assignedAt))
    : [];

  const assignMap = new Map<number, any>();
  for (const a of assignments) {
    if (!assignMap.has(a.caseId)) assignMap.set(a.caseId, a);
  }

  return res.json(cases.map(c => ({ ...c, assignment: assignMap.get(c.id) ?? null })));
});

// ─── Admin: case detail ───────────────────────────────────────────────────────
router.get("/welfare/admin/cases/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const detail = await buildCaseDetail(id, true);
  if (!detail) return res.status(404).json({ error: "Case not found" });
  return res.json(detail);
});

// ─── Admin: change priority ───────────────────────────────────────────────────
router.patch("/welfare/admin/cases/:id/priority", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { priority } = req.body;
  if (!priority) return res.status(400).json({ error: "priority required" });

  const [updated] = await db.update(welfareCasesTable)
    .set({ priority, updatedAt: new Date() }).where(eq(welfareCasesTable.id, id)).returning();
  if (!updated) return res.status(404).json({ error: "Case not found" });

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "WELFARE_PRIORITY_CHANGED", model: "welfare_cases", modelId: id,
    newData: { priority, ip },
  });
  return res.json(updated);
});

// ─── Admin: change status ─────────────────────────────────────────────────────
router.patch("/welfare/admin/cases/:id/status", requireAuth, requireRole("admin", "counsellor"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "status required" });

  // Counsellor can only update their assigned case
  if (req.user!.role === "counsellor") {
    const [assign] = await db.select()
      .from(welfareAssignmentsTable)
      .where(and(eq(welfareAssignmentsTable.caseId, id), eq(welfareAssignmentsTable.assignedTo, req.user!.userId)))
      .limit(1);
    if (!assign) return res.status(403).json({ error: "You are not assigned to this case" });
  }

  const [c] = await db.select().from(welfareCasesTable).where(eq(welfareCasesTable.id, id)).limit(1);
  if (!c) return res.status(404).json({ error: "Case not found" });

  const [updated] = await db.update(welfareCasesTable)
    .set({ status, updatedAt: new Date() }).where(eq(welfareCasesTable.id, id)).returning();

  // Notify student
  const [student] = await db.select({ userId: studentsTable.userId })
    .from(studentsTable).where(eq(studentsTable.id, c.studentId)).limit(1);

  const statusMsg: Record<string, string> = {
    assigned:    "Your welfare case has been assigned to a counsellor and is being reviewed.",
    in_progress: "Your welfare case is now in progress. A counsellor is actively working on your case.",
    resolved:    "Your welfare case has been marked as resolved. We hope you are feeling better.",
    closed:      "Your welfare case has been closed.",
  };
  if (student && statusMsg[status]) {
    await createNotification(student.userId, "Welfare Case Update", statusMsg[status], status === "resolved" ? "success" : "info");
  }

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "WELFARE_STATUS_CHANGED", model: "welfare_cases", modelId: id,
    newData: { from: c.status, to: status, ip },
  });

  return res.json(updated);
});

// ─── Admin: assign counsellor ─────────────────────────────────────────────────
router.post("/welfare/admin/cases/:id/assign", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { counsellorId } = req.body;
  if (!counsellorId) return res.status(400).json({ error: "counsellorId required" });

  const [c] = await db.select().from(welfareCasesTable).where(eq(welfareCasesTable.id, id)).limit(1);
  if (!c) return res.status(404).json({ error: "Case not found" });

  const [counsellor] = await db.select().from(usersTable)
    .where(and(eq(usersTable.id, counsellorId), eq(usersTable.role, "counsellor"))).limit(1);
  if (!counsellor) return res.status(404).json({ error: "Counsellor not found" });

  const [assign] = await db.insert(welfareAssignmentsTable).values({
    caseId: id, assignedTo: counsellorId, assignedBy: req.user!.userId,
  }).returning();

  // Update case status to assigned
  await db.update(welfareCasesTable).set({ status: "assigned", updatedAt: new Date() }).where(eq(welfareCasesTable.id, id));

  // Notify counsellor
  await createNotification(counsellorId, "Welfare Case Assigned to You",
    `A welfare case has been assigned to you for review. Please log in to the counsellor portal to review.`, "info");

  // Notify student
  const [student] = await db.select({ userId: studentsTable.userId })
    .from(studentsTable).where(eq(studentsTable.id, c.studentId)).limit(1);
  if (student) {
    await createNotification(student.userId, "Welfare Case Assigned",
      "Your welfare case has been assigned to a counsellor. They will reach out to you shortly.", "info");
  }

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "WELFARE_CASE_ASSIGNED", model: "welfare_assignments", modelId: assign.id,
    newData: { caseId: id, ip },
  });

  return res.status(201).json(assign);
});

// ─── Admin / Counsellor: add note ─────────────────────────────────────────────
router.post("/welfare/cases/:id/notes", requireAuth, requireRole("admin", "counsellor"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { note, isPrivate } = req.body;
  if (!note) return res.status(400).json({ error: "note is required" });

  const [c] = await db.select().from(welfareCasesTable).where(eq(welfareCasesTable.id, id)).limit(1);
  if (!c) return res.status(404).json({ error: "Case not found" });

  // Counsellor must be assigned to this case
  if (req.user!.role === "counsellor") {
    const [assign] = await db.select()
      .from(welfareAssignmentsTable)
      .where(and(eq(welfareAssignmentsTable.caseId, id), eq(welfareAssignmentsTable.assignedTo, req.user!.userId)))
      .limit(1);
    if (!assign) return res.status(403).json({ error: "You are not assigned to this case" });
  }

  const private_ = isPrivate ?? false;
  const [n] = await db.insert(welfareNotesTable).values({
    caseId: id, authorId: req.user!.userId, note, isPrivate: private_,
  }).returning();

  // If shared note, notify student
  if (!private_) {
    const [student] = await db.select({ userId: studentsTable.userId })
      .from(studentsTable).where(eq(studentsTable.id, c.studentId)).limit(1);
    if (student) {
      await createNotification(student.userId, "Response on Your Welfare Case",
        "A counsellor has added a response to your welfare case. Log in to view the update.", "info");
    }
  }

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "WELFARE_NOTE_ADDED", model: "welfare_notes", modelId: n.id,
    newData: { caseId: id, isPrivate: private_, ip },
  });

  return res.status(201).json(n);
});

// ─── Counsellor: assigned cases ───────────────────────────────────────────────
router.get("/welfare/counsellor/my-cases", requireAuth, requireRole("counsellor"), async (req, res) => {
  const assignments = await db.select({ caseId: welfareAssignmentsTable.caseId })
    .from(welfareAssignmentsTable)
    .where(eq(welfareAssignmentsTable.assignedTo, req.user!.userId));

  if (assignments.length === 0) return res.json([]);

  const caseIds = assignments.map(a => a.caseId);
  const cases = await db.select({
    id: welfareCasesTable.id,
    category: welfareCasesTable.category,
    title: welfareCasesTable.title,
    priority: welfareCasesTable.priority,
    status: welfareCasesTable.status,
    isConfidential: welfareCasesTable.isConfidential,
    createdAt: welfareCasesTable.createdAt,
    updatedAt: welfareCasesTable.updatedAt,
    studentName: usersTable.name,
    matricNumber: studentsTable.matricNumber,
    department: studentsTable.department,
  })
    .from(welfareCasesTable)
    .innerJoin(studentsTable, eq(welfareCasesTable.studentId, studentsTable.id))
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(inArray(welfareCasesTable.id, caseIds))
    .orderBy(desc(welfareCasesTable.updatedAt));

  return res.json(cases);
});

// ─── Counsellor: case detail ──────────────────────────────────────────────────
router.get("/welfare/counsellor/cases/:id", requireAuth, requireRole("counsellor"), async (req, res) => {
  const id = parseInt(req.params.id);
  const [assign] = await db.select()
    .from(welfareAssignmentsTable)
    .where(and(eq(welfareAssignmentsTable.caseId, id), eq(welfareAssignmentsTable.assignedTo, req.user!.userId)))
    .limit(1);
  if (!assign) return res.status(403).json({ error: "You are not assigned to this case" });

  const detail = await buildCaseDetail(id, true);
  if (!detail) return res.status(404).json({ error: "Case not found" });
  return res.json(detail);
});

export default router;
