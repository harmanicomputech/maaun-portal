import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldAlert, CheckCircle, Clock, XCircle, AlertTriangle,
  Gavel, BookOpen, Home, GraduationCap, UserX, FileText, ChevronRight,
} from "lucide-react";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

const SEVERITY_CFG: Record<string, { color: string; bg: string; label: string; dot: string }> = {
  minor:    { color: "text-green-700",  bg: "bg-green-100",  label: "Minor",    dot: "bg-green-500" },
  moderate: { color: "text-yellow-700", bg: "bg-yellow-100", label: "Moderate", dot: "bg-yellow-500" },
  major:    { color: "text-orange-700", bg: "bg-orange-100", label: "Major",    dot: "bg-orange-500" },
  critical: { color: "text-red-700",    bg: "bg-red-100",    label: "Critical", dot: "bg-red-500" },
};

const STATUS_CFG: Record<string, { icon: any; color: string; label: string }> = {
  open:         { icon: AlertTriangle, color: "bg-blue-100 text-blue-700",   label: "Open" },
  under_review: { icon: Clock,         color: "bg-yellow-100 text-yellow-700", label: "Under Review" },
  resolved:     { icon: CheckCircle,   color: "bg-green-100 text-green-700", label: "Resolved" },
  dismissed:    { icon: XCircle,       color: "bg-gray-100 text-gray-700",   label: "Dismissed" },
};

const ACTION_CFG: Record<string, { icon: any; color: string; label: string; desc: string }> = {
  warning:     { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-50 border-yellow-200", label: "Formal Warning",   desc: "Recorded on academic file" },
  suspension:  { icon: BookOpen,      color: "text-orange-600 bg-orange-50 border-orange-200", label: "Suspension",       desc: "Course registration blocked" },
  restriction: { icon: Home,          color: "text-purple-600 bg-purple-50 border-purple-200", label: "Hostel Restriction",desc: "Hostel access blocked" },
  expulsion:   { icon: UserX,         color: "text-red-600 bg-red-50 border-red-300",          label: "Expulsion",        desc: "Full account restriction" },
};

const FLAG_CFG: Record<string, { icon: any; label: string; color: string }> = {
  academic_hold:    { icon: BookOpen,       label: "Academic Hold",      color: "text-orange-600 bg-orange-50 border-orange-200" },
  hostel_block:     { icon: Home,           label: "Hostel Block",       color: "text-purple-600 bg-purple-50 border-purple-200" },
  graduation_block: { icon: GraduationCap,  label: "Graduation Block",   color: "text-red-600 bg-red-50 border-red-200" },
  account_disabled: { icon: UserX,          label: "Account Restricted", color: "text-red-700 bg-red-100 border-red-300" },
};

export default function StudentDisciplinary() {
  const { data, isLoading } = useQuery<{ cases: any[]; activeFlags: any[] }>({
    queryKey: ["my-disciplinary"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/disciplinary/my-cases`, { headers: authHeaders() });
      return data;
    },
  });

  const cases = data?.cases ?? [];
  const flags = data?.activeFlags ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Disciplinary Record</h1>
        <p className="text-muted-foreground mt-1">View your disciplinary cases, sanctions, and active restrictions</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : (
        <>
          {/* Active flags banner */}
          {flags.length > 0 && (
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-800 text-sm">Active Restrictions on Your Account</p>
                    <p className="text-xs text-red-700 mt-0.5 mb-3">The following restrictions are currently affecting your access. Contact the registry to resolve.</p>
                    <div className="flex flex-wrap gap-2">
                      {flags.map((f: any) => {
                        const cfg = FLAG_CFG[f.flagType];
                        const Icon = cfg?.icon ?? ShieldAlert;
                        return (
                          <div key={f.id} className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${cfg?.color ?? "text-red-600 bg-red-50 border-red-200"}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {cfg?.label ?? f.flagType}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Clean record */}
          {cases.length === 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-green-800 text-lg">Clean Record</h3>
                <p className="text-sm text-green-700 mt-1">You have no disciplinary cases on record.</p>
              </CardContent>
            </Card>
          )}

          {/* Cases list */}
          {cases.length > 0 && (
            <div className="space-y-4">
              {cases.map((c: any) => {
                const sev = SEVERITY_CFG[c.severity] ?? SEVERITY_CFG.minor;
                const st = STATUS_CFG[c.status] ?? STATUS_CFG.open;
                const StatusIcon = st.icon;
                return (
                  <Card key={c.id} className={`border-l-4 ${c.severity === "critical" ? "border-l-red-500" : c.severity === "major" ? "border-l-orange-500" : c.severity === "moderate" ? "border-l-yellow-500" : "border-l-green-500"}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${sev.bg} ${sev.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                              {sev.label}
                            </span>
                            <Badge className={`${st.color} text-[10px]`}>
                              <StatusIcon className="w-2.5 h-2.5 mr-1" />{st.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Case #{c.id}</span>
                          </div>
                          <h3 className="font-semibold text-sm">{c.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Opened {new Date(c.createdAt).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })}
                          </p>
                        </div>
                      </div>

                      {/* Sanctions timeline */}
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

          {/* Info card */}
          <Card className="border-blue-100 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800 space-y-1">
                  <p className="font-semibold">About Your Disciplinary Record</p>
                  <div className="space-y-0.5 text-blue-700">
                    {[
                      "Cases are opened and managed by the Dean of Students office.",
                      "Sanctions may affect course registration, hostel access, or graduation eligibility.",
                      "Resolved or dismissed cases have no active restrictions.",
                      "Contact the registry for any clarification or appeal.",
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
        </>
      )}
    </div>
  );
}
