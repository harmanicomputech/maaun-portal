import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET || "maaun-university-secret-key-2024";

export interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

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
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden", message: "You do not have permission to perform this action." });
    }
    return next();
  };
}
