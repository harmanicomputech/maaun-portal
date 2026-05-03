import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, lecturersTable, usersTable } from "@workspace/db";
import { requireAuth } from "../lib/auth-middleware";

const router = Router();

router.get("/lecturers", requireAuth, async (req, res) => {
  const rows = await db
    .select({
      id: lecturersTable.id,
      userId: lecturersTable.userId,
      name: usersTable.name,
      email: usersTable.email,
      staffId: lecturersTable.staffId,
      department: lecturersTable.department,
      faculty: lecturersTable.faculty,
      designation: lecturersTable.designation,
      createdAt: lecturersTable.createdAt,
    })
    .from(lecturersTable)
    .innerJoin(usersTable, eq(lecturersTable.userId, usersTable.id));

  return res.json(rows.map(l => ({ ...l, createdAt: l.createdAt.toISOString() })));
});

router.get("/lecturers/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const [lecturer] = await db
    .select({
      id: lecturersTable.id,
      userId: lecturersTable.userId,
      name: usersTable.name,
      email: usersTable.email,
      staffId: lecturersTable.staffId,
      department: lecturersTable.department,
      faculty: lecturersTable.faculty,
      designation: lecturersTable.designation,
      createdAt: lecturersTable.createdAt,
    })
    .from(lecturersTable)
    .innerJoin(usersTable, eq(lecturersTable.userId, usersTable.id))
    .where(eq(lecturersTable.id, id))
    .limit(1);

  if (!lecturer) return res.status(404).json({ error: "Not found", message: "Lecturer not found." });
  return res.json({ ...lecturer, createdAt: lecturer.createdAt.toISOString() });
});

export default router;
