import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ReferenceLine, Cell,
} from "recharts";
import {
  Trophy, TrendingUp, TrendingDown, BookOpen, AlertTriangle,
  CheckCircle, XCircle, GraduationCap, Minus, Star, Target,
  CalendarDays, Award, BarChart2, ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

// ── Config ────────────────────────────────────────────────────────────────────

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

const REQUIRED_UNITS_DEFAULT = 120;

interface SemesterGPA {
  academicYear: string;
  semester: string;
  unitsAttempted: number;
  qualityPoints: number;
  gpa: number;
}

interface AcademicStanding {
  studentId: number;
  studentName: string;
  matricNumber: string;
  department: string;
  faculty: string;
  level: string;
  enrollmentYear: string;
  cgpa: number;
  classification: string;
  status: string;
  totalUnitsAttempted: number;
  totalQualityPoints: number;
  semesterBreakdown: SemesterGPA[];
  carryoverCourses: { courseCode: string; title: string; grade: string; semester: string; academicYear: string }[];
  generatedAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCgpaColor(cgpa: number) {
  if (cgpa >= 4.5) return "text-yellow-600";
  if (cgpa >= 3.5) return "text-blue-600";
  if (cgpa >= 2.4) return "text-indigo-600";
  if (cgpa >= 1.5) return "text-purple-600";
  if (cgpa >= 1.0) return "text-green-600";
  return "text-red-600";
}

function getCgpaBg(cgpa: number) {
  if (cgpa >= 4.5) return "bg-yellow-50 border-yellow-200";
  if (cgpa >= 3.5) return "bg-blue-50 border-blue-200";
  if (cgpa >= 2.4) return "bg-indigo-50 border-indigo-200";
  if (cgpa >= 1.5) return "bg-purple-50 border-purple-200";
  if (cgpa >= 1.0) return "bg-green-50 border-green-200";
  return "bg-red-50 border-red-200";
}

const STATUS_CFG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  good:             { label: "Good Standing",     icon: CheckCircle,  color: "text-green-700",  bg: "bg-green-50 border-green-200" },
  probation:        { label: "Academic Probation", icon: AlertTriangle, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  withdrawal_risk:  { label: "Withdrawal Risk",   icon: XCircle,      color: "text-red-700",    bg: "bg-red-50 border-red-200" },
};

function semLabel(s: SemesterGPA) {
  const yr = s.academicYear.replace("/", "–");
  return `${s.semester === "first" ? "1st" : "2nd"} Sem\n${yr}`;
}

function semLabelShort(s: SemesterGPA) {
  const [start] = s.academicYear.split("/");
  return `${s.semester === "first" ? "S1" : "S2"}'${start?.slice(2) ?? ""}`;
}

function computeReadiness(standing: AcademicStanding): number {
  const required = REQUIRED_UNITS_DEFAULT;
  const unitProgress = Math.min(standing.totalUnitsAttempted / required, 1.0);
  const cgpaQuality = Math.min(standing.cgpa / 5.0, 1.0);
  const meetsMinimum = standing.cgpa >= 1.0 ? 1 : 0;
  return Math.round((unitProgress * 0.5 + cgpaQuality * 0.3 + meetsMinimum * 0.2) * 100);
}

function computePredictedYear(standing: AcademicStanding): number | null {
  const yr = parseInt(standing.enrollmentYear);
  if (isNaN(yr)) return null;
  const lvl = parseInt(standing.level);
  const yearsLeft = isNaN(lvl) ? 4 : Math.max(0, Math.ceil((5 - lvl / 100)));
  return yr + 4 + (lvl >= 500 ? 1 : 0);
}

function TrendIcon({ current, prev }: { current: number; prev?: number }) {
  if (prev === undefined || current === prev) return <Minus className="size-3 text-muted-foreground" />;
  return current > prev
    ? <TrendingUp className="size-3 text-green-600" />
    : <TrendingDown className="size-3 text-red-500" />;
}

// ── Radial Gauge ──────────────────────────────────────────────────────────────

function ReadinessGauge({ score }: { score: number }) {
  const clamp = Math.max(0, Math.min(100, score));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeLength = (clamp / 100) * circumference * 0.75; // 270° arc
  const offset = circumference * 0.125; // start at -135°

  const color = clamp >= 80 ? "#16a34a" : clamp >= 60 ? "#0B3CFE" : clamp >= 40 ? "#d97706" : "#dc2626";

  return (
    <div className="relative size-36 mx-auto">
      <svg viewBox="0 0 128 128" className="size-full -rotate-[135deg]">
        {/* Track */}
        <circle cx="64" cy="64" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="10"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeDashoffset={0} strokeLinecap="round" />
        {/* Fill */}
        <circle cx="64" cy="64" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
          strokeDashoffset={0} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
        <span className="text-3xl font-bold tabular-nums" style={{ color }}>{clamp}%</span>
        <span className="text-[10px] text-muted-foreground font-medium mt-0.5">Readiness</span>
      </div>
    </div>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────

function SemTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const val: number = payload[0]?.value;
  return (
    <div className="bg-card border border-border/70 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className={cn("font-bold text-base", getCgpaColor(val))}>GPA: {val.toFixed(2)}</p>
      {payload[1] && (
        <p className="text-muted-foreground">Units: {payload[1].value}</p>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StudentProgress() {
  const { data: standing, isLoading } = useQuery<AcademicStanding>({
    queryKey: ["academic-standing-my"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/academic-standing/my`, { headers: authHeaders() });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-56 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-52 rounded-2xl" />
      </div>
    );
  }

  if (!standing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
        <GraduationCap className="size-12 opacity-20" />
        <p className="text-sm">No academic data available yet. Results will appear once approved.</p>
        <Link href="/student/results">
          <button className="text-xs text-[#0B3CFE] hover:underline flex items-center gap-1">
            View Results <ArrowRight className="size-3" />
          </button>
        </Link>
      </div>
    );
  }

  const readiness = computeReadiness(standing);
  const predictedYear = computePredictedYear(standing);
  const statusCfg = STATUS_CFG[standing.status] ?? STATUS_CFG.good;
  const StatusIcon = statusCfg.icon;
  const hasSemesters = standing.semesterBreakdown.length > 0;

  // Chart data
  const chartData = standing.semesterBreakdown.map((s, i) => ({
    label: semLabelShort(s),
    fullLabel: semLabel(s),
    gpa: s.gpa,
    units: s.unitsAttempted,
    prev: i > 0 ? standing.semesterBreakdown[i - 1].gpa : undefined,
  }));

  // Bar chart color per semester
  const barColors = chartData.map(d =>
    d.gpa >= 4.5 ? "#eab308" : d.gpa >= 3.5 ? "#0B3CFE" : d.gpa >= 2.4 ? "#6366f1" : d.gpa >= 1.5 ? "#a855f7" : d.gpa >= 1.0 ? "#16a34a" : "#dc2626"
  );

  const latestGpa = chartData.at(-1)?.gpa;
  const prevGpa = chartData.at(-2)?.gpa;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Academic Progress</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {standing.studentName} · {standing.matricNumber} · {standing.department}
          </p>
        </div>
        <Badge className={cn("text-xs font-semibold border", statusCfg.bg, statusCfg.color)}>
          <StatusIcon className="size-3 mr-1" />
          {statusCfg.label}
        </Badge>
      </div>

      {/* Hero metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* CGPA */}
        <div className={cn("rounded-2xl border p-5 flex items-center gap-4", getCgpaBg(standing.cgpa))}>
          <div className="size-12 rounded-xl bg-white/60 flex items-center justify-center shrink-0 shadow-sm">
            <Trophy className={cn("size-6", getCgpaColor(standing.cgpa))} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Cumulative GPA</p>
            <p className={cn("text-3xl font-bold tabular-nums", getCgpaColor(standing.cgpa))}>
              {standing.cgpa.toFixed(2)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{standing.classification}</p>
          </div>
        </div>

        {/* Units Progress */}
        <div className="rounded-2xl border bg-card p-5 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-[#0B3CFE]/10 flex items-center justify-center shrink-0">
            <BookOpen className="size-6 text-[#0B3CFE]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium">Units Completed</p>
            <p className="text-3xl font-bold tabular-nums text-foreground">{standing.totalUnitsAttempted}</p>
            <div className="mt-1.5">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                <span>{standing.totalUnitsAttempted} of {REQUIRED_UNITS_DEFAULT} required</span>
                <span>{Math.round(standing.totalUnitsAttempted / REQUIRED_UNITS_DEFAULT * 100)}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0B3CFE] rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(standing.totalUnitsAttempted / REQUIRED_UNITS_DEFAULT * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Readiness + Predicted Year */}
        <div className="rounded-2xl border bg-card p-5 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <Target className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Graduation Readiness</p>
            <p className="text-3xl font-bold tabular-nums text-emerald-600">{readiness}%</p>
            {predictedYear && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Expected completion: {predictedYear}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* GPA Trend Area Chart — 3/5 */}
        <Card className="border-border/60 shadow-sm lg:col-span-3">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-[#0B3CFE]" />
              <CardTitle className="text-sm font-semibold">Semester GPA Trend</CardTitle>
            </div>
            {latestGpa !== undefined && prevGpa !== undefined && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendIcon current={latestGpa} prev={prevGpa} />
                <span className={cn(
                  "font-semibold",
                  latestGpa > prevGpa ? "text-green-600" : latestGpa < prevGpa ? "text-red-500" : "text-muted-foreground"
                )}>
                  {latestGpa > prevGpa ? "+" : ""}{(latestGpa - prevGpa).toFixed(2)} vs prev
                </span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!hasSemesters ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm bg-muted/30 rounded-xl">
                No approved results yet — trend will appear once results are graded.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gpaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B3CFE" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#0B3CFE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<SemTooltip />} />
                  <ReferenceLine y={1.0} stroke="#dc2626" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: "Min 1.0", position: "right", fontSize: 9, fill: "#dc2626" }} />
                  <ReferenceLine y={4.5} stroke="#eab308" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: "1st Class", position: "right", fontSize: 9, fill: "#eab308" }} />
                  <Area type="monotone" dataKey="gpa" stroke="#0B3CFE" strokeWidth={2.5}
                    fill="url(#gpaGrad)" dot={{ fill: "#0B3CFE", r: 4, strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Graduation Readiness Gauge — 2/5 */}
        <Card className="border-border/60 shadow-sm lg:col-span-2 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-emerald-600" />
              <CardTitle className="text-sm font-semibold">Graduation Readiness</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center gap-3 pb-5">
            <ReadinessGauge score={readiness} />
            <div className="w-full space-y-2 text-xs">
              {/* Breakdown bars */}
              {[
                {
                  label: "Units Progress",
                  pct: Math.round(Math.min(standing.totalUnitsAttempted / REQUIRED_UNITS_DEFAULT, 1) * 100),
                  color: "bg-[#0B3CFE]",
                },
                {
                  label: "GPA Quality",
                  pct: Math.round((standing.cgpa / 5.0) * 100),
                  color: "bg-emerald-500",
                },
                {
                  label: "Min Threshold",
                  pct: standing.cgpa >= 1.0 ? 100 : 0,
                  color: "bg-purple-500",
                },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                    <span>{item.label}</span><span>{item.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-700", item.color)}
                      style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per-semester bar chart */}
      {hasSemesters && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart2 className="size-4 text-indigo-600" />
              <CardTitle className="text-sm font-semibold">Semester-by-Semester Breakdown</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip content={<SemTooltip />} />
                <ReferenceLine y={4.5} stroke="#eab308" strokeDasharray="3 3" strokeWidth={1.5} />
                <ReferenceLine y={1.0} stroke="#dc2626" strokeDasharray="3 3" strokeWidth={1.5} />
                <Bar dataKey="gpa" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={barColors[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Semester detail table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">Semester</th>
                    <th className="text-center py-2 px-2 text-muted-foreground font-medium">GPA</th>
                    <th className="text-center py-2 px-2 text-muted-foreground font-medium">Units</th>
                    <th className="text-center py-2 px-2 text-muted-foreground font-medium">Quality Pts</th>
                    <th className="text-center py-2 px-2 text-muted-foreground font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {standing.semesterBreakdown.map((s, i) => (
                    <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-2 px-2 font-medium capitalize">
                        {s.semester === "first" ? "1st" : "2nd"} Sem · {s.academicYear}
                      </td>
                      <td className={cn("py-2 px-2 text-center font-bold tabular-nums", getCgpaColor(s.gpa))}>
                        {s.gpa.toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-center tabular-nums text-muted-foreground">{s.unitsAttempted}</td>
                      <td className="py-2 px-2 text-center tabular-nums text-muted-foreground">{s.qualityPoints.toFixed(1)}</td>
                      <td className="py-2 px-2 flex justify-center">
                        <TrendIcon current={s.gpa} prev={i > 0 ? standing.semesterBreakdown[i - 1].gpa : undefined} />
                      </td>
                    </tr>
                  ))}
                  {/* Running CGPA row */}
                  <tr className="bg-[#0B3CFE]/5 border-t-2 border-[#0B3CFE]/20 font-semibold">
                    <td className="py-2 px-2 text-[#0B3CFE]">Cumulative (CGPA)</td>
                    <td className={cn("py-2 px-2 text-center font-bold tabular-nums", getCgpaColor(standing.cgpa))}>
                      {standing.cgpa.toFixed(2)}
                    </td>
                    <td className="py-2 px-2 text-center tabular-nums text-[#0B3CFE]">{standing.totalUnitsAttempted}</td>
                    <td className="py-2 px-2 text-center tabular-nums text-[#0B3CFE]">{standing.totalQualityPoints.toFixed(1)}</td>
                    <td className="py-2 px-2" />
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Carryover Courses */}
      {standing.carryoverCourses.length > 0 && (
        <Card className="border-red-200 bg-red-50/50 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-red-600" />
              <CardTitle className="text-sm font-semibold text-red-700">
                Carryover Courses ({standing.carryoverCourses.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-600 mb-3">
              You have failed courses below that must be retaken to meet graduation requirements.
            </p>
            <div className="space-y-2">
              {standing.carryoverCourses.map((c, i) => (
                <div key={i} className="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2.5 border border-red-100">
                  <div>
                    <span className="font-semibold text-xs text-red-800">{c.courseCode}</span>
                    <span className="text-xs text-muted-foreground ml-2">{c.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {c.semester === "first" ? "1st" : "2nd"} Sem {c.academicYear}
                    </span>
                    <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] font-bold px-1.5">
                      {c.grade}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Classification legend */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Award className="size-4 text-[#0B3CFE]" />
            <CardTitle className="text-sm font-semibold">Classification Scale</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { range: "4.50 – 5.00", label: "First Class Honours",                   color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
              { range: "3.50 – 4.49", label: "Second Class Honours (Upper)",           color: "bg-blue-100 text-blue-800 border-blue-200" },
              { range: "2.40 – 3.49", label: "Second Class Honours (Lower)",           color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
              { range: "1.50 – 2.39", label: "Third Class Honours",                    color: "bg-purple-100 text-purple-800 border-purple-200" },
              { range: "1.00 – 1.49", label: "Pass",                                   color: "bg-green-100 text-green-800 border-green-200" },
              { range: "< 1.00",      label: "Fail / Withdrawal Risk",                 color: "bg-red-100 text-red-800 border-red-200" },
            ].map(item => (
              <div key={item.range} className={cn("rounded-xl border px-3 py-2 text-xs", item.color)}>
                <p className="font-bold tabular-nums">{item.range}</p>
                <p className="text-[10px] leading-tight mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">
            * Minimum 120 credit units required for graduation. Readiness score weights: Units (50%), GPA Quality (30%), Minimum Threshold (20%).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
