import { pgTable, serial, integer, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { studentsTable } from "./students";
import { usersTable } from "./users";

export const welfareCasesTable = pgTable("welfare_cases", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  category: text("category", { enum: ["mental_health", "financial_support", "harassment", "academic_stress", "other"] }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).notNull().default("medium"),
  status: text("status", { enum: ["submitted", "assigned", "in_progress", "resolved", "closed"] }).notNull().default("submitted"),
  isConfidential: boolean("is_confidential").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const welfareAssignmentsTable = pgTable("welfare_assignments", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull().references(() => welfareCasesTable.id, { onDelete: "cascade" }),
  assignedTo: integer("assigned_to").notNull().references(() => usersTable.id, { onDelete: "restrict" }),
  assignedBy: integer("assigned_by").notNull().references(() => usersTable.id, { onDelete: "restrict" }),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

export const welfareNotesTable = pgTable("welfare_notes", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull().references(() => welfareCasesTable.id, { onDelete: "cascade" }),
  authorId: integer("author_id").notNull().references(() => usersTable.id, { onDelete: "restrict" }),
  note: text("note").notNull(),
  isPrivate: boolean("is_private").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type WelfareCase = typeof welfareCasesTable.$inferSelect;
export type WelfareAssignment = typeof welfareAssignmentsTable.$inferSelect;
export type WelfareNote = typeof welfareNotesTable.$inferSelect;
