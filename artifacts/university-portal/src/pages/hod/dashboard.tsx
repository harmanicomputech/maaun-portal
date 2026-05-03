import { useEffect, useState } from "react";
import { PageTransition, StaggerList, StaggerItem } from "@/components/ui/page-transition";
import { HeroCard, StatCard } from "@/components/ui/stat-card";
import { BookOpen, Calendar, Clock, CheckCircle } from "lucide-react";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const BASE = (import.meta.env.BASE_URL || "").replace(/\/$/, "");
const h = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

export default function HodDashboard() {
  const [courses, setCourses]     = useState<any[]>([]);
  const [results, setResults]     = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/courses`,    { headers: h() }).then(r => r.ok ? r.json() : []),
      fetch(`${BASE}/api/results`,    { headers: h() }).then(r => r.ok ? r.json() : []),
      fetch(`${BASE}/api/timetables`, { headers: h() }).then(r => r.ok ? r.json() : []),
    ]).then(([c, res, t]) => {
      setCourses(Array.isArray(c)   ? c   : []);
      setResults(Array.isArray(res) ? res : []);
      setTimetable(Array.isArray(t) ? t   : []);
    }).finally(() => setLoading(false));
  }, []);

  const pending  = results.filter(r => r.status === "pending").length;
  const approved = results.filter(r => ["approved","locked"].includes(r.status)).length;

  return (
    <PageTransition>
      <HeroCard
        title="Head of Department"
        subtitle="Maryam Abacha American University of Nigeria"
        icon={BookOpen}
        chips={[
          { label: "Courses",         value: loading ? "…" : String(courses.length) },
          { label: "Pending Results", value: loading ? "…" : String(pending) },
        ]}
      />

      <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StaggerItem>
          <StatCard label="Total Courses"    value={loading ? "—" : courses.length}   icon={BookOpen}   iconColor="text-primary"    iconBg="bg-primary/10" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Timetable Slots"  value={loading ? "—" : timetable.length} icon={Calendar}   iconColor="text-blue-600"   iconBg="bg-blue-50" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Pending Results"  value={loading ? "—" : pending}           icon={Clock}      iconColor="text-yellow-600" iconBg="bg-yellow-50" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Approved Results" value={loading ? "—" : approved}          icon={CheckCircle} iconColor="text-green-600" iconBg="bg-green-50" />
        </StaggerItem>
      </StaggerList>

      <div className="mt-6">
        <TodaySchedule />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm">Department Courses</h2>
              <p className="text-xs text-muted-foreground mt-0.5">All courses in your department</p>
            </div>
            <Link href="/hod/courses">
              <Button variant="ghost" size="sm" className="text-xs">Manage</Button>
            </Link>
          </div>
          {loading ? (
            <div className="p-6 text-center text-sm text-muted-foreground animate-pulse">Loading…</div>
          ) : courses.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No courses found.</div>
          ) : (
            <div className="divide-y">
              {courses.slice(0, 6).map((c: any) => (
                <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.code} · {c.unit ?? 0} units</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                    c.status === "active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                  }`}>{c.status ?? "active"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm">Pending Results</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Results awaiting review</p>
            </div>
            <Link href="/hod/results">
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </Link>
          </div>
          {loading ? (
            <div className="p-6 text-center text-sm text-muted-foreground animate-pulse">Loading…</div>
          ) : results.filter(r => r.status === "pending").length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500/50" />
              All results are reviewed.
            </div>
          ) : (
            <div className="divide-y">
              {results.filter(r => r.status === "pending").slice(0, 6).map((r: any) => (
                <div key={r.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{r.courseName ?? r.courseCode ?? `Result #${r.id}`}</p>
                    <p className="text-xs text-muted-foreground">{r.studentName ?? ""} · Score: {r.score ?? "—"}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 uppercase">pending</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
