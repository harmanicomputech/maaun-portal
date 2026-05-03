import { Router } from "express";
import { eq, and, inArray } from "drizzle-orm";
import { db, feesTable, paymentsTable, usersTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth-middleware";
import { logActivity } from "../lib/activity-logger";
import { createNotification } from "../lib/notification-helper";
import { createReceiptAndLedger } from "./financial";
import crypto from "crypto";
import axios from "axios";

const router = Router();
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";

// Roles that can see all payments (not just own)
const FINANCE_ROLES = ["admin", "super_admin", "bursar"] as const;

function generateRef(): string {
  return `MAAUN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

// ─── Fees ─────────────────────────────────────────────────────────────────────

router.get("/fees", requireAuth, async (req, res) => {
  const fees = await db.select().from(feesTable).orderBy(feesTable.id);
  return res.json(fees.map(f => ({ ...f, createdAt: f.createdAt.toISOString() })));
});

// Only admin and super_admin can create/update/delete fees.
// Use requireRole so super_admin is automatically included.
router.post("/fees", requireAuth, requireRole("admin"), async (req, res) => {
  const { name, amount, department, level, description } = req.body;
  if (!name || amount === undefined || amount === null) {
    return res.status(400).json({ error: "name and amount are required" });
  }
  const parsedAmount = parseInt(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: "amount must be a positive integer" });
  }
  const [fee] = await db.insert(feesTable).values({ name, amount: parsedAmount, department, level, description }).returning();
  await logActivity(req.user!.userId, "create", "fee", fee.id, null, fee);
  return res.status(201).json({ ...fee, createdAt: fee.createdAt.toISOString() });
});

router.put("/fees/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid fee id" });
  const { name, amount, department, level, description } = req.body;
  const parsedAmount = parseInt(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: "amount must be a positive integer" });
  }
  const [fee] = await db.update(feesTable)
    .set({ name, amount: parsedAmount, department, level, description })
    .where(eq(feesTable.id, id)).returning();
  if (!fee) return res.status(404).json({ error: "Fee not found" });
  return res.json({ ...fee, createdAt: fee.createdAt.toISOString() });
});

router.delete("/fees/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid fee id" });
  const deleted = await db.delete(feesTable).where(eq(feesTable.id, id)).returning();
  if (!deleted[0]) return res.status(404).json({ error: "Fee not found" });
  return res.json({ message: "Fee deleted" });
});

// ─── Payments ─────────────────────────────────────────────────────────────────

router.get("/payments", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const role   = req.user!.role;
  const isPrivileged = (FINANCE_ROLES as readonly string[]).includes(role);

  // Filter at DB level to avoid loading entire table for non-admin users.
  const rows = await db
    .select({
      id:         paymentsTable.id,
      userId:     paymentsTable.userId,
      feeId:      paymentsTable.feeId,
      reference:  paymentsTable.reference,
      amount:     paymentsTable.amount,
      status:     paymentsTable.status,
      paidAt:     paymentsTable.paidAt,
      createdAt:  paymentsTable.createdAt,
      feeName:    feesTable.name,
      userName:   usersTable.name,
      userEmail:  usersTable.email,
    })
    .from(paymentsTable)
    .leftJoin(feesTable,  eq(paymentsTable.feeId,   feesTable.id))
    .leftJoin(usersTable, eq(paymentsTable.userId, usersTable.id))
    .where(isPrivileged ? undefined : eq(paymentsTable.userId, userId))
    .orderBy(paymentsTable.createdAt);

  return res.json(rows.map(r => ({
    ...r,
    paidAt:    r.paidAt?.toISOString()    ?? null,
    createdAt: r.createdAt.toISOString(),
  })));
});

// ─── Initialize Paystack payment ──────────────────────────────────────────────

router.post("/payments/initialize", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const { feeId } = req.body;
  if (!feeId) return res.status(400).json({ error: "feeId is required" });

  const [fee] = await db.select().from(feesTable).where(eq(feesTable.id, parseInt(feeId))).limit(1);
  if (!fee) return res.status(404).json({ error: "Fee not found" });

  // Idempotency: block double-payment for the same fee
  const alreadyPaid = await db.select({ id: paymentsTable.id })
    .from(paymentsTable)
    .where(and(
      eq(paymentsTable.userId, userId),
      eq(paymentsTable.feeId, fee.id),
      eq(paymentsTable.status, "success"),
    ))
    .limit(1);
  if (alreadyPaid[0]) {
    return res.status(409).json({ error: "Already paid", message: "You have already paid this fee." });
  }

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
        amount: fee.amount * 100, // Paystack uses kobo
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

// ─── Verify payment (poll after redirect) ─────────────────────────────────────

router.get("/payments/verify/:reference", requireAuth, async (req, res) => {
  const { reference } = req.params;
  const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress ?? "unknown";

  const rows = await db
    .select({
      id:        paymentsTable.id,
      userId:    paymentsTable.userId,
      feeId:     paymentsTable.feeId,
      reference: paymentsTable.reference,
      amount:    paymentsTable.amount,
      status:    paymentsTable.status,
      paidAt:    paymentsTable.paidAt,
      createdAt: paymentsTable.createdAt,
      feeName:   feesTable.name,
    })
    .from(paymentsTable)
    .leftJoin(feesTable, eq(paymentsTable.feeId, feesTable.id))
    .where(eq(paymentsTable.reference, reference))
    .limit(1);

  const payment = rows[0];
  if (!payment) return res.status(404).json({ error: "Payment not found" });

  // Already confirmed — ensure receipt exists (idempotent)
  if (payment.status === "success") {
    await createReceiptAndLedger(payment.id, payment.userId, payment.amount, payment.feeName ?? "Fee", ip);
    return res.json({ ...payment, paidAt: payment.paidAt?.toISOString(), createdAt: payment.createdAt.toISOString() });
  }

  if (!PAYSTACK_SECRET) {
    return res.status(400).json({ error: "Cannot verify in test mode — no Paystack key configured." });
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
        .where(and(
          eq(paymentsTable.reference, reference),
          eq(paymentsTable.status, "pending"), // Guard: only update if still pending
        ))
        .returning();

      // If updated is empty, the payment was already confirmed (concurrent call)
      const finalPayment = updated ?? payment;
      await createReceiptAndLedger(finalPayment.id, finalPayment.userId, finalPayment.amount, payment.feeName ?? "Fee", ip);
      await logActivity(payment.userId, "payment_success", "payment", payment.id, { status: "pending" }, { status: "success" });
      await createNotification(
        payment.userId,
        "Payment Confirmed — Receipt Issued",
        `Your payment of ₦${payment.amount.toLocaleString()} for ${payment.feeName ?? "fee"} was confirmed. An official receipt has been generated in My Receipts.`,
        "payment"
      );
      return res.json({ ...finalPayment, paidAt: finalPayment.paidAt?.toISOString() ?? new Date().toISOString(), createdAt: payment.createdAt.toISOString() });
    } else {
      await db.update(paymentsTable).set({ status: "failed" }).where(eq(paymentsTable.reference, reference));
      return res.status(400).json({ error: "Payment not successful", message: data.gateway_response });
    }
  } catch (err: any) {
    return res.status(502).json({ error: "Verification failed", message: err?.response?.data?.message || "Could not verify payment with Paystack" });
  }
});

// ─── Paystack webhook ─────────────────────────────────────────────────────────
// Raw body is captured by the express.json verify callback in app.ts and stored
// on req.rawBody, ensuring byte-perfect signature verification.

router.post("/paystack/webhook", async (req, res) => {
  const rawBody: Buffer | undefined = (req as any).rawBody;

  if (!rawBody) {
    req.log.warn("Paystack webhook: no raw body available for signature check");
    return res.status(400).send("Bad request");
  }

  if (!PAYSTACK_SECRET) {
    req.log.warn("Paystack webhook: PAYSTACK_SECRET_KEY not configured, ignoring request");
    return res.sendStatus(200); // Return 200 to avoid Paystack retries in dev
  }

  const expectedHash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(rawBody)
    .digest("hex");

  const receivedHash = req.headers["x-paystack-signature"] as string | undefined;

  if (!receivedHash || expectedHash !== receivedHash) {
    req.log.warn({ expectedHash: expectedHash.slice(0, 8), receivedHash: receivedHash?.slice(0, 8) },
      "Paystack webhook: signature mismatch — ignoring");
    return res.status(401).send("Invalid signature");
  }

  const event = req.body;

  // Only process charge.success — silently ignore all other event types
  if (event?.event !== "charge.success") {
    return res.sendStatus(200);
  }

  const reference: string | undefined = event?.data?.reference;
  if (!reference) {
    req.log.warn("Paystack webhook: charge.success missing reference");
    return res.sendStatus(200);
  }

  const rows = await db
    .select({
      id:      paymentsTable.id,
      userId:  paymentsTable.userId,
      amount:  paymentsTable.amount,
      status:  paymentsTable.status,
      feeName: feesTable.name,
    })
    .from(paymentsTable)
    .leftJoin(feesTable, eq(paymentsTable.feeId, feesTable.id))
    .where(eq(paymentsTable.reference, reference))
    .limit(1);

  const payment = rows[0];
  if (!payment) {
    req.log.warn({ reference }, "Paystack webhook: payment not found for reference");
    return res.sendStatus(200); // Not our payment — ack to stop retries
  }

  if (payment.status === "success") {
    // Already processed — idempotent ack
    req.log.info({ reference }, "Paystack webhook: already confirmed, skipping");
    return res.sendStatus(200);
  }

  // Transition pending → success — guard with WHERE to prevent race with verify endpoint
  const [updated] = await db
    .update(paymentsTable)
    .set({ status: "success", paidAt: new Date() })
    .where(and(
      eq(paymentsTable.reference, reference),
      eq(paymentsTable.status, "pending"),
    ))
    .returning();

  if (updated) {
    await createReceiptAndLedger(payment.id, payment.userId, payment.amount, payment.feeName ?? "Fee", "paystack-webhook");
    await createNotification(
      payment.userId,
      "Payment Confirmed — Receipt Issued",
      `Payment ref: ${reference} confirmed. An official receipt has been generated.`,
      "payment"
    );
    req.log.info({ reference, paymentId: payment.id }, "Paystack webhook: payment confirmed");
  }

  return res.sendStatus(200);
});

export default router;
