import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET || "maaun-university-secret-key-2024";

export interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

// ─── Permission map (code-based — no DB join required) ─────────────────────
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  student: [
    "view_courses", "view_timetable", "view_payments",
    "create_welfare_case", "view_own_welfare_cases",
  ],
  lecturer: [
    "view_courses", "manage_courses", "enter_results", "view_timetable",
  ],
  counsellor: [
    "view_assigned_welfare_cases", "manage_welfare_cases",
    "add_private_notes", "add_shared_notes", "close_welfare_cases",
    "view_announcements",
  ],
  bursar: [
    "view_payments", "confirm_payments", "reverse_payments", "view_financial_reports",
    "view_announcements",
  ],
  registrar: [
    "approve_results", "approve_graduation", "view_courses", "manage_courses",
    "view_transcripts", "view_announcements",
  ],
  hod: [
    "view_courses", "manage_courses", "enter_results", "approve_results", "view_timetable",
    "view_announcements",
  ],
  dean: [
    "view_courses", "approve_results", "approve_graduation", "view_timetable",
    "view_announcements",
  ],
  admin: [
    "view_courses", "manage_courses", "enter_results", "approve_results",
    "view_payments", "confirm_payments", "reverse_payments", "view_financial_reports",
    "manage_disciplinary_cases", "apply_sanctions", "review_appeals",
    "create_welfare_case", "view_own_welfare_cases", "assign_welfare_cases",
    "manage_welfare_cases", "add_private_notes", "add_shared_notes", "close_welfare_cases",
    "manage_hostels", "allocate_rooms",
    "evaluate_clearance", "approve_graduation",
    "manage_users", "assign_roles", "view_audit_logs",
    "view_timetable", "view_transcripts",
  ],
  super_admin: ["full_access"],
};

export function hasPermission(role: string, permission: string): boolean {
  if (role === "super_admin") return true;
  return (ROLE_PERMISSIONS[role] ?? []).includes(permission);
}

// ─── Middleware factories ───────────────────────────────────────────────────
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized", message: "Authentication required." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid or expired token." });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    // super_admin bypasses all role checks
    if (req.user.role === "super_admin") return next();
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden", message: "You do not have permission to perform this action." });
    }
    return next();
  };
}

export function requirePermission(permission: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ error: "Forbidden", message: `Permission required: ${permission}` });
    }
    return next();
  };
}
