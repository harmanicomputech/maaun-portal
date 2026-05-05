import { Router } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, usersTable, studentsTable, lecturersTable } from "@workspace/db";
import { RegisterBody, LoginBody } from "@workspace/api-zod";

const router = Router();

const JWT_SECRET = process.env.SESSION_SECRET || "maaun-university-secret-key-2024";

function generateMatricNumber(dept: string, year: string) {
  const deptCode = dept.substring(0, 3).toUpperCase();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `MAAUN/${year}/${deptCode}/${random}`;
}

function generateStaffId(dept: string) {
  const deptCode = dept.substring(0, 3).toUpperCase();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `STAFF/${deptCode}/${random}`;
}

router.post("/auth/register", async (req, res) => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", message: parsed.error.message });
  }

  const { name, email, password, role } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    return res.status(400).json({ error: "Email already registered", message: "This email is already in use." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(usersTable).values({ name, email, passwordHash, role }).returning();

  let studentProfile = null;
  let lecturerProfile = null;

  if (role === "student") {
    const year = new Date().getFullYear().toString();
    const [student] = await db.insert(studentsTable).values({
      userId: user.id,
      matricNumber: generateMatricNumber("CSC", year),
      department: "Computer Science",
      faculty: "Science and Technology",
      level: "100",
      enrollmentYear: year,
    }).returning();
    studentProfile = { ...student, name: user.name, email: user.email };
  } else if (role === "lecturer") {
    const [lecturer] = await db.insert(lecturersTable).values({
      userId: user.id,
      staffId: generateStaffId("CSC"),
      department: "Computer Science",
      faculty: "Science and Technology",
      designation: "Lecturer I",
    }).returning();
    lecturerProfile = { ...lecturer, name: user.name, email: user.email };
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

  return res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      studentProfile,
      lecturerProfile,
    },
    token,
  });
});

router.post("/auth/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", message: parsed.error.message });
  }

  const { email, password } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials", message: "Email or password is incorrect." });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials", message: "Email or password is incorrect." });
  }

  let studentProfile = null;
  let lecturerProfile = null;

  if (user.role === "student") {
    const [s] = await db.select().from(studentsTable).where(eq(studentsTable.userId, user.id)).limit(1);
    if (s) studentProfile = { ...s, name: user.name, email: user.email };
  } else if (user.role === "lecturer") {
    const [l] = await db.select().from(lecturersTable).where(eq(lecturersTable.userId, user.id)).limit(1);
    if (l) lecturerProfile = { ...l, name: user.name, email: user.email };
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      studentProfile,
      lecturerProfile,
    },
    token,
  });
});

router.post("/auth/logout", (req, res) => {
  return res.json({ message: "Logged out successfully" });
});

router.get("/auth/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized", message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId)).limit(1);
    if (!user) return res.status(401).json({ error: "User not found", message: "Token invalid." });

    let studentProfile = null;
    let lecturerProfile = null;

    if (user.role === "student") {
      const [s] = await db.select().from(studentsTable).where(eq(studentsTable.userId, user.id)).limit(1);
      if (s) studentProfile = { ...s, name: user.name, email: user.email };
    } else if (user.role === "lecturer") {
      const [l] = await db.select().from(lecturersTable).where(eq(lecturersTable.userId, user.id)).limit(1);
      if (l) lecturerProfile = { ...l, name: user.name, email: user.email };
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      studentProfile,
      lecturerProfile,
    });
  } catch {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid or expired token." });
  }
});

export default router;
