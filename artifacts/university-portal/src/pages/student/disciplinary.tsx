import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ShieldAlert, CheckCircle, Clock, XCircle, AlertTriangle,
  Gavel, BookOpen, Home, GraduationCap, UserX, FileText, ChevronRight,
  Send, MessageSquare, Scale,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

const SEVERITY_CFG: Record<string, { color: string; bg: string; label: string; dot: string }> = {
  minor:    { color: "text-green-700",  bg: "bg-green-100",  label: "Minor",    dot: "bg-green-500" },
  moderate: { color: "text-yellow-700", bg: "bg-yellow-100", label: "Moderate", dot: "bg-yellow-500" },
  major:    { color: "text-orange-700", bg: "bg-orange-100", label: "Major",    dot: "bg-orange-500" },
  critical: { color: "text-red-700",    bg: "bg-red-100",    label: "Critical", dot: "bg-red-500" },
};

const STATUS_CFG: Record<string, { icon: any; color: string; label: string }> = {
  open:         { icon: AlertTriangle, color: "bg-blue-100 text-blue-700",    label: "Open" },
  under_review: { icon: Clock,         color: "bg-yellow-100 text-yellow-700",label: "Under Review" },
  resolved:     { icon: CheckCircle,   color: "bg-green-100 text-green-700",  label: "Resolved" },
  dismissed:    { icon: XCircle,       color: "bg-gray-100 text-gray-700",    label: "Dismissed" },
};

const APPEAL_STATUS_CFG: Record<string, { color: string; label: string; icon: any }> = {
  submitted:    { color: "bg-blue-100 text-blue-700",    label: "Submitted",    icon: Send },
  under_review: { color: "bg-yellow-100 text-yellow-700",label: "Under Review", icon: Clock },
  accepted:     { color: "bg-green-100 text-green-700",  label: "Accepted",     icon: CheckCircle },
  rejected:     { color: "bg-red-100 text-red-700",      label: "Rejected",     icon: XCircle },
};

const ACTION_CFG: Record<string, { icon: any; color: string; label: string; desc: string }> = {
  warning:     { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-50 border-yellow-200", label: "Formal Warning",    desc: "Recorded on academic file" },
  suspension:  { icon: BookOpen,      color: "text-orange-600 bg-orange-50 border-orange-200", label: "Suspension",        desc: "Course registration blocked" },
  restriction: { icon: Home,          color: "text-purple-600 bg-purple-50 border-purple-200", label: "Hostel Restriction", desc: "Hostel access blocked" },
  expulsion:   { icon: UserX,         color: "text-red-600 bg-red-50 border-red-300",          label: "Expulsion",         desc: "Full account restriction" },
};

const FLAG_CFG: Record<string, { icon: any; label: string; color: string }> = {
  academic_hold:    { icon: BookOpen,      label: "Academic Hold",      color: "text-orange-600 bg-orange-50 border-orange-200" },
  hostel_block:     { icon: Home,          label: "Hostel Block",       color: "text-purple-600 bg-purple-50 border-purple-200" },
  graduation_block: { icon: GraduationCap, label: "Graduation Block",   color: "text-red-600 bg-red-50 border-red-200" },
  account_disabled: { icon: UserX,         label: "Account Restricted", color: "text-red-700 bg-red-100 border-red-300" },
};

const DECISION_CFG: Record<string, { color: string; label: string }> = {
  uphold:  { color: "text-red-700 bg-red-50 border-red-200",    label: "Sanction Upheld" },
  modify:  { color: "text-blue-700 bg-blue-50 border-blue-200", label: "Sanction Modified" },
  dismiss: { color: "text-green-700 bg-green-50 border-green-200", label: "Case Dismissed" },
};

const BORDER_COLORS: Record<string, string> = {
  minor: "border-l-green-400", moderate: "border-l-yellow-400",
  major: "border-l-orange-400", critical: "border-l-red-500",
};

export default function StudentDisciplinary() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [appealTarget, setAppealTarget] = useState<{ id: number; title: string } | null>(null);
  const [appealForm, setAppealForm] = useState({ reason: "", evidence: "" });

  const { data, isLoading } = useQuery<{ cases: any[]; activeFlags: any[] }>({
    queryKey: ["my-disciplinary"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/disciplinary/my-cases`, { headers: authHeaders() }); return data; },
  });

  const { data: appeals = [], isLoading: appealsLoading } = useQuery<any[]>({
    queryKey: ["my-appeals"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/appeals/my-appeals`, { headers: authHeaders() }); return data; },
  });

  const submitAppealMut = useMutation({
    mutationFn: async ({ caseId, form }: { caseId: number; form: typeof appealForm }) => {
      const { data } = await axios.post(`${BASE()}/api/appeals/cases/${caseId}`, form, { headers: authHeaders() });
      return data;
    },
    onSuccess: () => {
      toast({ title: "Appeal submitted", description: "Your appeal has been received and will be reviewed." });
      qc.invalidateQueries({ queryKey: ["my-appeals"] });
      setAppealTarget(null);
      setAppealForm({ reason: "", evidence: "" });
    },
    onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed to submit appeal", variant: "destructive" }),
  });

  const cases = data?.cases ?? [];
  const flags = data?.activeFlags ?? [];

  // Build map caseId → appeal for per-case badge
  const appealByCaseId = new Map<number, any>(appeals.map(a => [a.caseId, a]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Disciplinary Record</h1>
        <p className="text-muted-foreground mt-1">View your cases, submit appeals, and track restrictions</p>
      </div>

      {/* Active flags banner */}
      {flags.length > 0 && (
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-800 text-sm">Active Restrictions on Your Account</p>
                <p className="text-xs text-red-700 mt-0.5 mb-3">The following restrictions are currently affecting your access.</p>
                <div className="flex flex-wrap gap-2">
                  {flags.map((f: any) => {
                    const cfg = FLAG_CFG[f.flagType];
                    const Icon = cfg?.icon ?? ShieldAlert;
                    return (
                      <div key={f.id} className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${cfg?.color ?? "text-red-600 bg-red-50 border-red-200"}`}>
                        <Icon className="w-3.5 h-3.5" />{cfg?.label ?? f.flagType}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="cases">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="cases">Cases {cases.length > 0 && `(${cases.length})`}</TabsTrigger>
          <TabsTrigger value="appeals">Appeals {appeals.length > 0 && `(${appeals.length})`}</TabsTrigger>
        </TabsList>

        {/* ── Cases Tab ────────────────────────────────────────────────────── */}
        <TabsContent value="cases" className="mt-4">
          {isLoading ? (
            <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
          ) : cases.length === 0 ? (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-green-800 text-lg">Clean Record</h3>
                <p className="text-sm text-green-700 mt-1">You have no disciplinary cases on record.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {cases.map((c: any) => {
                const sev = SEVERITY_CFG[c.severity] ?? SEVERITY_CFG.minor;
                const st = STATUS_CFG[c.status] ?? STATUS_CFG.open;
                const StatusIcon = st.icon;
                const caseAppeal = appealByCaseId.get(c.id);
                const canAppeal = (c.status === "open" || c.status === "under_review") && !caseAppeal;
                const appealCfg = caseAppeal ? APPEAL_STATUS_CFG[caseAppeal.status] : null;
                const AppealIcon = appealCfg?.icon;

                return (
                  <Card key={c.id} className={`border-l-4 ${BORDER_COLORS[c.severity] ?? "border-l-gray-300"}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${sev.bg} ${sev.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />{sev.label}
                            </span>
                            <Badge className={`${st.color} text-[10px]`}>
                              <StatusIcon className="w-2.5 h-2.5 mr-1" />{st.label}
                            </Badge>
                            {appealCfg && AppealIcon && (
                              <Badge className={`${appealCfg.color} text-[10px]`}>
                                <AppealIcon className="w-2.5 h-2.5 mr-1" />Appeal: {appealCfg.label}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">Case #{c.id}</span>
                          </div>
                          <h3 className="font-semibold text-sm">{c.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Opened {new Date(c.createdAt).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        {canAppeal && (
                          <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] text-primary border-primary shrink-0"
                            onClick={() => setAppealTarget({ id: c.id, title: c.title })}>
                            <Scale className="w-3 h-3 mr-1" />Submit Appeal
                          </Button>
                        )}
                      </div>

                      {/* Sanctions */}
                      {c.actions?.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sanctions Applied</p>
                          {c.actions.map((a: any, i: number) => {
                            const act = ACTION_CFG[a.actionType];
                            const Icon = act?.icon ?? Gavel;
                            return (
                              <div key={i} className={`flex items-start gap-3 rounded-lg border p-3 ${act?.color ?? "text-gray-600 bg-gray-50 border-gray-200"}`}>
                                <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between flex-wrap gap-1">
                                    <p className="font-semibold text-xs">{act?.label ?? a.actionType}</p>
                                    <p className="text-[10px] opacity-70">
                                      {new Date(a.startDate).toLocaleDateString("en-NG")}
                                      {a.endDate ? ` — ${new Date(a.endDate).toLocaleDateString("en-NG")}` : " (ongoing)"}
                                    </p>
                                  </div>
                                  <p className="text-[10px] mt-0.5 opacity-80">{act?.desc}</p>
                                  {a.remarks && <p className="text-[10px] mt-1 italic opacity-70">"{a.remarks}"</p>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Resolution note */}
                      {(c.status === "resolved" || c.status === "dismissed") && c.resolutionNote && (
                        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-green-800">Resolution</p>
                            <p className="text-xs text-green-700 mt-0.5">{c.resolutionNote}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ── Appeals Tab ───────────────────────────────────────────────────── */}
        <TabsContent value="appeals" className="mt-4">
          {appealsLoading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
          ) : appeals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Scale className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No appeals submitted</p>
              <p className="text-xs mt-1">Open a disciplinary case to see the "Submit Appeal" option.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appeals.map((a: any) => {
                const cfg = APPEAL_STATUS_CFG[a.status] ?? APPEAL_STATUS_CFG.submitted;
                const Icon = cfg.icon;
                const decCfg = a.decision ? DECISION_CFG[a.decision.decision] : null;

                // Timeline steps
                const steps = [
                  { label: "Appeal Submitted",     done: true,                                  date: a.createdAt },
                  { label: "Under Admin Review",   done: a.status !== "submitted",              date: null },
                  { label: "Decision Issued",       done: a.status === "accepted" || a.status === "rejected", date: a.resolvedAt },
                ];

                return (
                  <Card key={a.id} className="border">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-2 flex-wrap mb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${cfg.color} text-[10px]`}><Icon className="w-2.5 h-2.5 mr-1" />{cfg.label}</Badge>
                            <span className="text-xs text-muted-foreground">Appeal #{a.id} · Case #{a.caseId}</span>
                          </div>
                          <p className="font-semibold text-sm mt-1">{a.caseTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            Submitted {new Date(a.createdAt).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })}
                          </p>
                        </div>
                      </div>

                      {/* Progress timeline */}
                      <div className="flex items-center gap-0 mb-4">
                        {steps.map((s, i) => (
                          <div key={i} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${s.done ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                                {s.done ? <CheckCircle className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
                              </div>
                              <p className={`text-[9px] mt-1 text-center leading-tight w-16 ${s.done ? "text-primary font-medium" : "text-muted-foreground"}`}>{s.label}</p>
                            </div>
                            {i < steps.length - 1 && (
                              <div className={`flex-1 h-px mx-1 mb-4 ${steps[i + 1].done ? "bg-primary" : "bg-border"}`} />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Appeal reason */}
                      <div className="bg-muted/40 rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Your Appeal</p>
                        <p className="text-xs">{a.reason}</p>
                        {a.evidence && (
                          <a href={a.evidence} target="_blank" rel="noopener noreferrer"
                            className="text-[10px] text-primary underline mt-1 block">View Supporting Evidence</a>
                        )}
                      </div>

                      {/* Decision */}
                      {a.decision && decCfg && (
                        <div className={`rounded-lg border p-3 ${decCfg.color}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Gavel className="w-3.5 h-3.5" />
                            <p className="text-xs font-bold">{decCfg.label}</p>
                          </div>
                          {a.decision.modifiedAction && (
                            <p className="text-[10px] mb-1">Reduced to: <strong>{a.decision.modifiedAction}</strong></p>
                          )}
                          <p className="text-xs">{a.adminResponse ?? a.decision.remarks}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Info */}
      <Card className="border-blue-100 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-800 space-y-1">
              <p className="font-semibold">Your Rights & the Appeals Process</p>
              <div className="space-y-0.5 text-blue-700">
                {[
                  "You may submit one appeal per active disciplinary case.",
                  "Appeals cannot be edited after submission.",
                  "Provide clear evidence or reasoning to support your appeal.",
                  "Dismissed cases lift all active restrictions automatically.",
                  "Contact the Dean of Students office for further assistance.",
                ].map(t => (
                  <div key={t} className="flex items-start gap-1.5">
                    <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" /><span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Appeal Dialog */}
      <Dialog open={!!appealTarget} onOpenChange={o => !o && (setAppealTarget(null), setAppealForm({ reason: "", evidence: "" }))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Scale className="w-5 h-5" />Submit Formal Appeal
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <div className="bg-muted/40 rounded-lg p-3 text-sm">
              <p className="font-semibold text-xs text-muted-foreground mb-0.5">Case</p>
              <p className="font-medium">Case #{appealTarget?.id}: {appealTarget?.title}</p>
            </div>

            {/* Appeal steps indicator */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
              <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
              <div>
                <p className="font-semibold mb-1">Before you submit</p>
                <ul className="space-y-0.5 text-blue-700">
                  <li>· Appeals are reviewed by the administration.</li>
                  <li>· You cannot edit your appeal after submission.</li>
                  <li>· Provide clear, factual reasoning.</li>
                </ul>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Grounds for Appeal <span className="text-red-500">*</span></label>
              <Textarea
                placeholder="Explain why you are challenging this disciplinary case. Include relevant facts, context, or mitigating circumstances..."
                rows={5}
                value={appealForm.reason}
                onChange={e => setAppealForm(p => ({ ...p, reason: e.target.value }))}
              />
              <p className="text-[10px] text-muted-foreground mt-1">{appealForm.reason.length}/1000 characters</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Supporting Evidence (optional)</label>
              <Input
                placeholder="URL to a document, photo, or file (Google Drive, etc.)"
                value={appealForm.evidence}
                onChange={e => setAppealForm(p => ({ ...p, evidence: e.target.value }))}
              />
              <p className="text-[10px] text-muted-foreground mt-1">Paste a publicly accessible link to any supporting evidence.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAppealTarget(null); setAppealForm({ reason: "", evidence: "" }); }}>Cancel</Button>
            <Button
              disabled={!appealForm.reason.trim() || submitAppealMut.isPending}
              onClick={() => appealTarget && submitAppealMut.mutate({ caseId: appealTarget.id, form: appealForm })}>
              {submitAppealMut.isPending ? "Submitting..." : "Submit Appeal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
