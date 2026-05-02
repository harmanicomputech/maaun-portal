import { pgTable, serial, integer, text, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { studentsTable } from "./students";
import { usersTable } from "./users";
import { academicSessionsTable } from "./sessions";

export const graduationClearancesTable = pgTable("graduation_clearances", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  cgpa: real("cgpa").notNull().default(0),
  academicStatus: text("academic_status", { enum: ["passed", "failed"] }).notNull(),
  financialStatus: text("financial_status", { enum: ["cleared", "blocked"] }).notNull(),
  adminStatus: text("admin_status", { enum: ["cleared", "pending"] }).notNull(),
  overallStatus: text("overall_status", { enum: ["eligible", "not_eligible"] }).notNull(),
  academicRemarks: text("academic_remarks"),
  financialRemarks: text("financial_remarks"),
  adminRemarks: text("admin_remarks"),
  evaluatedAt: timestamp("evaluated_at").defaultNow().notNull(),
  evaluatedBy: integer("evaluated_by").references(() => usersTable.id, { onDelete: "set null" }),
});

export const graduationApplicationsTable = pgTable("graduation_applications", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  sessionId: integer("session_id").references(() => academicSessionsTable.id, { onDelete: "set null" }),
  status: text("status", { enum: ["applied", "under_review", "approved", "rejected"] }).notNull().default("applied"),
  reviewedBy: integer("reviewed_by").references(() => usersTable.id, { onDelete: "set null" }),
  rejectionReason: text("rejection_reason"),
  adminOverride: boolean("admin_override").default(false),
  overrideReason: text("override_reason"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GraduationClearance = typeof graduationClearancesTable.$inferSelect;
export type GraduationApplication = typeof graduationApplicationsTable.$inferSelect;
