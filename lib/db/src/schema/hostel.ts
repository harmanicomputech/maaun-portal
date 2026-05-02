import { pgTable, serial, integer, text, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { studentsTable } from "./students";
import { usersTable } from "./users";
import { academicSessionsTable } from "./sessions";

export const hostelsTable = pgTable("hostels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gender: text("gender", { enum: ["male", "female", "mixed"] }).notNull().default("mixed"),
  totalRooms: integer("total_rooms").notNull().default(0),
  location: text("location"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roomsTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  hostelId: integer("hostel_id").notNull().references(() => hostelsTable.id, { onDelete: "cascade" }),
  roomNumber: text("room_number").notNull(),
  capacity: integer("capacity").notNull().default(2),
  status: text("status", { enum: ["available", "full", "maintenance"] }).notNull().default("available"),
  floor: integer("floor").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bedSpacesTable = pgTable("bed_spaces", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => roomsTable.id, { onDelete: "cascade" }),
  bedLabel: text("bed_label").notNull(),
  studentId: integer("student_id").references(() => studentsTable.id, { onDelete: "set null" }),
  status: text("status", { enum: ["vacant", "occupied", "reserved"] }).notNull().default("vacant"),
});

export const hostelApplicationsTable = pgTable("hostel_applications", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  sessionId: integer("session_id").references(() => academicSessionsTable.id, { onDelete: "set null" }),
  status: text("status", { enum: ["applied", "under_review", "approved", "rejected", "allocated"] }).notNull().default("applied"),
  priorityScore: real("priority_score").default(0),
  preferredGender: text("preferred_gender", { enum: ["male", "female", "mixed"] }),
  remarks: text("remarks"),
  rejectionReason: text("rejection_reason"),
  reviewedBy: integer("reviewed_by").references(() => usersTable.id, { onDelete: "set null" }),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const hostelAllocationsTable = pgTable("hostel_allocations", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  bedSpaceId: integer("bed_space_id").notNull().references(() => bedSpacesTable.id, { onDelete: "restrict" }),
  allocatedBy: integer("allocated_by").references(() => usersTable.id, { onDelete: "set null" }),
  allocatedAt: timestamp("allocated_at").defaultNow().notNull(),
  status: text("status", { enum: ["active", "moved", "vacated"] }).notNull().default("active"),
  notes: text("notes"),
});

export type Hostel = typeof hostelsTable.$inferSelect;
export type Room = typeof roomsTable.$inferSelect;
export type BedSpace = typeof bedSpacesTable.$inferSelect;
export type HostelApplication = typeof hostelApplicationsTable.$inferSelect;
export type HostelAllocation = typeof hostelAllocationsTable.$inferSelect;
