import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, feesTable, paymentsTable, usersTable } from "@workspace/db";
import { requireAuth } from "../lib/auth-middleware";
import { logActivity } from "../lib/activity-logger";
import { createNotification } from "../lib/notification-helper";
import { createReceiptAndLedger } from "./financial";
import crypto from "crypto";
import axios from "axios";

const router = Router();
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";

function generateRef(): string {
  return `MAAUN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

// ---- Fees ----
router.get("/fees", requireAuth, async (req, res) => {
  const fees = await db.select().from(feesTable).orderBy(feesTable.id);
  return res.json(fees.map(f => ({ ...f, createdAt: f.createdAt.toISOString() })));
});

router.post("/fees", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const { name, amount, department, level, description } = req.body;
  if (!name || !amount) return res.status(400).json({ error: "name and amount are required" });
  const [fee] = await db.insert(feesTable).values({ name, amount: parseInt(amount), department, level, description }).returning();
  await logActivity(req.user.userId, "create", "fee", fee.id, null, fee);
  return res.status(201).json({ ...fee, createdAt: fee.createdAt.toISOString() });
});

router.put("/fees/:id", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const id = parseInt(req.params.id);
  const { name, amount, department, level, description } = req.body;
  const [fee] = await db.update(feesTable)
    .set({ name, amount: parseInt(amount), department, level, description })
    .where(eq(feesTable.id, id)).returning();
  return res.json({ ...fee, createdAt: fee.createdAt.toISOString() });
});

router.delete("/fees/:id", requireAuth, async (req, res) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  await db.delete(feesTable).where(eq(feesTable.id, parseInt(req.params.id)));
  return res.json({ message: "Fee deleted" });
});

// ---- Payments ----
router.get("/payments", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const role = req.user!.role;

  const rows = await db
    .select({
      id: paymentsTable.id,
      userId: paymentsTable.userId,
      feeId: paymentsTable.feeId,
      reference: paymentsTable.reference,
      amount: paymentsTable.amount,
      status: paymentsTable.status,
      paidAt: paymentsTable.paidAt,
      createdAt: paymentsTable.createdAt,
      feeName: feesTable.name,
      userName: usersTable.name,
      userEmail: usersTable.email,
    })
    .from(paymentsTable)
    .leftJoin(feesTable, eq(paymentsTable.feeId, feesTable.id))
    .leftJoin(usersTable, eq(paymentsTable.userId, usersTable.id))
    .orderBy(paymentsTable.createdAt);

  const filtered = role === "admin" ? rows : rows.filter(r => r.userId === userId);
  return res.json(filtered.map(r => ({
    ...r,
    paidAt: r.paidAt?.toISOString() || null,
    createdAt: r.createdAt.toISOString(),
  })));
});

// Initialize Paystack payment
router.post("/payments/initialize", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const { feeId } = req.body;
  if (!feeId) return res.status(400).json({ error: "feeId is required" });

  const [fee] = await db.select().from(feesTable).where(eq(feesTable.id, parseInt(feeId))).limit(1);
  if (!fee) return res.status(404).json({ error: "Fee not found" });

  const alreadyPaid = await db.select().from(paymentsTable)
    .where(and(eq(paymentsTable.userId, userId), eq(paymentsTable.feeId, fee.id), eq(paymentsTable.status, "success")))
    .limit(1);
  if (alreadyPaid[0]) return res.status(409).json({ error: "Already paid", message: "You have already paid this fee." });

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  const reference = generateRef();

  const [payment] = await db.insert(paymentsTable).values({
    userId, feeId: fee.id, reference, amount: fee.amount, status: "pending",
  }).returning();

  if (!PAYSTACK_SECRET) {
    return res.json({
      payment: { ...payment, createdAt: payment.createdAt.toISOString(), paidAt: null },
      authorizationUrl: null,
      reference,
      testMode: true,
    });
  }

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: user.email,
        amount: fee.amount * 100,
        reference,
        callback_url: `${process.env.APP_URL || ""}/student/payments?ref=${reference}`,
        metadata: { feeId: fee.id, userId, feeName: fee.name },
      },
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}`, "Content-Type": "application/json" } }
    );
    return res.json({
      payment: { ...payment, createdAt: payment.createdAt.toISOString(), paidAt: null },
      authorizationUrl: response.data.data.authorization_url,
      reference,
    });
  } catch (err: any) {
    await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.id, payment.id));
    return res.status(502).json({ error: "Paystack error", message: err?.response?.data?.message || "Could not initialize payment" });
  }
});

// Verify payment — auto-creates receipt + ledger entry on success
router.get("/payments/verify/:reference", requireAuth, async (req, res) => {
  const { reference } = req.params;
  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";

  const rows = await db
    .select({
      id: paymentsTable.id,
      userId: paymentsTable.userId,
      feeId: paymentsTable.feeId,
      reference: paymentsTable.reference,
      amount: paymentsTable.amount,
      status: paymentsTable.status,
      paidAt: paymentsTable.paidAt,
      createdAt: paymentsTable.createdAt,
      feeName: feesTable.name,
    })
    .from(paymentsTable)
    .leftJoin(feesTable, eq(paymentsTable.feeId, feesTable.id))
    .where(eq(paymentsTable.reference, reference))
    .limit(1);

  const payment = rows[0];
  if (!payment) return res.status(404).json({ error: "Payment not found" });

  if (payment.status === "success") {
    // Idempotent — ensure receipt exists for already-confirmed payments
    await createReceiptAndLedger(payment.id, payment.userId, payment.amount, payment.feeName ?? "Fee", ip);
    return res.json({ ...payment, paidAt: payment.paidAt?.toISOString(), createdAt: payment.createdAt.toISOString() });
  }

  if (!PAYSTACK_SECRET) {
    return res.status(400).json({ error: "Cannot verify in test mode" });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );
    const data = response.data.data;
    if (data.status === "success") {
      const [updated] = await db.update(paymentsTable)
        .set({ status: "success", paidAt: new Date() })
        .where(eq(paymentsTable.reference, reference)).returning();

      await createReceiptAndLedger(updated.id, updated.userId, updated.amount, payment.feeName ?? "Fee", ip);
      await logActivity(payment.userId, "payment_success", "payment", payment.id, { status: "pending" }, { status: "success" });
      await createNotification(
        payment.userId,
        "Payment Confirmed — Receipt Issued",
        `Your payment of ₦${payment.amount.toLocaleString()} for ${payment.feeName ?? "fee"} was confirmed. An official receipt has been generated in My Receipts.`,
        "payment"
      );
      return res.json({ ...updated, paidAt: updated.paidAt?.toISOString(), createdAt: updated.createdAt.toISOString() });
    } else {
      await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.reference, reference));
      return res.status(400).json({ error: "Payment not successful", message: data.gateway_response });
    }
  } catch (err: any) {
    return res.status(502).json({ error: "Verification failed", message: err?.response?.data?.message || "Could not verify" });
  }
});

// Paystack webhook — auto-creates receipt + ledger entry
router.post("/paystack/webhook", async (req, res) => {
  const hash = crypto.createHmac("sha512", PAYSTACK_SECRET).update(JSON.stringify(req.body)).digest("hex");
  if (hash !== req.headers["x-paystack-signature"]) return res.status(401).json({ error: "Invalid signature" });

  const event = req.body;
  if (event.event === "charge.success") {
    const reference = event.data.reference;
    const rows = await db
      .select({ id: paymentsTable.id, userId: paymentsTable.userId, amount: paymentsTable.amount, status: paymentsTable.status, feeName: feesTable.name })
      .from(paymentsTable)
      .leftJoin(feesTable, eq(paymentsTable.feeId, feesTable.id))
      .where(eq(paymentsTable.reference, reference))
      .limit(1);

    const payment = rows[0];
    if (payment && payment.status !== "success") {
      await db.update(paymentsTable).set({ status: "success", paidAt: new Date() }).where(eq(paymentsTable.reference, reference));
      await createReceiptAndLedger(payment.id, payment.userId, payment.amount, payment.feeName ?? "Fee", "paystack-webhook");
      await createNotification(payment.userId, "Payment Confirmed — Receipt Issued", `Payment ref: ${reference} confirmed. Receipt issued.`, "payment");
    }
  }
  return res.sendStatus(200);
});

export default router;
