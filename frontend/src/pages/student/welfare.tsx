import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Heart, DollarSign, Shield, BookOpen, HelpCircle, CheckCircle,
  Clock, Plus, ChevronRight, MessageSquare, Lock, User, AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

const CATEGORY_CFG: Record<string, { icon: any; label: string; color: string; bg: string }> = {
  mental_health:    { icon: Heart,       label: "Mental Health",       color: "text-purple-700", bg: "bg-purple-100" },
  financial_support:{ icon: DollarSign,  label: "Financial Support",   color: "text-blue-700",   bg: "bg-blue-100" },
  harassment:       { icon: Shield,      label: "Harassment / Safety", color: "text-orange-700", bg: "bg-orange-100" },
  academic_stress:  { icon: BookOpen,    label: "Academic Stress",     color: "text-teal-700",   bg: "bg-teal-100" },
  other:            { icon: HelpCircle,  label: "Other Support",       color: "text-gray-700",   bg: "bg-gray-100" },
};

const PRIORITY_CFG: Record<string, { color: string; label: string }> = {
  low:    { color: "bg-emerald-100 text-emerald-700", label: "Low Priority" },
  medium: { color: "bg-sky-100 text-sky-700",         label: "Medium Priority" },
  high:   { color: "bg-amber-100 text-amber-700",     label: "High Priority" },
  urgent: { color: "bg-rose-100 text-rose-700",       label: "Urgent" },
};

const STATUS_STEPS = ["submitted", "assigned", "in_progress", "resolved", "closed"];
const STATUS_LABELS: Record<string, string> = {
  submitted:   "Request Submitted",
  assigned:    "Counsellor Assigned",
  in_progress: "In Progress",
  resolved:    "Resolved",
  closed:      "Closed",
};

const SENSITIVE = ["mental_health", "harassment"];

export default function StudentWelfare() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [newOpen, setNewOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [form, setForm] = useState({ category: "academic_stress", title: "", description: "", priority: "medium" });

  const { data: cases = [], isLoading } = useQuery<any[]>({
    queryKey: ["my-welfare"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/welfare/my-cases`, { headers: authHeaders() }); return data; },
  });

  const { data: detail, isLoading: detailLoading } = useQuery<any>({
    queryKey: ["welfare-detail", detailId],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/welfare/my-cases/${detailId}`, { headers: authHeaders() }); return data; },
    enabled: !!detailId,
  });

  const submitMut = useMutation({
    mutationFn: async () => { const { data } = await axios.post(`${BASE()}/api/welfare`, form, { headers: authHeaders() }); return data; },
    onSuccess: () => {
      toast({ title: "Request submitted", description: "Your welfare request has been received. We will reach out soon." });
      qc.invalidateQueries({ queryKey: ["my-welfare"] });
      setNewOpen(false);
      setForm({ category: "academic_stress", title: "", description: "", priority: "medium" });
    },
    onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed", variant: "destructive" }),
  });

  const selectedCase = detailId ? (detail ?? cases.find(c => c.id === detailId)) : null;
  const statusIdx = selectedCase ? STATUS_STEPS.indexOf(selectedCase.status) : -1;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Student Welfare</h1>
          <p className="text-muted-foreground mt-1">Confidential support for mental health, financial hardship, and personal wellbeing</p>
        </div>
        <Button onClick={() => setNewOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" />New Request
        </Button>
      </div>

      {/* Support categories info */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {Object.entries(CATEGORY_CFG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={key} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center ${cfg.bg}`}>
              <Icon className={`w-5 h-5 ${cfg.color}`} />
              <p className={`text-[10px] font-medium ${cfg.color} leading-tight`}>{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Privacy notice */}
      <Card className="border-teal-200 bg-teal-50/60">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div className="text-xs text-teal-800">
              <p className="font-semibold mb-0.5">Your Privacy is Protected</p>
              <p className="text-teal-700">All welfare requests are handled with strict confidentiality. Mental health and harassment cases are automatically marked confidential and only visible to assigned counsellors and administrators.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases list */}
      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
      ) : cases.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center">
            <Heart className="w-10 h-10 text-teal-300 mx-auto mb-3" />
            <p className="font-medium text-muted-foreground">No welfare requests yet</p>
            <p className="text-xs text-muted-foreground mt-1">If you need support, please don't hesitate to reach out.</p>
            <Button className="mt-4 bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setNewOpen(true)}>
              Submit a Request
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {cases.map((c: any) => {
            const cat = CATEGORY_CFG[c.category] ?? CATEGORY_CFG.other;
            const Icon = cat.icon;
            const prio = PRIORITY_CFG[c.priority] ?? PRIORITY_CFG.medium;
            const isSensitive = SENSITIVE.includes(c.category);
            const isSelected = detailId === c.id;
            return (
              <Card key={c.id} className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-teal-400 border-teal-300" : "hover:border-teal-200"}`}
                onClick={() => setDetailId(isSelected ? null : c.id)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cat.bg}`}>
                      <Icon className={`w-4.5 h-4.5 ${cat.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge className={`text-[10px] ${prio.color}`}>{prio.label}</Badge>
                        {isSensitive && (
                          <Badge className="text-[10px] bg-purple-100 text-purple-700">
                            <Lock className="w-2.5 h-2.5 mr-0.5" />Confidential
                          </Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground capitalize">{STATUS_LABELS[c.status] ?? c.status}</span>
                      </div>
                      <p className="font-semibold text-sm">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{cat.label} · {new Date(c.createdAt).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })}</p>
                      {c.assignment && <p className="text-[10px] text-teal-700 mt-0.5 flex items-center gap-1"><User className="w-3 h-3" />Assigned to {c.assignment.counsellorName}</p>}
                    </div>
                    <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                  </div>

                  {/* Expanded detail */}
                  {isSelected && (
                    <div className="mt-4 border-t pt-4 space-y-4">
                      {detailLoading ? <Skeleton className="h-20" /> : detail ? (
                        <>
                          {/* Status timeline */}
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Case Progress</p>
                            <div className="flex items-start">
                              {STATUS_STEPS.map((step, i) => {
                                const done = i <= statusIdx;
                                const active = i === statusIdx;
                                return (
                                  <div key={step} className="flex items-start flex-1">
                                    <div className="flex flex-col items-center">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${active ? "bg-teal-500 border-teal-500 text-white" : done ? "bg-teal-200 border-teal-200 text-teal-700" : "bg-muted border-muted-foreground/30 text-muted-foreground"}`}>
                                        {done ? <CheckCircle className="w-3.5 h-3.5" /> : <span className="text-[9px]">{i + 1}</span>}
                                      </div>
                                      <p className={`text-[9px] mt-1 text-center leading-tight w-14 ${done ? "text-teal-700 font-medium" : "text-muted-foreground"}`}>{STATUS_LABELS[step]}</p>
                                    </div>
                                    {i < STATUS_STEPS.length - 1 && (
                                      <div className={`flex-1 h-0.5 mx-0.5 mt-3 ${i < statusIdx ? "bg-teal-300" : "bg-border"}`} />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Responses from counsellor */}
                          {detail.notes?.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Responses</p>
                              <div className="space-y-2">
                                {detail.notes.map((n: any) => (
                                  <div key={n.id} className="bg-teal-50 border border-teal-100 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                                      <p className="text-xs font-semibold text-teal-800">{n.authorName}</p>
                                      <p className="text-[10px] text-teal-600">{new Date(n.createdAt).toLocaleDateString("en-NG")}</p>
                                    </div>
                                    <p className="text-xs text-teal-900">{n.note}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {detail.notes?.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-3">No responses yet. A counsellor will follow up soon.</p>
                          )}
                        </>
                      ) : null}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Submit Request Dialog */}
      <Dialog open={newOpen} onOpenChange={o => !o && (setNewOpen(false), setForm({ category: "academic_stress", title: "", description: "", priority: "medium" }))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-700">
              <Heart className="w-5 h-5" />Submit Welfare Request
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <div className="bg-teal-50 border border-teal-100 rounded-lg p-3 text-xs text-teal-800 flex items-start gap-2">
              <Lock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <p>Your request is confidential. Only authorized staff will have access to your case details.</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Type of Support Needed <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(CATEGORY_CFG).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  return (
                    <label key={key} className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${form.category === key ? `${cfg.bg} border-current ${cfg.color}` : "border-border hover:bg-muted/40"}`}>
                      <input type="radio" className="sr-only" value={key} checked={form.category === key} onChange={() => setForm(p => ({ ...p, category: key }))} />
                      <Icon className={`w-4 h-4 shrink-0 ${form.category === key ? cfg.color : "text-muted-foreground"}`} />
                      <span className={`text-sm font-medium ${form.category === key ? cfg.color : ""}`}>{cfg.label}</span>
                      {SENSITIVE.includes(key) && <Lock className="w-3 h-3 ml-auto text-purple-500" />}
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Subject <span className="text-red-500">*</span></label>
              <Input placeholder="Brief description of your situation..." value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tell us more <span className="text-red-500">*</span></label>
              <Textarea placeholder="Please describe what you are experiencing. The more detail you provide, the better we can support you..." rows={4}
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">How urgent is this?</label>
              <Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low — I can wait a few days</SelectItem>
                  <SelectItem value="medium">Medium — I'd like help within 1–2 days</SelectItem>
                  <SelectItem value="high">High — I need help soon</SelectItem>
                  <SelectItem value="urgent">Urgent — I need immediate support</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.priority === "urgent" && (
              <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p>If you are in immediate danger, please contact emergency services (199) or the campus security (080-MAAUN-112) immediately.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white"
              disabled={!form.title || !form.description || submitMut.isPending}
              onClick={() => submitMut.mutate()}>
              {submitMut.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
