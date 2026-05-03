import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Trophy, Target, Minus, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SemesterGPA {
  academicYear: string;
  semester: string;
  gpa: number;
  unitsAttempted: number;
}

interface AcademicStanding {
  cgpa: number;
  classification: string;
  status: string;
  totalUnitsAttempted: number;
  semesterBreakdown: SemesterGPA[];
  carryoverCourses: unknown[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });
const REQUIRED_UNITS = 120;

function getCgpaColor(cgpa: number) {
  if (cgpa >= 4.5) return "text-yellow-600";
  if (cgpa >= 3.5) return "text-blue-600";
  if (cgpa >= 2.4) return "text-indigo-600";
  if (cgpa >= 1.5) return "text-purple-600";
  if (cgpa >= 1.0) return "text-green-600";
  return "text-red-600";
}

function computeReadiness(s: AcademicStanding): number {
  const unitProgress = Math.min(s.totalUnitsAttempted / REQUIRED_UNITS, 1.0);
  const cgpaQuality = Math.min(s.cgpa / 5.0, 1.0);
  const meetsMin = s.cgpa >= 1.0 ? 1 : 0;
  return Math.round((unitProgress * 0.5 + cgpaQuality * 0.3 + meetsMin * 0.2) * 100);
}

function semLabelShort(s: SemesterGPA) {
  const [start] = s.academicYear.split("/");
  return `${s.semester === "first" ? "S1" : "S2"}'${start?.slice(2) ?? ""}`;
}

// ── Mini Sparkline Tooltip ────────────────────────────────────────────────────

function SparkTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/70 rounded-lg px-2 py-1 text-[10px] shadow">
      <span className={cn("font-bold", getCgpaColor(payload[0].value))}>
        {payload[0].value.toFixed(2)}
      </span>
      <span className="text-muted-foreground ml-1">GPA</span>
    </div>
  );
}

// ── Widget ────────────────────────────────────────────────────────────────────

export function AcademicProgressWidget() {
  const { data: standing, isLoading } = useQuery<AcademicStanding>({
    queryKey: ["academic-standing-my"],       // shares cache with progress page
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/academic-standing/my`, { headers: authHeaders() });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const chartData = (standing?.semesterBreakdown ?? []).map(s => ({
    label: semLabelShort(s),
    gpa: s.gpa,
  }));

  const latest = chartData.at(-1)?.gpa;
  const prev   = chartData.at(-2)?.gpa;
  const trend  = latest !== undefined && prev !== undefined ? latest - prev : 0;
  const readiness = standing ? computeReadiness(standing) : 0;
  const unitPct = standing
    ? Math.min(Math.round(standing.totalUnitsAttempted / REQUIRED_UNITS * 100), 100)
    : 0;

  const readinessColor =
    readiness >= 80 ? "text-green-600" :
    readiness >= 60 ? "text-[#0B3CFE]" :
    readiness >= 40 ? "text-amber-600" : "text-red-600";

  const readinessBarColor =
    readiness >= 80 ? "bg-green-500" :
    readiness >= 60 ? "bg-[#0B3CFE]" :
    readiness >= 40 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-[#0B3CFE]/10 flex items-center justify-center">
            <TrendingUp className="size-3.5 text-[#0B3CFE]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight">Academic Progress</h3>
            <p className="text-[10px] text-muted-foreground">GPA trend & graduation readiness</p>
          </div>
        </div>
        <Link href="/student/progress">
          <button className="text-[10px] font-medium text-[#0B3CFE] flex items-center gap-0.5 hover:underline">
            Full report <ArrowRight className="size-2.5" />
          </button>
        </Link>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-5 w-full" />
          </div>
        ) : !standing ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            No approved results yet — progress will appear once results are graded.
          </div>
        ) : (
          <>
            {/* CGPA + trend */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground">Cumulative GPA</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <Trophy className={cn("size-4", getCgpaColor(standing.cgpa))} />
                  <span className={cn("text-2xl font-bold tabular-nums", getCgpaColor(standing.cgpa))}>
                    {standing.cgpa.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">/5.00</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[140px]">
                  {standing.classification}
                </p>
              </div>

              {/* Trend indicator */}
              {chartData.length >= 2 && (
                <div className="flex flex-col items-center gap-0.5">
                  {trend > 0 ? (
                    <TrendingUp className="size-4 text-green-600" />
                  ) : trend < 0 ? (
                    <TrendingDown className="size-4 text-red-500" />
                  ) : (
                    <Minus className="size-4 text-muted-foreground" />
                  )}
                  <span className={cn("text-[10px] font-semibold tabular-nums",
                    trend > 0 ? "text-green-600" : trend < 0 ? "text-red-500" : "text-muted-foreground"
                  )}>
                    {trend > 0 ? "+" : ""}{trend.toFixed(2)}
                  </span>
                  <span className="text-[9px] text-muted-foreground">vs last sem</span>
                </div>
              )}
            </div>

            {/* Sparkline */}
            {chartData.length > 0 ? (
              <div className="h-16 -mx-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 2, right: 4, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0B3CFE" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#0B3CFE" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <YAxis domain={[0, 5]} hide />
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false} tickLine={false} />
                    <Tooltip content={<SparkTooltip />} />
                    <Area type="monotone" dataKey="gpa" stroke="#0B3CFE" strokeWidth={2}
                      fill="url(#sparkGrad)"
                      dot={{ fill: "#0B3CFE", r: 3, strokeWidth: 1.5, stroke: "#fff" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-[10px] text-muted-foreground text-center py-3 bg-muted/30 rounded-xl">
                GPA trend appears after first semester results
              </p>
            )}

            {/* Readiness + units row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Graduation readiness */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                  <div className="flex items-center gap-1">
                    <Target className="size-2.5" />
                    <span>Grad Readiness</span>
                  </div>
                  <span className={cn("font-bold", readinessColor)}>{readiness}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-700", readinessBarColor)}
                    style={{ width: `${readiness}%` }} />
                </div>
              </div>

              {/* Units */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Units Done</span>
                  <span className="font-bold text-[#0B3CFE]">{unitPct}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-[#0B3CFE] rounded-full transition-all duration-700"
                    style={{ width: `${unitPct}%` }} />
                </div>
              </div>
            </div>

            {/* Carryover warning */}
            {standing.carryoverCourses.length > 0 && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                <span className="text-red-600 text-[10px] font-medium">
                  ⚠️ {standing.carryoverCourses.length} carryover course{standing.carryoverCourses.length > 1 ? "s" : ""} — action required
                </span>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <Link href="/student/progress">
          <button className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#0B3CFE] hover:underline py-1 rounded-lg hover:bg-[#0B3CFE]/5 transition-colors">
            View full progress report
            <ArrowRight className="size-3" />
          </button>
        </Link>
      </div>
    </div>
  );
}
