import { Router } from "express";
import { eq, inArray } from "drizzle-orm";
import { randomBytes } from "crypto";
import {
  db, transcriptsTable, studentsTable, usersTable, lecturersTable,
  coursesTable, enrollmentsTable, activityLogsTable,
} from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth-middleware";
import { calculateAcademicStanding } from "../lib/academic-standing-service";

const router = Router();

function generateRef(): string {
  const year = new Date().getFullYear();
  const hex = randomBytes(4).toString("hex").toUpperCase();
  return `MAAUN-TXN-${year}-${hex}`;
}

async function logAudit(userId: number, action: string, modelId: number, extra?: object) {
  await db.insert(activityLogsTable).values({
    userId,
    action,
    model: "transcript",
    modelId,
    newData: extra ?? {},
  });
}

// GET /api/transcripts/verify/:reference — public, no auth required
router.get("/transcripts/verify/:reference", async (req, res) => {
  const { reference } = req.params;

  const rows = await db
    .select({
      id: transcriptsTable.id,
      status: transcriptsTable.status,
      referenceNumber: transcriptsTable.referenceNumber,
      createdAt: transcriptsTable.createdAt,
      finalizedAt: transcriptsTable.finalizedAt,
      studentId: transcriptsTable.studentId,
      studentName: usersTable.name,
      matricNumber: studentsTable.matricNumber,
      department: studentsTable.department,
    })
    .from(transcriptsTable)
    .innerJoin(studentsTable, eq(transcriptsTable.studentId, studentsTable.id))
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(transcriptsTable.referenceNumber, reference))
    .limit(1);

  const tx = rows[0];
  if (!tx) return res.status(404).json({ valid: false, message: "Reference not found in system." });

  const standing = await calculateAcademicStanding(tx.studentId);

  return res.json({
    valid: true,
    isOfficial: tx.status === "official",
    status: tx.status,
    referenceNumber: tx.referenceNumber,
    studentName: tx.studentName,
    matricNumber: tx.matricNumber,
    department: tx.department,
    cgpa: standing?.cgpa ?? null,
    classification: standing?.classification ?? null,
    issuedAt: tx.finalizedAt ?? tx.createdAt,
  });
});

// GET /api/transcripts/my-students — lecturer sees their assigned students
router.get("/transcripts/my-students", requireAuth, requireRole("lecturer"), async (req, res) => {
  const lecturerRows = await db
    .select({ id: lecturersTable.id })
    .from(lecturersTable)
    .where(eq(lecturersTable.userId, req.user!.userId))
    .limit(1);

  const lecturer = lecturerRows[0];
  if (!lecturer) return res.status(404).json({ error: "Lecturer profile not found" });

  const courses = await db
    .select({ id: coursesTable.id })
    .from(coursesTable)
    .where(eq(coursesTable.lecturerId, lecturer.id));

  if (!courses.length) return res.json([]);

  const courseIds = courses.map(c => c.id);
  const enrollments = await db
    .select({ studentId: enrollmentsTable.studentId })
    .from(enrollmentsTable)
    .where(inArray(enrollmentsTable.courseId, courseIds));

  const studentIds = [...new Set(enrollments.map(e => e.studentId))];
  if (!studentIds.length) return res.json([]);

  const students = await db
    .select({
      id: studentsTable.id,
      name: usersTable.name,
      matricNumber: studentsTable.matricNumber,
      department: studentsTable.department,
      level: studentsTable.level,
    })
    .from(studentsTable)
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(inArray(studentsTable.id, studentIds));

  return res.json(students);
});

// GET /api/transcripts — admin lists all transcripts
router.get("/transcripts", requireAuth, requireRole("admin", "lecturer"), async (req, res) => {
  if (req.user!.role !== "admin") return res.json([]);

  const rows = await db
    .select({
      id: transcriptsTable.id,
      referenceNumber: transcriptsTable.referenceNumber,
      status: transcriptsTable.status,
      notes: transcriptsTable.notes,
      createdAt: transcriptsTable.createdAt,
      approvedAt: transcriptsTable.approvedAt,
      finalizedAt: transcriptsTable.finalizedAt,
      studentId: transcriptsTable.studentId,
      generatedBy: transcriptsTable.generatedBy,
      approvedBy: transcriptsTable.approvedBy,
      ipAddress: transcriptsTable.ipAddress,
      studentName: usersTable.name,
      matricNumber: studentsTable.matricNumber,
      department: studentsTable.department,
      level: studentsTable.level,
    })
    .from(transcriptsTable)
    .innerJoin(studentsTable, eq(transcriptsTable.studentId, studentsTable.id))
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .orderBy(transcriptsTable.createdAt);

  return res.json(rows);
});

// POST /api/transcripts — generate a transcript request
router.post("/transcripts", requireAuth, requireRole("admin", "lecturer"), async (req, res) => {
  const { studentId } = req.body;
  if (!studentId) return res.status(400).json({ error: "studentId required" });

  const studentRows = await db
    .select({ id: studentsTable.id })
    .from(studentsTable)
    .where(eq(studentsTable.id, studentId))
    .limit(1);

  if (!studentRows[0]) return res.status(404).json({ error: "Student not found" });

  const ref = generateRef();
  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";

  const inserted = await db.insert(transcriptsTable).values({
    studentId,
    generatedBy: req.user!.userId,
    status: req.user!.role === "admin" ? "pending" : "draft",
    referenceNumber: ref,
    ipAddress: ip,
  }).returning();

  const tx = inserted[0];
  await logAudit(req.user!.userId, "TRANSCRIPT_GENERATED", tx.id, { ref, role: req.user!.role, ip });

  return res.status(201).json(tx);
});

// GET /api/transcripts/:id — full detail with standing data
router.get("/transcripts/:id", requireAuth, requireRole("admin", "lecturer"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const rows = await db
    .select()
    .from(transcriptsTable)
    .where(eq(transcriptsTable.id, id))
    .limit(1);

  const tx = rows[0];
  if (!tx) return res.status(404).json({ error: "Transcript not found" });

  const [standing, genUser, appUser] = await Promise.all([
    calculateAcademicStanding(tx.studentId),
    db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, tx.generatedBy)).limit(1),
    tx.approvedBy
      ? db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, tx.approvedBy)).limit(1)
      : Promise.resolve([]),
  ]);

  return res.json({
    ...tx,
    generatedByName: genUser[0]?.name ?? "Unknown",
    approvedByName: appUser[0]?.name ?? null,
    standing,
  });
});

// PATCH /api/transcripts/:id/status — admin approves/finalizes
router.patch("/transcripts/:id/status", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const { status, notes } = req.body;
  const allowed = ["draft", "pending", "approved", "official"];
  if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status" });

  const existing = await db.select().from(transcriptsTable).where(eq(transcriptsTable.id, id)).limit(1);
  if (!existing[0]) return res.status(404).json({ error: "Not found" });
  if (existing[0].status === "official") return res.status(400).json({ error: "Official transcripts cannot be modified" });

  const updates: Record<string, unknown> = {
    status,
    notes: notes ?? existing[0].notes,
    updatedAt: new Date(),
  };
  if (status === "approved") {
    updates.approvedBy = req.user!.userId;
    updates.approvedAt = new Date();
  }
  if (status === "official") {
    updates.approvedBy = req.user!.userId;
    updates.approvedAt = updates.approvedAt ?? new Date();
    updates.finalizedAt = new Date();
  }

  const updated = await db
    .update(transcriptsTable)
    .set(updates as any)
    .where(eq(transcriptsTable.id, id))
    .returning();

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await logAudit(req.user!.userId, `TRANSCRIPT_${status.toUpperCase()}`, id, { status, ip });

  return res.json(updated[0]);
});

export default router;
