import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  FileText, Search, Download, CheckCircle, XCircle, RefreshCw,
  Shield, Clock, Award, Eye, Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import QRCode from "qrcode";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
function authHeaders() { return { Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` }; }

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  draft:    { label: "Draft",    color: "bg-gray-100 text-gray-700",    icon: Clock },
  pending:  { label: "Pending",  color: "bg-yellow-100 text-yellow-700", icon: Clock },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-700",    icon: CheckCircle },
  official: { label: "Official", color: "bg-green-100 text-green-700",  icon: Shield },
};

async function buildPDF(tx: any, isOfficial: boolean) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, M = 18;
  let y = 0;

  // Header
  doc.setFillColor(11, 60, 254);
  doc.rect(0, 0, W, 44, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15); doc.setFont("helvetica", "bold");
  doc.text("MARYAM ABACHA AMERICAN UNIVERSITY OF NIGERIA", W / 2, 11, { align: "center" });
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("PMB 2060, Kano, Nigeria  |  www.maaun.edu.ng  |  registry@maaun.edu.ng", W / 2, 19, { align: "center" });
  doc.setFontSize(13); doc.setFont("helvetica", "bold");
  doc.text(isOfficial ? "OFFICIAL ACADEMIC TRANSCRIPT" : "UNOFFICIAL ACADEMIC TRANSCRIPT (DRAFT)", W / 2, 30, { align: "center" });
  doc.setFontSize(8); doc.setFont("helvetica", "normal");
  doc.text(`Reference: ${tx.referenceNumber}  |  Issued: ${new Date(tx.finalizedAt ?? tx.createdAt).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })}`, W / 2, 38, { align: "center" });

  y = 52;

  // UNOFFICIAL watermark
  if (!isOfficial) {
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(52); doc.setFont("helvetica", "bold");
    doc.saveGraphicsState();
    (doc as any).setGState(new (doc as any).GState({ opacity: 0.18 }));
    for (let wy = 90; wy < 260; wy += 55) {
      doc.text("UNOFFICIAL", W / 2, wy, { align: "center", angle: 30 });
    }
    doc.restoreGraphicsState();
    doc.setTextColor(30, 30, 30);
  }

  // Student info
  const s = tx.standing;
  doc.setFillColor(245, 247, 255); doc.setDrawColor(200, 210, 255);
  doc.roundedRect(M, y, W - M * 2, 46, 3, 3, "FD");
  doc.setTextColor(30, 30, 30); doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text("STUDENT INFORMATION", M + 4, y + 8);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
  const col1 = M + 4, col2 = W / 2 + 2, baseY = y + 16;
  const row = (label: string, val: string, cx: number, cy: number) => {
    doc.setFont("helvetica", "bold"); doc.text(label, cx, cy);
    doc.setFont("helvetica", "normal"); doc.text(val ?? "—", cx + 28, cy);
  };
  row("Full Name:", s?.studentName ?? "—", col1, baseY);
  row("Matric No:", s?.matricNumber ?? "—", col2, baseY);
  row("Department:", s?.department ?? "—", col1, baseY + 8);
  row("Faculty:", s?.faculty ?? "—", col2, baseY + 8);
  row("Level:", `${s?.level ?? "—"} Level`, col1, baseY + 16);
  row("Entry Year:", s?.enrollmentYear ?? "—", col2, baseY + 16);
  row("Status:", s?.status === "good" ? "Good Standing" : s?.status === "probation" ? "Academic Probation" : "Withdrawal Risk", col1, baseY + 24);
  y += 54;

  // CGPA Summary banner
  doc.setFillColor(11, 60, 254);
  doc.roundedRect(M, y, W - M * 2, 24, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20); doc.setFont("helvetica", "bold");
  doc.text((s?.cgpa ?? 0).toFixed(2), M + 22, y + 15, { align: "center" });
  doc.setFontSize(7); doc.setFont("helvetica", "normal");
  doc.text("CGPA (5.0)", M + 22, y + 21, { align: "center" });
  doc.setFontSize(12); doc.setFont("helvetica", "bold");
  doc.text(s?.classification ?? "—", W / 2, y + 11, { align: "center" });
  doc.setFontSize(8); doc.setFont("helvetica", "normal");
  doc.text(`${s?.totalUnitsAttempted ?? 0} Credit Units Completed`, W / 2, y + 19, { align: "center" });
  y += 32;

  // Semester table
  doc.setTextColor(30, 30, 30); doc.setFont("helvetica", "bold"); doc.setFontSize(9.5);
  doc.text("SEMESTER ACADEMIC RECORD", M, y); y += 4;
  const cols = [M, 62, 100, 128, 157, 183];
  doc.setFillColor(11, 60, 254); doc.rect(M, y, W - M * 2, 7, "F");
  doc.setTextColor(255, 255, 255); doc.setFontSize(7.5); doc.setFont("helvetica", "bold");
  doc.text("Academic Year", cols[0] + 2, y + 5);
  doc.text("Semester", cols[1] + 2, y + 5);
  doc.text("Units", cols[2] + 2, y + 5);
  doc.text("Qual. Pts", cols[3] + 2, y + 5);
  doc.text("GPA", cols[4] + 2, y + 5);
  doc.text("Remark", cols[5] + 2, y + 5);
  y += 7;
  doc.setTextColor(30, 30, 30); doc.setFont("helvetica", "normal");
  let rowBg = false;
  for (const sem of (s?.semesterBreakdown ?? [])) {
    if (rowBg) { doc.setFillColor(245, 247, 255); doc.rect(M, y, W - M * 2, 6, "F"); }
    doc.setFontSize(7.5);
    doc.text(sem.academicYear, cols[0] + 2, y + 4);
    doc.text(sem.semester === "first" ? "First Sem." : "Second Sem.", cols[1] + 2, y + 4);
    doc.text(String(sem.unitsAttempted), cols[2] + 2, y + 4);
    doc.text(sem.qualityPoints.toFixed(2), cols[3] + 2, y + 4);
    doc.setFont("helvetica", "bold"); doc.text(sem.gpa.toFixed(2), cols[4] + 2, y + 4); doc.setFont("helvetica", "normal");
    const remark = sem.gpa >= 3.5 ? "Distinction" : sem.gpa >= 2.4 ? "Credit" : sem.gpa >= 2.0 ? "Pass" : "Probation";
    doc.text(remark, cols[5] + 2, y + 4);
    rowBg = !rowBg; y += 6;
  }
  if (!(s?.semesterBreakdown?.length)) { doc.setTextColor(150, 150, 150); doc.text("No approved results.", M + 2, y + 4); y += 7; }
  y += 6;

  // Carryovers
  if (s?.carryoverCourses?.length) {
    doc.setTextColor(30, 30, 30); doc.setFont("helvetica", "bold"); doc.setFontSize(9.5);
    doc.text("CARRYOVER COURSES", M, y); y += 4;
    doc.setFillColor(255, 235, 235); doc.rect(M, y, W - M * 2, s.carryoverCourses.length * 6 + 7, "F");
    doc.setTextColor(180, 40, 40); doc.setFontSize(7.5); doc.setFont("helvetica", "bold");
    doc.text("Code", M + 2, y + 5); doc.text("Course Title", M + 25, y + 5); doc.text("Grade", W - M - 15, y + 5); y += 7;
    doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 30);
    for (const c of s.carryoverCourses) {
      doc.text(c.courseCode, M + 2, y); doc.text(c.title.substring(0, 50), M + 25, y);
      doc.setTextColor(180, 40, 40); doc.text(c.grade, W - M - 15, y); doc.setTextColor(30, 30, 30); y += 6;
    }
    y += 4;
  }

  // QR Code
  if (isOfficial) {
    const verifyUrl = `${window.location.origin}${BASE()}/verify/transcript/${tx.referenceNumber}`;
    try {
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 120, margin: 1 });
      const qrX = W - M - 28, qrY = 250;
      doc.addImage(qrDataUrl, "PNG", qrX, qrY, 26, 26);
      doc.setFontSize(6); doc.setTextColor(100, 100, 100);
      doc.text("Scan to verify", qrX + 13, qrY + 29, { align: "center" });
      doc.text(tx.referenceNumber, qrX + 13, qrY + 33, { align: "center" });
    } catch { /* skip QR if error */ }
  }

  // Footer
  const footerY = 278;
  doc.setDrawColor(11, 60, 254); doc.setLineWidth(0.5); doc.line(M, footerY, W - M, footerY); doc.setLineWidth(0.2);
  doc.setFontSize(7); doc.setTextColor(80, 80, 80);
  if (isOfficial) {
    doc.text("This is an OFFICIAL transcript issued by Maryam Abacha American University of Nigeria.", M, footerY + 5);
    doc.text(`Approved by: ${tx.approvedByName ?? "Registry"}  |  Finalized: ${tx.finalizedAt ? new Date(tx.finalizedAt).toLocaleDateString() : "—"}`, M, footerY + 10);
  } else {
    doc.setTextColor(180, 40, 40);
    doc.text("⚠ THIS IS AN UNOFFICIAL DRAFT TRANSCRIPT — NOT FOR OFFICIAL USE", M, footerY + 5);
    doc.setTextColor(80, 80, 80);
  }
  doc.line(M, footerY + 16, M + 52, footerY + 16);
  doc.text("Registrar's Signature & Stamp", M + 26, footerY + 20, { align: "center" });

  const name = `MAAUN_Transcript_${tx.standing?.matricNumber ?? "student"}_${tx.referenceNumber}.pdf`;
  doc.save(name);
}

type TxRow = {
  id: number; referenceNumber: string; status: string; createdAt: string;
  approvedAt: string | null; finalizedAt: string | null;
  studentName: string; matricNumber: string; department: string; level: string;
  generatedBy: number; approvedBy: number | null;
};

export default function AdminTranscripts() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewTx, setViewTx] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const { data: transcripts = [], isLoading, refetch, isFetching } = useQuery<TxRow[]>({
    queryKey: ["admin-transcripts"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/transcripts`, { headers: authHeaders() });
      return data;
    },
  });

  const statusMut = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      const { data } = await axios.patch(`${BASE()}/api/transcripts/${id}/status`, { status, notes }, { headers: authHeaders() });
      return data;
    },
    onSuccess: (_, vars) => {
      toast({ title: `Transcript ${vars.status === "official" ? "finalized as Official" : vars.status}` });
      qc.invalidateQueries({ queryKey: ["admin-transcripts"] });
      if (viewTx?.id === vars.id) fetchDetail(vars.id);
    },
    onError: () => toast({ title: "Action failed", variant: "destructive" }),
  });

  const fetchDetail = async (id: number) => {
    setLoadingDetail(true);
    try {
      const { data } = await axios.get(`${BASE()}/api/transcripts/${id}`, { headers: authHeaders() });
      setViewTx(data);
    } catch { toast({ title: "Failed to load transcript", variant: "destructive" }); }
    finally { setLoadingDetail(false); }
  };

  const filtered = transcripts.filter(t => {
    const matchSearch = !search ||
      t.studentName.toLowerCase().includes(search.toLowerCase()) ||
      t.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.matricNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: transcripts.length,
    draft: transcripts.filter(t => t.status === "draft").length,
    pending: transcripts.filter(t => t.status === "pending").length,
    approved: transcripts.filter(t => t.status === "approved").length,
    official: transcripts.filter(t => t.status === "official").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transcript Management</h1>
          <p className="text-muted-foreground mt-1">Review, approve, and issue official academic transcripts</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="p-5 text-center"><div className="flex justify-center mb-2"><Users className="w-5 h-5 text-blue-600" /></div><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground mt-0.5">Total</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><div className="flex justify-center mb-2"><Clock className="w-5 h-5 text-gray-500" /></div><p className="text-2xl font-bold text-gray-600">{stats.draft}</p><p className="text-xs text-muted-foreground mt-0.5">Draft</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><div className="flex justify-center mb-2"><Clock className="w-5 h-5 text-yellow-600" /></div><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p><p className="text-xs text-muted-foreground mt-0.5">Pending</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><div className="flex justify-center mb-2"><CheckCircle className="w-5 h-5 text-blue-600" /></div><p className="text-2xl font-bold text-blue-600">{stats.approved}</p><p className="text-xs text-muted-foreground mt-0.5">Approved</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><div className="flex justify-center mb-2"><Shield className="w-5 h-5 text-green-600" /></div><p className="text-2xl font-bold text-green-600">{stats.official}</p><p className="text-xs text-muted-foreground mt-0.5">Official</p></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name, matric, reference..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="official">Official</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">All Transcript Requests ({filtered.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No transcript requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Student</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Reference No</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Department</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Status</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Created</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => {
                    const cfg = STATUS_CONFIG[t.status] ?? STATUS_CONFIG.draft;
                    const Ico = cfg.icon;
                    return (
                      <tr key={t.id} className="border-b hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-3">
                          <p className="font-medium">{t.studentName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{t.matricNumber}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-primary hidden sm:table-cell">{t.referenceNumber}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">{t.department}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={`${cfg.color} flex items-center gap-1 w-fit mx-auto text-xs`}>
                            <Ico className="w-3 h-3" />{cfg.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-muted-foreground hidden md:table-cell">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => fetchDetail(t.id)} title="View Details">
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            {t.status === "draft" && (
                              <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-300 hover:bg-yellow-50 text-xs" onClick={() => statusMut.mutate({ id: t.id, status: "pending" })}>
                                Submit
                              </Button>
                            )}
                            {t.status === "pending" && (
                              <Button size="sm" variant="outline" className="text-blue-700 border-blue-300 hover:bg-blue-50 text-xs" onClick={() => statusMut.mutate({ id: t.id, status: "approved" })}>
                                Approve
                              </Button>
                            )}
                            {t.status === "approved" && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs" onClick={() => statusMut.mutate({ id: t.id, status: "official" })}>
                                <Shield className="w-3 h-3 mr-1" />Finalize
                              </Button>
                            )}
                            {t.status === "official" && (
                              <Button size="sm" variant="outline" className="text-xs" onClick={async () => {
                                const { data } = await axios.get(`${BASE()}/api/transcripts/${t.id}`, { headers: authHeaders() });
                                await buildPDF(data, true);
                                toast({ title: "Official transcript downloaded" });
                              }}>
                                <Download className="w-3 h-3 mr-1" />PDF
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

      {/* Detail dialog */}
      <Dialog open={!!viewTx} onOpenChange={(o) => !o && setViewTx(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Transcript — {viewTx?.referenceNumber}
            </DialogTitle>
          </DialogHeader>
          {loadingDetail ? (
            <div className="space-y-3 py-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : viewTx && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">{viewTx.standing?.studentName}</p>
                  <p className="text-sm text-muted-foreground font-mono">{viewTx.standing?.matricNumber} · {viewTx.standing?.department}</p>
                </div>
                <Badge className={`${STATUS_CONFIG[viewTx.status]?.color} text-sm px-3`}>{STATUS_CONFIG[viewTx.status]?.label}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-primary/5 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{(viewTx.standing?.cgpa ?? 0).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">CGPA</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-3 text-center col-span-2">
                  <p className="font-semibold text-sm">{viewTx.standing?.classification}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{viewTx.standing?.totalUnitsAttempted} Units · {viewTx.standing?.semesterBreakdown?.length} Semesters</p>
                </div>
              </div>

              <div className="text-sm space-y-1.5 bg-muted/30 rounded-lg p-3">
                <div className="flex justify-between"><span className="text-muted-foreground">Generated by</span><span className="font-medium">{viewTx.generatedByName}</span></div>
                {viewTx.approvedByName && <div className="flex justify-between"><span className="text-muted-foreground">Approved by</span><span className="font-medium">{viewTx.approvedByName}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{new Date(viewTx.createdAt).toLocaleString()}</span></div>
                {viewTx.approvedAt && <div className="flex justify-between"><span className="text-muted-foreground">Approved at</span><span>{new Date(viewTx.approvedAt).toLocaleString()}</span></div>}
                {viewTx.finalizedAt && <div className="flex justify-between"><span className="text-muted-foreground">Finalized at</span><span>{new Date(viewTx.finalizedAt).toLocaleString()}</span></div>}
                {viewTx.ipAddress && <div className="flex justify-between"><span className="text-muted-foreground">IP Address</span><span className="font-mono text-xs">{viewTx.ipAddress}</span></div>}
              </div>

              {viewTx.standing?.semesterBreakdown?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Semester Breakdown</p>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-xs">
                      <thead><tr className="bg-muted/40 border-b">
                        <th className="text-left px-3 py-2">Year</th><th className="text-left px-3 py-2">Sem</th>
                        <th className="text-center px-3 py-2">Units</th><th className="text-center px-3 py-2">GPA</th>
                      </tr></thead>
                      <tbody>{viewTx.standing.semesterBreakdown.map((s: any, i: number) => (
                        <tr key={i} className="border-b">
                          <td className="px-3 py-2">{s.academicYear}</td>
                          <td className="px-3 py-2 capitalize">{s.semester}</td>
                          <td className="px-3 py-2 text-center">{s.unitsAttempted}</td>
                          <td className="px-3 py-2 text-center font-bold">{s.gpa.toFixed(2)}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
              )}

              {viewTx.standing?.carryoverCourses?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2 text-orange-700">Carryover Courses ({viewTx.standing.carryoverCourses.length})</p>
                  <div className="space-y-1">{viewTx.standing.carryoverCourses.map((c: any, i: number) => (
                    <div key={i} className="flex justify-between text-xs bg-orange-50 rounded px-3 py-2">
                      <span className="font-medium">{c.courseCode}</span>
                      <span className="text-muted-foreground flex-1 mx-3">{c.title}</span>
                      <Badge className="bg-red-100 text-red-700">F</Badge>
                    </div>
                  ))}</div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex gap-2 flex-wrap">
            {viewTx?.status === "draft" && (
              <Button variant="outline" onClick={() => statusMut.mutate({ id: viewTx.id, status: "pending" })}>Submit for Review</Button>
            )}
            {viewTx?.status === "pending" && (
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => statusMut.mutate({ id: viewTx.id, status: "approved" })}>
                <CheckCircle className="w-4 h-4 mr-2" />Approve
              </Button>
            )}
            {viewTx?.status === "approved" && (
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => statusMut.mutate({ id: viewTx.id, status: "official" })}>
                <Shield className="w-4 h-4 mr-2" />Finalize as Official
              </Button>
            )}
            {viewTx?.status === "official" && (
              <Button onClick={async () => { await buildPDF(viewTx, true); toast({ title: "Official transcript PDF downloaded" }); }}>
                <Download className="w-4 h-4 mr-2" />Download Official PDF
              </Button>
            )}
            {viewTx?.status === "draft" && (
              <Button variant="outline" onClick={async () => { await buildPDF(viewTx, false); toast({ title: "Draft transcript downloaded" }); }}>
                <Download className="w-4 h-4 mr-2" />Download Draft PDF
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
