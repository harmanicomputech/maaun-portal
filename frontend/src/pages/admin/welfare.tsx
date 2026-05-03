import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart, DollarSign, Shield, BookOpen, HelpCircle, Search, RefreshCw,
  Lock, User, MessageSquare, CheckCircle, Clock, UserCheck, AlertCircle,
  ChevronRight, Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

const CATEGORY_CFG: Record<string, { icon: any; label: string; color: string; bg: string }> = {
  mental_health:    { icon: Heart,      label: "Mental Health",       color: "text-purple-700", bg: "bg-purple-100" },
  financial_support:{ icon: DollarSign, label: "Financial Support",   color: "text-blue-700",   bg: "bg-blue-100" },
  harassment:       { icon: Shield,     label: "Harassment / Safety", color: "text-orange-700", bg: "bg-orange-100" },
  academic_stress:  { icon: BookOpen,   label: "Academic Stress",     color: "text-teal-700",   bg: "bg-teal-100" },
  other:            { icon: HelpCircle, label: "Other Support",       color: "text-gray-700",   bg: "bg-gray-100" },
};

const PRIORITY_CFG: Record<string, { color: string; label: string; dot: string }> = {
  low:    { color: "bg-emerald-100 text-emerald-700", label: "Low",    dot: "bg-emerald-400" },
  medium: { color: "bg-sky-100 text-sky-700",         label: "Medium", dot: "bg-sky-400" },
  high:   { color: "bg-amber-100 text-amber-700",     label: "High",   dot: "bg-amber-400" },
  urgent: { color: "bg-rose-100 text-rose-800",       label: "Urgent", dot: "bg-rose-500" },
};

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  submitted:   { label: "Submitted",   color: "bg-slate-100 text-slate-700" },
  assigned:    { label: "Assigned",    color: "bg-blue-100 text-blue-700" },
  in_progress: { label: "In Progress", color: "bg-amber-100 text-amber-700" },
  resolved:    { label: "Resolved",    color: "bg-teal-100 text-teal-700" },
  closed:      { label: "Closed",      color: "bg-gray-100 text-gray-500" },
};

const SENSITIVE = ["mental_health", "harassment"];

export default function AdminWelfare() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [assignCounsellorId, setAssignCounsellorId] = useState("");

  const { data: cases = [], isLoading, refetch, isFetching } = useQuery<any[]>({
    queryKey: ["admin-welfare"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/welfare/admin/all`, { headers: authHeaders() }); return data; },
  });

  const { data: counsellors = [] } = useQuery<any[]>({
    queryKey: ["welfare-counsellors"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/welfare/admin/counsellors`, { headers: authHeaders() }); return data; },
  });

  const { data: caseDetail, isLoading: detailLoading } = useQuery<any>({
    queryKey: ["admin-welfare-detail", selectedId],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/welfare/admin/cases/${selectedId}`, { headers: authHeaders() }); return data; },
    enabled: !!selectedId,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-welfare"] });
    qc.invalidateQueries({ queryKey: ["admin-welfare-detail", selectedId] });
  };

  const priorityMut = useMutation({
    mutationFn: async ({ id, priority }: { id: number; priority: string }) => {
      const { data } = await axios.patch(`${BASE()}/api/welfare/admin/cases/${id}/priority`, { priority }, { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Priority updated" }); invalidate(); },
    onError: () => toast({ title: "Failed", variant: "destructive" }),
  });

  const statusMut = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await axios.patch(`${BASE()}/api/welfare/admin/cases/${id}/status`, { status }, { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Status updated" }); invalidate(); },
    onError: () => toast({ title: "Failed", variant: "destructive" }),
  });

  const assignMut = useMutation({
    mutationFn: async ({ id, counsellorId }: { id: number; counsellorId: number }) => {
      const { data } = await axios.post(`${BASE()}/api/welfare/admin/cases/${id}/assign`, { counsellorId }, { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Case assigned to counsellor" }); invalidate(); setAssignCounsellorId(""); },
    onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed", variant: "destructive" }),
  });

  const noteMut = useMutation({
    mutationFn: async ({ id, note, isPrivate }: { id: number; note: string; isPrivate: boolean }) => {
      const { data } = await axios.post(`${BASE()}/api/welfare/cases/${id}/notes`, { note, isPrivate }, { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Note added" }); invalidate(); setNoteText(""); },
    onError: () => toast({ title: "Failed", variant: "destructive" }),
  });

  const stats = {
    total: cases.length,
    urgent: cases.filter((c: any) => c.priority === "urgent").length,
    unassigned: cases.filter((c: any) => c.status === "submitted").length,
    inProgress: cases.filter((c: any) => c.status === "in_progress").length,
    resolved: cases.filter((c: any) => c.status === "resolved" || c.status === "closed").length,
  };

  const filtered = cases.filter((c: any) => {
    if (search && !c.studentName.toLowerCase().includes(search.toLowerCase()) && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (filterCategory !== "all" && c.category !== filterCategory) return false;
    if (filterPriority !== "all" && c.priority !== filterPriority) return false;
    return true;
  });

  const d = caseDetail;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Student Welfare Management</h1>
          <p className="text-muted-foreground mt-1">Review, assign, and respond to student welfare requests</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Cases",  value: stats.total,      color: "text-primary" },
          { label: "Urgent",       value: stats.urgent,     color: "text-rose-600" },
          { label: "Unassigned",   value: stats.unassigned, color: "text-amber-600" },
          { label: "In Progress",  value: stats.inProgress, color: "text-blue-600" },
          { label: "Resolved",     value: stats.resolved,   color: "text-teal-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}><CardContent className="p-3 text-center">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className={`${selectedId ? "grid grid-cols-1 lg:grid-cols-2 gap-4" : ""}`}>
        {/* Left: list */}
        <div className="space-y-3">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
            <div className="relative flex-1 min-w-40">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9 h-9" placeholder="Search student or title..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(STATUS_CFG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(CATEGORY_CFG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {Object.entries(PRIORITY_CFG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Heart className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>No welfare cases found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((c: any) => {
                const cat = CATEGORY_CFG[c.category] ?? CATEGORY_CFG.other;
                const Icon = cat.icon;
                const prio = PRIORITY_CFG[c.priority] ?? PRIORITY_CFG.medium;
                const st = STATUS_CFG[c.status] ?? STATUS_CFG.submitted;
                const isSensitive = SENSITIVE.includes(c.category);
                const isSelected = selectedId === c.id;
                return (
                  <Card key={c.id} className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-teal-400 border-teal-300" : "hover:border-teal-200"} ${c.priority === "urgent" ? "border-l-4 border-l-rose-400" : ""}`}
                    onClick={() => setSelectedId(isSelected ? null : c.id)}>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cat.bg}`}>
                          <Icon className={`w-4 h-4 ${cat.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${prio.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${prio.dot}`} />{prio.label}
                            </span>
                            <Badge className={`text-[9px] ${st.color}`}>{st.label}</Badge>
                            {isSensitive && <Badge className="text-[9px] bg-purple-100 text-purple-700"><Lock className="w-2 h-2 mr-0.5" />Confidential</Badge>}
                          </div>
                          <p className="font-semibold text-xs truncate">{c.title}</p>
                          <p className="text-[10px] text-muted-foreground">{c.studentName} · {c.matricNumber}</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: detail panel */}
        {selectedId && (
          <div className="border rounded-xl overflow-hidden">
            <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
              <span className="font-semibold text-sm flex items-center gap-2"><Heart className="w-4 h-4 text-teal-600" />Case Review</span>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setSelectedId(null)}>Close</Button>
            </div>

            {detailLoading ? (
              <div className="p-4 space-y-3"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-40" /></div>
            ) : d ? (
              <ScrollArea className="h-[calc(100vh-360px)] min-h-80">
                <div className="p-4 space-y-4">
                  {/* Student info */}
                  <div className="bg-muted/40 rounded-lg p-3">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {d.isConfidential && <Badge className="text-[10px] bg-purple-100 text-purple-700"><Lock className="w-2.5 h-2.5 mr-0.5" />Confidential Case</Badge>}
                      <Badge className={`text-[10px] ${PRIORITY_CFG[d.priority]?.color}`}>{PRIORITY_CFG[d.priority]?.label}</Badge>
                      <Badge className={`text-[10px] ${STATUS_CFG[d.status]?.color}`}>{STATUS_CFG[d.status]?.label}</Badge>
                    </div>
                    <p className="font-semibold text-sm mt-1">{d.studentName}</p>
                    <p className="text-xs text-muted-foreground">{d.matricNumber} · {d.department} · Level {d.level}</p>
                  </div>

                  {/* Case details */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">{CATEGORY_CFG[d.category]?.label ?? d.category} — {d.title}</p>
                    <div className="bg-muted/30 rounded-lg p-3 text-xs">{d.description}</div>
                  </div>

                  {/* Quick actions row */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Priority</label>
                      <Select value={d.priority} onValueChange={v => priorityMut.mutate({ id: d.id, priority: v })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Status</label>
                      <Select value={d.status} onValueChange={v => statusMut.mutate({ id: d.id, status: v })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="assigned">Assigned</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Assign counsellor */}
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                      {d.assignment ? `Assigned to: ${d.assignment.counsellorName}` : "Assign Counsellor"}
                    </label>
                    {counsellors.length === 0 ? (
                      <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg p-2">
                        No counsellor accounts found. Ask your IT admin to set a user's role to "counsellor".
                      </p>
                    ) : (
                      <div className="flex gap-2">
                        <Select value={assignCounsellorId} onValueChange={setAssignCounsellorId}>
                          <SelectTrigger className="h-8 text-xs flex-1"><SelectValue placeholder="Select counsellor..." /></SelectTrigger>
                          <SelectContent>
                            {counsellors.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Button size="sm" className="h-8 px-3 text-xs bg-teal-600 hover:bg-teal-700 text-white shrink-0"
                          disabled={!assignCounsellorId || assignMut.isPending}
                          onClick={() => assignMut.mutate({ id: d.id, counsellorId: parseInt(assignCounsellorId) })}>
                          <UserCheck className="w-3.5 h-3.5 mr-1" />{d.assignment ? "Reassign" : "Assign"}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Case Notes ({d.notes?.length ?? 0})</p>
                    {d.notes?.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">No notes yet.</p>}
                    <div className="space-y-2 mb-3">
                      {(d.notes ?? []).map((n: any) => (
                        <div key={n.id} className={`rounded-lg p-2.5 border text-xs ${n.isPrivate ? "bg-amber-50 border-amber-200" : "bg-teal-50 border-teal-100"}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className={`w-3 h-3 ${n.isPrivate ? "text-amber-600" : "text-teal-600"}`} />
                            <span className={`font-semibold text-[10px] ${n.isPrivate ? "text-amber-800" : "text-teal-800"}`}>{n.authorName}</span>
                            {n.isPrivate && <span className="text-[9px] bg-amber-200 text-amber-800 px-1 rounded">Internal</span>}
                            <span className="text-[10px] text-muted-foreground ml-auto">{new Date(n.createdAt).toLocaleDateString("en-NG")}</span>
                          </div>
                          <p className={n.isPrivate ? "text-amber-900" : "text-teal-900"}>{n.note}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add note */}
                    <div className="border rounded-lg p-3 bg-muted/20 space-y-2">
                      <Textarea placeholder="Add a note..." rows={2} value={noteText} onChange={e => setNoteText(e.target.value)} className="text-xs resize-none" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch checked={isPrivate} onCheckedChange={setIsPrivate} id="private-sw" />
                          <label htmlFor="private-sw" className="text-xs text-muted-foreground cursor-pointer">
                            {isPrivate ? "Internal note" : "Shared with student"}
                          </label>
                        </div>
                        <Button size="sm" className="h-7 px-3 text-xs bg-teal-600 hover:bg-teal-700 text-white"
                          disabled={!noteText.trim() || noteMut.isPending}
                          onClick={() => noteMut.mutate({ id: d.id, note: noteText, isPrivate })}>
                          <Send className="w-3 h-3 mr-1" />{noteMut.isPending ? "..." : "Add"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
