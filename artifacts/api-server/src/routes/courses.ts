import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, coursesTable, lecturersTable, usersTable } from "@workspace/db";
import { CreateCourseBody } from "@workspace/api-zod";
import { requireAuth, requireRole } from "../lib/auth-middleware";

const router = Router();

router.get("/courses", async (req, res) => {
  const { department, level, semester } = req.query;

  let query = db
    .select({
      id: coursesTable.id,
      courseCode: coursesTable.courseCode,
      title: coursesTable.title,
      unit: coursesTable.unit,
      department: coursesTable.department,
      faculty: coursesTable.faculty,
      level: coursesTable.level,
      semester: coursesTable.semester,
      description: coursesTable.description,
      lecturerId: coursesTable.lecturerId,
      lecturerName: usersTable.name,
      createdAt: coursesTable.createdAt,
    })
    .from(coursesTable)
    .leftJoin(lecturersTable, eq(coursesTable.lecturerId, lecturersTable.id))
    .leftJoin(usersTable, eq(lecturersTable.userId, usersTable.id));

  const courses = await query;

  let filtered = courses;
  if (department) filtered = filtered.filter(c => c.department === department);
  if (level) filtered = filtered.filter(c => c.level === level);
  if (semester) filtered = filtered.filter(c => c.semester === semester);

  return res.json(filtered.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  })));
});

router.get("/courses/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [course] = await db
    .select({
      id: coursesTable.id,
      courseCode: coursesTable.courseCode,
      title: coursesTable.title,
      unit: coursesTable.unit,
      department: coursesTable.department,
      faculty: coursesTable.faculty,
      level: coursesTable.level,
      semester: coursesTable.semester,
      description: coursesTable.description,
      lecturerId: coursesTable.lecturerId,
      lecturerName: usersTable.name,
      createdAt: coursesTable.createdAt,
    })
    .from(coursesTable)
    .leftJoin(lecturersTable, eq(coursesTable.lecturerId, lecturersTable.id))
    .leftJoin(usersTable, eq(lecturersTable.userId, usersTable.id))
    .where(eq(coursesTable.id, id))
    .limit(1);

  if (!course) return res.status(404).json({ error: "Not found", message: "Course not found." });
  return res.json({ ...course, createdAt: course.createdAt.toISOString() });
});

router.post("/courses", requireAuth, requireRole("admin", "super_admin", "lecturer", "hod", "dean", "registrar"), async (req, res) => {
  const parsed = CreateCourseBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", message: parsed.error.message });
  }

  const [course] = await db.insert(coursesTable).values(parsed.data).returning();
  return res.status(201).json({ ...course, createdAt: course.createdAt.toISOString(), lecturerName: null });
});

router.put("/courses/:id", requireAuth, requireRole("admin", "super_admin", "lecturer", "hod", "dean", "registrar"), async (req, res) => {
  const id = parseInt(req.params.id);
  const parsed = CreateCourseBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", message: parsed.error.message });
  }

  const [course] = await db.update(coursesTable).set({ ...parsed.data, updatedAt: new Date() }).where(eq(coursesTable.id, id)).returning();
  if (!course) return res.status(404).json({ error: "Not found", message: "Course not found." });
  return res.json({ ...course, createdAt: course.createdAt.toISOString(), lecturerName: null });
});

router.delete("/courses/:id", requireAuth, requireRole("admin", "super_admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(coursesTable).where(eq(coursesTable.id, id));
  return res.json({ message: "Course deleted successfully." });
});

export default router;
