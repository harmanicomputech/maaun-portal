import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ShieldAlert, Plus, Search, RefreshCw, Gavel, CheckCircle, XCircle,
  Clock, AlertTriangle, UserX, BookOpen, Home,
  GraduationCap, Eye, Flag, Scale, Send, MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

const SEVERITY_CFG: Record<string, { color: string; bg: string; label: string }> = {
  minor:    { color: "text-green-700",  bg: "bg-green-100",  label: "Minor" },
  moderate: { color: "text-yellow-700", bg: "bg-yellow-100", label: "Moderate" },
  major:    { color: "text-orange-700", bg: "bg-orange-100", label: "Major" },
  critical: { color: "text-red-700",    bg: "bg-red-100",    label: "Critical" },
};

const STATUS_CFG: Record<string, { icon: any; color: string; label: string }> = {
  open:         { icon: AlertTriangle, color: "bg-blue-100 text-blue-700",    label: "Open" },
  under_review: { icon: Clock,         color: "bg-yellow-100 text-yellow-700",label: "Under Review" },
  resolved:     { icon: CheckCircle,   color: "bg-green-100 text-green-700",  label: "Resolved" },
  dismissed:    { icon: XCircle,       color: "bg-gray-100 text-gray-600",    label: "Dismissed" },
};

const APPEAL_STATUS_CFG: Record<string, { color: string; label: string; icon: any }> = {
  submitted:    { color: "bg-blue-100 text-blue-700",    label: "Submitted",    icon: Send },
  under_review: { color: "bg-yellow-100 text-yellow-700",label: "Under Review", icon: Clock },
  accepted:     { color: "bg-green-100 text-green-700",  label: "Accepted",     icon: CheckCircle },
  rejected:     { color: "bg-red-100 text-red-700",      label: "Rejected",     icon: XCircle },
};

const ACTION_OPTIONS = [
  { value: "warning",     label: "Formal Warning",    icon: AlertTriangle, desc: "Formal record, no system restriction" },
  { value: "suspension",  label: "Suspension",         icon: BookOpen,      desc: "Blocks course registration + graduation" },
  { value: "restriction", label: "Hostel Restriction", icon: Home,          desc: "Blocks hostel application access" },
  { value: "expulsion",   label: "Expulsion",          icon: UserX,         desc: "Full system restriction on all services" },
];

const FLAG_CFG: Record<string, { icon: any; label: string; color: string }> = {
  academic_hold:    { icon: BookOpen,      label: "Academic Hold",      color: "text-orange-600 bg-orange-50 border-orange-200" },
  hostel_block:     { icon: Home,          label: "Hostel Block",       color: "text-purple-600 bg-purple-50 border-purple-200" },
  graduation_block: { icon: GraduationCap, label: "Graduation Block",   color: "text-red-600 bg-red-50 border-red-200" },
  account_disabled: { icon: UserX,         label: "Account Restricted", color: "text-red-700 bg-red-100 border-red-300" },
};

const BORDER_COLORS: Record<string, string> = {
  minor: "border-l-green-400", moderate: "border-l-yellow-400",
  major: "border-l-orange-400", critical: "border-l-red-500",
};

export default function AdminDisciplinary() {
  const { toast } = useToast();
  const qc = useQueryClient();

  // Cases state
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [detailCase, setDetailCase] = useState<any | null>(null);
  const [statusTarget, setStatusTarget] = useState<{ id: number; current: string } | null>(null);
  const [createForm, setCreateForm] = useState({ studentId: "", title: "", description: "", severity: "minor" });
  const [actionForm, setActionForm] = useState({ actionType: "warning", startDate: "", endDate: "", remarks: "" });
  const [newStatus, setNewStatus] = useState("under_review");
  const [resolutionNote, setResolutionNote] = useState("");

  // Appeals state
  const [selectedAppeal, setSelectedAppeal] = useState<any | null>(null);
  const [appealSearch, setAppealSearch] = useState("");
  const [appealFilterStatus, setAppealFilterStatus] = useState("all");
  const [decisionForm, setDecisionForm] = useState({ decision: "uphold", modifiedAction: "warning", remarks: "", adminResponse: "" });

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: cases = [], isLoading, refetch, isFetching } = useQuery<any[]>({
    queryKey: ["admin-disciplinary"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/disciplinary/admin/cases`, { headers: authHeaders() }); return data; },
  });

  const { data: flags = [], refetch: refetchFlags } = useQuery<any[]>({
    queryKey: ["admin-disciplinary-flags"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/disciplinary/admin/flags`, { headers: authHeaders() }); return data; },
  });

  const { data: caseDetail } = useQuery<any>({
    queryKey: ["disciplinary-case", detailCase?.id],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/disciplinary/admin/cases/${detailCase!.id}`, { headers: authHeaders() }); return data; },
    enabled: !!detailCase,
  });

  const { data: appeals = [], refetch: refetchAppeals } = useQuery<any[]>({
    queryKey: ["admin-appeals"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/appeals/admin/all`, { headers: authHeaders() }); return data; },
  });

  const { data: appealDetail, isLoading: appealDetailLoading } = useQuery<any>({
    queryKey: ["appeal-detail", selectedAppeal?.id],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/appeals/admin/${selectedAppeal!.id}`, { headers: authHeaders() }); return data; },
    enabled: !!selectedAppeal,
  });

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["admin-disciplinary"] });
    qc.invalidateQueries({ queryKey: ["admin-disciplinary-flags"] });
    qc.invalidateQueries({ queryKey: ["admin-appeals"] });
    qc.invalidateQueries({ queryKey: ["disciplinary-case", detailCase?.id] });
    qc.invalidateQueries({ queryKey: ["appeal-detail", selectedAppeal?.id] });
  };

  // ── Mutations ──────────────────────────────────────────────────────────────
  const createMut = useMutation({
    mutationFn: async (form: typeof createForm) => {
      const { data } = await axios.post(`${BASE()}/api/disciplinary/admin/cases`, { ...form, studentId: parseInt(form.studentId) }, { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Case created" }); invalidateAll(); setCreateOpen(false); setCreateForm({ studentId: "", title: "", description: "", severity: "minor" }); },
    onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed", variant: "destructive" }),
  });

  const statusMut = useMutation({
    mutationFn: async ({ id, status, resolutionNote }: { id: number; status: string; resolutionNote?: string }) => {
      const { data } = await axios.patch(`${BASE()}/api/disciplinary/admin/cases/${id}/status`, { status, resolutionNote }, { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Status updated" }); invalidateAll(); setStatusTarget(null); setResolutionNote(""); },
    onError: () => toast({ title: "Failed", variant: "destructive" }),
  });

  const actionMut = useMutation({
    mutationFn: async ({ id, form }: { id: number; form: typeof actionForm }) => {
      const { data } = await axios.post(`${BASE()}/api/disciplinary/admin/cases/${id}/action`, form, { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Sanction applied" }); invalidateAll(); setActionOpen(false); setActionForm({ actionType: "warning", startDate: "", endDate: "", remarks: "" }); },
    onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed", variant: "destructive" }),
  });

  const liftFlagMut = useMutation({
    mutationFn: async (id: number) => { const { data } = await axios.patch(`${BASE()}/api/disciplinary/admin/flags/${id}/lift`, {}, { headers: authHeaders() }); return data; },
    onSuccess: () => { toast({ title: "Flag lifted" }); invalidateAll(); },
    onError: () => toast({ title: "Failed", variant: "destructive" }),
  });

  const reviewMut = useMutation({
    mutationFn: async (id: number) => { const { data } = await axios.patch(`${BASE()}/api/appeals/admin/${id}/review`, {}, { headers: authHeaders() }); return data; },
    onSuccess: () => { toast({ title: "Appeal marked under review" }); invalidateAll(); },
    onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed", variant: "destructive" }),
  });

  const decisionMut = useMutation({
    mutationFn: async ({ id, form }: { id: number; form: typeof decisionForm }) => {
      const { data } = await axios.post(`${BASE()}/api/appeals/admin/${id}/decision`, form, { headers: authHeaders() }); return data;
    },
    onSuccess: () => {
      toast({ title: "Decision recorded" });
      invalidateAll();
      setSelectedAppeal(null);
      setDecisionForm({ decision: "uphold", modifiedAction: "warning", remarks: "", adminResponse: "" });
    },
    onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed", variant: "destructive" }),
  });

  // ── Derived ────────────────────────────────────────────────────────────────
  const stats = {
    total: cases.length,
    open: cases.filter((c: any) => c.status === "open").length,
    review: cases.filter((c: any) => c.status === "under_review").length,
    critical: cases.filter((c: any) => c.severity === "critical").length,
    activeFlags: flags.length,
    pendingAppeals: appeals.filter((a: any) => a.status === "submitted" || a.status === "under_review").length,
  };

  const filteredCases = cases.filter((c: any) => {
    if (search && !c.studentName.toLowerCase().includes(search.toLowerCase()) && !c.matricNumber.toLowerCase().includes(search.toLowerCase()) && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (filterSeverity !== "all" && c.severity !== filterSeverity) return false;
    return true;
  });

  const filteredAppeals = appeals.filter((a: any) => {
    if (appealSearch && !a.studentName.toLowerCase().includes(appealSearch.toLowerCase()) && !a.matricNumber.toLowerCase().includes(appealSearch.toLowerCase()) && !a.caseTitle.toLowerCase().includes(appealSearch.toLowerCase())) return false;
    if (appealFilterStatus !== "all" && a.status !== appealFilterStatus) return false;
    return true;
  });

  const shown = detailCase ? (caseDetail ?? detailCase) : null;
  const ad = appealDetail ?? selectedAppeal;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Disciplinary Management</h1>
          <p className="text-muted-foreground mt-1">Cases, sanctions, flags, and student appeals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { refetch(); refetchFlags(); refetchAppeals(); }} disabled={isFetching} size="sm">
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />Refresh
          </Button>
          <Button onClick={() => setCreateOpen(true)} size="sm"><Plus className="w-4 h-4 mr-1.5" />New Case</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: "Total",    value: stats.total,         color: "text-primary" },
          { label: "Open",     value: stats.open,          color: "text-blue-600" },
          { label: "Review",   value: stats.review,        color: "text-yellow-600" },
          { label: "Critical", value: stats.critical,      color: "text-red-600" },
          { label: "Flags",    value: stats.activeFlags,   color: "text-orange-600" },
          { label: "Appeals",  value: stats.pendingAppeals,color: "text-purple-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}><CardContent className="p-3 text-center">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="cases">
        <TabsList className="grid w-full grid-cols-3 max-w-sm">
          <TabsTrigger value="cases">Cases</TabsTrigger>
          <TabsTrigger value="flags">Flags</TabsTrigger>
          <TabsTrigger value="appeals">
            Appeals {stats.pendingAppeals > 0 && <span className="ml-1 bg-purple-500 text-white text-[9px] rounded-full w-4 h-4 inline-flex items-center justify-center">{stats.pendingAppeals}</span>}
          </TabsTrigger>
        </TabsList>

        {/* ─── Cases Tab ──────────────────────────────────────────────────── */}
        <TabsContent value="cases" className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search student, matric, title..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-44"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All Severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No cases found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCases.map((c: any) => {
                const sev = SEVERITY_CFG[c.severity] ?? SEVERITY_CFG.minor;
                const st = STATUS_CFG[c.status] ?? STATUS_CFG.open;
                const StatusIcon = st.icon;
                return (
                  <Card key={c.id} className={`border-l-4 ${BORDER_COLORS[c.severity] ?? "border-l-gray-300"}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge className={`${sev.bg} ${sev.color} text-[10px]`}>{sev.label}</Badge>
                            <Badge className={`${st.color} text-[10px]`}><StatusIcon className="w-2.5 h-2.5 mr-1" />{st.label}</Badge>
                            <span className="text-[10px] text-muted-foreground">Case #{c.id}</span>
                          </div>
                          <p className="font-semibold text-sm">{c.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {c.studentName} · {c.matricNumber} · {c.department}
                            {c.actions?.length > 0 && ` · ${c.actions.length} sanction(s)`}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]" onClick={() => setDetailCase(c)}>
                            <Eye className="w-3 h-3 mr-1" />View
                          </Button>
                          {c.status !== "resolved" && c.status !== "dismissed" && (
                            <>
                              <Button size="sm" className="h-7 px-2 text-[10px]" onClick={() => { setDetailCase(c); setActionOpen(true); }}>
                                <Gavel className="w-3 h-3 mr-1" />Sanction
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]"
                                onClick={() => { setStatusTarget({ id: c.id, current: c.status }); setNewStatus("resolved"); }}>
                                Update Status
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ─── Flags Tab ──────────────────────────────────────────────────── */}
        <TabsContent value="flags" className="mt-4">
          {flags.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>No active flags.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {flags.map((f: any) => {
                const cfg = FLAG_CFG[f.flagType];
                const Icon = cfg?.icon ?? Flag;
                return (
                  <Card key={f.id}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${cfg?.color ?? "text-red-600 bg-red-50 border-red-200"}`}>
                        <Icon className="w-3.5 h-3.5" />{cfg?.label ?? f.flagType}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs">{f.studentName}</p>
                        <p className="text-[10px] text-muted-foreground">{f.matricNumber}{f.relatedCaseId ? ` · Case #${f.relatedCaseId}` : ""}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground shrink-0">{new Date(f.createdAt).toLocaleDateString("en-NG")}</p>
                      <Button size="sm" variant="outline" className="h-6 px-2 text-[10px] text-green-600 border-green-300 shrink-0"
                        onClick={() => { if (confirm("Lift this flag?")) liftFlagMut.mutate(f.id); }}>
                        Lift Flag
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ─── Appeals Tab ────────────────────────────────────────────────── */}
        <TabsContent value="appeals" className="mt-4">
          <div className={`${selectedAppeal ? "grid grid-cols-1 lg:grid-cols-2 gap-4" : ""}`}>
            {/* Left: appeals list */}
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Search student, case..." value={appealSearch} onChange={e => setAppealSearch(e.target.value)} />
                </div>
                <Select value={appealFilterStatus} onValueChange={setAppealFilterStatus}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredAppeals.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Scale className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>No appeals found.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAppeals.map((a: any) => {
                    const cfg = APPEAL_STATUS_CFG[a.status] ?? APPEAL_STATUS_CFG.submitted;
                    const Icon = cfg.icon;
                    const sev = SEVERITY_CFG[a.caseSeverity] ?? SEVERITY_CFG.minor;
                    const isSelected = selectedAppeal?.id === a.id;
                    return (
                      <Card key={a.id}
                        className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-primary border-primary" : "hover:border-primary/40"}`}
                        onClick={() => setSelectedAppeal(isSelected ? null : a)}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <Badge className={`${cfg.color} text-[10px]`}><Icon className="w-2.5 h-2.5 mr-1" />{cfg.label}</Badge>
                                <Badge className={`${sev.bg} ${sev.color} text-[10px]`}>{sev.label}</Badge>
                                <span className="text-[10px] text-muted-foreground">Appeal #{a.id}</span>
                              </div>
                              <p className="font-semibold text-xs">{a.caseTitle}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{a.studentName} · {a.matricNumber}</p>
                              <p className="text-[10px] text-muted-foreground">{new Date(a.createdAt).toLocaleDateString("en-NG")}</p>
                            </div>
                            <Eye className={`w-4 h-4 shrink-0 mt-1 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: split-screen review panel */}
            {selectedAppeal && (
              <div className="border rounded-xl overflow-hidden bg-background">
                <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">Appeal Review</span>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setSelectedAppeal(null)}>Close</Button>
                </div>

                {appealDetailLoading ? (
                  <div className="p-4 space-y-3"><Skeleton className="h-20" /><Skeleton className="h-20" /><Skeleton className="h-32" /></div>
                ) : ad ? (
                  <ScrollArea className="h-[calc(100vh-380px)] min-h-80">
                    <div className="p-4 space-y-4">
                      {/* Case details (left side content) */}
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Case Details</p>
                        <div className="bg-muted/40 rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {ad.caseSeverity && <Badge className={`${SEVERITY_CFG[ad.caseSeverity]?.bg} ${SEVERITY_CFG[ad.caseSeverity]?.color} text-[10px]`}>{SEVERITY_CFG[ad.caseSeverity]?.label}</Badge>}
                            {ad.caseStatus && <Badge className={`${STATUS_CFG[ad.caseStatus]?.color} text-[10px]`}>{STATUS_CFG[ad.caseStatus]?.label}</Badge>}
                          </div>
                          <p className="font-semibold text-sm">{ad.caseTitle}</p>
                          <p className="text-xs text-muted-foreground">{ad.studentName} · {ad.matricNumber} · {ad.department} · Level {ad.level}</p>
                          {ad.caseDescription && <p className="text-xs text-muted-foreground border-t pt-2 mt-2">{ad.caseDescription}</p>}
                        </div>
                      </div>

                      {/* Original sanctions */}
                      {ad.actions?.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Original Sanctions</p>
                          <div className="space-y-1.5">
                            {ad.actions.map((a: any, i: number) => (
                              <div key={i} className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                                <Gavel className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                                <div>
                                  <p className="text-xs font-semibold text-orange-800">{a.actionType.toUpperCase()}</p>
                                  <p className="text-[10px] text-orange-700">{new Date(a.startDate).toLocaleDateString("en-NG")}{a.endDate ? ` — ${new Date(a.endDate).toLocaleDateString("en-NG")}` : " (ongoing)"}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Active flags */}
                      {ad.activeFlags?.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Active Flags</p>
                          <div className="flex flex-wrap gap-1.5">
                            {ad.activeFlags.map((f: any) => {
                              const cfg = FLAG_CFG[f.flagType];
                              const Icon = cfg?.icon ?? Flag;
                              return (
                                <div key={f.id} className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-medium ${cfg?.color ?? "text-red-600 bg-red-50 border-red-200"}`}>
                                  <Icon className="w-3 h-3" />{cfg?.label ?? f.flagType}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Student's appeal */}
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Student Appeal</p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                            <p className="text-xs font-semibold text-blue-800">{ad.studentName}</p>
                            <span className="text-[10px] text-blue-600">{new Date(ad.createdAt).toLocaleDateString("en-NG")}</span>
                          </div>
                          <p className="text-xs text-blue-900">{ad.reason}</p>
                          {ad.evidence && (
                            <a href={ad.evidence} target="_blank" rel="noopener noreferrer"
                              className="text-[10px] text-primary underline mt-2 block">View Supporting Evidence →</a>
                          )}
                        </div>
                      </div>

                      {/* Existing decision (immutable) */}
                      {ad.decision && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-xs font-bold text-green-800 mb-1">Decision Already Recorded</p>
                          <p className="text-xs text-green-700"><strong>{ad.decision.decision.toUpperCase()}</strong>{ad.decision.modifiedAction ? ` → ${ad.decision.modifiedAction}` : ""}</p>
                          <p className="text-xs text-green-600 mt-1">{ad.decision.remarks}</p>
                        </div>
                      )}

                      {/* Decision tools — only if no decision yet */}
                      {!ad.decision && (
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-muted/40 px-3 py-2 border-b">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Issue Decision</p>
                          </div>
                          <div className="p-3 space-y-3">
                            {/* Mark under review first if submitted */}
                            {ad.status === "submitted" && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-semibold text-yellow-800">Not yet under review</p>
                                  <p className="text-[10px] text-yellow-700">Mark this appeal as being reviewed before issuing a decision.</p>
                                </div>
                                <Button size="sm" className="h-7 px-3 text-xs bg-yellow-600 hover:bg-yellow-700 text-white shrink-0"
                                  disabled={reviewMut.isPending}
                                  onClick={() => reviewMut.mutate(ad.id)}>
                                  {reviewMut.isPending ? "..." : "Start Review"}
                                </Button>
                              </div>
                            )}

                            {/* Decision type */}
                            <div>
                              <label className="text-xs font-medium mb-1.5 block">Decision Type</label>
                              <div className="space-y-1.5">
                                {[
                                  { value: "uphold",  label: "Uphold Sanction",  desc: "Original sanction remains. Appeal rejected.", color: "border-red-200 bg-red-50" },
                                  { value: "modify",  label: "Modify Sanction",  desc: "Reduce the sanction. Appeal partially accepted.", color: "border-blue-200 bg-blue-50" },
                                  { value: "dismiss", label: "Dismiss Case",     desc: "Drop all sanctions and flags. Appeal accepted.", color: "border-green-200 bg-green-50" },
                                ].map(opt => (
                                  <label key={opt.value} className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${decisionForm.decision === opt.value ? opt.color : "border-border hover:bg-muted/40"}`}>
                                    <input type="radio" className="mt-0.5 accent-primary" value={opt.value} checked={decisionForm.decision === opt.value}
                                      onChange={() => setDecisionForm(p => ({ ...p, decision: opt.value }))} />
                                    <div>
                                      <p className="text-xs font-semibold">{opt.label}</p>
                                      <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Modified action (only for modify) */}
                            {decisionForm.decision === "modify" && (
                              <div>
                                <label className="text-xs font-medium mb-1 block">Reduced Sanction Level</label>
                                <Select value={decisionForm.modifiedAction} onValueChange={v => setDecisionForm(p => ({ ...p, modifiedAction: v }))}>
                                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="warning">Warning only (lift all system flags)</SelectItem>
                                    <SelectItem value="suspension">Suspension (lift hostel block only)</SelectItem>
                                    <SelectItem value="restriction">Restriction (lift academic/graduation blocks)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            <div>
                              <label className="text-xs font-medium mb-1 block">Decision Remarks <span className="text-red-500">*</span></label>
                              <Textarea placeholder="Provide official reasoning for your decision..." rows={2}
                                value={decisionForm.remarks}
                                onChange={e => setDecisionForm(p => ({ ...p, remarks: e.target.value }))} />
                            </div>

                            <div>
                              <label className="text-xs font-medium mb-1 block">Message to Student (optional)</label>
                              <Textarea placeholder="Additional note sent to the student..." rows={2}
                                value={decisionForm.adminResponse}
                                onChange={e => setDecisionForm(p => ({ ...p, adminResponse: e.target.value }))} />
                            </div>

                            <Button
                              className={`w-full text-xs h-9 ${decisionForm.decision === "dismiss" ? "bg-green-600 hover:bg-green-700 text-white" : decisionForm.decision === "uphold" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
                              disabled={!decisionForm.remarks || decisionMut.isPending}
                              onClick={() => ad && decisionMut.mutate({ id: ad.id, form: decisionForm })}>
                              {decisionMut.isPending ? "Recording..." : `Record Decision: ${decisionForm.decision.toUpperCase()}`}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                ) : null}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Case Detail Dialog ─────────────────────────────────────────────── */}
      <Dialog open={!!detailCase && !actionOpen && !statusTarget} onOpenChange={o => !o && setDetailCase(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />Case #{shown?.id}: {shown?.title}
            </DialogTitle>
          </DialogHeader>
          {shown && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Student", value: shown.studentName },
                  { label: "Matric", value: shown.matricNumber },
                  { label: "Department", value: shown.department },
                  { label: "Level", value: `Level ${shown.level}` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-semibold text-sm mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {[SEVERITY_CFG[shown.severity], STATUS_CFG[shown.status]].filter(Boolean).map((cfg: any, i: number) => (
                  <Badge key={i} className={`${cfg.bg ?? cfg.color} ${cfg.color}`}>{cfg.label}</Badge>
                ))}
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{shown.description}</p>
              </div>
              {(shown.actions ?? []).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sanctions Timeline</p>
                  <div className="space-y-2">
                    {(shown.actions ?? []).map((a: any, i: number) => {
                      const act = ACTION_OPTIONS.find(o => o.value === a.actionType);
                      const Icon = act?.icon ?? Gavel;
                      return (
                        <div key={i} className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                          <Icon className="w-3.5 h-3.5 text-orange-600" />
                          <div>
                            <p className="text-xs font-semibold">{act?.label ?? a.actionType}</p>
                            <p className="text-[10px] text-muted-foreground">{new Date(a.startDate).toLocaleDateString("en-NG")}{a.endDate ? ` — ${new Date(a.endDate).toLocaleDateString("en-NG")}` : " (ongoing)"}{a.remarks ? ` · ${a.remarks}` : ""}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {(shown.flags ?? []).filter((f: any) => f.active).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Active Flags</p>
                  <div className="flex flex-wrap gap-2">
                    {(shown.flags ?? []).filter((f: any) => f.active).map((f: any) => {
                      const cfg = FLAG_CFG[f.flagType];
                      const Icon = cfg?.icon ?? Flag;
                      return (
                        <div key={f.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${cfg?.color ?? "text-red-600 bg-red-50 border-red-200"}`}>
                          <Icon className="w-3 h-3" />{cfg?.label ?? f.flagType}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex gap-2 flex-wrap">
            {shown && shown.status !== "resolved" && shown.status !== "dismissed" && (
              <>
                <Button variant="outline" onClick={() => setActionOpen(true)}><Gavel className="w-4 h-4 mr-2" />Apply Sanction</Button>
                <Button variant="outline" onClick={() => { setStatusTarget({ id: shown.id, current: shown.status }); setNewStatus("resolved"); }}>Update Status</Button>
              </>
            )}
            <Button variant="outline" onClick={() => setDetailCase(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Create Case Dialog ─────────────────────────────────────────────── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-primary" />Open Disciplinary Case</DialogTitle></DialogHeader>
          <div className="py-2 space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Student ID <span className="text-red-500">*</span></label>
              <Input type="number" placeholder="Enter student ID (numeric)" value={createForm.studentId} onChange={e => setCreateForm(p => ({ ...p, studentId: e.target.value }))} />
              <p className="text-[10px] text-muted-foreground mt-1">Find the student ID from the Students page.</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Case Title <span className="text-red-500">*</span></label>
              <Input placeholder="e.g. Academic Misconduct — Exam Irregularity" value={createForm.title} onChange={e => setCreateForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description <span className="text-red-500">*</span></label>
              <Textarea placeholder="Describe the incident in detail..." rows={3} value={createForm.description} onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Severity</label>
              <Select value={createForm.severity} onValueChange={v => setCreateForm(p => ({ ...p, severity: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">Minor — Low impact incident</SelectItem>
                  <SelectItem value="moderate">Moderate — Repeated or notable offence</SelectItem>
                  <SelectItem value="major">Major — Serious violation</SelectItem>
                  <SelectItem value="critical">Critical — Severe academic/social misconduct</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button disabled={!createForm.studentId || !createForm.title || !createForm.description || createMut.isPending}
              onClick={() => createMut.mutate(createForm)}>
              {createMut.isPending ? "Creating..." : "Open Case"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Apply Sanction Dialog ──────────────────────────────────────────── */}
      <Dialog open={actionOpen} onOpenChange={o => { if (!o) setActionOpen(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-orange-700"><Gavel className="w-5 h-5" />Apply Sanction</DialogTitle></DialogHeader>
          <div className="py-2 space-y-3">
            <div className="bg-muted/40 rounded-lg p-3 text-sm">
              <p className="font-semibold">{detailCase?.studentName}</p>
              <p className="text-xs text-muted-foreground">{detailCase?.matricNumber} · Case #{detailCase?.id}: {detailCase?.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Sanction Type <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {ACTION_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${actionForm.actionType === opt.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"}`}>
                      <input type="radio" className="mt-0.5 accent-primary" value={opt.value} checked={actionForm.actionType === opt.value} onChange={() => setActionForm(p => ({ ...p, actionType: opt.value }))} />
                      <div>
                        <div className="flex items-center gap-2"><Icon className="w-3.5 h-3.5" /><span className="text-sm font-medium">{opt.label}</span></div>
                        <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Start Date <span className="text-red-500">*</span></label>
                <Input type="date" value={actionForm.startDate} onChange={e => setActionForm(p => ({ ...p, startDate: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">End Date (optional)</label>
                <Input type="date" value={actionForm.endDate} onChange={e => setActionForm(p => ({ ...p, endDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Remarks</label>
              <Textarea placeholder="Additional notes..." rows={2} value={actionForm.remarks} onChange={e => setActionForm(p => ({ ...p, remarks: e.target.value }))} />
            </div>
            {actionForm.actionType === "expulsion" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p><strong>Warning:</strong> Expulsion applies all system restrictions. This is logged and requires formal documentation.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionOpen(false)}>Cancel</Button>
            <Button
              className={actionForm.actionType === "expulsion" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
              disabled={!actionForm.startDate || actionMut.isPending}
              onClick={() => detailCase && actionMut.mutate({ id: detailCase.id, form: actionForm })}>
              {actionMut.isPending ? "Applying..." : `Apply ${ACTION_OPTIONS.find(o => o.value === actionForm.actionType)?.label}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Status Update Dialog ───────────────────────────────────────────── */}
      <Dialog open={!!statusTarget} onOpenChange={o => !o && (setStatusTarget(null), setResolutionNote(""))}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Update Case Status</DialogTitle></DialogHeader>
          <div className="py-2 space-y-3">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            {(newStatus === "resolved" || newStatus === "dismissed") && (
              <div>
                <label className="text-sm font-medium mb-1 block">Resolution Note</label>
                <Textarea placeholder="Describe how the case was resolved..." rows={2} value={resolutionNote} onChange={e => setResolutionNote(e.target.value)} />
              </div>
            )}
            {(newStatus === "resolved" || newStatus === "dismissed") && (
              <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg p-2">
                All active flags tied to this case will be automatically lifted.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setStatusTarget(null); setResolutionNote(""); }}>Cancel</Button>
            <Button disabled={statusMut.isPending}
              onClick={() => statusTarget && statusMut.mutate({ id: statusTarget.id, status: newStatus, resolutionNote })}>
              {statusMut.isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
