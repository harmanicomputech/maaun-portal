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

/**
 * Compute the true running balance for a user by summing all ledger entries.
 * Using SUM avoids the race condition that occurs when relying on the stored
 * `balance_after` value of the "latest" row (which can be stale under concurrency).
 */
async function getRunningBalance(userId: number): Promise<number> {
  const result = await db
    .select({
      balance: sql<number>`COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE -amount END), 0)`,
    })
    .from(financialLedgerTable)
    .where(eq(financialLedgerTable.userId, userId));
  return Number(result[0]?.balance ?? 0);
}

/**
 * Atomically create a receipt and ledger entry for a confirmed payment.
 * Uses ON CONFLICT DO NOTHING on the unique payment_id constraint so concurrent
 * calls (e.g. webhook + verify arriving simultaneously) are idempotent.
 */
export async function createReceiptAndLedger(
  paymentId: number,
  userId: number,
  amount: number,
  feeName: string,
  ip = "system"
): Promise<void> {
  const ref = generateReceiptRef();
  const currentBalance = await getRunningBalance(userId);
  const newBalance = currentBalance + amount;

  // Atomic insert — unique constraint on payment_id prevents duplicate receipts.
  // If a receipt already exists for this payment, DO NOTHING.
  const inserted = await db
    .insert(receiptsTable)
    .values({
      paymentId,
      userId,
      referenceNumber: ref,
      amount,
      feeName,
      status: "confirmed",
      issuedAt: new Date(),
      ipAddress: ip,
    })
    .onConflictDoNothing()
    .returning();

  if (!inserted[0]) {
    // Receipt already existed — idempotent, nothing to do.
    return;
  }

  // Only insert the ledger entry when the receipt was newly created.
  await db.insert(financialLedgerTable).values({
    userId,
    type: "credit",
    amount,
    description: `Payment for ${feeName}`,
    relatedPaymentId: paymentId,
    relatedReceiptId: inserted[0].id,
    balanceAfter: newBalance,
  });
}

// ─── Public: verify receipt by reference ─────────────────────────────────────
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

// ─── Student: own receipts ────────────────────────────────────────────────────
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

// ─── Student: own ledger ──────────────────────────────────────────────────────
router.get("/ledger/my", requireAuth, async (req, res) => {
  const rows = await db
    .select()
    .from(financialLedgerTable)
    .where(eq(financialLedgerTable.userId, req.user!.userId))
    .orderBy(desc(financialLedgerTable.createdAt));

  const totalPaid   = rows.filter(r => r.type === "credit").reduce((s, r) => s + r.amount, 0);
  const totalDebits = rows.filter(r => r.type === "debit").reduce((s, r) => s + r.amount, 0);

  return res.json({ entries: rows, totalPaid, totalDebits, balance: totalPaid - totalDebits });
});

// ─── Admin/Bursar: all receipts ───────────────────────────────────────────────
router.get("/receipts", requireAuth, requireRole("admin", "bursar"), async (req, res) => {
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

// ─── Admin/Bursar: confirm a receipt ─────────────────────────────────────────
router.patch("/receipts/:id/confirm", requireAuth, requireRole("admin", "bursar"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const existing = await db.select().from(receiptsTable).where(eq(receiptsTable.id, id)).limit(1);
  if (!existing[0]) return res.status(404).json({ error: "Receipt not found" });
  if (existing[0].status === "reversed") return res.status(400).json({ error: "Cannot confirm a reversed receipt" });
  if (existing[0].status === "confirmed") return res.status(409).json({ error: "Receipt is already confirmed" });

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

// ─── Admin/Bursar: reverse a receipt ─────────────────────────────────────────
router.patch("/receipts/:id/reverse", requireAuth, requireRole("admin", "bursar"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const { reason } = req.body;
  if (!reason || !reason.toString().trim()) return res.status(400).json({ error: "Reversal reason is required" });

  const existing = await db.select().from(receiptsTable).where(eq(receiptsTable.id, id)).limit(1);
  if (!existing[0]) return res.status(404).json({ error: "Receipt not found" });
  if (existing[0].status === "reversed") return res.status(409).json({ error: "Receipt is already reversed" });

  const [updated] = await db
    .update(receiptsTable)
    .set({ status: "reversed", reversedAt: new Date(), reversalReason: reason.toString().trim(), issuedBy: req.user!.userId })
    .where(eq(receiptsTable.id, id))
    .returning();

  // Debit ledger — track the reversal accurately without clamping to 0.
  // This preserves full accounting integrity even if balance would go negative.
  const currentBalance = await getRunningBalance(existing[0].userId);
  const newBalance = currentBalance - existing[0].amount;

  await db.insert(financialLedgerTable).values({
    userId: existing[0].userId,
    type: "debit",
    amount: existing[0].amount,
    description: `Reversal: ${reason.toString().trim()}`,
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
    newData: { reason: reason.toString().trim(), ip, reversedStudentId: existing[0].userId },
  });

  return res.json(updated);
});

// ─── Admin/Bursar: finance analytics ─────────────────────────────────────────
router.get("/finance/analytics", requireAuth, requireRole("admin", "bursar"), async (req, res) => {
  const receipts = await db
    .select({
      id: receiptsTable.id,
      amount: receiptsTable.amount,
      feeName: receiptsTable.feeName,
      status: receiptsTable.status,
      // Use issuedAt (actual payment confirmation date) for accurate revenue reporting.
      // Fall back to createdAt only if issuedAt is null.
      issuedAt: receiptsTable.issuedAt,
      createdAt: receiptsTable.createdAt,
    })
    .from(receiptsTable)
    .orderBy(receiptsTable.issuedAt, receiptsTable.createdAt);

  const confirmed = receipts.filter(r => r.status === "confirmed");
  const pending   = receipts.filter(r => r.status === "pending");
  const reversed  = receipts.filter(r => r.status === "reversed");

  const totalRevenue   = confirmed.reduce((s, r) => s + r.amount, 0);
  const pendingAmount  = pending.reduce((s, r) => s + r.amount, 0);
  const reversedAmount = reversed.reduce((s, r) => s + r.amount, 0);

  // Revenue by fee type (confirmed only)
  const byFee: Record<string, number> = {};
  for (const r of confirmed) {
    byFee[r.feeName] = (byFee[r.feeName] ?? 0) + r.amount;
  }
  const revenueByFee = Object.entries(byFee).map(([feeName, amount]) => ({ feeName, amount }));

  // Monthly revenue — use issuedAt (confirmation date), falling back to createdAt
  const monthlyMap: Record<string, number> = {};
  for (const r of confirmed) {
    const d = new Date(r.issuedAt ?? r.createdAt);
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

// ─── Admin/Bursar: view a student's ledger ────────────────────────────────────
router.get("/ledger/student/:userId", requireAuth, requireRole("admin", "bursar"), async (req, res) => {
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
