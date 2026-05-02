import { pgTable, serial, integer, text, timestamp, real } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { paymentsTable, feesTable } from "./fees";

export const receiptsTable = pgTable("receipts", {
  id: serial("id").primaryKey(),
  paymentId: integer("payment_id").notNull().references(() => paymentsTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  referenceNumber: text("reference_number").notNull().unique(),
  amount: integer("amount").notNull(),
  feeName: text("fee_name").notNull(),
  status: text("status", { enum: ["pending", "confirmed", "reversed"] }).notNull().default("pending"),
  issuedBy: integer("issued_by").references(() => usersTable.id, { onDelete: "set null" }),
  issuedAt: timestamp("issued_at"),
  reversedAt: timestamp("reversed_at"),
  reversalReason: text("reversal_reason"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const financialLedgerTable = pgTable("financial_ledger", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["credit", "debit"] }).notNull(),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  relatedPaymentId: integer("related_payment_id").references(() => paymentsTable.id, { onDelete: "set null" }),
  relatedReceiptId: integer("related_receipt_id").references(() => receiptsTable.id, { onDelete: "set null" }),
  balanceAfter: integer("balance_after").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Receipt = typeof receiptsTable.$inferSelect;
export type FinancialLedger = typeof financialLedgerTable.$inferSelect;
