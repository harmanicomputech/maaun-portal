import { pgTable, serial, text, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const announcementsTable = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdBy: integer("created_by").notNull().references(() => usersTable.id, { onDelete: "restrict" }),
  targetRoles: json("target_roles").$type<string[]>().notNull().default([]),
  targetDepartments: json("target_departments").$type<string[]>(),
  targetLevels: json("target_levels").$type<string[]>(),
  isPinned: boolean("is_pinned").notNull().default(false),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Announcement = typeof announcementsTable.$inferSelect;
