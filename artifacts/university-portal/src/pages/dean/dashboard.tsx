import { useEffect, useState } from "react";
import { PageTransition, StaggerList, StaggerItem } from "@/components/ui/page-transition";
import { HeroCard, StatCard } from "@/components/ui/stat-card";
import { Crown, GraduationCap, Clock, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const BASE = (import.meta.env.BASE_URL || "").replace(/\/$/, "");
const h = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

export default function DeanDashboard() {
  const [results, setResults] = useState<any[]>([]);
  const [graduation, setGrad] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/results`,               { headers: h() }).then(r => r.ok ? r.json() : []),
      fetch(`${BASE}/api/graduation/admin/list`, { headers: h() }).then(r => r.ok ? r.json() : []),
    ]).then(([res, grad]) => {
      setResults(Array.isArray(res)  ? res  : []);
      setGrad(Array.isArray(grad)    ? grad : []);
    }).finally(() => setLoading(false));
  }, []);

  const pendingResults  = results.filter(r => r.status === "pending").length;
  const approvedResults = results.filter(r => ["approved","locked"].includes(r.status)).length;
  const pendingGrad     = graduation.filter(g => g.clearanceStatus === "pending").length;
  const approvedGrad    = graduation.filter(g => g.clearanceStatus === "approved").length;

  return (
    <PageTransition>
      <HeroCard
        title="Dean's Dashboard"
        subtitle="Maryam Abacha American University of Nigeria"
        icon={Crown}
        chips={[
          { label: "Pending Results",   value: loading ? "…" : String(pendingResults) },
          { label: "Pending Clearance", value: loading ? "…" : String(pendingGrad) },
        ]}
      />

      <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StaggerItem>
          <StatCard label="Pending Results"   value={loading ? "—" : pendingResults}  icon={Clock}        iconColor="text-yellow-600" iconBg="bg-yellow-50" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Approved Results"  value={loading ? "—" : approvedResults} icon={CheckCircle}  iconColor="text-green-600"  iconBg="bg-green-50" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Pending Graduation" value={loading ? "—" : pendingGrad}   icon={GraduationCap} iconColor="text-blue-600"   iconBg="bg-blue-50" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Cleared Students"  value={loading ? "—" : approvedGrad}   icon={Crown}        iconColor="text-primary"    iconBg="bg-primary/10" />
        </StaggerItem>
      </StaggerList>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm">Results Pending Approval</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Faculty results awaiting your review</p>
            </div>
            <Link href="/dean/results">
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </Link>
          </div>
          {loading ? (
            <div className="p-6 text-center text-sm text-muted-foreground animate-pulse">Loading…</div>
          ) : results.filter(r => r.status === "pending").length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500/50" />
              No pending results.
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

        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm">Graduation Clearances</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Students pending faculty clearance</p>
            </div>
            <Link href="/dean/graduation">
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </Link>
          </div>
          {loading ? (
            <div className="p-6 text-center text-sm text-muted-foreground animate-pulse">Loading…</div>
          ) : graduation.filter(g => g.clearanceStatus === "pending").length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No pending clearances.</div>
          ) : (
            <div className="divide-y">
              {graduation.filter(g => g.clearanceStatus === "pending").slice(0, 6).map((g: any) => (
                <div key={g.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{g.name ?? `Student #${g.studentId}`}</p>
                    <p className="text-xs text-muted-foreground">{g.department ?? ""} · {g.level ?? ""}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase">{g.clearanceStatus}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
