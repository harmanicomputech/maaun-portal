import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  DollarSign, TrendingUp, CheckCircle, XCircle, Clock, Search,
  RefreshCw, Receipt, AlertCircle, Shield, Download,
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

const CHART_COLORS = ["#0B3CFE", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

async function downloadReceiptPDF(r: any) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, M = 20;
  let y = 0;

  doc.setFillColor(11, 60, 254); doc.rect(0, 0, W, 42, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13); doc.setFont("helvetica", "bold");
  doc.text("MARYAM ABACHA AMERICAN UNIVERSITY OF NIGERIA", W / 2, 11, { align: "center" });
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Financial Services Division  |  accounts@maaun.edu.ng", W / 2, 19, { align: "center" });
  doc.setFontSize(12); doc.setFont("helvetica", "bold");
  doc.text("OFFICIAL PAYMENT RECEIPT", W / 2, 30, { align: "center" });
  doc.setFontSize(8); doc.setFont("helvetica", "normal");
  doc.text(`Receipt: ${r.referenceNumber}`, W / 2, 37, { align: "center" });
  y = 52;

  doc.setFillColor(245, 247, 255); doc.setDrawColor(200, 210, 255);
  doc.roundedRect(M, y, W - M * 2, 28, 3, 3, "FD");
  doc.setTextColor(30, 30, 30); doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text("RECEIVED FROM", M + 5, y + 8);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  doc.text(r.studentName, M + 5, y + 16); doc.text(r.userEmail, M + 5, y + 23);
  y += 36;

  doc.setFillColor(11, 60, 254); doc.roundedRect(M, y, W - M * 2, 22, 3, 3, "F");
  doc.setTextColor(255, 255, 255); doc.setFontSize(8); doc.setFont("helvetica", "normal");
  doc.text("AMOUNT PAID", W / 2, y + 7, { align: "center" });
  doc.setFontSize(22); doc.setFont("helvetica", "bold");
  doc.text(fmt(r.amount), W / 2, y + 18, { align: "center" });
  y += 30;

  doc.setTextColor(30, 30, 30);
  const rows: [string, string][] = [
    ["Fee", r.feeName], ["Method", "Paystack Online"], ["Status", r.status.toUpperCase()], ["Ref No", r.referenceNumber],
    ["Date", new Date(r.issuedAt ?? r.createdAt).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })],
  ];
  for (const [l, v] of rows) {
    doc.setFillColor(248, 250, 255); doc.rect(M, y, W - M * 2, 8, "F");
    doc.setDrawColor(220, 225, 245); doc.rect(M, y, W - M * 2, 8, "D");
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.text(l, M + 3, y + 5.5);
    doc.setFont("helvetica", "normal"); doc.text(v, W / 2, y + 5.5);
    y += 8;
  }
  y += 8;

  try {
    const verifyUrl = `${window.location.origin}${BASE()}/verify/receipt/${r.referenceNumber}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 100, margin: 1 });
    doc.addImage(qrDataUrl, "PNG", W / 2 - 14, y, 28, 28);
    doc.setFontSize(7); doc.setTextColor(100, 100, 100);
    doc.text("Scan to verify", W / 2, y + 32, { align: "center" });
  } catch { /* skip */ }

  const fY = 278;
  doc.setDrawColor(11, 60, 254); doc.setLineWidth(0.4); doc.line(M, fY, W - M, fY); doc.setLineWidth(0.2);
  doc.setFontSize(7); doc.setTextColor(100, 100, 100);
  doc.text("OFFICIAL PAYMENT RECEIPT — MAAUN FINANCIAL SERVICES", W / 2, fY + 5, { align: "center" });
  doc.line(M, fY + 12, M + 55, fY + 12); doc.text("Finance Officer", M + 27, fY + 17, { align: "center" });
  doc.save(`MAAUN_Receipt_${r.referenceNumber}.pdf`);
}

type ReceiptRow = {
  id: number; referenceNumber: string; amount: number; feeName: string;
  status: string; issuedAt: string | null; createdAt: string;
  studentName: string; userEmail: string; userId: number;
  reversalReason: string | null; reversedAt: string | null; ipAddress: string | null;
};

export default function AdminFinance() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [reverseTarget, setReverseTarget] = useState<ReceiptRow | null>(null);
  const [reason, setReason] = useState("");

  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ["finance-analytics"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/finance/analytics`, { headers: authHeaders() });
      return data;
    },
  });

  const { data: receipts = [], isLoading: loadingReceipts, refetch, isFetching } = useQuery<ReceiptRow[]>({
    queryKey: ["admin-receipts"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/receipts`, { headers: authHeaders() });
      return data;
    },
  });

  const confirmMut = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axios.patch(`${BASE()}/api/receipts/${id}/confirm`, {}, { headers: authHeaders() });
      return data;
    },
    onSuccess: () => { toast({ title: "Receipt confirmed" }); qc.invalidateQueries({ queryKey: ["admin-receipts"] }); qc.invalidateQueries({ queryKey: ["finance-analytics"] }); },
    onError: () => toast({ title: "Failed to confirm", variant: "destructive" }),
  });

  const reverseMut = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const { data } = await axios.patch(`${BASE()}/api/receipts/${id}/reverse`, { reason }, { headers: authHeaders() });
      return data;
    },
    onSuccess: () => {
      toast({ title: "Receipt reversed", variant: "destructive" });
      qc.invalidateQueries({ queryKey: ["admin-receipts"] });
      qc.invalidateQueries({ queryKey: ["finance-analytics"] });
      setReverseTarget(null); setReason("");
    },
    onError: () => toast({ title: "Reversal failed", variant: "destructive" }),
  });

  const filtered = receipts.filter(r => {
    const ms = !search || r.studentName.toLowerCase().includes(search.toLowerCase()) || r.referenceNumber.toLowerCase().includes(search.toLowerCase()) || r.feeName.toLowerCase().includes(search.toLowerCase());
    const mst = filterStatus === "all" || r.status === filterStatus;
    return ms && mst;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Finance & Receipts</h1>
          <p className="text-muted-foreground mt-1">Revenue analytics, payment verification, and financial ledger</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />Refresh
        </Button>
      </div>

      {/* Analytics summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: fmt(analytics?.totalRevenue ?? 0), icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
          { label: "Pending", value: fmt(analytics?.pendingAmount ?? 0), icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
          { label: "Reversed", value: fmt(analytics?.reversedAmount ?? 0), icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
          { label: "Transactions", value: analytics?.totalTransactions ?? 0, icon: Receipt, color: "text-blue-600", bg: "bg-blue-100" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}><CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                {loadingAnalytics ? <Skeleton className="h-6 w-20 mt-1" /> : (
                  <p className={`text-lg font-bold ${color}`}>{String(value)}</p>
                )}
              </div>
            </div>
          </CardContent></Card>
        ))}
      </div>

      {/* Charts */}
      {!loadingAnalytics && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly revenue bar chart */}
          {analytics.monthly?.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" />Monthly Revenue</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.monthly} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v: number) => [`₦${v.toLocaleString()}`, "Revenue"]} />
                    <Bar dataKey="amount" fill="#0B3CFE" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Revenue by fee type pie chart */}
          {analytics.revenueByFee?.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><DollarSign className="w-4 h-4" />Revenue by Fee Type</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={analytics.revenueByFee} dataKey="amount" nameKey="feeName" cx="50%" cy="50%" outerRadius={70} label={({ feeName, percent }) => `${feeName.slice(0, 12)} ${(percent * 100).toFixed(0)}%`}>
                      {analytics.revenueByFee.map((_: any, i: number) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => fmt(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Receipts table */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search receipts..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="reversed">Reversed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">All Receipts ({filtered.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loadingReceipts ? (
            <div className="p-4 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No receipts found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Student</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Receipt No</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Fee</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Amount</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Status</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Date</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => {
                    const cfg = STATUS_CFG[r.status] ?? STATUS_CFG.pending;
                    const Ico = cfg.icon;
                    return (
                      <tr key={r.id} className="border-b hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-3">
                          <p className="font-medium">{r.studentName}</p>
                          <p className="text-xs text-muted-foreground">{r.userEmail}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-primary hidden sm:table-cell">{r.referenceNumber}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{r.feeName}</td>
                        <td className="px-4 py-3 text-center font-bold text-green-700">{fmt(r.amount)}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={`${cfg.color} flex items-center gap-1 w-fit mx-auto text-xs`}>
                            <Ico className="w-3 h-3" />{cfg.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-muted-foreground hidden lg:table-cell">
                          {new Date(r.issuedAt ?? r.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button size="sm" variant="ghost" title="Download PDF" onClick={async () => { await downloadReceiptPDF(r); toast({ title: "Receipt PDF downloaded" }); }}>
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                            {r.status === "pending" && (
                              <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-50 text-xs" onClick={() => confirmMut.mutate(r.id)}>
                                <Shield className="w-3 h-3 mr-1" />Confirm
                              </Button>
                            )}
                            {r.status !== "reversed" && (
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" title="Reverse" onClick={() => setReverseTarget(r)}>
                                <XCircle className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
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

      {/* Reversal dialog */}
      <Dialog open={!!reverseTarget} onOpenChange={(o) => !o && (setReverseTarget(null), setReason(""))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />Reverse Receipt
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              <p className="font-semibold">This action cannot be undone.</p>
              <p className="mt-1">Reversing this receipt will debit {fmt(reverseTarget?.amount ?? 0)} from <strong>{reverseTarget?.studentName}</strong>'s financial ledger.</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Reason for reversal <span className="text-red-500">*</span></label>
              <Input placeholder="e.g. Duplicate payment, fraudulent transaction..." value={reason} onChange={e => setReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setReverseTarget(null); setReason(""); }}>Cancel</Button>
            <Button variant="destructive" disabled={!reason.trim() || reverseMut.isPending} onClick={() => reverseTarget && reverseMut.mutate({ id: reverseTarget.id, reason })}>
              {reverseMut.isPending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
              Confirm Reversal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
