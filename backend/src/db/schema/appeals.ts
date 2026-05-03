import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { studentsTable } from "./students";
import { usersTable } from "./users";
import { disciplinaryCasesTable } from "./disciplinary";

export const disciplinaryAppealsTable = pgTable("disciplinary_appeals", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull().references(() => disciplinaryCasesTable.id, { onDelete: "cascade" }),
  studentId: integer("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  evidence: text("evidence"),
  status: text("status", { enum: ["submitted", "under_review", "accepted", "rejected"] }).notNull().default("submitted"),
  reviewedBy: integer("reviewed_by").references(() => usersTable.id, { onDelete: "set null" }),
  adminResponse: text("admin_response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const appealDecisionsTable = pgTable("appeal_decisions", {
  id: serial("id").primaryKey(),
  appealId: integer("appeal_id").notNull().references(() => disciplinaryAppealsTable.id, { onDelete: "cascade" }),
  decision: text("decision", { enum: ["uphold", "modify", "dismiss"] }).notNull(),
  modifiedAction: text("modified_action"),
  remarks: text("remarks").notNull(),
  decidedBy: integer("decided_by").notNull().references(() => usersTable.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DisciplinaryAppeal = typeof disciplinaryAppealsTable.$inferSelect;
export type AppealDecision = typeof appealDecisionsTable.$inferSelect;
