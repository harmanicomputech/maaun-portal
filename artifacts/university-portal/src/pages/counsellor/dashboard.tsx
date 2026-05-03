import { useEffect, useState } from "react";
import { PageTransition, StaggerList, StaggerItem } from "@/components/ui/page-transition";
import { HeroCard, StatCard } from "@/components/ui/stat-card";
import { Heart, Clock, CheckCircle, AlertCircle, User } from "lucide-react";

const BASE = (import.meta.env.BASE_URL || "").replace(/\/$/, "");
const h = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

interface WelfareCase {
  id: number;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  studentName?: string;
}

const priorityColor = (p: string) => {
  if (p === "urgent") return "bg-red-100 text-red-700";
  if (p === "high")   return "bg-orange-100 text-orange-700";
  if (p === "medium") return "bg-yellow-100 text-yellow-700";
  return "bg-muted text-muted-foreground";
};
const statusColor = (s: string) => {
  if (s === "open")        return "bg-blue-100 text-blue-700";
  if (s === "in_progress") return "bg-yellow-100 text-yellow-700";
  if (s === "resolved")    return "bg-green-100 text-green-700";
  return "bg-muted text-muted-foreground";
};

export default function CounsellorDashboard() {
  const [cases, setCases] = useState<WelfareCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/welfare/counsellor/my-cases`, { headers: h() })
      .then(r => r.ok ? r.json() : [])
      .then(setCases)
      .catch(() => setCases([]))
      .finally(() => setLoading(false));
  }, []);

  const open     = cases.filter(c => c.status === "open").length;
  const inProg   = cases.filter(c => c.status === "in_progress").length;
  const resolved = cases.filter(c => c.status === "resolved").length;
  const urgent   = cases.filter(c => c.priority === "urgent" || c.priority === "high").length;

  return (
    <PageTransition>
      <HeroCard
        title="Counsellor Dashboard"
        subtitle="Maryam Abacha American University of Nigeria"
        icon={Heart}
        chips={[
          { label: "Total Cases", value: String(cases.length) },
          { label: "Open",        value: String(open) },
        ]}
      />

      <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StaggerItem>
          <StatCard label="Total Assigned" value={loading ? "—" : cases.length} icon={Heart} iconColor="text-primary" iconBg="bg-primary/10" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Open" value={loading ? "—" : open} icon={Clock} iconColor="text-blue-600" iconBg="bg-blue-50" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="In Progress" value={loading ? "—" : inProg} icon={AlertCircle} iconColor="text-yellow-600" iconBg="bg-yellow-50" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Resolved" value={loading ? "—" : resolved} icon={CheckCircle} iconColor="text-green-600" iconBg="bg-green-50" />
        </StaggerItem>
      </StaggerList>

      {urgent > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm font-medium text-red-700">
            {urgent} case{urgent !== 1 ? "s" : ""} marked as <span className="font-bold">urgent or high priority</span> — please review them promptly.
          </p>
        </div>
      )}

      <div className="mt-6 bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-base">My Assigned Cases</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Cases assigned to you for counselling</p>
        </div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm animate-pulse">Loading cases…</div>
        ) : cases.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            <Heart className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
            No cases assigned to you yet.
          </div>
        ) : (
          <div className="divide-y">
            {cases.slice(0, 10).map(c => (
              <div key={c.id} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.title}</p>
                    {c.studentName && <p className="text-xs text-muted-foreground mt-0.5">{c.studentName}</p>}
                    <p className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${priorityColor(c.priority)}`}>
                    {c.priority}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${statusColor(c.status)}`}>
                    {c.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
