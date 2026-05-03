import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart, DollarSign, Shield, BookOpen, HelpCircle, RefreshCw,
  Lock, MessageSquare, CheckCircle, Send, ChevronRight,
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

const PRIORITY_CFG: Record<string, { color: string; label: string }> = {
  low:    { color: "bg-emerald-100 text-emerald-700", label: "Low" },
  medium: { color: "bg-sky-100 text-sky-700",         label: "Medium" },
  high:   { color: "bg-amber-100 text-amber-700",     label: "High" },
  urgent: { color: "bg-rose-100 text-rose-800",       label: "Urgent" },
};

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  submitted:   { label: "Submitted",   color: "bg-slate-100 text-slate-700" },
  assigned:    { label: "Assigned",    color: "bg-blue-100 text-blue-700" },
  in_progress: { label: "In Progress", color: "bg-amber-100 text-amber-700" },
  resolved:    { label: "Resolved",    color: "bg-teal-100 text-teal-700" },
  closed:      { label: "Closed",      color: "bg-gray-100 text-gray-500" },
};

const STATUS_STEPS = ["submitted", "assigned", "in_progress", "resolved", "closed"];
const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted", assigned: "Assigned", in_progress: "In Progress", resolved: "Resolved", closed: "Closed",
};

export default function CounsellorWelfare() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const { data: cases = [], isLoading, refetch, isFetching } = useQuery<any[]>({
    queryKey: ["counsellor-welfare"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/welfare/counsellor/my-cases`, { headers: authHeaders() }); return data; },
  });

  const { data: caseDetail, isLoading: detailLoading } = useQuery<any>({
    queryKey: ["counsellor-welfare-detail", selectedId],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/welfare/counsellor/cases/${selectedId}`, { headers: authHeaders() }); return data; },
    enabled: !!selectedId,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["counsellor-welfare"] });
    qc.invalidateQueries({ queryKey: ["counsellor-welfare-detail", selectedId] });
  };

  const statusMut = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await axios.patch(`${BASE()}/api/welfare/admin/cases/${id}/status`, { status }, { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Status updated" }); invalidate(); },
    onError: () => toast({ title: "Failed to update status", variant: "destructive" }),
  });

  const noteMut = useMutation({
    mutationFn: async ({ id, note, isPrivate }: { id: number; note: string; isPrivate: boolean }) => {
      const { data } = await axios.post(`${BASE()}/api/welfare/cases/${id}/notes`, { note, isPrivate }, { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Note added" }); invalidate(); setNoteText(""); },
    onError: () => toast({ title: "Failed to add note", variant: "destructive" }),
  });

  const d = caseDetail;
  const statusIdx = d ? STATUS_STEPS.indexOf(d.status) : -1;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">My Assigned Cases</h1>
          <p className="text-muted-foreground mt-1">Welfare cases assigned to you for counselling support</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />Refresh
        </Button>
      </div>

      {/* Privacy reminder */}
      <Card className="border-purple-200 bg-purple-50/60">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-xs text-purple-800">
            <Lock className="w-4 h-4 text-purple-600 shrink-0" />
            <p><strong>Confidentiality Notice:</strong> All student welfare information is strictly confidential. Do not disclose case details to any third party.</p>
          </div>
        </CardContent>
      </Card>

      <div className={`${selectedId ? "grid grid-cols-1 lg:grid-cols-2 gap-4" : ""}`}>
        {/* Left: cases list */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
          ) : cases.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-10 text-center text-muted-foreground">
                <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No cases assigned to you</p>
                <p className="text-xs mt-1">Cases assigned by the admin will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            cases.map((c: any) => {
              const cat = CATEGORY_CFG[c.category] ?? CATEGORY_CFG.other;
              const Icon = cat.icon;
              const prio = PRIORITY_CFG[c.priority] ?? PRIORITY_CFG.medium;
              const st = STATUS_CFG[c.status] ?? STATUS_CFG.submitted;
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
                          <Badge className={`text-[9px] ${prio.color}`}>{prio.label}</Badge>
                          <Badge className={`text-[9px] ${st.color}`}>{st.label}</Badge>
                          {c.isConfidential && <Badge className="text-[9px] bg-purple-100 text-purple-700"><Lock className="w-2 h-2 mr-0.5" />Confidential</Badge>}
                        </div>
                        <p className="font-semibold text-xs truncate">{c.title}</p>
                        <p className="text-[10px] text-muted-foreground">{c.studentName} · {c.department}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Right: detail panel */}
        {selectedId && (
          <div className="border rounded-xl overflow-hidden">
            <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
              <span className="font-semibold text-sm flex items-center gap-2"><Heart className="w-4 h-4 text-teal-600" />Case Detail</span>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setSelectedId(null)}>Close</Button>
            </div>

            {detailLoading ? (
              <div className="p-4 space-y-3"><Skeleton className="h-20" /><Skeleton className="h-24" /><Skeleton className="h-40" /></div>
            ) : d ? (
              <ScrollArea className="h-[calc(100vh-360px)] min-h-80">
                <div className="p-4 space-y-4">
                  {/* Student & category */}
                  <div className="bg-muted/40 rounded-lg p-3">
                    <div className="flex gap-2 flex-wrap mb-1">
                      <Badge className={`text-[10px] ${PRIORITY_CFG[d.priority]?.color}`}>{PRIORITY_CFG[d.priority]?.label}</Badge>
                      <Badge className={`text-[10px] ${STATUS_CFG[d.status]?.color}`}>{STATUS_CFG[d.status]?.label}</Badge>
                      {d.isConfidential && <Badge className="text-[10px] bg-purple-100 text-purple-700"><Lock className="w-2.5 h-2.5 mr-0.5" />Confidential</Badge>}
                    </div>
                    <p className="font-semibold text-sm">{d.studentName}</p>
                    <p className="text-xs text-muted-foreground">{d.department} · Level {d.level}</p>
                  </div>

                  {/* Case info */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">{CATEGORY_CFG[d.category]?.label} — {d.title}</p>
                    <div className="bg-muted/30 rounded-lg p-3 text-xs">{d.description}</div>
                  </div>

                  {/* Status timeline */}
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Case Progress</p>
                    <div className="flex items-start">
                      {STATUS_STEPS.map((step, i) => {
                        const done = i <= statusIdx;
                        const active = i === statusIdx;
                        return (
                          <div key={step} className="flex items-start flex-1">
                            <div className="flex flex-col items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${active ? "bg-teal-500 border-teal-500 text-white" : done ? "bg-teal-200 border-teal-300 text-teal-700" : "bg-muted border-border text-muted-foreground"}`}>
                                {done ? <CheckCircle className="w-3 h-3" /> : <span className="text-[8px]">{i + 1}</span>}
                              </div>
                              <p className={`text-[8px] mt-0.5 text-center leading-tight w-12 ${done ? "text-teal-700 font-medium" : "text-muted-foreground"}`}>{STATUS_LABELS[step]}</p>
                            </div>
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-0.5 mt-2.5 ${i < statusIdx ? "bg-teal-300" : "bg-border"}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Update status */}
                  {d.status !== "resolved" && d.status !== "closed" && (
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Update Status</label>
                      <div className="flex gap-2">
                        <Select defaultValue={d.status} onValueChange={v => statusMut.mutate({ id: d.id, status: v })}>
                          <SelectTrigger className="h-8 text-xs flex-1"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in_progress">Mark In Progress</SelectItem>
                            <SelectItem value="resolved">Mark Resolved</SelectItem>
                            <SelectItem value="closed">Close Case</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Notes</p>
                    {d.notes?.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">No notes yet.</p>}
                    <div className="space-y-2 mb-3">
                      {(d.notes ?? []).map((n: any) => (
                        <div key={n.id} className={`rounded-lg p-2.5 border text-xs ${n.isPrivate ? "bg-amber-50 border-amber-200" : "bg-teal-50 border-teal-100"}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className={`w-3 h-3 ${n.isPrivate ? "text-amber-600" : "text-teal-600"}`} />
                            <span className="font-semibold text-[10px]">{n.authorName}</span>
                            {n.isPrivate && <span className="text-[9px] bg-amber-200 text-amber-800 px-1 rounded">Internal</span>}
                            <span className="text-[10px] text-muted-foreground ml-auto">{new Date(n.createdAt).toLocaleDateString("en-NG")}</span>
                          </div>
                          <p>{n.note}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add note */}
                    <div className="border rounded-lg p-3 bg-muted/20 space-y-2">
                      <Textarea placeholder="Add a note or response..." rows={3} value={noteText} onChange={e => setNoteText(e.target.value)} className="text-xs resize-none" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch checked={isPrivate} onCheckedChange={setIsPrivate} id="priv-sw" />
                          <label htmlFor="priv-sw" className="text-xs text-muted-foreground cursor-pointer">
                            {isPrivate ? "Internal only" : "Share with student"}
                          </label>
                        </div>
                        <Button size="sm" className="h-7 px-3 text-xs bg-teal-600 hover:bg-teal-700 text-white"
                          disabled={!noteText.trim() || noteMut.isPending}
                          onClick={() => noteMut.mutate({ id: d.id, note: noteText, isPrivate })}>
                          <Send className="w-3 h-3 mr-1" />{noteMut.isPending ? "..." : "Add Note"}
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
