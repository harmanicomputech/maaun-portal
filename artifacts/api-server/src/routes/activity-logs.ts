import { Router } from "express";
import { desc, eq } from "drizzle-orm";
import { db, activityLogsTable, usersTable } from "@workspace/db";
import { requireAuth } from "../lib/auth-middleware";

const router = Router();

router.get("/activity-logs", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
  const offset = parseInt(req.query.offset as string) || 0;

  const logs = await db
    .select({
      id: activityLogsTable.id,
      userId: activityLogsTable.userId,
      action: activityLogsTable.action,
      model: activityLogsTable.model,
      modelId: activityLogsTable.modelId,
      oldData: activityLogsTable.oldData,
      newData: activityLogsTable.newData,
      createdAt: activityLogsTable.createdAt,
      userName: usersTable.name,
      userEmail: usersTable.email,
      userRole: usersTable.role,
    })
    .from(activityLogsTable)
    .leftJoin(usersTable, eq(activityLogsTable.userId, usersTable.id))
    .orderBy(desc(activityLogsTable.createdAt))
    .limit(limit)
    .offset(offset);

  return res.json(logs.map(l => ({ ...l, createdAt: l.createdAt.toISOString() })));
});

export default router;
