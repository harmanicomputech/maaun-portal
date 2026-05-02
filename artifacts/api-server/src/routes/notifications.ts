import { Router } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, notificationsTable, usersTable } from "@workspace/db";
import { requireAuth } from "../lib/auth-middleware";

const router = Router();

router.get("/notifications", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const rows = await db
    .select()
    .from(notificationsTable)
    .where(eq(notificationsTable.userId, userId))
    .orderBy(desc(notificationsTable.createdAt))
    .limit(50);
  return res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.put("/notifications/:id/read", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const userId = req.user!.userId;
  await db.update(notificationsTable).set({ isRead: true })
    .where(and(eq(notificationsTable.id, id), eq(notificationsTable.userId, userId)));
  return res.json({ message: "Marked as read" });
});

router.put("/notifications/read-all", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  await db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.userId, userId));
  return res.json({ message: "All marked as read" });
});

// Admin: get all users to target broadcast
router.get("/notifications/users", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const users = await db.select({ id: usersTable.id, name: usersTable.name, email: usersTable.email, role: usersTable.role }).from(usersTable);
  return res.json(users);
});

// Admin: broadcast notification
router.post("/notifications/broadcast", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const { title, message, type, targetRole } = req.body;
  if (!title || !message) return res.status(400).json({ error: "title and message are required" });

  let users = await db.select({ id: usersTable.id }).from(usersTable);
  if (targetRole && targetRole !== "all") {
    users = users.filter(u => (u as any).role === targetRole);
    // Re-query with role filter
    const filtered = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.role, targetRole));
    users = filtered;
  }

  if (users.length === 0) return res.status(400).json({ error: "No users to notify" });

  const notifs = users.map(u => ({
    userId: u.id,
    title,
    message,
    type: (type || "info") as "info" | "success" | "warning" | "payment" | "result" | "enrollment",
    isRead: false,
  }));

  await db.insert(notificationsTable).values(notifs);
  return res.json({ message: `Notification sent to ${notifs.length} users` });
});

export default router;
