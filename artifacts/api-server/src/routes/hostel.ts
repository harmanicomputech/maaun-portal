import { Router } from "express";
import { eq, and, desc, inArray, sql, isNull, ne } from "drizzle-orm";
import {
  db, studentsTable, usersTable, enrollmentsTable,
  academicStandingsTable, receiptsTable,
  hostelsTable, roomsTable, bedSpacesTable,
  hostelApplicationsTable, hostelAllocationsTable,
  activityLogsTable, academicSessionsTable, disciplinaryFlagsTable,
} from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth-middleware";
import { createNotification } from "../lib/notification-helper";

const router = Router();

// ─── Eligibility check ────────────────────────────────────────────────────────
async function checkHostelEligibility(studentId: number) {
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId)).limit(1);
  if (!student) return { eligible: false, reason: "Student profile not found" };

  // 1. Academic standing must be "good"
  const [standing] = await db.select()
    .from(academicStandingsTable)
    .where(eq(academicStandingsTable.studentId, studentId))
    .orderBy(desc(academicStandingsTable.generatedAt))
    .limit(1);

  if (!standing) return { eligible: false, reason: "No academic standing record found. Please contact the registry." };
  if (standing.status !== "good") {
    return { eligible: false, reason: `Academic standing is "${standing.status}" — must be "Good Standing" to apply for hostel accommodation.` };
  }

  // 1b. Disciplinary hostel block
  const [hostelBlock] = await db.select()
    .from(disciplinaryFlagsTable)
    .where(and(
      eq(disciplinaryFlagsTable.studentId, studentId),
      eq(disciplinaryFlagsTable.flagType, "hostel_block"),
      eq(disciplinaryFlagsTable.active, true),
    ))
    .limit(1);

  if (hostelBlock) {
    return { eligible: false, reason: "Active disciplinary hostel restriction on your account. Contact the Dean of Students office to resolve." };
  }

  // 2. No outstanding (pending) fees
  const pendingReceipts = await db.select()
    .from(receiptsTable)
    .where(and(eq(receiptsTable.userId, student.userId), eq(receiptsTable.status, "pending")));

  if (pendingReceipts.length > 0) {
    return { eligible: false, reason: `${pendingReceipts.length} pending receipt(s) unconfirmed — clear all outstanding fees before applying.` };
  }

  // 3. Must be enrolled in current session
  const [activeSession] = await db.select().from(academicSessionsTable).where(eq(academicSessionsTable.isActive, true)).limit(1);
  if (activeSession) {
    const enrollments = await db.select()
      .from(enrollmentsTable)
      .where(and(
        eq(enrollmentsTable.studentId, studentId),
        eq(enrollmentsTable.academicYear, activeSession.name),
        eq(enrollmentsTable.status, "active"),
      ))
      .limit(1);
    if (!enrollments[0]) {
      return { eligible: false, reason: `No active enrollment found for the current session (${activeSession.name}). Enroll before applying.` };
    }
  }

  // 4. Cannot already have an active allocation
  const existing = await db.select()
    .from(hostelAllocationsTable)
    .where(and(eq(hostelAllocationsTable.studentId, studentId), eq(hostelAllocationsTable.status, "active")))
    .limit(1);

  if (existing[0]) return { eligible: false, reason: "You already have an active hostel allocation." };

  return { eligible: true, reason: null, student };
}

// ─── Priority score ───────────────────────────────────────────────────────────
function priorityScore(cgpa: number, level: string, confirmedReceipts: number): number {
  const levelMap: Record<string, number> = { "500": 5, "400": 4, "300": 3, "200": 2, "100": 1 };
  return (cgpa * 10) + (levelMap[level] ?? 1) * 2 + Math.min(confirmedReceipts, 5);
}

// ─── PUBLIC: hostel list (for student viewing) ────────────────────────────────
router.get("/hostels", requireAuth, async (req, res) => {
  const hostels = await db.select().from(hostelsTable).where(eq(hostelsTable.isActive, true)).orderBy(hostelsTable.name);

  const rooms = await db.select().from(roomsTable);
  const beds = await db.select().from(bedSpacesTable);

  const hostelData = hostels.map(h => {
    const hostelRooms = rooms.filter(r => r.hostelId === h.id);
    const hostelBeds = beds.filter(b => hostelRooms.some(r => r.id === b.roomId));
    const vacantBeds = hostelBeds.filter(b => b.status === "vacant").length;
    const totalBeds = hostelBeds.length;
    return { ...h, totalBeds, vacantBeds, occupiedBeds: totalBeds - vacantBeds };
  });

  return res.json(hostelData);
});

// ─── Student: check own eligibility ──────────────────────────────────────────
router.get("/hostels/my-eligibility", requireAuth, requireRole("student"), async (req, res) => {
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.userId, req.user!.userId)).limit(1);
  if (!student) return res.status(404).json({ error: "Student profile not found" });

  const result = await checkHostelEligibility(student.id);

  // Get existing application
  const [app] = await db.select()
    .from(hostelApplicationsTable)
    .where(eq(hostelApplicationsTable.studentId, student.id))
    .orderBy(desc(hostelApplicationsTable.createdAt))
    .limit(1);

  // Get active allocation
  const [allocation] = await db.select({
    id: hostelAllocationsTable.id,
    status: hostelAllocationsTable.status,
    allocatedAt: hostelAllocationsTable.allocatedAt,
    bedLabel: bedSpacesTable.bedLabel,
    roomNumber: roomsTable.roomNumber,
    roomFloor: roomsTable.floor,
    hostelName: hostelsTable.name,
    hostelLocation: hostelsTable.location,
    hostelGender: hostelsTable.gender,
  })
    .from(hostelAllocationsTable)
    .innerJoin(bedSpacesTable, eq(hostelAllocationsTable.bedSpaceId, bedSpacesTable.id))
    .innerJoin(roomsTable, eq(bedSpacesTable.roomId, roomsTable.id))
    .innerJoin(hostelsTable, eq(roomsTable.hostelId, hostelsTable.id))
    .where(and(eq(hostelAllocationsTable.studentId, student.id), eq(hostelAllocationsTable.status, "active")))
    .limit(1);

  return res.json({ ...result, application: app ?? null, allocation: allocation ?? null });
});

// ─── Student: apply ───────────────────────────────────────────────────────────
router.post("/hostels/apply", requireAuth, requireRole("student"), async (req, res) => {
  const { preferredGender } = req.body;
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.userId, req.user!.userId)).limit(1);
  if (!student) return res.status(404).json({ error: "Student profile not found" });

  const { eligible, reason } = await checkHostelEligibility(student.id);
  if (!eligible) return res.status(400).json({ error: "Not eligible", message: reason });

  // Check for active application
  const [existing] = await db.select()
    .from(hostelApplicationsTable)
    .where(and(
      eq(hostelApplicationsTable.studentId, student.id),
      inArray(hostelApplicationsTable.status, ["applied", "under_review", "approved", "allocated"]),
    ))
    .limit(1);

  if (existing) return res.status(409).json({ error: "Already applied", message: "You already have an active hostel application.", application: existing });

  const [activeSession] = await db.select().from(academicSessionsTable).where(eq(academicSessionsTable.isActive, true)).limit(1);
  const confirmedCount = await db.select({ count: sql<number>`count(*)` })
    .from(receiptsTable)
    .where(and(eq(receiptsTable.userId, student.userId), eq(receiptsTable.status, "confirmed")));

  const score = priorityScore(student.cgpa ?? 0, student.level, confirmedCount[0]?.count ?? 0);

  const [app] = await db.insert(hostelApplicationsTable).values({
    studentId: student.id,
    sessionId: activeSession?.id ?? null,
    status: "applied",
    priorityScore: score,
    preferredGender: preferredGender ?? null,
  }).returning();

  // Notify admins
  try {
    const admins = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.role, "admin"));
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, student.userId)).limit(1);
    for (const admin of admins) {
      await createNotification(admin.id, "Hostel Application Received", `${user?.name} (${student.matricNumber}) has applied for hostel accommodation.`, "info");
    }
  } catch { /* best-effort */ }

  return res.status(201).json(app);
});

// ─── Admin: list all applications ────────────────────────────────────────────
router.get("/hostels/admin/applications", requireAuth, requireRole("admin"), async (req, res) => {
  const apps = await db.select({
    id: hostelApplicationsTable.id,
    studentId: hostelApplicationsTable.studentId,
    sessionId: hostelApplicationsTable.sessionId,
    status: hostelApplicationsTable.status,
    priorityScore: hostelApplicationsTable.priorityScore,
    preferredGender: hostelApplicationsTable.preferredGender,
    remarks: hostelApplicationsTable.remarks,
    rejectionReason: hostelApplicationsTable.rejectionReason,
    reviewedAt: hostelApplicationsTable.reviewedAt,
    createdAt: hostelApplicationsTable.createdAt,
    studentName: usersTable.name,
    matricNumber: studentsTable.matricNumber,
    department: studentsTable.department,
    faculty: studentsTable.faculty,
    level: studentsTable.level,
    cgpa: studentsTable.cgpa,
  })
    .from(hostelApplicationsTable)
    .innerJoin(studentsTable, eq(hostelApplicationsTable.studentId, studentsTable.id))
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .orderBy(desc(hostelApplicationsTable.priorityScore));

  // Attach allocation if any
  const allocations = await db.select({
    studentId: hostelAllocationsTable.studentId,
    bedLabel: bedSpacesTable.bedLabel,
    roomNumber: roomsTable.roomNumber,
    hostelName: hostelsTable.name,
    status: hostelAllocationsTable.status,
  })
    .from(hostelAllocationsTable)
    .innerJoin(bedSpacesTable, eq(hostelAllocationsTable.bedSpaceId, bedSpacesTable.id))
    .innerJoin(roomsTable, eq(bedSpacesTable.roomId, roomsTable.id))
    .innerJoin(hostelsTable, eq(roomsTable.hostelId, hostelsTable.id))
    .where(eq(hostelAllocationsTable.status, "active"));

  const allocMap = new Map(allocations.map(a => [a.studentId, a]));
  return res.json(apps.map(a => ({ ...a, allocation: allocMap.get(a.studentId) ?? null })));
});

// ─── Admin: approve application ───────────────────────────────────────────────
router.patch("/hostels/applications/:id/approve", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const [app] = await db.select().from(hostelApplicationsTable).where(eq(hostelApplicationsTable.id, id)).limit(1);
  if (!app) return res.status(404).json({ error: "Application not found" });

  const [updated] = await db.update(hostelApplicationsTable)
    .set({ status: "under_review", reviewedBy: req.user!.userId, reviewedAt: new Date() })
    .where(eq(hostelApplicationsTable.id, id))
    .returning();

  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, app.studentId)).limit(1);
  if (student) await createNotification(student.userId, "Hostel Application Under Review", "Your hostel application is now under review. Await room allocation.", "info");

  return res.json(updated);
});

// ─── Admin: reject application ────────────────────────────────────────────────
router.patch("/hostels/applications/:id/reject", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { reason } = req.body;
  if (!reason) return res.status(400).json({ error: "Rejection reason required" });

  const [app] = await db.select().from(hostelApplicationsTable).where(eq(hostelApplicationsTable.id, id)).limit(1);
  if (!app) return res.status(404).json({ error: "Application not found" });

  const [updated] = await db.update(hostelApplicationsTable)
    .set({ status: "rejected", rejectionReason: reason, reviewedBy: req.user!.userId, reviewedAt: new Date() })
    .where(eq(hostelApplicationsTable.id, id))
    .returning();

  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, app.studentId)).limit(1);
  if (student) await createNotification(student.userId, "Hostel Application Rejected", `Your hostel application was rejected. Reason: ${reason}`, "warning");

  return res.json(updated);
});

// ─── Admin: allocate bed to student ──────────────────────────────────────────
router.post("/hostels/allocate", requireAuth, requireRole("admin"), async (req, res) => {
  const { studentId, bedSpaceId, notes } = req.body;
  if (!studentId || !bedSpaceId) return res.status(400).json({ error: "studentId and bedSpaceId are required" });

  // Check bed is vacant
  const [bed] = await db.select().from(bedSpacesTable).where(eq(bedSpacesTable.id, bedSpaceId)).limit(1);
  if (!bed) return res.status(404).json({ error: "Bed space not found" });
  if (bed.status !== "vacant") return res.status(409).json({ error: "Bed space is not vacant" });

  // Check student doesn't already have active allocation
  const [existing] = await db.select()
    .from(hostelAllocationsTable)
    .where(and(eq(hostelAllocationsTable.studentId, studentId), eq(hostelAllocationsTable.status, "active")))
    .limit(1);
  if (existing) return res.status(409).json({ error: "Student already has an active allocation" });

  // Create allocation
  const [allocation] = await db.insert(hostelAllocationsTable).values({
    studentId, bedSpaceId, allocatedBy: req.user!.userId, status: "active", notes: notes ?? null,
  }).returning();

  // Update bed space
  await db.update(bedSpacesTable).set({ studentId, status: "occupied" }).where(eq(bedSpacesTable.id, bedSpaceId));

  // Update room status
  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, bed.roomId)).limit(1);
  if (room) {
    const roomBeds = await db.select().from(bedSpacesTable).where(eq(bedSpacesTable.roomId, room.id));
    const vacantCount = roomBeds.filter(b => b.id !== bedSpaceId && b.status === "vacant").length;
    await db.update(roomsTable).set({ status: vacantCount === 0 ? "full" : "available" }).where(eq(roomsTable.id, room.id));
  }

  // Update application status to allocated
  await db.update(hostelApplicationsTable)
    .set({ status: "allocated", reviewedBy: req.user!.userId, reviewedAt: new Date() })
    .where(and(eq(hostelApplicationsTable.studentId, studentId), inArray(hostelApplicationsTable.status, ["applied", "under_review", "approved"])));

  const [student] = await db.select({ userId: studentsTable.userId }).from(studentsTable).where(eq(studentsTable.id, studentId)).limit(1);
  if (student) await createNotification(student.userId, "Room Allocated!", "You have been allocated a hostel room. Log in to view your room details.", "success");

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "HOSTEL_ALLOCATE", model: "hostel_allocations", modelId: allocation.id,
    newData: { studentId, bedSpaceId, ip },
  });

  return res.status(201).json(allocation);
});

// ─── Admin: vacate a bed ──────────────────────────────────────────────────────
router.patch("/hostels/allocations/:id/vacate", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const [alloc] = await db.select().from(hostelAllocationsTable).where(eq(hostelAllocationsTable.id, id)).limit(1);
  if (!alloc) return res.status(404).json({ error: "Allocation not found" });

  const [updated] = await db.update(hostelAllocationsTable).set({ status: "vacated" }).where(eq(hostelAllocationsTable.id, id)).returning();

  await db.update(bedSpacesTable)
    .set({ studentId: null, status: "vacant" })
    .where(eq(bedSpacesTable.id, alloc.bedSpaceId));

  const [bed] = await db.select().from(bedSpacesTable).where(eq(bedSpacesTable.id, alloc.bedSpaceId)).limit(1);
  if (bed) await db.update(roomsTable).set({ status: "available" }).where(eq(roomsTable.id, bed.roomId));

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "HOSTEL_VACATE", model: "hostel_allocations", modelId: id,
    newData: { ip },
  });

  return res.json(updated);
});

// ─── Admin: auto-allocate (priority engine) ───────────────────────────────────
router.post("/hostels/auto-allocate", requireAuth, requireRole("admin"), async (req, res) => {
  // Get all pending applications sorted by priority
  const apps = await db.select({
    id: hostelApplicationsTable.id,
    studentId: hostelApplicationsTable.studentId,
    priorityScore: hostelApplicationsTable.priorityScore,
    preferredGender: hostelApplicationsTable.preferredGender,
  })
    .from(hostelApplicationsTable)
    .where(inArray(hostelApplicationsTable.status, ["applied", "under_review"]))
    .orderBy(desc(hostelApplicationsTable.priorityScore));

  if (apps.length === 0) return res.json({ allocated: 0, message: "No pending applications" });

  // Get all vacant beds with room and hostel info
  const vacantBeds = await db.select({
    id: bedSpacesTable.id,
    roomId: bedSpacesTable.roomId,
    bedLabel: bedSpacesTable.bedLabel,
    hostelGender: hostelsTable.gender,
    hostelId: hostelsTable.id,
  })
    .from(bedSpacesTable)
    .innerJoin(roomsTable, eq(bedSpacesTable.roomId, roomsTable.id))
    .innerJoin(hostelsTable, eq(roomsTable.hostelId, hostelsTable.id))
    .where(and(eq(bedSpacesTable.status, "vacant"), ne(roomsTable.status, "maintenance"), eq(hostelsTable.isActive, true)));

  // Check who already has active allocations
  const activeAllocs = await db.select({ studentId: hostelAllocationsTable.studentId })
    .from(hostelAllocationsTable).where(eq(hostelAllocationsTable.status, "active"));
  const allocatedStudents = new Set(activeAllocs.map(a => a.studentId));

  let bedQueue = [...vacantBeds];
  let allocated = 0;

  for (const app of apps) {
    if (allocatedStudents.has(app.studentId) || bedQueue.length === 0) continue;

    // Match preferred gender if specified
    let bed = app.preferredGender
      ? bedQueue.find(b => b.hostelGender === app.preferredGender || b.hostelGender === "mixed")
      : bedQueue[0];

    if (!bed) bed = bedQueue[0];
    if (!bed) continue;

    // Allocate
    await db.insert(hostelAllocationsTable).values({
      studentId: app.studentId, bedSpaceId: bed.id,
      allocatedBy: req.user!.userId, status: "active", notes: "Auto-allocated by system",
    });

    await db.update(bedSpacesTable).set({ studentId: app.studentId, status: "occupied" }).where(eq(bedSpacesTable.id, bed.id));

    // Update room status
    const roomBeds = await db.select().from(bedSpacesTable).where(eq(bedSpacesTable.roomId, bed.roomId));
    const vacantLeft = roomBeds.filter(b => b.id !== bed!.id && b.status === "vacant").length;
    await db.update(roomsTable).set({ status: vacantLeft === 0 ? "full" : "available" }).where(eq(roomsTable.id, bed.roomId));

    await db.update(hostelApplicationsTable).set({ status: "allocated", reviewedBy: req.user!.userId, reviewedAt: new Date() }).where(eq(hostelApplicationsTable.id, app.id));

    const [student] = await db.select({ userId: studentsTable.userId }).from(studentsTable).where(eq(studentsTable.id, app.studentId)).limit(1);
    if (student) await createNotification(student.userId, "Room Allocated!", "A hostel room has been automatically allocated to you. Log in to view details.", "success");

    allocatedStudents.add(app.studentId);
    bedQueue = bedQueue.filter(b => b.id !== bed!.id);
    allocated++;
  }

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId, action: "HOSTEL_AUTO_ALLOCATE", model: "hostel_allocations", modelId: 0,
    newData: { allocated, ip },
  });

  return res.json({ allocated, message: `Auto-allocated ${allocated} student(s)` });
});

// ─── Hostels CRUD (admin) ─────────────────────────────────────────────────────
router.get("/hostels/admin/all", requireAuth, requireRole("admin"), async (req, res) => {
  const hostels = await db.select().from(hostelsTable).orderBy(hostelsTable.name);
  return res.json(hostels);
});

router.post("/hostels/admin/hostel", requireAuth, requireRole("admin"), async (req, res) => {
  const { name, gender, totalRooms, location, description } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  const [h] = await db.insert(hostelsTable).values({ name, gender: gender ?? "mixed", totalRooms: totalRooms ?? 0, location, description }).returning();
  return res.status(201).json(h);
});

router.put("/hostels/admin/hostel/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, gender, totalRooms, location, description, isActive } = req.body;
  const [h] = await db.update(hostelsTable).set({ name, gender, totalRooms, location, description, isActive }).where(eq(hostelsTable.id, id)).returning();
  return res.json(h);
});

// ─── Rooms CRUD (admin) ───────────────────────────────────────────────────────
router.get("/hostels/admin/rooms", requireAuth, requireRole("admin"), async (req, res) => {
  const rooms = await db.select({
    id: roomsTable.id,
    hostelId: roomsTable.hostelId,
    roomNumber: roomsTable.roomNumber,
    capacity: roomsTable.capacity,
    status: roomsTable.status,
    floor: roomsTable.floor,
    hostelName: hostelsTable.name,
    hostelGender: hostelsTable.gender,
  })
    .from(roomsTable)
    .innerJoin(hostelsTable, eq(roomsTable.hostelId, hostelsTable.id))
    .orderBy(hostelsTable.name, roomsTable.roomNumber);

  const beds = await db.select().from(bedSpacesTable);
  const bedMap = new Map<number, typeof beds>();
  for (const b of beds) {
    if (!bedMap.has(b.roomId)) bedMap.set(b.roomId, []);
    bedMap.get(b.roomId)!.push(b);
  }

  return res.json(rooms.map(r => ({
    ...r,
    beds: bedMap.get(r.id) ?? [],
    occupiedCount: (bedMap.get(r.id) ?? []).filter(b => b.status === "occupied").length,
  })));
});

router.post("/hostels/admin/room", requireAuth, requireRole("admin"), async (req, res) => {
  const { hostelId, roomNumber, capacity, floor } = req.body;
  if (!hostelId || !roomNumber || !capacity) return res.status(400).json({ error: "hostelId, roomNumber, capacity required" });

  const [room] = await db.insert(roomsTable).values({ hostelId, roomNumber, capacity, floor: floor ?? 1 }).returning();

  // Auto-create bed spaces (A, B, C, D...)
  const labels = ["A", "B", "C", "D", "E", "F", "G", "H"].slice(0, capacity);
  if (labels.length > 0) {
    await db.insert(bedSpacesTable).values(labels.map(l => ({ roomId: room.id, bedLabel: l, status: "vacant" as const })));
  }

  // Update hostel total_rooms count
  const roomCount = await db.select({ count: sql<number>`count(*)` }).from(roomsTable).where(eq(roomsTable.hostelId, hostelId));
  await db.update(hostelsTable).set({ totalRooms: roomCount[0]?.count ?? 0 }).where(eq(hostelsTable.id, hostelId));

  return res.status(201).json(room);
});

router.patch("/hostels/admin/room/:id/status", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const [r] = await db.update(roomsTable).set({ status }).where(eq(roomsTable.id, id)).returning();
  return res.json(r);
});

router.delete("/hostels/admin/room/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(roomsTable).where(eq(roomsTable.id, id));
  return res.json({ message: "Room deleted" });
});

// ─── Admin: all active allocations ───────────────────────────────────────────
router.get("/hostels/admin/allocations", requireAuth, requireRole("admin"), async (req, res) => {
  const allocs = await db.select({
    id: hostelAllocationsTable.id,
    studentId: hostelAllocationsTable.studentId,
    allocatedAt: hostelAllocationsTable.allocatedAt,
    status: hostelAllocationsTable.status,
    notes: hostelAllocationsTable.notes,
    studentName: usersTable.name,
    matricNumber: studentsTable.matricNumber,
    department: studentsTable.department,
    level: studentsTable.level,
    bedLabel: bedSpacesTable.bedLabel,
    roomNumber: roomsTable.roomNumber,
    hostelName: hostelsTable.name,
    hostelGender: hostelsTable.gender,
  })
    .from(hostelAllocationsTable)
    .innerJoin(studentsTable, eq(hostelAllocationsTable.studentId, studentsTable.id))
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .innerJoin(bedSpacesTable, eq(hostelAllocationsTable.bedSpaceId, bedSpacesTable.id))
    .innerJoin(roomsTable, eq(bedSpacesTable.roomId, roomsTable.id))
    .innerJoin(hostelsTable, eq(roomsTable.hostelId, hostelsTable.id))
    .orderBy(desc(hostelAllocationsTable.allocatedAt));

  return res.json(allocs);
});

// ─── Admin: vacant beds list ──────────────────────────────────────────────────
router.get("/hostels/admin/vacant-beds", requireAuth, requireRole("admin"), async (req, res) => {
  const beds = await db.select({
    id: bedSpacesTable.id,
    bedLabel: bedSpacesTable.bedLabel,
    roomId: roomsTable.id,
    roomNumber: roomsTable.roomNumber,
    roomFloor: roomsTable.floor,
    hostelId: hostelsTable.id,
    hostelName: hostelsTable.name,
    hostelGender: hostelsTable.gender,
  })
    .from(bedSpacesTable)
    .innerJoin(roomsTable, eq(bedSpacesTable.roomId, roomsTable.id))
    .innerJoin(hostelsTable, eq(roomsTable.hostelId, hostelsTable.id))
    .where(and(eq(bedSpacesTable.status, "vacant"), ne(roomsTable.status, "maintenance")))
    .orderBy(hostelsTable.name, roomsTable.roomNumber, bedSpacesTable.bedLabel);

  return res.json(beds);
});

export default router;
