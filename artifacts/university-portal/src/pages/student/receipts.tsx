import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Receipt, Download, CheckCircle, XCircle, Clock, TrendingUp,
  ArrowUpCircle, ArrowDownCircle, RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import QRCode from "qrcode";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
function authHeaders() { return { Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` }; }
const fmt = (n: number) => `₦${n.toLocaleString()}`;

const STATUS_CFG: Record<string, { label: string; color: string; icon: any }> = {
  pending:   { label: "Pending",   color: "bg-yellow-100 text-yellow-700", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700",   icon: CheckCircle },
  reversed:  { label: "Reversed",  color: "bg-red-100 text-red-700",       icon: XCircle },
};

async function downloadReceiptPDF(receipt: any, studentName: string) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, M = 20;
  let y = 0;

  // Header
  doc.setFillColor(11, 60, 254);
  doc.rect(0, 0, W, 42, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14); doc.setFont("helvetica", "bold");
  doc.text("MARYAM ABACHA AMERICAN UNIVERSITY OF NIGERIA", W / 2, 11, { align: "center" });
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Financial Services Division  |  registry@maaun.edu.ng", W / 2, 19, { align: "center" });
  doc.setFontSize(12); doc.setFont("helvetica", "bold");
  doc.text("OFFICIAL PAYMENT RECEIPT", W / 2, 30, { align: "center" });
  doc.setFontSize(8); doc.setFont("helvetica", "normal");
  doc.text(`Receipt No: ${receipt.referenceNumber}`, W / 2, 37, { align: "center" });

  y = 52;

  // Official watermark
  doc.setTextColor(230, 235, 255);
  doc.setFontSize(40); doc.setFont("helvetica", "bold");
  doc.text("VERIFIED", W / 2, 160, { align: "center", angle: 30 });

  doc.setTextColor(30, 30, 30);

  // Student info box
  doc.setFillColor(245, 247, 255); doc.setDrawColor(200, 210, 255);
  doc.roundedRect(M, y, W - M * 2, 32, 3, 3, "FD");
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text("RECEIVED FROM", M + 5, y + 8);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  doc.text(studentName, M + 5, y + 16);
  doc.setFont("helvetica", "bold"); doc.text("Date:", M + 5, y + 25);
  doc.setFont("helvetica", "normal");
  doc.text(new Date(receipt.issuedAt ?? receipt.createdAt).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" }), M + 18, y + 25);
  doc.setFont("helvetica", "bold"); doc.text("Ref:", W / 2 + 5, y + 25);
  doc.setFont("helvetica", "normal"); doc.text(receipt.paymentReference ?? "—", W / 2 + 15, y + 25);
  y += 40;

  // Amount block
  doc.setFillColor(11, 60, 254);
  doc.roundedRect(M, y, W - M * 2, 24, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("AMOUNT PAID", W / 2, y + 8, { align: "center" });
  doc.setFontSize(24); doc.setFont("helvetica", "bold");
  doc.text(fmt(receipt.amount), W / 2, y + 20, { align: "center" });
  y += 32;

  doc.setTextColor(30, 30, 30);

  // Details table
  const rows: [string, string][] = [
    ["Fee / Purpose", receipt.feeName],
    ["Payment Method", "Paystack Online Payment"],
    ["Payment Status", receipt.status === "confirmed" ? "CONFIRMED & VERIFIED" : receipt.status.toUpperCase()],
    ["Receipt Number", receipt.referenceNumber],
    ["Transaction Ref", receipt.paymentReference ?? "—"],
    ["Issued By", "MAAUN Financial Services"],
  ];

  for (const [label, value] of rows) {
    doc.setFillColor(248, 250, 255);
    doc.rect(M, y, W - M * 2, 8, "F");
    doc.setDrawColor(220, 225, 245);
    doc.rect(M, y, W - M * 2, 8, "D");
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5);
    doc.text(label, M + 3, y + 5.5);
    doc.setFont("helvetica", "normal");
    doc.text(value, W / 2, y + 5.5);
    y += 8;
  }
  y += 8;

  // QR Code
  try {
    const verifyUrl = `${window.location.origin}${BASE()}/verify/receipt/${receipt.referenceNumber}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 100, margin: 1 });
    const qrSize = 28;
    const qrX = W / 2 - qrSize / 2;
    doc.addImage(qrDataUrl, "PNG", qrX, y, qrSize, qrSize);
    doc.setFontSize(7); doc.setTextColor(100, 100, 100);
    doc.text("Scan to verify this receipt online", W / 2, y + qrSize + 5, { align: "center" });
    doc.text(receipt.referenceNumber, W / 2, y + qrSize + 10, { align: "center" });
    y += qrSize + 14;
  } catch { y += 10; }

  // Footer
  const footerY = 278;
  doc.setDrawColor(11, 60, 254); doc.setLineWidth(0.4);
  doc.line(M, footerY, W - M, footerY);
  doc.setLineWidth(0.2);
  doc.setFontSize(7); doc.setTextColor(100, 100, 100);
  doc.text("OFFICIAL PAYMENT RECEIPT — VERIFIED BY MAAUN FINANCIAL SERVICES DIVISION", W / 2, footerY + 5, { align: "center" });
  doc.text("This receipt is computer-generated. Keep for your records. Contact accounts@maaun.edu.ng for enquiries.", W / 2, footerY + 10, { align: "center" });

  doc.line(M, footerY + 16, M + 55, footerY + 16);
  doc.text("Authorised Signatory / Cashier", M + 27, footerY + 21, { align: "center" });
  doc.line(W - M - 55, footerY + 16, W - M, footerY + 16);
  doc.text("Finance Officer Stamp", W - M - 27, footerY + 21, { align: "center" });

  doc.save(`MAAUN_Receipt_${receipt.referenceNumber}.pdf`);
}

export default function StudentReceipts() {
  const { toast } = useToast();

  const { data: receipts = [], isLoading: loadingReceipts } = useQuery({
    queryKey: ["my-receipts"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/receipts/my`, { headers: authHeaders() });
      return data;
    },
  });

  const { data: ledger, isLoading: loadingLedger } = useQuery({
    queryKey: ["my-ledger"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/ledger/my`, { headers: authHeaders() });
      return data;
    },
  });

  const { data: authUser } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/auth/me`, { headers: authHeaders() });
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment Receipts</h1>
        <p className="text-muted-foreground mt-1">Your official payment records and financial history</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowUpCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Paid</p>
                {loadingLedger ? <Skeleton className="h-6 w-24 mt-1" /> : (
                  <p className="text-xl font-bold text-green-600">{fmt(ledger?.totalPaid ?? 0)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ArrowDownCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reversals</p>
                {loadingLedger ? <Skeleton className="h-6 w-24 mt-1" /> : (
                  <p className="text-xl font-bold text-red-600">{fmt(ledger?.totalDebits ?? 0)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Net Balance</p>
                {loadingLedger ? <Skeleton className="h-6 w-24 mt-1" /> : (
                  <p className="text-xl font-bold text-primary">{fmt(ledger?.balance ?? 0)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receipts table */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Receipt className="w-4 h-4" />Official Receipts ({receipts.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loadingReceipts ? (
            <div className="p-4 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
          ) : receipts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No receipts yet. Complete a payment to see your receipts here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Receipt No</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Fee</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Amount</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Status</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Date</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((r: any) => {
                    const cfg = STATUS_CFG[r.status] ?? STATUS_CFG.pending;
                    const Ico = cfg.icon;
                    return (
                      <tr key={r.id} className="border-b hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-3 font-mono text-xs text-primary">{r.referenceNumber}</td>
                        <td className="px-4 py-3 font-medium">{r.feeName}</td>
                        <td className="px-4 py-3 text-center font-bold text-green-700">{fmt(r.amount)}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={`${cfg.color} flex items-center gap-1 w-fit mx-auto text-xs`}>
                            <Ico className="w-3 h-3" />{cfg.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-muted-foreground hidden md:table-cell">
                          {new Date(r.issuedAt ?? r.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            size="sm"
                            variant={r.status === "confirmed" ? "default" : "outline"}
                            disabled={r.status === "reversed"}
                            onClick={async () => {
                              await downloadReceiptPDF(r, authUser?.name ?? "Student");
                              toast({ title: "Receipt downloaded" });
                            }}
                          >
                            <Download className="w-3.5 h-3.5 mr-1" />PDF
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ledger timeline */}
      {ledger?.entries?.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" />Financial Ledger Timeline</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Description</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Type</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Amount</th>
                    <th className="text-right px-6 py-3 font-semibold text-muted-foreground">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.entries.map((e: any) => (
                    <tr key={e.id} className="border-b hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-3 text-xs text-muted-foreground">{new Date(e.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{e.description}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={e.type === "credit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {e.type === "credit" ? "↑ Credit" : "↓ Debit"}
                        </Badge>
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${e.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                        {e.type === "credit" ? "+" : "−"}{fmt(e.amount)}
                      </td>
                      <td className="px-6 py-3 text-right font-bold text-primary">{fmt(e.balanceAfter)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
