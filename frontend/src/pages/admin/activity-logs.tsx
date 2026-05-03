import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, RefreshCw, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
function authHeaders() { return { Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` }; }

const actionColors: Record<string, string> = {
  create: "bg-green-100 text-green-700",
  create_result: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  update_result: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  submit_result: "bg-yellow-100 text-yellow-700",
  approve_result: "bg-green-100 text-green-700",
  lock_result: "bg-gray-100 text-gray-700",
  payment_success: "bg-emerald-100 text-emerald-700",
  activate: "bg-purple-100 text-purple-700",
};

export default function AdminActivityLogs() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const LIMIT = 50;

  const load = async (offset = 0) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE()}/api/activity-logs?limit=${LIMIT}&offset=${offset}`, { headers: authHeaders() });
      setLogs(data);
    } catch { toast({ title: "Failed to load activity logs", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(page * LIMIT); }, [page]);

  const filtered = logs.filter(l => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (l.userName || "").toLowerCase().includes(s)
      || (l.action || "").toLowerCase().includes(s)
      || (l.model || "").toLowerCase().includes(s)
      || (l.userEmail || "").toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Activity Audit Log</h1>
          <p className="text-muted-foreground mt-1">Track all system actions and changes</p>
        </div>
        <Button variant="outline" onClick={() => load(page * LIMIT)}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by user, action, model..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Activity className="w-4 h-4" />Recent Activities ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No activity logs found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/40">
                  <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Time</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">User</th>
                  <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Action</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Resource</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Details</th>
                </tr></thead>
                <tbody>
                  {filtered.map(log => (
                    <tr key={log.id} className="border-b hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm">{log.userName || "System"}</p>
                        <p className="text-xs text-muted-foreground">{log.userRole}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={actionColors[log.action] || "bg-gray-100 text-gray-600"} variant="secondary">
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-muted-foreground capitalize">{log.model}</span>
                        {log.modelId && <span className="text-xs text-muted-foreground/70"> #{log.modelId}</span>}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {log.newData && (
                          <details className="cursor-pointer">
                            <summary className="text-xs text-muted-foreground hover:text-foreground">View data</summary>
                            <pre className="text-xs bg-muted rounded p-2 mt-1 max-h-24 overflow-auto max-w-xs">{JSON.stringify(log.newData, null, 2)}</pre>
                          </details>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Previous</Button>
        <span className="text-sm text-muted-foreground">Page {page + 1}</span>
        <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={logs.length < LIMIT}>Next</Button>
      </div>
    </div>
  );
}
