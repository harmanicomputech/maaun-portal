import { pgTable, serial, integer, text, timestamp, real, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { studentsTable } from "./students";
import { coursesTable } from "./courses";

export const resultsTable = pgTable("results", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  semester: text("semester", { enum: ["first", "second"] }).notNull(),
  academicYear: text("academic_year").notNull(),
  caScore: real("ca_score"),
  examScore: real("exam_score"),
  totalScore: real("total_score"),
  grade: text("grade"),
  gradePoint: real("grade_point"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  unique("unique_result").on(t.studentId, t.courseId, t.semester, t.academicYear),
]);

export const insertResultSchema = createInsertSchema(resultsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertResult = z.infer<typeof insertResultSchema>;
export type Result = typeof resultsTable.$inferSelect;
