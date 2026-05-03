import { useEffect, useState } from "react";
import { PageTransition, StaggerList, StaggerItem } from "@/components/ui/page-transition";
import { HeroCard, StatCard } from "@/components/ui/stat-card";
import { DollarSign, TrendingUp, AlertCircle, XCircle, Receipt } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BASE = (import.meta.env.BASE_URL || "").replace(/\/$/, "");
const h = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

interface Analytics {
  totalRevenue?: number;
  confirmedCount?: number;
  pendingCount?: number;
  reversedCount?: number;
  monthly?: { month: string; amount: number }[];
}

interface ReceiptRow {
  id: number;
  referenceNumber: string;
  amount: number;
  feeName: string;
  status: string;
  studentName: string;
  issuedAt: string | null;
  createdAt: string;
}

const fmt = (n: number | undefined) => `₦${(n ?? 0).toLocaleString()}`;

export default function BursarDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [receipts, setReceipts]   = useState<ReceiptRow[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/finance/analytics`, { headers: h() }).then(r => r.ok ? r.json() : null),
      fetch(`${BASE}/api/receipts`,           { headers: h() }).then(r => r.ok ? r.json() : []),
    ]).then(([a, r]) => {
      setAnalytics(a);
      setReceipts(Array.isArray(r) ? r : []);
    }).finally(() => setLoading(false));
  }, []);

  const monthData = (analytics?.monthly ?? []).map(m => ({
    ...m,
    label: new Date(m.month + "-01").toLocaleDateString("en-NG", { month: "short", year: "2-digit" }),
  }));

  return (
    <PageTransition>
      <HeroCard
        title="Bursar Dashboard"
        subtitle="Maryam Abacha American University of Nigeria"
        icon={DollarSign}
        chips={[
          { label: "Total Revenue",  value: loading ? "…" : fmt(analytics?.totalRevenue) },
          { label: "Confirmed",      value: loading ? "…" : String(analytics?.confirmedCount ?? 0) },
        ]}
      />

      <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StaggerItem>
          <StatCard label="Total Revenue"  value={loading ? "—" : fmt(analytics?.totalRevenue)}  icon={TrendingUp}   iconColor="text-green-600"  iconBg="bg-green-50" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Confirmed"      value={loading ? "—" : analytics?.confirmedCount ?? 0} icon={Receipt}      iconColor="text-primary"    iconBg="bg-primary/10" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Pending"        value={loading ? "—" : analytics?.pendingCount ?? 0}   icon={AlertCircle}  iconColor="text-yellow-600" iconBg="bg-yellow-50" />
        </StaggerItem>
        <StaggerItem>
          <StatCard label="Reversed"       value={loading ? "—" : analytics?.reversedCount ?? 0}  icon={XCircle}      iconColor="text-red-600"    iconBg="bg-red-50" />
        </StaggerItem>
      </StaggerList>

      {monthData.length > 0 && (
        <div className="mt-6 bg-card rounded-2xl border shadow-sm p-6">
          <h2 className="font-semibold text-sm mb-4">Monthly Revenue (last 12 months)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `₦${(Number(v) / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`₦${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-6 bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-base">Recent Receipts</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Latest payment receipts across all students</p>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">Loading receipts…</div>
        ) : receipts.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No receipts yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {["Reference", "Student", "Fee", "Amount", "Status", "Date"].map(col => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {receipts.slice(0, 8).map(r => (
                <tr key={r.id} className="hover:bg-primary/[0.03] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.referenceNumber}</td>
                  <td className="px-4 py-3 font-medium">{r.studentName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.feeName}</td>
                  <td className="px-4 py-3 font-semibold text-green-700">₦{r.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                      r.status === "confirmed" ? "bg-green-100 text-green-700" :
                      r.status === "reversed"  ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(r.issuedAt ?? r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PageTransition>
  );
}
