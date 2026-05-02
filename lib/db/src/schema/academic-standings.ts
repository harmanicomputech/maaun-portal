import { pgTable, serial, integer, text, real, timestamp } from "drizzle-orm/pg-core";
import { studentsTable } from "./students";

export const academicStandingsTable = pgTable("academic_standings", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  cgpa: real("cgpa").notNull(),
  classification: text("classification").notNull(),
  status: text("status", { enum: ["good", "probation", "withdrawal_risk"] }).notNull(),
  totalUnitsAttempted: integer("total_units_attempted").notNull().default(0),
  totalQualityPoints: real("total_quality_points").notNull().default(0),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

export type AcademicStanding = typeof academicStandingsTable.$inferSelect;
