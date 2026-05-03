import { Router } from "express";
import { eq, desc, ne } from "drizzle-orm";
import { db, usersTable, studentsTable, lecturersTable, activityLogsTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth-middleware";

const router = Router();

const VALID_ROLES = ["student", "lecturer", "counsellor", "bursar", "registrar", "hod", "dean", "admin", "super_admin"];
const RESTRICTED_ROLES = ["admin", "super_admin"]; // only super_admin can assign these

// ─── List all system users ─────────────────────────────────────────────────
router.get("/admin/users/all", requireAuth, requireRole("admin", "super_admin"), async (req, res) => {
  const { role, search } = req.query;

  let users = await db.select({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
    role: usersTable.role,
    createdAt: usersTable.createdAt,
  })
    .from(usersTable)
    .orderBy(desc(usersTable.createdAt));

  if (role && role !== "all") {
    users = users.filter(u => u.role === role);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  // Attach student/staff context where available
  const enriched = await Promise.all(users.map(async u => {
    if (u.role === "student") {
      const [s] = await db.select({ matricNumber: studentsTable.matricNumber, department: studentsTable.department })
        .from(studentsTable).where(eq(studentsTable.userId, u.id)).limit(1);
      return { ...u, context: s ? `${s.matricNumber} · ${s.department}` : null };
    }
    if (u.role === "lecturer") {
      const [l] = await db.select({ staffId: lecturersTable.staffId, department: lecturersTable.department })
        .from(lecturersTable).where(eq(lecturersTable.userId, u.id)).limit(1);
      return { ...u, context: l ? `${l.staffId} · ${l.department}` : null };
    }
    return { ...u, context: null };
  }));

  return res.json(enriched);
});

// ─── Change a user's role ──────────────────────────────────────────────────
router.patch("/admin/users/:id/role", requireAuth, requireRole("admin", "super_admin"), async (req, res) => {
  const targetId = parseInt(req.params.id);
  const { role } = req.body;

  if (!role || !VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: "Invalid role", validRoles: VALID_ROLES });
  }

  // Only super_admin can assign admin/super_admin roles
  if (RESTRICTED_ROLES.includes(role) && req.user!.role !== "super_admin") {
    return res.status(403).json({ error: "Only super_admin can assign admin or super_admin roles" });
  }

  // Cannot downgrade/change your own role
  if (targetId === req.user!.userId) {
    return res.status(400).json({ error: "You cannot change your own role" });
  }

  const [target] = await db.select().from(usersTable).where(eq(usersTable.id, targetId)).limit(1);
  if (!target) return res.status(404).json({ error: "User not found" });

  // Cannot change another super_admin (unless you are super_admin)
  if (target.role === "super_admin" && req.user!.role !== "super_admin") {
    return res.status(403).json({ error: "Cannot modify a super_admin account" });
  }

  const [updated] = await db.update(usersTable)
    .set({ role, updatedAt: new Date() })
    .where(eq(usersTable.id, targetId))
    .returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email, role: usersTable.role });

  await db.insert(activityLogsTable).values({
    userId: req.user!.userId,
    action: "USER_ROLE_CHANGED",
    model: "users",
    modelId: targetId,
    oldData: { role: target.role },
    newData: { role, changedBy: req.user!.userId },
  });

  return res.json(updated);
});

// ─── Stats for user management dashboard ──────────────────────────────────
router.get("/admin/users/stats", requireAuth, requireRole("admin", "super_admin"), async (req, res) => {
  const users = await db.select({ role: usersTable.role }).from(usersTable);
  const roleCounts: Record<string, number> = {};
  for (const u of users) {
    roleCounts[u.role] = (roleCounts[u.role] ?? 0) + 1;
  }
  return res.json({ total: users.length, byRole: roleCounts });
});

export default router;
