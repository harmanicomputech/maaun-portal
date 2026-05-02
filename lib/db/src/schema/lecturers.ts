import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const lecturersTable = pgTable("lecturers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  staffId: text("staff_id").notNull().unique(),
  department: text("department").notNull(),
  faculty: text("faculty").notNull(),
  designation: text("designation").notNull().default("Lecturer I"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLecturerSchema = createInsertSchema(lecturersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLecturer = z.infer<typeof insertLecturerSchema>;
export type Lecturer = typeof lecturersTable.$inferSelect;
