import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ShieldAlert, Plus, Search, RefreshCw, Gavel, CheckCircle, XCircle,
  Clock, AlertTriangle, ChevronRight, UserX, BookOpen, Home,
  GraduationCap, Eye, Flag,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

const SEVERITY_CFG: Record<string, { color: string; bg: string; label: string; border: string }> = {
  minor:    { color: "text-green-700",  bg: "bg-green-100",  label: "Minor",    border: "border-green-300" },
  moderate: { color: "text-yellow-700", bg: "bg-yellow-100", label: "Moderate", border: "border-yellow-300" },
  major:    { color: "text-orange-700", bg: "bg-orange-100", label: "Major",    border: "border-orange-300" },
  critical: { color: "text-red-700",    bg: "bg-red-100",    label: "Critical", border: "border-red-400" },
};

const STATUS_CFG: Record<string, { icon: any; color: string; label: string }> = {
  open:         { icon: AlertTriangle, color: "bg-blue-100 text-blue-700",    label: "Open" },
  under_review: { icon: Clock,         color: "bg-yellow-100 text-yellow-700",label: "Under Review" },
  resolved:     { icon: CheckCircle,   color: "bg-green-100 text-green-700",  label: "Resolved" },
  dismissed:    { icon: XCircle,       color: "bg-gray-100 text-gray-600",    label: "Dismissed" },
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

  const { data: cases = [], isLoading, refetch, isFetching } = useQuery<any[]>({
    queryKey: ["admin-disciplinary"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/disciplinary/admin/cases`, { headers: authHeaders() }); return data; },
  });

  const { data: flags = [], refetch: refetchFlags } = useQuery<any[]>({
    queryKey: ["admin-disciplinary-flags"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/disciplinary/admin/flags`, { headers: authHeaders() }); return data; },
  });

  const { data: caseDetail, isLoading: detailLoading } = useQuery<any>({
    queryKey: ["disciplinary-case", detailCase?.id],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/disciplinary/admin/cases/${detailCase!.id}`, { headers: authHeaders() }); return data; },
    enabled: !!detailCase,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-disciplinary"] });
    qc.invalidateQueries({ queryKey: ["admin-disciplinary-flags"] });
    qc.invalidateQueries({ queryKey: ["disciplinary-case", detailCase?.id] });
  };

  const createMut = useMutation({
    mutationFn: async (form: typeof createForm) => {
      const { data } = await axios.post(`${BASE()}/api/disciplinary/admin/cases`, { ...form, studentId: parseInt(form.studentId) }, { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Case created" }); invalidate(); setCreateOpen(false); setCreateForm({ studentId: "", title: "", description: "", severity: "minor" }); },
    onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed", variant: "destructive" }),
  });

  const statusMut = useMutation({
    mutationFn: async ({ id, status, resolutionNote }: { id: number; status: string; resolutionNote?: string }) => {
      const { data } = await axios.patch(`${BASE()}/api/disciplinary/admin/cases/${id}/status`, { status, resolutionNote }, { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Status updated" }); invalidate(); setStatusTarget(null); setResolutionNote(""); },
    onError: () => toast({ title: "Failed", variant: "destructive" }),
  });

  const actionMut = useMutation({
    mutationFn: async ({ id, form }: { id: number; form: typeof actionForm }) => {
      const { data } = await axios.post(`${BASE()}/api/disciplinary/admin/cases/${id}/action`, form, { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Sanction applied" }); invalidate(); setActionOpen(false); setActionForm({ actionType: "warning", startDate: "", endDate: "", remarks: "" }); },
    onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed", variant: "destructive" }),
  });

  const liftFlagMut = useMutation({
    mutationFn: async (id: number) => { const { data } = await axios.patch(`${BASE()}/api/disciplinary/admin/flags/${id}/lift`, {}, { headers: authHeaders() }); return data; },
    onSuccess: () => { toast({ title: "Flag lifted" }); invalidate(); },
    onError: () => toast({ title: "Failed", variant: "destructive" }),
  });

  // Stats
  const stats = {
    total: cases.length,
    open: cases.filter((c: any) => c.status === "open").length,
    review: cases.filter((c: any) => c.status === "under_review").length,
    critical: cases.filter((c: any) => c.severity === "critical").length,
    activeFlags: flags.length,
  };

  const filtered = cases.filter((c: any) => {
    const ms = !search || c.studentName.toLowerCase().includes(search.toLowerCase()) || c.matricNumber.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase());
    if (!ms) return false;
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (filterSeverity !== "all" && c.severity !== filterSeverity) return false;
    return true;
  });

  const shown = detailCase ? (caseDetail ?? detailCase) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Disciplinary Cases</h1>
          <p className="text-muted-foreground mt-1">Manage student misconduct, apply sanctions, and track case resolutions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { refetch(); refetchFlags(); }} disabled={isFetching} size="sm">
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />Refresh
          </Button>
          <Button onClick={() => setCreateOpen(true)} size="sm"><Plus className="w-4 h-4 mr-1.5" />New Case</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Cases",   value: stats.total,      color: "text-primary" },
          { label: "Open",          value: stats.open,       color: "text-blue-600" },
          { label: "Under Review",  value: stats.review,     color: "text-yellow-600" },
          { label: "Critical",      value: stats.critical,   color: "text-red-600" },
          { label: "Active Flags",  value: stats.activeFlags,color: "text-orange-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}><CardContent className="p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="cases">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="cases">Cases</TabsTrigger>
          <TabsTrigger value="flags">Active Flags</TabsTrigger>
        </TabsList>

        {/* ── Cases Tab ────────────────────────────────────────────────────── */}
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
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No cases found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((c: any) => {
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
                            {c.studentName} · {c.matricNumber} · {c.department} · Level {c.level}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {new Date(c.createdAt).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })}
                            {c.actions?.length > 0 && ` · ${c.actions.length} sanction(s) applied`}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]" onClick={() => setDetailCase(c)}>
                            <Eye className="w-3 h-3 mr-1" />View
                          </Button>
                          {c.status !== "resolved" && c.status !== "dismissed" && (
                            <>
                              <Button size="sm" className="h-7 px-2 text-[10px]"
                                onClick={() => { setDetailCase(c); setActionOpen(true); }}>
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

        {/* ── Flags Tab ────────────────────────────────────────────────────── */}
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
                      <p className="text-[10px] text-muted-foreground shrink-0">
                        {new Date(f.createdAt).toLocaleDateString("en-NG")}
                      </p>
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
      </Tabs>

      {/* ── Case Detail Dialog ────────────────────────────────────────────── */}
      <Dialog open={!!detailCase && !actionOpen && !statusTarget} onOpenChange={o => !o && setDetailCase(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />Case #{shown?.id}: {shown?.title}
            </DialogTitle>
          </DialogHeader>
          {detailLoading ? <Skeleton className="h-40" /> : shown && (
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

              {/* Timeline */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Case Timeline</p>
                <div className="relative pl-4">
                  <div className="absolute left-1.5 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-4">
                    {/* Creation */}
                    <div className="relative">
                      <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                      <p className="text-xs font-medium">Case Opened</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(shown.createdAt).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })}</p>
                    </div>
                    {/* Actions */}
                    {(shown.actions ?? []).map((a: any, i: number) => {
                      const act = ACTION_OPTIONS.find(o => o.value === a.actionType);
                      const Icon = act?.icon ?? Gavel;
                      return (
                        <div key={i} className="relative">
                          <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-orange-500 border-2 border-background" />
                          <div className="flex items-center gap-2 flex-wrap">
                            <Icon className="w-3.5 h-3.5 text-orange-600" />
                            <p className="text-xs font-medium">{act?.label ?? a.actionType} Applied</p>
                            <span className="text-[10px] text-muted-foreground">by {a.appliedByName}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{new Date(a.appliedAt).toLocaleDateString("en-NG")}</p>
                          {a.remarks && <p className="text-[10px] italic text-muted-foreground mt-0.5">"{a.remarks}"</p>}
                        </div>
                      );
                    })}
                    {/* Resolution */}
                    {(shown.status === "resolved" || shown.status === "dismissed") && (
                      <div className="relative">
                        <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                        <p className="text-xs font-medium text-green-700">Case {shown.status === "resolved" ? "Resolved" : "Dismissed"}</p>
                        {shown.resolutionNote && <p className="text-[10px] text-muted-foreground mt-0.5">{shown.resolutionNote}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Active flags */}
              {(shown.flags ?? []).filter((f: any) => f.active).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Active Flags from this Case</p>
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

      {/* ── Create Case Dialog ────────────────────────────────────────────── */}
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

      {/* ── Apply Sanction Dialog ─────────────────────────────────────────── */}
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
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5" />
                          <span className="text-sm font-medium">{opt.label}</span>
                        </div>
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
                <p><strong>Warning:</strong> Expulsion will apply all system restrictions (academic hold, hostel block, graduation block, account restricted). This action is logged and requires formal documentation.</p>
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

      {/* ── Status Update Dialog ──────────────────────────────────────────── */}
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
