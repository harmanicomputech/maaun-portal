import { pgTable, serial, integer, text, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { studentsTable } from "./students";
import { coursesTable } from "./courses";

export const enrollmentsTable = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  semester: text("semester", { enum: ["first", "second"] }).notNull(),
  academicYear: text("academic_year").notNull(),
  status: text("status", { enum: ["active", "dropped", "completed"] }).notNull().default("active"),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
}, (t) => [
  unique("unique_enrollment").on(t.studentId, t.courseId, t.semester, t.academicYear),
]);

export const insertEnrollmentSchema = createInsertSchema(enrollmentsTable).omit({ id: true, enrolledAt: true });
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollmentsTable.$inferSelect;
