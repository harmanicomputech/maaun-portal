import { pgTable, serial, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const academicSessionsTable = pgTable("academic_sessions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const academicSemestersTable = pgTable("academic_semesters", {
  id: serial("id").primaryKey(),
  name: text("name", { enum: ["First Semester", "Second Semester"] }).notNull(),
  sessionId: integer("session_id").notNull().references(() => academicSessionsTable.id, { onDelete: "cascade" }),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSessionSchema = createInsertSchema(academicSessionsTable).omit({ id: true, createdAt: true });
export const insertSemesterSchema = createInsertSchema(academicSemestersTable).omit({ id: true, createdAt: true });
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type InsertSemester = z.infer<typeof insertSemesterSchema>;
export type AcademicSession = typeof academicSessionsTable.$inferSelect;
export type AcademicSemester = typeof academicSemestersTable.$inferSelect;
