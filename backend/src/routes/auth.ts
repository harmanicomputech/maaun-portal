import { Router } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { db, usersTable, studentsTable, lecturersTable } from "@workspace/db";
import { RegisterBody, LoginBody } from "@workspace/api-zod";

const router = Router();

const JWT_SECRET =
  process.env.SESSION_SECRET || "maaun-university-secret-key-2024";

/**
 * Helpers
 */
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

/**
 * REGISTER
 */
router.post("/auth/register", async (req, res) => {
  try {
    const parsed = RegisterBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        message: parsed.error.message,
      });
    }

    const { name, email, password, role } = parsed.data;

    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existing.length > 0) {
      return res.status(400).json({
        error: "Email already registered",
        message: "This email is already in use.",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password_hash,
        role,
      })
      .returning();

    let studentProfile = null;
    let lecturerProfile = null;

    if (role === "student") {
      const year = new Date().getFullYear().toString();

      const [student] = await db
        .insert(studentsTable)
        .values({
          userId: user.id,
          matricNumber: generateMatricNumber("CSC", year),
          department: "Computer Science",
          faculty: "Science and Technology",
          level: "100",
          enrollmentYear: year,
        })
        .returning();

      studentProfile = {
        ...student,
        name: user.name,
        email: user.email,
      };
    }

    if (role === "lecturer") {
      const [lecturer] = await db
        .insert(lecturersTable)
        .values({
          userId: user.id,
          staffId: generateStaffId("CSC"),
          department: "Computer Science",
          faculty: "Science and Technology",
          designation: "Lecturer I",
        })
        .returning();

      lecturerProfile = {
        ...lecturer,
        name: user.name,
        email: user.email,
      };
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
          ? new Date(user.createdAt).toISOString()
          : null,
        studentProfile,
        lecturerProfile,
      },
      token,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * LOGIN
 */
router.post("/auth/login", async (req, res) => {
  try {
    const parsed = LoginBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        message: parsed.error.message,
      });
    }

    const { email, password } = parsed.data;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Email or password is incorrect.",
      });
    }

    // FIXED: correct column name
    if (!user.password_hash) {
      return res.status(500).json({
        error: "Server error",
        message: "User password is not set.",
      });
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Email or password is incorrect.",
      });
    }

    let studentProfile = null;
    let lecturerProfile = null;

    if (user.role === "student") {
      const [s] = await db
        .select()
        .from(studentsTable)
        .where(eq(studentsTable.userId, user.id))
        .limit(1);

      if (s) {
        studentProfile = { ...s, name: user.name, email: user.email };
      }
    }

    if (user.role === "lecturer") {
      const [l] = await db
        .select()
        .from(lecturersTable)
        .where(eq(lecturersTable.userId, user.id))
        .limit(1);

      if (l) {
        lecturerProfile = { ...l, name: user.name, email: user.email };
      }
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
          ? new Date(user.createdAt).toISOString()
          : null,
        studentProfile,
        lecturerProfile,
      },
      token,
    });
} catch (err) {
  console.error("LOGIN REAL ERROR:", err);

  return res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong during login."
        : String(err),
  });
}

});

export default router;