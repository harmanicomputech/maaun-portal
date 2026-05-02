import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, academicSessionsTable, academicSemestersTable } from "@workspace/db";
import { requireAuth } from "../lib/auth-middleware";
import { logActivity } from "../lib/activity-logger";

const router = Router();

router.get("/sessions", requireAuth, async (req, res) => {
  const sessions = await db.select().from(academicSessionsTable).orderBy(academicSessionsTable.id);
  const semesters = await db.select().from(academicSemestersTable);
  const result = sessions.map(s => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    semesters: semesters.filter(sem => sem.sessionId === s.id).map(sem => ({ ...sem, createdAt: sem.createdAt.toISOString() })),
  }));
  return res.json(result);
});

router.get("/sessions/active", async (req, res) => {
  const [session] = await db.select().from(academicSessionsTable).where(eq(academicSessionsTable.isActive, true)).limit(1);
  if (!session) return res.json(null);
  const semesters = await db.select().from(academicSemestersTable).where(eq(academicSemestersTable.sessionId, session.id));
  return res.json({
    ...session,
    createdAt: session.createdAt.toISOString(),
    semesters: semesters.map(s => ({ ...s, createdAt: s.createdAt.toISOString() })),
  });
});

router.post("/sessions", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  const [session] = await db.insert(academicSessionsTable).values({ name, isActive: false }).returning();
  await logActivity(req.user.userId, "create", "session", session.id, null, session);
  return res.status(201).json({ ...session, createdAt: session.createdAt.toISOString(), semesters: [] });
});

router.put("/sessions/:id/activate", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const id = parseInt(req.params.id);
  await db.update(academicSessionsTable).set({ isActive: false });
  const [session] = await db.update(academicSessionsTable).set({ isActive: true }).where(eq(academicSessionsTable.id, id)).returning();
  await logActivity(req.user.userId, "activate", "session", id, null, session);
  return res.json({ ...session, createdAt: session.createdAt.toISOString() });
});

router.delete("/sessions/:id", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  await db.delete(academicSessionsTable).where(eq(academicSessionsTable.id, parseInt(req.params.id)));
  return res.json({ message: "Session deleted" });
});

router.post("/sessions/:sessionId/semesters", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const sessionId = parseInt(req.params.sessionId);
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  const [sem] = await db.insert(academicSemestersTable).values({ name, sessionId, isActive: false }).returning();
  return res.status(201).json({ ...sem, createdAt: sem.createdAt.toISOString() });
});

router.put("/sessions/:sessionId/semesters/:id/activate", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const sessionId = parseInt(req.params.sessionId);
  const id = parseInt(req.params.id);
  await db.update(academicSemestersTable).set({ isActive: false }).where(eq(academicSemestersTable.sessionId, sessionId));
  const [sem] = await db.update(academicSemestersTable).set({ isActive: true }).where(eq(academicSemestersTable.id, id)).returning();
  return res.json({ ...sem, createdAt: sem.createdAt.toISOString() });
});

router.delete("/sessions/:sessionId/semesters/:id", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  await db.delete(academicSemestersTable).where(eq(academicSemestersTable.id, parseInt(req.params.id)));
  return res.json({ message: "Semester deleted" });
});

export default router;
