import { Router } from "express";
import { eq, and, desc, gt, sql } from "drizzle-orm";
import { db, notificationsTable, usersTable } from "@workspace/db";
import { requireAuth } from "../lib/auth-middleware";

const router = Router();

// ─── GET /notifications/my — delta-aware, returns { notifications, unreadCount }
router.get("/notifications/my", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const since  = req.query.since as string | undefined;
  const limit  = Math.min(parseInt((req.query.limit as string) || "20"), 50);

  const conditions = since
    ? and(eq(notificationsTable.userId, userId), gt(notificationsTable.createdAt, new Date(since)))
    : eq(notificationsTable.userId, userId);

  const [rows, countRows] = await Promise.all([
    db.select().from(notificationsTable).where(conditions)
      .orderBy(desc(notificationsTable.createdAt)).limit(limit),
    db.select({ count: sql<number>`cast(count(*) as integer)` })
      .from(notificationsTable)
      .where(and(eq(notificationsTable.userId, userId), eq(notificationsTable.isRead, false))),
  ]);

  return res.json({
    notifications: rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })),
    unreadCount: countRows[0]?.count ?? 0,
  });
});

// ─── GET /notifications — full list (legacy, kept for student page)
router.get("/notifications", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const rows = await db.select().from(notificationsTable)
    .where(eq(notificationsTable.userId, userId))
    .orderBy(desc(notificationsTable.createdAt)).limit(50);
  return res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

// ─── GET /notifications/unread-count
router.get("/notifications/unread-count", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const [row] = await db.select({ count: sql<number>`cast(count(*) as integer)` })
    .from(notificationsTable)
    .where(and(eq(notificationsTable.userId, userId), eq(notificationsTable.isRead, false)));
  return res.json({ unreadCount: row?.count ?? 0 });
});

// ─── PATCH /notifications/:id/read — mark single (also accepts PUT for compat)
const markOneRead = requireAuth;
const markOneHandler = async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  const userId = req.user!.userId;
  await db.update(notificationsTable).set({ isRead: true })
    .where(and(eq(notificationsTable.id, id), eq(notificationsTable.userId, userId)));
  return res.json({ ok: true });
};
router.patch("/notifications/:id/read", markOneRead, markOneHandler);
router.put("/notifications/:id/read",   markOneRead, markOneHandler);

// ─── PATCH /notifications/read-all (also accepts PUT)
const markAllHandler = async (req: any, res: any) => {
  const userId = req.user!.userId;
  await db.update(notificationsTable).set({ isRead: true })
    .where(eq(notificationsTable.userId, userId));
  return res.json({ ok: true });
};
router.patch("/notifications/read-all", requireAuth, markAllHandler);
router.put("/notifications/read-all",   requireAuth, markAllHandler);

// ─── Admin: user list for broadcast targeting
router.get("/notifications/users", requireAuth, async (req, res) => {
  if (!["admin", "super_admin"].includes(req.user?.role ?? ""))
    return res.status(403).json({ error: "Forbidden" });
  const users = await db.select({
    id: usersTable.id, name: usersTable.name, email: usersTable.email, role: usersTable.role,
  }).from(usersTable);
  return res.json(users);
});

// ─── Admin: broadcast notification
router.post("/notifications/broadcast", requireAuth, async (req, res) => {
  if (!["admin", "super_admin"].includes(req.user?.role ?? ""))
    return res.status(403).json({ error: "Forbidden" });
  const { title, message, type, targetRole } = req.body;
  if (!title || !message) return res.status(400).json({ error: "title and message are required" });

  let users = await db.select({ id: usersTable.id }).from(usersTable);
  if (targetRole && targetRole !== "all") {
    const filtered = await db.select({ id: usersTable.id }).from(usersTable)
      .where(eq(usersTable.role, targetRole));
    users = filtered;
  }
  if (users.length === 0) return res.status(400).json({ error: "No users to notify" });

  const notifs = users.map(u => ({
    userId: u.id, title, message,
    type: (type || "info") as "info" | "success" | "warning" | "payment" | "result" | "enrollment",
    isRead: false,
  }));
  await db.insert(notificationsTable).values(notifs);
  return res.json({ message: `Notification sent to ${notifs.length} users` });
});

export default router;
