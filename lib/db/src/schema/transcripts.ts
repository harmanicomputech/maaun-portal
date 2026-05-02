import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { studentsTable } from "./students";
import { usersTable } from "./users";

export const transcriptsTable = pgTable("transcripts", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  generatedBy: integer("generated_by").notNull().references(() => usersTable.id, { onDelete: "restrict" }),
  approvedBy: integer("approved_by").references(() => usersTable.id, { onDelete: "set null" }),
  status: text("status", { enum: ["draft", "pending", "approved", "official"] }).notNull().default("draft"),
  referenceNumber: text("reference_number").notNull().unique(),
  ipAddress: text("ip_address"),
  notes: text("notes"),
  approvedAt: timestamp("approved_at"),
  finalizedAt: timestamp("finalized_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Transcript = typeof transcriptsTable.$inferSelect;
