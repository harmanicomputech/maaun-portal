import { useEffect, useState } from "react";
import { PageTransition, StaggerList, StaggerItem } from "@/components/ui/page-transition";
import { HeroCard, StatCard } from "@/components/ui/stat-card";
import { ScrollText, GraduationCap, Clock, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const BASE = (import.meta.env.BASE_URL || "").replace(/\/$/, "");
const h = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

export default function RegistrarDashboard() {
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [graduation, setGraduation]   = useState<any[]>([]);
  const [results, setResults]         = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/transcripts`,           { headers: h() }).then(r => r.ok ? r.json() : []),
      fetch(`${BASE}/api/graduation/admin/list`, { headers: h() }).then(r => r.ok ? r.json() : []),
      fetch(`${BASE}/api/results`,               { headers: h() }).then(r => r.ok ? r.json() : []),
    ]).then(([t, g, res]) => {
      setTranscripts(Array.isArray(t)   ? t   : []);
      setGraduation(Array.isArray(g)    ? g   : []);
      setResults(Array.isArray(res)     ? res : []);
    }).finally(() => setLoading(false));
  }, []);

  const pendingTranscripts = transcripts.filter(t => ["pending","processing"].includes(t.status)).length;
  const pendingGraduation  = graduation.filter(g => g.clearanceStatus === "pending").length;
  const pendingResults     = results.filter(r => r.status === "pending").length;
  const approvedResults    = results.filter(r => ["approved","locked"].includes(r.status)).length;

  return (
    <PageTransition>
      <HeroCard
        title="Registrar Dashboard"
        subtitle="Maryam Abacha American University of Nigeria"
        icon={ScrollText}
        chips={[
          { label: "Pending Transcripts", value: loading ? "…" : String(pendingTranscripts) },
          { label: "Pending Graduation",  value: loading ? "…" : String(pendingGraduation) },
        ]}
      />

      <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StaggerItem>
          <StatCard label="Pending Transcripts" value={loading ? "—" : pendingTranscripts} icon={ScrollText}     iconColor="text-yellow-600" iconBg="bg-yellow-50" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Pending Graduation"  value={loading ? "—" : pendingGraduation}  icon={GraduationCap} iconColor="text-blue-600"   iconBg="bg-blue-50" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Pending Results"     value={loading ? "—" : pendingResults}     icon={Clock}         iconColor="text-red-600"    iconBg="bg-red-50" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Approved Results"    value={loading ? "—" : approvedResults}    icon={CheckCircle}   iconColor="text-green-600"  iconBg="bg-green-50" />
        </StaggerItem>
      </StaggerList>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm">Pending Transcripts</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Transcript requests awaiting processing</p>
            </div>
            <Link href="/registrar/transcripts">
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </Link>
          </div>
          {loading ? (
            <div className="p-6 text-center text-sm text-muted-foreground animate-pulse">Loading…</div>
          ) : transcripts.filter(t => ["pending","processing"].includes(t.status)).length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No pending transcripts.</div>
          ) : (
            <div className="divide-y">
              {transcripts.filter(t => ["pending","processing"].includes(t.status)).slice(0, 5).map(t => (
                <div key={t.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t.studentName ?? t.referenceNumber ?? `#${t.id}`}</p>
                    <p className="text-xs text-muted-foreground">{t.type ?? "Official"} · {new Date(t.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 uppercase">{t.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm">Graduation Clearances</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Students awaiting clearance approval</p>
            </div>
            <Link href="/registrar/graduation">
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </Link>
          </div>
          {loading ? (
            <div className="p-6 text-center text-sm text-muted-foreground animate-pulse">Loading…</div>
          ) : graduation.filter(g => g.clearanceStatus === "pending").length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No pending clearances.</div>
          ) : (
            <div className="divide-y">
              {graduation.filter(g => g.clearanceStatus === "pending").slice(0, 5).map(g => (
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
