import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  GraduationCap, CheckCircle, XCircle, Clock, Search, RefreshCw,
  AlertCircle, Shield, BookOpen, DollarSign, Zap, Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
function authHeaders() { return { Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` }; }

const APP_STATUS: Record<string, { color: string; icon: any; label: string }> = {
  applied:      { color: "bg-blue-100 text-blue-700",    icon: Clock,         label: "Applied" },
  under_review: { color: "bg-yellow-100 text-yellow-700",icon: AlertCircle,   label: "Under Review" },
  approved:     { color: "bg-green-100 text-green-700",  icon: CheckCircle,   label: "Approved" },
  rejected:     { color: "bg-red-100 text-red-700",      icon: XCircle,       label: "Rejected" },
};

async function generateAdminClearancePDF(row: any) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, M = 20;
  let y = 0;

  doc.setFillColor(11, 60, 254); doc.rect(0, 0, W, 44, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13); doc.setFont("helvetica", "bold");
  doc.text("MARYAM ABACHA AMERICAN UNIVERSITY OF NIGERIA", W / 2, 11, { align: "center" });
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Academic Registry  |  registry@maaun.edu.ng", W / 2, 19, { align: "center" });
  doc.setFontSize(12); doc.setFont("helvetica", "bold");
  doc.text("GRADUATION ELIGIBILITY CLEARANCE REPORT", W / 2, 30, { align: "center" });
  doc.setFontSize(8); doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })}`, W / 2, 39, { align: "center" });
  y = 54;

  const eligible = row.clearance?.overallStatus === "eligible";
  doc.setFillColor(eligible ? 34 : 220, eligible ? 197 : 38, eligible ? 94 : 38);
  doc.roundedRect(M, y, W - M * 2, 16, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12); doc.setFont("helvetica", "bold");
  doc.text(eligible ? "✓  ELIGIBLE FOR GRADUATION" : "✗  NOT ELIGIBLE FOR GRADUATION", W / 2, y + 11, { align: "center" });
  y += 24;

  doc.setTextColor(30, 30, 30);
  doc.setFillColor(245, 247, 255); doc.setDrawColor(200, 210, 255);
  doc.roundedRect(M, y, W - M * 2, 36, 3, 3, "FD");
  doc.setFont("helvetica", "bold"); doc.setFontSize(9);
  doc.text("STUDENT INFORMATION", M + 5, y + 8);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
  const info = [
    `Name: ${row.studentName}`, `Matric: ${row.matricNumber}`,
    `Dept: ${row.department}`, `Faculty: ${row.faculty}`,
    `Level: ${row.level}`, `CGPA: ${(row.cgpa ?? 0).toFixed(2)}`,
  ];
  let ix = M + 5, iy = y + 16;
  for (let i = 0; i < info.length; i++) {
    doc.text(info[i], ix, iy);
    if (i % 2 === 1) { ix = M + 5; iy += 7; } else ix = W / 2 + 5;
  }
  y += 44;

  if (row.clearance) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(9.5);
    doc.text("CLEARANCE BREAKDOWN", M, y + 6);
    y += 12;
    const checks = [
      { label: "Academic Clearance", ok: row.clearance.academicStatus === "passed", remarks: row.clearance.academicRemarks },
      { label: "Financial Clearance", ok: row.clearance.financialStatus === "cleared", remarks: row.clearance.financialRemarks },
      { label: "Administrative Clearance", ok: row.clearance.adminStatus === "cleared", remarks: row.clearance.adminRemarks },
    ];
    for (const c of checks) {
      doc.setFillColor(c.ok ? 240 : 255, c.ok ? 253 : 240, c.ok ? 244 : 240);
      doc.setDrawColor(c.ok ? 34 : 220, c.ok ? 197 : 38, c.ok ? 94 : 38);
      doc.roundedRect(M, y, W - M * 2, 20, 2, 2, "FD");
      doc.setFont("helvetica", "bold"); doc.setFontSize(8.5);
      doc.setTextColor(c.ok ? 21 : 153, c.ok ? 128 : 27, c.ok ? 61 : 27);
      doc.text(c.ok ? "✓ CLEARED" : "✗ BLOCKED", M + 3, y + 7);
      doc.setTextColor(30, 30, 30);
      doc.text(c.label, M + 28, y + 7);
      doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(80, 80, 80);
      doc.text(doc.splitTextToSize(c.remarks ?? "", W - M * 2 - 28)[0] ?? "", M + 28, y + 14);
      y += 24;
    }
  }

  if (row.application) {
    y += 4;
    doc.setFillColor(248, 250, 255); doc.setDrawColor(200, 210, 255);
    doc.roundedRect(M, y, W - M * 2, 12, 2, 2, "FD");
    doc.setTextColor(30, 30, 30); doc.setFont("helvetica", "bold"); doc.setFontSize(8.5);
    doc.text("Application Status:", M + 4, y + 8);
    doc.setFont("helvetica", "normal");
    doc.text(row.application.status.toUpperCase(), M + 42, y + 8);
    y += 18;
  }

  const sigY = 265;
  doc.setDrawColor(11, 60, 254); doc.setLineWidth(0.4);
  doc.line(M, sigY, W - M, sigY); doc.setLineWidth(0.2);
  doc.setFontSize(7); doc.setTextColor(100, 100, 100);
  doc.text("This document is computer-generated by the MAAUN Academic Registry System.", W / 2, sigY + 5, { align: "center" });
  doc.line(M, sigY + 13, M + 55, sigY + 13);
  doc.text("Registrar / Deputy Registrar", M + 27, sigY + 18, { align: "center" });
  doc.line(W - M - 55, sigY + 13, W - M, sigY + 13);
  doc.text("Dean of Students", W - M - 27, sigY + 18, { align: "center" });

  doc.save(`MAAUN_Clearance_${row.matricNumber}.pdf`);
}

export default function AdminGraduation() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [rejectTarget, setRejectTarget] = useState<any | null>(null);
  const [overrideTarget, setOverrideTarget] = useState<any | null>(null);
  const [reason, setReason] = useState("");
  const [evaluating, setEvaluating] = useState<number | null>(null);

  const { data: rows = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-graduation"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/graduation/admin/list`, { headers: authHeaders() });
      return data;
    },
  });

  const evaluateMut = useMutation({
    mutationFn: async (studentId: number) => {
      const { data } = await axios.post(`${BASE()}/api/graduation/admin/evaluate/${studentId}`, {}, { headers: authHeaders() });
      return data;
    },
    onSuccess: () => { toast({ title: "Evaluation complete" }); qc.invalidateQueries({ queryKey: ["admin-graduation"] }); setEvaluating(null); },
    onError: () => toast({ title: "Evaluation failed", variant: "destructive" }),
  });

  const approveMut = useMutation({
    mutationFn: async (appId: number) => {
      const { data } = await axios.patch(`${BASE()}/api/graduation/applications/${appId}/approve`, {}, { headers: authHeaders() });
      return data;
    },
    onSuccess: () => { toast({ title: "Application approved" }); qc.invalidateQueries({ queryKey: ["admin-graduation"] }); },
    onError: () => toast({ title: "Failed to approve", variant: "destructive" }),
  });

  const rejectMut = useMutation({
    mutationFn: async ({ appId, reason }: { appId: number; reason: string }) => {
      const { data } = await axios.patch(`${BASE()}/api/graduation/applications/${appId}/reject`, { reason }, { headers: authHeaders() });
      return data;
    },
    onSuccess: () => { toast({ title: "Application rejected" }); qc.invalidateQueries({ queryKey: ["admin-graduation"] }); setRejectTarget(null); setReason(""); },
    onError: () => toast({ title: "Failed to reject", variant: "destructive" }),
  });

  const overrideMut = useMutation({
    mutationFn: async ({ studentId, reason }: { studentId: number; reason: string }) => {
      const { data } = await axios.post(`${BASE()}/api/graduation/admin/override/${studentId}`, { reason }, { headers: authHeaders() });
      return data;
    },
    onSuccess: () => { toast({ title: "Override applied" }); qc.invalidateQueries({ queryKey: ["admin-graduation"] }); setOverrideTarget(null); setReason(""); },
    onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Override failed", variant: "destructive" }),
  });

  const stats = {
    eligible: rows.filter((r: any) => r.clearance?.overallStatus === "eligible").length,
    notEligible: rows.filter((r: any) => r.clearance?.overallStatus === "not_eligible").length,
    notEvaluated: rows.filter((r: any) => !r.clearance).length,
    applications: rows.filter((r: any) => r.application?.status === "applied").length,
    approved: rows.filter((r: any) => r.application?.status === "approved").length,
  };

  const filtered = rows.filter((r: any) => {
    const ms = !search || r.studentName.toLowerCase().includes(search.toLowerCase()) || r.matricNumber.toLowerCase().includes(search.toLowerCase()) || r.department.toLowerCase().includes(search.toLowerCase());
    if (!ms) return false;
    if (filter === "eligible") return r.clearance?.overallStatus === "eligible";
    if (filter === "not_eligible") return r.clearance?.overallStatus === "not_eligible";
    if (filter === "pending") return r.application?.status === "applied" || r.application?.status === "under_review";
    if (filter === "approved") return r.application?.status === "approved";
    if (filter === "not_evaluated") return !r.clearance;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Graduation Clearance</h1>
          <p className="text-muted-foreground mt-1">Evaluate, review, and approve student graduation applications</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Students", value: rows.length, color: "text-primary" },
          { label: "Eligible", value: stats.eligible, color: "text-green-600" },
          { label: "Not Eligible", value: stats.notEligible, color: "text-red-600" },
          { label: "Pending Review", value: stats.applications, color: "text-yellow-600" },
          { label: "Approved", value: stats.approved, color: "text-green-700" },
        ].map(({ label, value, color }) => (
          <Card key={label}><CardContent className="p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-52"><SelectValue placeholder="All Students" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="eligible">Eligible</SelectItem>
            <SelectItem value="not_eligible">Not Eligible</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="not_evaluated">Not Yet Evaluated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No students found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/40">
                  {["Student","Dept / Level","CGPA","Academic","Financial","Admin","Eligibility","Application","Actions"].map(h => (
                    <th key={h} className="text-left px-3 py-3 font-semibold text-muted-foreground text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filtered.map((r: any) => {
                    const c = r.clearance;
                    const app = r.application;
                    const eligible = c?.overallStatus === "eligible";
                    const appCfg = app ? APP_STATUS[app.status] : null;
                    return (
                      <tr key={r.studentId} className="border-b hover:bg-muted/20 transition-colors">
                        <td className="px-3 py-3">
                          <p className="font-medium text-xs">{r.studentName}</p>
                          <p className="text-[10px] text-muted-foreground">{r.matricNumber}</p>
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">{r.department}<br /><span className="text-[10px]">Level {r.level}</span></td>
                        <td className="px-3 py-3 text-xs font-bold text-primary">{(r.cgpa ?? 0).toFixed(2)}</td>
                        <td className="px-3 py-3">
                          {!c ? <span className="text-xs text-muted-foreground">—</span> : (
                            c.academicStatus === "passed"
                              ? <CheckCircle className="w-4 h-4 text-green-500" />
                              : <XCircle className="w-4 h-4 text-red-500" title={c.academicRemarks ?? ""} />
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {!c ? <span className="text-xs text-muted-foreground">—</span> : (
                            c.financialStatus === "cleared"
                              ? <CheckCircle className="w-4 h-4 text-green-500" />
                              : <XCircle className="w-4 h-4 text-red-500" title={c.financialRemarks ?? ""} />
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {!c ? <span className="text-xs text-muted-foreground">—</span> : (
                            c.adminStatus === "cleared"
                              ? <CheckCircle className="w-4 h-4 text-green-500" />
                              : <XCircle className="w-4 h-4 text-red-500" title={c.adminRemarks ?? ""} />
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {!c ? (
                            <Badge className="bg-gray-100 text-gray-600 text-[10px]">Not Evaluated</Badge>
                          ) : (
                            <Badge className={`${eligible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} text-[10px]`}>
                              {eligible ? "Eligible" : "Not Eligible"}
                            </Badge>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {appCfg ? (
                            <Badge className={`${appCfg.color} text-[10px] flex items-center gap-1 w-fit`}>
                              {appCfg.label}
                            </Badge>
                          ) : <span className="text-xs text-muted-foreground">—</span>}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1 flex-wrap">
                            <Button size="sm" variant="ghost" title="Evaluate" className="h-7 w-7 p-0 text-blue-600"
                              disabled={evaluating === r.studentId}
                              onClick={() => { setEvaluating(r.studentId); evaluateMut.mutate(r.studentId); }}>
                              <Zap className="w-3.5 h-3.5" />
                            </Button>
                            {c && (
                              <Button size="sm" variant="ghost" title="Download Report" className="h-7 w-7 p-0 text-gray-600"
                                onClick={async () => { await generateAdminClearancePDF(r); toast({ title: "Report downloaded" }); }}>
                                <Download className="w-3.5 h-3.5" />
                              </Button>
                            )}
                            {app?.status === "applied" && (
                              <>
                                <Button size="sm" className="h-6 px-2 text-[10px] bg-green-600 hover:bg-green-700"
                                  onClick={() => approveMut.mutate(app.id)}>Approve</Button>
                                <Button size="sm" variant="outline" className="h-6 px-2 text-[10px] text-red-600 border-red-300"
                                  onClick={() => setRejectTarget(r)}>Reject</Button>
                              </>
                            )}
                            {!eligible && c && (
                              <Button size="sm" variant="ghost" title="Admin Override" className="h-7 w-7 p-0 text-amber-600"
                                onClick={() => setOverrideTarget(r)}>
                                <Shield className="w-3.5 h-3.5" />
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

      {/* Reject dialog */}
      <Dialog open={!!rejectTarget} onOpenChange={o => !o && (setRejectTarget(null), setReason(""))}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-red-700"><XCircle className="w-5 h-5" />Reject Application</DialogTitle></DialogHeader>
          <div className="py-2 space-y-3">
            <p className="text-sm text-muted-foreground">Rejecting application for <strong>{rejectTarget?.studentName}</strong> ({rejectTarget?.matricNumber}).</p>
            <div>
              <label className="text-sm font-medium mb-1 block">Reason for rejection <span className="text-red-500">*</span></label>
              <Input placeholder="e.g. Incomplete documentation..." value={reason} onChange={e => setReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectTarget(null); setReason(""); }}>Cancel</Button>
            <Button variant="destructive" disabled={!reason.trim() || rejectMut.isPending}
              onClick={() => rejectTarget && rejectMut.mutate({ appId: rejectTarget.application.id, reason })}>
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Override dialog */}
      <Dialog open={!!overrideTarget} onOpenChange={o => !o && (setOverrideTarget(null), setReason(""))}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-amber-700"><Shield className="w-5 h-5" />Admin Eligibility Override</DialogTitle></DialogHeader>
          <div className="py-2 space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
              <p className="font-semibold">This action overrides the automated clearance engine.</p>
              <p className="mt-1">All checks will be marked as cleared for <strong>{overrideTarget?.studentName}</strong>. This is logged in the audit trail.</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Override reason <span className="text-red-500">*</span></label>
              <Input placeholder="e.g. Special committee approval..." value={reason} onChange={e => setReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOverrideTarget(null); setReason(""); }}>Cancel</Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white" disabled={!reason.trim() || overrideMut.isPending}
              onClick={() => overrideTarget && overrideMut.mutate({ studentId: overrideTarget.studentId, reason })}>
              Apply Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
