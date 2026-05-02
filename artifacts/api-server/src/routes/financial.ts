import { Router } from "express";
import { eq, and, desc, sql } from "drizzle-orm";
import { randomBytes } from "crypto";
import {
  db, receiptsTable, financialLedgerTable, paymentsTable, feesTable,
  usersTable, studentsTable, activityLogsTable,
} from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth-middleware";

const router = Router();

function generateReceiptRef(): string {
  const year = new Date().getFullYear();
  const hex = randomBytes(5).toString("hex").toUpperCase();
  return `MAAUN-RCP-${year}-${hex}`;
}

async function getRunningBalance(userId: number): Promise<number> {
  const rows = await db
    .select({ balanceAfter: financialLedgerTable.balanceAfter })
    .from(financialLedgerTable)
    .where(eq(financialLedgerTable.userId, userId))
    .orderBy(desc(financialLedgerTable.createdAt))
    .limit(1);
  return rows[0]?.balanceAfter ?? 0;
}

export async function createReceiptAndLedger(
  paymentId: number,
  userId: number,
  amount: number,
  feeName: string,
  ip = "system"
): Promise<void> {
  const existing = await db
    .select({ id: receiptsTable.id })
    .from(receiptsTable)
    .where(eq(receiptsTable.paymentId, paymentId))
    .limit(1);
  if (existing[0]) return; // already created

  const ref = generateReceiptRef();
  const currentBalance = await getRunningBalance(userId);
  const newBalance = currentBalance + amount;

  const [receipt] = await db.insert(receiptsTable).values({
    paymentId,
    userId,
    referenceNumber: ref,
    amount,
    feeName,
    status: "confirmed",
    issuedAt: new Date(),
    ipAddress: ip,
  }).returning();

  await db.insert(financialLedgerTable).values({
    userId,
    type: "credit",
    amount,
    description: `Payment for ${feeName}`,
    relatedPaymentId: paymentId,
    relatedReceiptId: receipt.id,
    balanceAfter: newBalance,
  });
}

// ─── Public: verify receipt ───────────────────────────────────────────────────
router.get("/receipts/verify/:reference", async (req, res) => {
  const { reference } = req.params;

  const rows = await db
    .select({
      id: receiptsTable.id,
      referenceNumber: receiptsTable.referenceNumber,
      amount: receiptsTable.amount,
      feeName: receiptsTable.feeName,
      status: receiptsTable.status,
      issuedAt: receiptsTable.issuedAt,
      createdAt: receiptsTable.createdAt,
      reversedAt: receiptsTable.reversedAt,
      studentName: usersTable.name,
      userEmail: usersTable.email,
    })
    .from(receiptsTable)
    .innerJoin(usersTable, eq(receiptsTable.userId, usersTable.id))
    .where(eq(receiptsTable.referenceNumber, reference))
    .limit(1);

  const r = rows[0];
  if (!r) return res.status(404).json({ valid: false, message: "Receipt reference not found." });

  return res.json({
    valid: true,
    referenceNumber: r.referenceNumber,
    studentName: r.studentName,
    feeName: r.feeName,
    amount: r.amount,
    status: r.status,
    isConfirmed: r.status === "confirmed",
    isReversed: r.status === "reversed",
    paymentDate: r.issuedAt ?? r.createdAt,
    reversedAt: r.reversedAt,
  });
});

// ─── Student: get own receipts ────────────────────────────────────────────────
router.get("/receipts/my", requireAuth, async (req, res) => {
  const rows = await db
    .select({
      id: receiptsTable.id,
      referenceNumber: receiptsTable.referenceNumber,
      amount: receiptsTable.amount,
      feeName: receiptsTable.feeName,
      status: receiptsTable.status,
      issuedAt: receiptsTable.issuedAt,
      createdAt: receiptsTable.createdAt,
      reversalReason: receiptsTable.reversalReason,
      paymentReference: paymentsTable.reference,
    })
    .from(receiptsTable)
    .innerJoin(paymentsTable, eq(receiptsTable.paymentId, paymentsTable.id))
    .where(eq(receiptsTable.userId, req.user!.userId))
    .orderBy(desc(receiptsTable.createdAt));

  return res.json(rows);
});

// ─── Student: get own ledger ──────────────────────────────────────────────────
router.get("/ledger/my", requireAuth, async (req, res) => {
  const rows = await db
    .select()
    .from(financialLedgerTable)
    .where(eq(financialLedgerTable.userId, req.user!.userId))
    .orderBy(desc(financialLedgerTable.createdAt));

  const totalPaid = rows.filter(r => r.type === "credit").reduce((s, r) => s + r.amount, 0);
  const totalDebits = rows.filter(r => r.type === "debit").reduce((s, r) => s + r.amount, 0);

  return res.json({ entries: rows, totalPaid, totalDebits, balance: totalPaid - totalDebits });
});

// ─── Admin: get all receipts ──────────────────────────────────────────────────
router.get("/receipts", requireAuth, requireRole("admin"), async (req, res) => {
  const rows = await db
    .select({
      id: receiptsTable.id,
      referenceNumber: receiptsTable.referenceNumber,
      amount: receiptsTable.amount,
      feeName: receiptsTable.feeName,
      status: receiptsTable.status,
      issuedAt: receiptsTable.issuedAt,
      createdAt: receiptsTable.createdAt,
      reversedAt: receiptsTable.reversedAt,
      reversalReason: receiptsTable.reversalReason,
      issuedBy: receiptsTable.issuedBy,
      ipAddress: receiptsTable.ipAddress,
      studentName: usersTable.name,
      userEmail: usersTable.email,
      userId: receiptsTable.userId,
      paymentId: receiptsTable.paymentId,
    })
    .from(receiptsTable)
    .innerJoin(usersTable, eq(receiptsTable.userId, usersTable.id))
    .orderBy(desc(receiptsTable.createdAt));

  return res.json(rows);
});

// ─── Admin: confirm receipt ───────────────────────────────────────────────────
router.patch("/receipts/:id/confirm", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const existing = await db.select().from(receiptsTable).where(eq(receiptsTable.id, id)).limit(1);
  if (!existing[0]) return res.status(404).json({ error: "Receipt not found" });
  if (existing[0].status === "reversed") return res.status(400).json({ error: "Cannot confirm a reversed receipt" });

  const [updated] = await db
    .update(receiptsTable)
    .set({ status: "confirmed", issuedBy: req.user!.userId, issuedAt: new Date() })
    .where(eq(receiptsTable.id, id))
    .returning();

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId,
    action: "RECEIPT_CONFIRMED",
    model: "receipt",
    modelId: id,
    newData: { status: "confirmed", ip },
  });

  return res.json(updated);
});

// ─── Admin: reverse receipt ───────────────────────────────────────────────────
router.patch("/receipts/:id/reverse", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const { reason } = req.body;
  if (!reason) return res.status(400).json({ error: "Reversal reason is required" });

  const existing = await db.select().from(receiptsTable).where(eq(receiptsTable.id, id)).limit(1);
  if (!existing[0]) return res.status(404).json({ error: "Receipt not found" });
  if (existing[0].status === "reversed") return res.status(400).json({ error: "Receipt already reversed" });

  const [updated] = await db
    .update(receiptsTable)
    .set({ status: "reversed", reversedAt: new Date(), reversalReason: reason, issuedBy: req.user!.userId })
    .where(eq(receiptsTable.id, id))
    .returning();

  // Debit ledger entry
  const currentBalance = await getRunningBalance(existing[0].userId);
  const newBalance = Math.max(0, currentBalance - existing[0].amount);
  await db.insert(financialLedgerTable).values({
    userId: existing[0].userId,
    type: "debit",
    amount: existing[0].amount,
    description: `Reversal: ${reason}`,
    relatedPaymentId: existing[0].paymentId,
    relatedReceiptId: id,
    balanceAfter: newBalance,
  });

  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";
  await db.insert(activityLogsTable).values({
    userId: req.user!.userId,
    action: "RECEIPT_REVERSED",
    model: "receipt",
    modelId: id,
    newData: { reason, ip },
  });

  return res.json(updated);
});

// ─── Admin: finance analytics ─────────────────────────────────────────────────
router.get("/finance/analytics", requireAuth, requireRole("admin"), async (req, res) => {
  const receipts = await db
    .select({
      id: receiptsTable.id,
      amount: receiptsTable.amount,
      feeName: receiptsTable.feeName,
      status: receiptsTable.status,
      createdAt: receiptsTable.createdAt,
    })
    .from(receiptsTable)
    .orderBy(receiptsTable.createdAt);

  const confirmed = receipts.filter(r => r.status === "confirmed");
  const pending   = receipts.filter(r => r.status === "pending");
  const reversed  = receipts.filter(r => r.status === "reversed");

  const totalRevenue = confirmed.reduce((s, r) => s + r.amount, 0);
  const pendingAmount = pending.reduce((s, r) => s + r.amount, 0);
  const reversedAmount = reversed.reduce((s, r) => s + r.amount, 0);

  // Revenue by fee type
  const byFee: Record<string, number> = {};
  for (const r of confirmed) {
    byFee[r.feeName] = (byFee[r.feeName] ?? 0) + r.amount;
  }
  const revenueByFee = Object.entries(byFee).map(([feeName, amount]) => ({ feeName, amount }));

  // Monthly revenue (last 12 months)
  const monthlyMap: Record<string, number> = {};
  for (const r of confirmed) {
    const d = new Date(r.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap[key] = (monthlyMap[key] ?? 0) + r.amount;
  }
  const monthly = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, amount]) => ({ month, amount }));

  return res.json({
    totalRevenue,
    pendingAmount,
    reversedAmount,
    totalTransactions: receipts.length,
    confirmedCount: confirmed.length,
    pendingCount: pending.length,
    reversedCount: reversed.length,
    revenueByFee,
    monthly,
  });
});

// ─── Admin: student ledger view ───────────────────────────────────────────────
router.get("/ledger/student/:userId", requireAuth, requireRole("admin"), async (req, res) => {
  const uid = parseInt(req.params.userId);
  if (isNaN(uid)) return res.status(400).json({ error: "Invalid userId" });

  const rows = await db
    .select()
    .from(financialLedgerTable)
    .where(eq(financialLedgerTable.userId, uid))
    .orderBy(desc(financialLedgerTable.createdAt));

  const totalPaid   = rows.filter(r => r.type === "credit").reduce((s, r) => s + r.amount, 0);
  const totalDebits = rows.filter(r => r.type === "debit").reduce((s, r) => s + r.amount, 0);
  return res.json({ entries: rows, totalPaid, totalDebits, balance: totalPaid - totalDebits });
});

export default router;
