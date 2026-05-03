import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { lecturersTable } from "./lecturers";

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  courseCode: text("course_code").notNull().unique(),
  title: text("title").notNull(),
  unit: integer("unit").notNull(),
  department: text("department").notNull(),
  faculty: text("faculty").notNull(),
  level: text("level", { enum: ["100", "200", "300", "400", "500"] }).notNull(),
  semester: text("semester", { enum: ["first", "second"] }).notNull(),
  description: text("description"),
  lecturerId: integer("lecturer_id").references(() => lecturersTable.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof coursesTable.$inferSelect;
