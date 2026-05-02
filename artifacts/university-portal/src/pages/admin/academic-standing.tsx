import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Trophy, AlertTriangle, XCircle, Download, RefreshCw,
  CheckCircle, Search, Users, Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
function authHeaders() { return { Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` }; }

const STATUS_CONFIG = {
  good: { label: "Good Standing", color: "bg-green-100 text-green-800", icon: CheckCircle, iconColor: "text-green-600" },
  probation: { label: "Probation", color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle, iconColor: "text-yellow-600" },
  withdrawal_risk: { label: "Withdrawal Risk", color: "bg-red-100 text-red-800", icon: XCircle, iconColor: "text-red-600" },
};

const CLASS_COLOR: Record<string, string> = {
  "First Class Honours": "text-yellow-600 font-bold",
  "Second Class Honours (Upper Division)": "text-blue-600 font-semibold",
  "Second Class Honours (Lower Division)": "text-indigo-600 font-semibold",
  "Third Class Honours": "text-purple-600",
  "Pass": "text-green-600",
  "Fail": "text-red-600",
  "Insufficient Credits": "text-gray-400",
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
  const W = 210, margin = 20;
  let y = 0;

  doc.setFillColor(11, 60, 254);
  doc.rect(0, 0, W, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15); doc.setFont("helvetica", "bold");
  doc.text("MARYAM ABACHA AMERICAN UNIVERSITY OF NIGERIA", W / 2, 13, { align: "center" });
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  doc.text("Academic Affairs Division — Student Academic Standing Report", W / 2, 21, { align: "center" });
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()}`, W / 2, 28, { align: "center" });
  doc.text("Confidential — For Official Use Only", W / 2, 34, { align: "center" });

  y = 50;

  doc.setFillColor(245, 247, 255); doc.setDrawColor(200, 210, 255);
  doc.roundedRect(margin, y, W - margin * 2, 42, 3, 3, "FD");
  doc.setTextColor(30, 30, 30); doc.setFontSize(11); doc.setFont("helvetica", "bold");
  doc.text("Student Information", margin + 5, y + 9);
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  const col1 = margin + 5, col2 = W / 2 + 5, iY = y + 17;
  doc.setFont("helvetica", "bold"); doc.text("Full Name:", col1, iY);
  doc.setFont("helvetica", "normal"); doc.text(data.studentName, col1 + 26, iY);
  doc.setFont("helvetica", "bold"); doc.text("Matric No:", col2, iY);
  doc.setFont("helvetica", "normal"); doc.text(data.matricNumber, col2 + 24, iY);
  doc.setFont("helvetica", "bold"); doc.text("Department:", col1, iY + 8);
  doc.setFont("helvetica", "normal"); doc.text(data.department, col1 + 26, iY + 8);
  doc.setFont("helvetica", "bold"); doc.text("Level:", col2, iY + 8);
  doc.setFont("helvetica", "normal"); doc.text(`${data.level} Level`, col2 + 24, iY + 8);
  y += 50;

  doc.setFillColor(11, 60, 254);
  doc.roundedRect(margin, y, W - margin * 2, 28, 3, 3, "F");
  doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.setFont("helvetica", "bold");
  doc.text(data.cgpa.toFixed(2), margin + 25, y + 16, { align: "center" });
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.text("CGPA", margin + 25, y + 23, { align: "center" });
  doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text(data.classification, W / 2, y + 12, { align: "center" });
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.text(`Status: ${data.status === "good" ? "Good Standing" : data.status === "probation" ? "Academic Probation" : "Withdrawal Risk"}`, W / 2, y + 21, { align: "center" });
  y += 36;

  doc.setTextColor(30, 30, 30); doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text("Semester GPA Breakdown", margin, y); y += 5;
  doc.setFillColor(11, 60, 254); doc.rect(margin, y, W - margin * 2, 7, "F");
  doc.setTextColor(255, 255, 255); doc.setFontSize(8); doc.setFont("helvetica", "bold");
  doc.text("Academic Year", margin + 2, y + 5);
  doc.text("Semester", 75, y + 5); doc.text("Units", 115, y + 5); doc.text("Quality Pts", 140, y + 5); doc.text("GPA", 170, y + 5);
  y += 7;
  doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 30);
  let rowBg = false;
  for (const sem of data.semesterBreakdown) {
    if (rowBg) { doc.setFillColor(245, 247, 255); doc.rect(margin, y, W - margin * 2, 6, "F"); }
    doc.setFontSize(8);
    doc.text(sem.academicYear, margin + 2, y + 4);
    doc.text(sem.semester === "first" ? "First" : "Second", 75, y + 4);
    doc.text(String(sem.unitsAttempted), 115, y + 4);
    doc.text(sem.qualityPoints.toFixed(2), 140, y + 4);
    doc.setFont("helvetica", "bold"); doc.text(sem.gpa.toFixed(2), 170, y + 4); doc.setFont("helvetica", "normal");
    rowBg = !rowBg; y += 6;
  }
  if (!data.semesterBreakdown.length) { doc.setTextColor(150, 150, 150); doc.text("No approved results.", margin + 2, y + 4); y += 7; }
  y += 4;

  if (data.carryoverCourses.length > 0) {
    doc.setTextColor(30, 30, 30); doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.text("Carryover Courses", margin, y); y += 5;
    doc.setFillColor(255, 240, 240); doc.rect(margin, y, W - margin * 2, data.carryoverCourses.length * 6 + 7, "F");
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(200, 50, 50);
    doc.text("Code", margin + 2, y + 5); doc.text("Title", margin + 25, y + 5); doc.text("Grade", W - margin - 15, y + 5); y += 7;
    doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 30);
    for (const c of data.carryoverCourses) {
      doc.text(c.courseCode, margin + 2, y); doc.text(c.title.substring(0, 45), margin + 25, y);
      doc.setTextColor(200, 50, 50); doc.text(c.grade, W - margin - 15, y); doc.setTextColor(30, 30, 30); y += 6;
    }
  }

  const footerY = 277;
  doc.setDrawColor(200, 200, 200); doc.line(margin, footerY, W - margin, footerY);
  doc.setFontSize(7); doc.setTextColor(120, 120, 120);
  doc.text("This report is computer-generated. Maryam Abacha American University of Nigeria — Registry Division", margin, footerY + 5);
  doc.line(W - 80, footerY + 10, W - margin, footerY + 10);
  doc.text("Registrar's Signature", W - 60, footerY + 15, { align: "center" });

  doc.save(`MAAUN_Standing_${data.matricNumber}.pdf`);
}

type StandingRow = {
  studentId: number; studentName: string; matricNumber: string;
  department: string; level: string; cgpa: number;
  classification: string; status: string; carryoverCourses: any[];
  totalUnitsAttempted: number; semesterBreakdown: any[];
};

export default function AdminAcademicStanding() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: standings = [], isLoading, refetch, isFetching } = useQuery<StandingRow[]>({
    queryKey: ["admin-academic-standings"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/academic-standing`, { headers: authHeaders() });
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });

  const filtered = standings.filter(s => {
    const matchSearch = !search ||
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.matricNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === "all" || s.classification === filterClass ||
      (filterClass === "second_upper" && s.classification.includes("Upper")) ||
      (filterClass === "second_lower" && s.classification.includes("Lower"));
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchClass && matchStatus;
  });

  const stats = {
    total: standings.length,
    good: standings.filter(s => s.status === "good").length,
    probation: standings.filter(s => s.status === "probation").length,
    risk: standings.filter(s => s.status === "withdrawal_risk").length,
    firstClass: standings.filter(s => s.classification === "First Class Honours").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Academic Standings</h1>
          <p className="text-muted-foreground mt-1">View and export all students' classifications and academic status</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="p-5 text-center"><div className="flex items-center justify-center mb-2"><Users className="w-5 h-5 text-blue-600" /></div><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground mt-0.5">Total Students</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><div className="flex items-center justify-center mb-2"><CheckCircle className="w-5 h-5 text-green-600" /></div><p className="text-2xl font-bold text-green-600">{stats.good}</p><p className="text-xs text-muted-foreground mt-0.5">Good Standing</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><div className="flex items-center justify-center mb-2"><AlertTriangle className="w-5 h-5 text-yellow-600" /></div><p className="text-2xl font-bold text-yellow-600">{stats.probation}</p><p className="text-xs text-muted-foreground mt-0.5">Probation</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><div className="flex items-center justify-center mb-2"><XCircle className="w-5 h-5 text-red-600" /></div><p className="text-2xl font-bold text-red-600">{stats.risk}</p><p className="text-xs text-muted-foreground mt-0.5">Withdrawal Risk</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><div className="flex items-center justify-center mb-2"><Award className="w-5 h-5 text-yellow-500" /></div><p className="text-2xl font-bold text-yellow-600">{stats.firstClass}</p><p className="text-xs text-muted-foreground mt-0.5">First Class</p></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name, matric, department..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="good">Good Standing</SelectItem>
            <SelectItem value="probation">Probation</SelectItem>
            <SelectItem value="withdrawal_risk">Withdrawal Risk</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger className="w-52"><SelectValue placeholder="All Classifications" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classifications</SelectItem>
            <SelectItem value="First Class Honours">First Class</SelectItem>
            <SelectItem value="second_upper">Second Class Upper</SelectItem>
            <SelectItem value="second_lower">Second Class Lower</SelectItem>
            <SelectItem value="Third Class Honours">Third Class</SelectItem>
            <SelectItem value="Pass">Pass</SelectItem>
            <SelectItem value="Fail">Fail</SelectItem>
            <SelectItem value="Insufficient Credits">Insufficient Credits</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">All Students — Academic Standings ({filtered.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No students match the current filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Student</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Matric No</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Department</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">CGPA</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Classification</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Status</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Carryovers</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => {
                    const statusCfg = STATUS_CONFIG[s.status as keyof typeof STATUS_CONFIG];
                    const StatusIcon = statusCfg?.icon || CheckCircle;
                    return (
                      <tr key={s.studentId} className="border-b hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-3">
                          <p className="font-medium">{s.studentName}</p>
                          <p className="text-xs text-muted-foreground">{s.level} Level</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">{s.matricNumber}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">{s.department}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-lg font-bold ${getCgpaColor(s.cgpa)}`}>{s.cgpa.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`text-xs ${CLASS_COLOR[s.classification] || "text-gray-600"}`}>{s.classification}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={`${statusCfg?.color} flex items-center gap-1 w-fit mx-auto text-xs`}>
                            <StatusIcon className="w-3 h-3" />{statusCfg?.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {s.carryoverCourses.length > 0 ? (
                            <Badge className="bg-orange-100 text-orange-700">{s.carryoverCourses.length}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button size="sm" variant="ghost" onClick={() => { generatePDF(s); toast({ title: `Report downloaded for ${s.studentName}` }); }}>
                            <Download className="w-3.5 h-3.5" />
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
    </div>
  );
}
