import { pgTable, serial, text, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const feesTable = pgTable("fees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: integer("amount").notNull(),
  department: text("department"),
  level: text("level"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  feeId: integer("fee_id").notNull().references(() => feesTable.id, { onDelete: "cascade" }),
  reference: text("reference").notNull().unique(),
  amount: integer("amount").notNull(),
  status: text("status", { enum: ["pending", "success", "failed"] }).notNull().default("pending"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFeeSchema = createInsertSchema(feesTable).omit({ id: true, createdAt: true });
export const insertPaymentSchema = createInsertSchema(paymentsTable).omit({ id: true, createdAt: true });
export type InsertFee = z.infer<typeof insertFeeSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Fee = typeof feesTable.$inferSelect;
export type Payment = typeof paymentsTable.$inferSelect;
