import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { coursesTable } from "./courses";
import { lecturersTable } from "./lecturers";
import { academicSessionsTable, academicSemestersTable } from "./sessions";

export const venuesTable = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull().default(50),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const timetablesTable = pgTable("timetables", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  lecturerId: integer("lecturer_id").notNull().references(() => lecturersTable.id, { onDelete: "cascade" }),
  venueId: integer("venue_id").notNull().references(() => venuesTable.id, { onDelete: "cascade" }),
  dayOfWeek: text("day_of_week", { enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] }).notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  sessionId: integer("session_id").references(() => academicSessionsTable.id, { onDelete: "cascade" }),
  semesterId: integer("semester_id").references(() => academicSemestersTable.id, { onDelete: "cascade" }),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Venue = typeof venuesTable.$inferSelect;
export type Timetable = typeof timetablesTable.$inferSelect;
