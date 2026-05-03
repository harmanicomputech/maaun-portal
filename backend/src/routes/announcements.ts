import { Router } from "express";
import { eq, desc, sql } from "drizzle-orm";
import {
  db, usersTable, studentsTable, activityLogsTable, announcementsTable,
} from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth-middleware";

const router = Router();

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getStudentContext(userId: number): Promise<{ department: string; level: string } | null> {
  const [s] = await db.select({ department: studentsTable.department, level: studentsTable.level })
    .from(studentsTable).where(eq(studentsTable.userId, userId)).limit(1);
  return s ?? null;
}

function isAnnouncementVisible(
  ann: { targetRoles: string[]; targetDepartments: string[] | null; targetLevels: string[] | null; expiresAt: Date | null },
  role: string,
  department?: string,
  level?: string
): boolean {
  if (ann.expiresAt && ann.expiresAt < new Date()) return false;
  if (!ann.targetRoles.includes(role)) return false;
  if (ann.targetDepartments && ann.targetDepartments.length > 0) {
    if (!department || !ann.targetDepartments.includes(department)) return false;
  }
  if (ann.targetLevels && ann.targetLevels.length > 0) {
    if (!level || !ann.targetLevels.includes(level)) return false;
  }
  return true;
}

// ─── GET /api/announcements — targeted for current user ────────────────────
router.get("/announcements", requireAuth, async (req, res) => {
  const { role, userId } = req.user!;
  const { pinned } = req.query;

  let department: string | undefined;
  let level: string | undefined;

  if (role === "student") {
    const ctx = await getStudentContext(userId);
    if (ctx) { department = ctx.department; level = ctx.level; }
  }

  const allAnn = await db.select({
    id: announcementsTable.id,
    title: announcementsTable.title,
    content: announcementsTable.content,
    targetRoles: announcementsTable.targetRoles,
    targetDepartments: announcementsTable.targetDepartments,
    targetLevels: announcementsTable.targetLevels,
    isPinned: announcementsTable.isPinned,
    expiresAt: announcementsTable.expiresAt,
    createdAt: announcementsTable.createdAt,
    createdByName: usersTable.name,
  })
    .from(announcementsTable)
    .innerJoin(usersTable, eq(announcementsTable.createdBy, usersTable.id))
    .orderBy(desc(announcementsTable.isPinned), desc(announcementsTable.createdAt));

  let visible = allAnn.filter(a => isAnnouncementVisible(a as any, role, department, level));

  if (pinned === "true") visible = visible.filter(a => a.isPinned);

  return res.json(visible.slice(0, 50));
});

// ─── Admin: all announcements ─────────────────────────────────────────────────
router.get("/announcements/admin/all", requireAuth, requireRole("admin", "super_admin"), async (req, res) => {
  const announcements = await db.select({
    id: announcementsTable.id,
    title: announcementsTable.title,
    content: announcementsTable.content,
    targetRoles: announcementsTable.targetRoles,
    targetDepartments: announcementsTable.targetDepartments,
    targetLevels: announcementsTable.targetLevels,
    isPinned: announcementsTable.isPinned,
    expiresAt: announcementsTable.expiresAt,
    createdAt: announcementsTable.createdAt,
    updatedAt: announcementsTable.updatedAt,
    createdByName: usersTable.name,
    createdBy: announcementsTable.createdBy,
  })
    .from(announcementsTable)
    .innerJoin(usersTable, eq(announcementsTable.createdBy, usersTable.id))
    .orderBy(desc(announcementsTable.isPinned), desc(announcementsTable.createdAt));

  const now = new Date();
  return res.json(announcements.map(a => ({
    ...a,
    isExpired: a.expiresAt ? a.expiresAt < now : false,
  })));
});

// ─── Admin: create announcement ────────────────────────────────────────────────
router.post("/announcements/admin", requireAuth, requireRole("admin", "super_admin"), async (req, res) => {
  const { title, content, targetRoles, targetDepartments, targetLevels, isPinned, expiresAt } = req.body;

  if (!title || !content || !targetRoles?.length) {
    return res.status(400).json({ error: "title, content, and targetRoles are required" });
  }

  // Enforce max 3 pinned at a time
  if (isPinned) {
    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(announcementsTable).where(eq(announcementsTable.isPinned, true));
    if (Number(count) >= 3) {
      return res.status(400).json({ error: "Maximum 3 pinned announcements allowed. Unpin one first." });
    }
  }

  const [ann] = await db.insert(announcementsTable).values({
    title,
    content,
    createdBy: req.user!.userId,
    targetRoles,
    targetDepartments: targetDepartments?.length ? targetDepartments : null,
    targetLevels: targetLevels?.length ? targetLevels : null,
    isPinned: isPinned ?? false,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
  }).returning();

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId,
    action: "ANNOUNCEMENT_CREATED",
    model: "announcements",
    modelId: ann.id,
    newData: { title, targetRoles, isPinned, ip },
  });

  return res.status(201).json(ann);
});

// ─── Admin: update announcement ────────────────────────────────────────────────
router.patch("/announcements/admin/:id", requireAuth, requireRole("admin", "super_admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content, targetRoles, targetDepartments, targetLevels, isPinned, expiresAt } = req.body;

  const [existing] = await db.select().from(announcementsTable).where(eq(announcementsTable.id, id)).limit(1);
  if (!existing) return res.status(404).json({ error: "Announcement not found" });

  // Enforce max 3 pinned (only if trying to pin a currently unpinned one)
  if (isPinned && !existing.isPinned) {
    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(announcementsTable).where(eq(announcementsTable.isPinned, true));
    if (Number(count) >= 3) {
      return res.status(400).json({ error: "Maximum 3 pinned announcements allowed. Unpin one first." });
    }
  }

  const updateData: Partial<typeof announcementsTable.$inferInsert> = { updatedAt: new Date() };
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (targetRoles !== undefined) updateData.targetRoles = targetRoles;
  if (targetDepartments !== undefined) updateData.targetDepartments = targetDepartments?.length ? targetDepartments : null;
  if (targetLevels !== undefined) updateData.targetLevels = targetLevels?.length ? targetLevels : null;
  if (isPinned !== undefined) updateData.isPinned = isPinned;
  if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;

  const [updated] = await db.update(announcementsTable).set(updateData).where(eq(announcementsTable.id, id)).returning();
  return res.json(updated);
});

// ─── Admin: delete announcement ────────────────────────────────────────────────
router.delete("/announcements/admin/:id", requireAuth, requireRole("admin", "super_admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const [existing] = await db.select().from(announcementsTable).where(eq(announcementsTable.id, id)).limit(1);
  if (!existing) return res.status(404).json({ error: "Announcement not found" });

  await db.delete(announcementsTable).where(eq(announcementsTable.id, id));

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "ANNOUNCEMENT_DELETED", model: "announcements", modelId: id,
    newData: { title: existing.title, ip },
  });

  return res.json({ success: true });
});

export default router;
