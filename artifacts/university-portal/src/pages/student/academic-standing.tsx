import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Trophy, AlertTriangle, XCircle, Download, TrendingUp,
  BookOpen, Award, RefreshCw, CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
function authHeaders() { return { Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` }; }

const STATUS_CONFIG = {
  good: { label: "Good Standing", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle, iconColor: "text-green-600", bg: "bg-green-50 border-green-200" },
  probation: { label: "Academic Probation", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: AlertTriangle, iconColor: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
  withdrawal_risk: { label: "Withdrawal Risk", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle, iconColor: "text-red-600", bg: "bg-red-50 border-red-200" },
};

const CLASS_COLOR: Record<string, string> = {
  "First Class Honours": "text-yellow-600",
  "Second Class Honours (Upper Division)": "text-blue-600",
  "Second Class Honours (Lower Division)": "text-indigo-600",
  "Third Class Honours": "text-purple-600",
  "Pass": "text-green-600",
  "Fail": "text-red-600",
  "Insufficient Credits": "text-gray-500",
};

function getCgpaColor(cgpa: number) {
  if (cgpa >= 4.5) return "text-yellow-600";
  if (cgpa >= 3.5) return "text-blue-600";
  if (cgpa >= 2.4) return "text-indigo-600";
  if (cgpa >= 1.5) return "text-purple-600";
  if (cgpa >= 1.0) return "text-green-600";
  return "text-red-600";
}

function generatePDF(data: any) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 20;
  let y = 0;

  // Header background
  doc.setFillColor(11, 60, 254);
  doc.rect(0, 0, W, 40, "F");

  // University name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("MARYAM ABACHA AMERICAN UNIVERSITY OF NIGERIA", W / 2, 13, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Academic Affairs Division — Student Academic Standing Report", W / 2, 21, { align: "center" });
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()}`, W / 2, 28, { align: "center" });
  doc.text("Confidential — For Official Use Only", W / 2, 34, { align: "center" });

  y = 50;

  // Student info box
  doc.setFillColor(245, 247, 255);
  doc.setDrawColor(200, 210, 255);
  doc.roundedRect(margin, y, W - margin * 2, 42, 3, 3, "FD");

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Student Information", margin + 5, y + 9);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const col1 = margin + 5, col2 = W / 2 + 5;
  const infoY = y + 17;
  doc.setFont("helvetica", "bold"); doc.text("Full Name:", col1, infoY);
  doc.setFont("helvetica", "normal"); doc.text(data.studentName, col1 + 26, infoY);
  doc.setFont("helvetica", "bold"); doc.text("Matric Number:", col2, infoY);
  doc.setFont("helvetica", "normal"); doc.text(data.matricNumber, col2 + 32, infoY);

  doc.setFont("helvetica", "bold"); doc.text("Department:", col1, infoY + 8);
  doc.setFont("helvetica", "normal"); doc.text(data.department, col1 + 26, infoY + 8);
  doc.setFont("helvetica", "bold"); doc.text("Faculty:", col2, infoY + 8);
  doc.setFont("helvetica", "normal"); doc.text(data.faculty, col2 + 32, infoY + 8);

  doc.setFont("helvetica", "bold"); doc.text("Level:", col1, infoY + 16);
  doc.setFont("helvetica", "normal"); doc.text(`${data.level} Level`, col1 + 26, infoY + 16);
  doc.setFont("helvetica", "bold"); doc.text("Entry Year:", col2, infoY + 16);
  doc.setFont("helvetica", "normal"); doc.text(data.enrollmentYear, col2 + 32, infoY + 16);

  y += 50;

  // Academic standing summary
  doc.setFillColor(11, 60, 254);
  doc.roundedRect(margin, y, W - margin * 2, 30, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(data.cgpa.toFixed(2), margin + 25, y + 18, { align: "center" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("CGPA", margin + 25, y + 25, { align: "center" });

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(data.classification, W / 2, y + 13, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Status: ${data.status === "good" ? "Good Standing" : data.status === "probation" ? "Academic Probation" : "Withdrawal Risk"}`, W / 2, y + 22, { align: "center" });

  const right = W - margin - 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`${data.totalUnitsAttempted}`, right, y + 13, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Total Units", right, y + 22, { align: "right" });

  y += 38;

  // Semester GPA Breakdown table
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Semester GPA Breakdown", margin, y);
  y += 5;

  // Table header
  const cols = [margin, 70, 110, 140, 170];
  doc.setFillColor(11, 60, 254);
  doc.rect(margin, y, W - margin * 2, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Academic Year", cols[0] + 2, y + 5);
  doc.text("Semester", cols[1] + 2, y + 5);
  doc.text("Units", cols[2] + 2, y + 5);
  doc.text("Quality Pts", cols[3] + 2, y + 5);
  doc.text("GPA", cols[4] + 2, y + 5);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  let rowBg = false;
  for (const sem of data.semesterBreakdown) {
    if (rowBg) { doc.setFillColor(245, 247, 255); doc.rect(margin, y, W - margin * 2, 6, "F"); }
    doc.setFontSize(8);
    doc.text(sem.academicYear, cols[0] + 2, y + 4);
    doc.text(sem.semester === "first" ? "First" : "Second", cols[1] + 2, y + 4);
    doc.text(String(sem.unitsAttempted), cols[2] + 2, y + 4);
    doc.text(sem.qualityPoints.toFixed(2), cols[3] + 2, y + 4);
    doc.setFont("helvetica", "bold");
    doc.text(sem.gpa.toFixed(2), cols[4] + 2, y + 4);
    doc.setFont("helvetica", "normal");
    rowBg = !rowBg;
    y += 6;
  }

  if (data.semesterBreakdown.length === 0) {
    doc.setTextColor(150, 150, 150);
    doc.text("No approved results found.", margin + 2, y + 4);
    y += 7;
  }

  y += 6;

  // Carryover courses
  if (data.carryoverCourses.length > 0) {
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Carryover Courses", margin, y);
    y += 5;
    doc.setFillColor(255, 240, 240);
    doc.rect(margin, y, W - margin * 2, data.carryoverCourses.length * 6 + 7, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 50, 50);
    doc.text("Course Code", margin + 2, y + 5);
    doc.text("Title", margin + 30, y + 5);
    doc.text("Grade", W - margin - 20, y + 5);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    for (const c of data.carryoverCourses) {
      doc.text(c.courseCode, margin + 2, y);
      doc.text(c.title.substring(0, 40), margin + 30, y);
      doc.setTextColor(200, 50, 50);
      doc.text(c.grade, W - margin - 20, y);
      doc.setTextColor(30, 30, 30);
      y += 6;
    }
    y += 4;
  }

  // Footer
  const footerY = 277;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, footerY, W - margin, footerY);
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text("This report is computer-generated and is valid without a signature unless otherwise stated.", margin, footerY + 5);
  doc.text("Maryam Abacha American University of Nigeria — Registry Division", margin, footerY + 10);

  // Signature line
  doc.line(W - 80, footerY + 8, W - margin, footerY + 8);
  doc.text("Registrar's Signature", W - 60, footerY + 13, { align: "center" });

  doc.save(`MAAUN_Academic_Standing_${data.matricNumber}_${new Date().getFullYear()}.pdf`);
}

export default function StudentAcademicStanding() {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const { data: standing, isLoading, isError, refetch } = useQuery({
    queryKey: ["academic-standing-my"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/academic-standing/my`, { headers: authHeaders() });
      return data;
    },
  });

  const handleDownloadPDF = () => {
    if (!standing) return;
    setGenerating(true);
    try {
      generatePDF(standing);
      toast({ title: "PDF report downloaded successfully" });
    } catch {
      toast({ title: "Failed to generate PDF", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (isError || !standing) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
        <h2 className="text-lg font-semibold mb-2">No Academic Standing Data</h2>
        <p className="text-muted-foreground mb-4 max-w-sm">Your academic standing report could not be generated. You may not have any approved results yet.</p>
        <Button variant="outline" onClick={() => refetch()}><RefreshCw className="w-4 h-4 mr-2" />Retry</Button>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[standing.status as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusCfg.icon;
  const classColor = CLASS_COLOR[standing.classification] || "text-gray-700";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Academic Standing</h1>
          <p className="text-muted-foreground mt-1">Your classification, CGPA, and academic status</p>
        </div>
        <Button onClick={handleDownloadPDF} disabled={generating} className="shrink-0">
          {generating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          Download Report
        </Button>
      </div>

      {/* Status Alert */}
      {standing.status !== "good" && (
        <div className={`flex items-start gap-4 p-4 rounded-xl border ${statusCfg.bg}`}>
          <StatusIcon className={`w-6 h-6 shrink-0 mt-0.5 ${statusCfg.iconColor}`} />
          <div>
            <p className={`font-semibold ${statusCfg.iconColor}`}>{statusCfg.label}</p>
            {standing.status === "probation" && (
              <p className="text-sm text-yellow-700 mt-0.5">Your CGPA is below 2.00. Please consult your academic advisor immediately and work to improve your grades.</p>
            )}
            {standing.status === "withdrawal_risk" && (
              <p className="text-sm text-red-700 mt-0.5">Your CGPA is critically low for 2 or more consecutive semesters. You are at risk of academic withdrawal. Report to the Dean's office immediately.</p>
            )}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <p className={`text-4xl font-bold ${getCgpaColor(standing.cgpa)}`}>{standing.cgpa.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">Cumulative GPA (5.0 Scale)</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <p className={`text-lg font-bold leading-tight ${classColor}`}>{standing.classification}</p>
            <p className="text-sm text-muted-foreground mt-1">Degree Classification</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${statusCfg.iconColor.replace("text-", "bg-").replace("-600", "-100")}`}>
              <StatusIcon className={`w-8 h-8 ${statusCfg.iconColor}`} />
            </div>
            <Badge className={`${statusCfg.color} text-sm px-3 py-1`}>{statusCfg.label}</Badge>
            <p className="text-sm text-muted-foreground mt-2">Academic Status</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-5 text-center">
          <p className="text-2xl font-bold text-primary">{standing.totalUnitsAttempted}</p>
          <p className="text-xs text-muted-foreground mt-1">Units Attempted</p>
        </CardContent></Card>
        <Card><CardContent className="p-5 text-center">
          <p className="text-2xl font-bold text-primary">{standing.totalQualityPoints.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-1">Quality Points</p>
        </CardContent></Card>
        <Card><CardContent className="p-5 text-center">
          <p className="text-2xl font-bold text-orange-600">{standing.carryoverCourses.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Carryover Courses</p>
        </CardContent></Card>
        <Card><CardContent className="p-5 text-center">
          <p className="text-2xl font-bold text-blue-600">{standing.semesterBreakdown.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Semesters Completed</p>
        </CardContent></Card>
      </div>

      {/* Semester breakdown */}
      {standing.semesterBreakdown.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" />Semester GPA Breakdown</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Academic Year</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Semester</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Units</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Quality Points</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">GPA</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Standing</th>
                  </tr>
                </thead>
                <tbody>
                  {standing.semesterBreakdown.map((sem: any, i: number) => {
                    const semStatus = sem.gpa >= 2.0 ? "good" : sem.gpa >= 1.0 ? "probation" : "withdrawal_risk";
                    const semCfg = STATUS_CONFIG[semStatus as keyof typeof STATUS_CONFIG];
                    return (
                      <tr key={i} className="border-b hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-3 font-medium">{sem.academicYear}</td>
                        <td className="px-4 py-3 capitalize">{sem.semester} Semester</td>
                        <td className="px-4 py-3 text-center">{sem.unitsAttempted}</td>
                        <td className="px-4 py-3 text-center">{sem.qualityPoints.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-lg font-bold ${getCgpaColor(sem.gpa)}`}>{sem.gpa.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={`${semCfg.color} text-xs`}>{semCfg.label}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Carryover courses */}
      {standing.carryoverCourses.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader><CardTitle className="text-base flex items-center gap-2 text-orange-700"><BookOpen className="w-4 h-4" />Carryover Courses ({standing.carryoverCourses.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-orange-50">
                    <th className="text-left px-6 py-3 font-semibold text-orange-700">Course Code</th>
                    <th className="text-left px-4 py-3 font-semibold text-orange-700">Title</th>
                    <th className="text-center px-4 py-3 font-semibold text-orange-700">Grade</th>
                    <th className="text-left px-4 py-3 font-semibold text-orange-700 hidden sm:table-cell">Session</th>
                  </tr>
                </thead>
                <tbody>
                  {standing.carryoverCourses.map((c: any, i: number) => (
                    <tr key={i} className="border-b hover:bg-orange-50/50">
                      <td className="px-6 py-3 font-medium text-orange-800">{c.courseCode}</td>
                      <td className="px-4 py-3">{c.title}</td>
                      <td className="px-4 py-3 text-center"><Badge className="bg-red-100 text-red-700">F</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground capitalize hidden sm:table-cell">{c.semester} · {c.academicYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Classification guide */}
      <Card>
        <CardHeader><CardTitle className="text-base">Degree Classification Guide</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: "First Class Honours", range: "4.50 – 5.00", color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
              { label: "Second Class Upper", range: "3.50 – 4.49", color: "bg-blue-50 border-blue-200 text-blue-800" },
              { label: "Second Class Lower", range: "2.40 – 3.49", color: "bg-indigo-50 border-indigo-200 text-indigo-800" },
              { label: "Third Class Honours", range: "1.50 – 2.39", color: "bg-purple-50 border-purple-200 text-purple-800" },
              { label: "Pass", range: "1.00 – 1.49", color: "bg-green-50 border-green-200 text-green-800" },
              { label: "Fail", range: "0.00 – 0.99", color: "bg-red-50 border-red-200 text-red-800" },
            ].map(({ label, range, color }) => (
              <div key={label} className={`flex items-center justify-between p-3 rounded-lg border ${color} ${standing.classification === label || (label === "Second Class Upper" && standing.classification.includes("Upper")) || (label === "Second Class Lower" && standing.classification.includes("Lower")) ? "ring-2 ring-primary" : ""}`}>
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs font-mono">{range}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
