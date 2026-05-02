import { pgTable, serial, integer, text, timestamp, boolean, date } from "drizzle-orm/pg-core";
import { studentsTable } from "./students";
import { usersTable } from "./users";

export const disciplinaryCasesTable = pgTable("disciplinary_cases", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  reportedBy: integer("reported_by").notNull().references(() => usersTable.id, { onDelete: "restrict" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity", { enum: ["minor", "moderate", "major", "critical"] }).notNull().default("minor"),
  status: text("status", { enum: ["open", "under_review", "resolved", "dismissed"] }).notNull().default("open"),
  resolutionNote: text("resolution_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const disciplinaryActionsTable = pgTable("disciplinary_actions", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull().references(() => disciplinaryCasesTable.id, { onDelete: "cascade" }),
  actionType: text("action_type", { enum: ["warning", "suspension", "restriction", "expulsion"] }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  remarks: text("remarks"),
  appliedBy: integer("applied_by").notNull().references(() => usersTable.id, { onDelete: "restrict" }),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
});

export const disciplinaryFlagsTable = pgTable("disciplinary_flags", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  flagType: text("flag_type", { enum: ["academic_hold", "hostel_block", "graduation_block", "account_disabled"] }).notNull(),
  active: boolean("active").notNull().default(true),
  relatedCaseId: integer("related_case_id").references(() => disciplinaryCasesTable.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DisciplinaryCase = typeof disciplinaryCasesTable.$inferSelect;
export type DisciplinaryAction = typeof disciplinaryActionsTable.$inferSelect;
export type DisciplinaryFlag = typeof disciplinaryFlagsTable.$inferSelect;
