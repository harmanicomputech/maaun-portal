import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GraduationCap, CheckCircle, XCircle, AlertCircle, Clock,
  BookOpen, DollarSign, Shield, Download, RefreshCw, ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
function authHeaders() { return { Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` }; }

type ClearanceResult = {
  studentId: number;
  student: any;
  user: any;
  cgpa: number;
  academic: { ok: boolean; remarks: string };
  financial: { ok: boolean; remarks: string };
  admin: { ok: boolean; remarks: string };
  eligible: boolean;
  overallStatus: string;
  application: any | null;
};

async function generateClearancePDF(data: ClearanceResult) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, M = 20;
  let y = 0;

  // Header
  doc.setFillColor(11, 60, 254); doc.rect(0, 0, W, 44, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13); doc.setFont("helvetica", "bold");
  doc.text("MARYAM ABACHA AMERICAN UNIVERSITY OF NIGERIA", W / 2, 11, { align: "center" });
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Academic Registry  |  registry@maaun.edu.ng", W / 2, 19, { align: "center" });
  doc.setFontSize(13); doc.setFont("helvetica", "bold");
  doc.text("GRADUATION ELIGIBILITY CLEARANCE REPORT", W / 2, 31, { align: "center" });
  doc.setFontSize(8); doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })}`, W / 2, 39, { align: "center" });
  y = 54;

  // Verdict banner
  const eligible = data.eligible;
  doc.setFillColor(eligible ? 34 : 220, eligible ? 197 : 38, eligible ? 94 : 38);
  doc.roundedRect(M, y, W - M * 2, 18, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13); doc.setFont("helvetica", "bold");
  doc.text(eligible ? "✓  ELIGIBLE FOR GRADUATION" : "✗  NOT ELIGIBLE FOR GRADUATION", W / 2, y + 12, { align: "center" });
  y += 26;

  doc.setTextColor(30, 30, 30);

  // Student details
  doc.setFillColor(245, 247, 255); doc.setDrawColor(200, 210, 255);
  doc.roundedRect(M, y, W - M * 2, 40, 3, 3, "FD");
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text("STUDENT INFORMATION", M + 5, y + 8);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  const details = [
    ["Full Name", data.user?.name ?? "—"],
    ["Matric Number", data.student?.matricNumber ?? "—"],
    ["Department", data.student?.department ?? "—"],
    ["Faculty", data.student?.faculty ?? "—"],
    ["Level", data.student?.level ?? "—"],
    ["CGPA", data.cgpa.toFixed(2)],
  ];
  let dx = M + 5, dy = y + 16;
  for (let i = 0; i < details.length; i++) {
    const [l, v] = details[i];
    doc.setFont("helvetica", "bold"); doc.text(`${l}:`, dx, dy);
    doc.setFont("helvetica", "normal"); doc.text(v, dx + 32, dy);
    if (i % 2 === 1) { dx = M + 5; dy += 7; } else { dx = W / 2 + 5; }
  }
  y += 48;

  // Clearance table
  const checks = [
    { label: "Academic Clearance", ok: data.academic.ok, remarks: data.academic.remarks },
    { label: "Financial Clearance", ok: data.financial.ok, remarks: data.financial.remarks },
    { label: "Administrative Clearance", ok: data.admin.ok, remarks: data.admin.remarks },
  ];

  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text("CLEARANCE BREAKDOWN", M, y + 7);
  y += 12;

  for (const c of checks) {
    doc.setFillColor(c.ok ? 240 : 255, c.ok ? 253 : 240, c.ok ? 244 : 240);
    doc.setDrawColor(c.ok ? 34 : 220, c.ok ? 197 : 38, c.ok ? 94 : 38);
    doc.roundedRect(M, y, W - M * 2, 20, 2, 2, "FD");
    doc.setFont("helvetica", "bold"); doc.setFontSize(9);
    doc.setTextColor(c.ok ? 21 : 153, c.ok ? 128 : 27, c.ok ? 61 : 27);
    doc.text(c.ok ? "✓ CLEARED" : "✗ BLOCKED", M + 3, y + 7);
    doc.setFont("helvetica", "bold"); doc.setTextColor(30, 30, 30); doc.setFontSize(9);
    doc.text(c.label, M + 28, y + 7);
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(80, 80, 80);
    const wrapped = doc.splitTextToSize(c.remarks, W - M * 2 - 28);
    doc.text(wrapped[0] ?? "", M + 28, y + 14);
    y += 24;
  }
  y += 4;

  // Application status
  if (data.application) {
    doc.setFillColor(248, 250, 255); doc.setDrawColor(200, 210, 255);
    doc.roundedRect(M, y, W - M * 2, 14, 2, 2, "FD");
    doc.setTextColor(30, 30, 30); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
    doc.text("Application Status:", M + 4, y + 9);
    doc.setFont("helvetica", "normal");
    doc.text(data.application.status.toUpperCase(), M + 40, y + 9);
    y += 20;
  }

  // Signature section
  const sigY = 260;
  doc.setDrawColor(11, 60, 254); doc.setLineWidth(0.4);
  doc.line(M, sigY, W - M, sigY); doc.setLineWidth(0.2);
  doc.setFontSize(7.5); doc.setTextColor(100, 100, 100);
  doc.text("This document is computer-generated by the MAAUN Academic Registry System.", W / 2, sigY + 5, { align: "center" });
  doc.line(M, sigY + 14, M + 60, sigY + 14);
  doc.text("Registrar / Deputy Registrar", M + 30, sigY + 19, { align: "center" });
  doc.line(W - M - 60, sigY + 14, W - M, sigY + 14);
  doc.text("Dean of Students", W - M - 30, sigY + 19, { align: "center" });
  doc.setFontSize(7); doc.setTextColor(150, 150, 150);
  doc.text("MAAUN Academic Registry — Confidential Student Document", W / 2, sigY + 28, { align: "center" });

  doc.save(`MAAUN_Graduation_Clearance_${data.student?.matricNumber ?? "report"}.pdf`);
}

const APP_STATUS_CFG: Record<string, { color: string; label: string }> = {
  applied:       { color: "bg-blue-100 text-blue-700",   label: "Applied" },
  under_review:  { color: "bg-yellow-100 text-yellow-700", label: "Under Review" },
  approved:      { color: "bg-green-100 text-green-700", label: "Approved" },
  rejected:      { color: "bg-red-100 text-red-700",     label: "Rejected" },
};

export default function StudentGraduation() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data, isLoading, refetch, isFetching } = useQuery<ClearanceResult>({
    queryKey: ["my-clearance"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/graduation/my-clearance`, { headers: authHeaders() });
      return data;
    },
  });

  const applyMut = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(`${BASE()}/api/graduation/apply`, {}, { headers: authHeaders() });
      return data;
    },
    onSuccess: () => {
      toast({ title: "Application submitted!", description: "Your graduation application has been sent to the registry." });
      qc.invalidateQueries({ queryKey: ["my-clearance"] });
    },
    onError: (err: any) => {
      toast({ title: err?.response?.data?.error ?? "Error", description: err?.response?.data?.message ?? "Could not apply", variant: "destructive" });
    },
  });

  const checks = data ? [
    { label: "Academic Clearance", desc: "CGPA ≥ 1.50, no carryovers", ok: data.academic.ok, remarks: data.academic.remarks, icon: BookOpen },
    { label: "Financial Clearance", desc: "All fees confirmed", ok: data.financial.ok, remarks: data.financial.remarks, icon: DollarSign },
    { label: "Administrative Clearance", desc: "Official transcript issued", ok: data.admin.ok, remarks: data.admin.remarks, icon: Shield },
  ] : [];

  const appStatus = data?.application?.status;
  const appCfg = appStatus ? APP_STATUS_CFG[appStatus] : null;
  const canApply = data?.eligible && !data?.application;
  const alreadyApplied = !!data?.application && appStatus !== "rejected";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Graduation Clearance</h1>
          <p className="text-muted-foreground mt-1">Check your eligibility status and apply for graduation</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />Re-evaluate
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32" />
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : data ? (
        <>
          {/* Main eligibility card */}
          <Card className={`border-2 ${data.eligible ? "border-green-300 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${data.eligible ? "bg-green-500" : "bg-red-500"}`}>
                  {data.eligible
                    ? <CheckCircle className="w-9 h-9 text-white" />
                    : <XCircle className="w-9 h-9 text-white" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`text-xl font-bold ${data.eligible ? "text-green-800" : "text-red-800"}`}>
                    {data.eligible ? "Eligible for Graduation" : "Not Yet Eligible"}
                  </h2>
                  <p className={`text-sm mt-1 ${data.eligible ? "text-green-700" : "text-red-700"}`}>
                    {data.eligible
                      ? "You have met all academic, financial, and administrative requirements."
                      : `${checks.filter(c => !c.ok).length} clearance requirement(s) outstanding. See breakdown below.`
                    }
                  </p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-700">CGPA: <span className="text-primary">{data.cgpa.toFixed(2)}</span></span>
                    {appCfg && <Badge className={appCfg.color}>Application: {appCfg.label}</Badge>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button
                    onClick={() => generateClearancePDF(data)}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />Report PDF
                  </Button>
                  {canApply && (
                    <Button onClick={() => applyMut.mutate()} disabled={applyMut.isPending} size="sm">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      {applyMut.isPending ? "Applying..." : "Apply Now"}
                    </Button>
                  )}
                  {alreadyApplied && appStatus !== "approved" && (
                    <Button variant="ghost" size="sm" disabled>
                      <Clock className="w-4 h-4 mr-2" />Application Submitted
                    </Button>
                  )}
                  {appStatus === "approved" && (
                    <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
                      <CheckCircle className="w-4 h-4" />Graduation Approved
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application rejection reason */}
          {appStatus === "rejected" && data.application?.rejectionReason && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800 text-sm">Application Rejected</p>
                  <p className="text-sm text-red-700 mt-0.5">{data.application.rejectionReason}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Clearance breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {checks.map(({ label, desc, ok, remarks, icon: Icon }) => (
              <Card key={label} className={`border-2 ${ok ? "border-green-200" : "border-red-200"}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${ok ? "bg-green-100" : "bg-red-100"}`}>
                      <Icon className={`w-5 h-5 ${ok ? "text-green-600" : "text-red-600"}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <div className="ml-auto shrink-0">
                      {ok
                        ? <CheckCircle className="w-5 h-5 text-green-500" />
                        : <XCircle className="w-5 h-5 text-red-500" />
                      }
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 text-xs ${ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {remarks}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Steps if not eligible */}
          {!data.eligible && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-amber-800 flex items-center gap-2"><AlertCircle className="w-4 h-4" />Steps to Become Eligible</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-2">
                {!data.academic.ok && (
                  <div className="flex items-start gap-2 text-sm text-amber-800">
                    <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" />
                    <span><strong>Academic:</strong> Clear all carryover courses and maintain CGPA ≥ 1.50.</span>
                  </div>
                )}
                {!data.financial.ok && (
                  <div className="flex items-start gap-2 text-sm text-amber-800">
                    <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" />
                    <span><strong>Financial:</strong> Complete all fee payments and ensure receipts are confirmed by the accounts office.</span>
                  </div>
                )}
                {!data.admin.ok && (
                  <div className="flex items-start gap-2 text-sm text-amber-800">
                    <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" />
                    <span><strong>Administrative:</strong> Request and ensure your official transcript is issued and finalized by the registrar.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card><CardContent className="text-center py-16 text-muted-foreground">
          <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Could not load clearance data. Please try again.</p>
        </CardContent></Card>
      )}
    </div>
  );
}
