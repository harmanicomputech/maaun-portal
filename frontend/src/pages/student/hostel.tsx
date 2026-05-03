import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Home, CheckCircle, XCircle, Clock, AlertCircle, Building2,
  BedDouble, MapPin, Key, ChevronRight, RefreshCw, Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

type EligibilityData = {
  eligible: boolean;
  reason: string | null;
  application: any | null;
  allocation: any | null;
};

const STATUS_STEPS = [
  { key: "applied",      label: "Application Submitted",  icon: Send },
  { key: "under_review", label: "Under Review",           icon: Clock },
  { key: "approved",     label: "Approved",               icon: CheckCircle },
  { key: "allocated",    label: "Room Allocated",          icon: Key },
];

const STATUS_ORDER: Record<string, number> = {
  applied: 0, under_review: 1, approved: 2, allocated: 3,
};

const STATUS_COLOR: Record<string, string> = {
  applied:      "bg-blue-100 text-blue-700",
  under_review: "bg-yellow-100 text-yellow-700",
  approved:     "bg-green-100 text-green-700",
  allocated:    "bg-emerald-100 text-emerald-700",
  rejected:     "bg-red-100 text-red-700",
};

export default function StudentHostel() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [preferredGender, setPreferredGender] = useState<string>("any");

  const { data, isLoading, refetch, isFetching } = useQuery<EligibilityData>({
    queryKey: ["my-hostel"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/hostels/my-eligibility`, { headers: authHeaders() });
      return data;
    },
  });

  const { data: hostels = [] } = useQuery<any[]>({
    queryKey: ["hostels-public"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/hostels`, { headers: authHeaders() });
      return data;
    },
  });

  const applyMut = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(`${BASE()}/api/hostels/apply`,
        { preferredGender: preferredGender === "any" ? null : preferredGender },
        { headers: authHeaders() }
      );
      return data;
    },
    onSuccess: () => {
      toast({ title: "Application submitted!", description: "Your hostel application has been received." });
      qc.invalidateQueries({ queryKey: ["my-hostel"] });
    },
    onError: (err: any) => {
      toast({ title: err?.response?.data?.error ?? "Error", description: err?.response?.data?.message ?? "Could not apply", variant: "destructive" });
    },
  });

  const app = data?.application;
  const alloc = data?.allocation;
  const currentStepIdx = app ? (STATUS_ORDER[app.status] ?? -1) : -1;
  const isRejected = app?.status === "rejected";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Hostel Accommodation</h1>
          <p className="text-muted-foreground mt-1">Apply for on-campus housing and track your allocation</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-36" />
          <Skeleton className="h-24" />
          <Skeleton className="h-40" />
        </div>
      ) : (
        <>
          {/* Allocated room card */}
          {alloc && (
            <Card className="border-2 border-emerald-300 bg-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <Key className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-emerald-800">Room Allocated</h2>
                    <p className="text-sm text-emerald-700 mt-0.5">Your accommodation has been confirmed.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      {[
                        { label: "Hostel Block", value: alloc.hostelName, icon: Building2 },
                        { label: "Room Number",  value: alloc.roomNumber, icon: Home },
                        { label: "Bed Space",    value: `Bed ${alloc.bedLabel}`, icon: BedDouble },
                        { label: "Location",     value: alloc.hostelLocation ?? "On-campus", icon: MapPin },
                      ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="bg-white rounded-lg p-3 border border-emerald-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-3.5 h-3.5 text-emerald-600" />
                            <p className="text-xs text-muted-foreground">{label}</p>
                          </div>
                          <p className="font-bold text-sm">{value}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-emerald-700 mt-3">
                      Allocated on {new Date(alloc.allocatedAt).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Application status tracker */}
          {app && !isRejected && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Application Status</CardTitle>
                  <Badge className={STATUS_COLOR[app.status] ?? "bg-gray-100 text-gray-700"}>{app.status.replace("_", " ").toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Progress line */}
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-muted" />
                  <div
                    className="absolute top-5 left-5 h-0.5 bg-primary transition-all duration-700"
                    style={{ width: currentStepIdx >= 0 ? `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` : "0%" }}
                  />
                  <div className="relative flex justify-between">
                    {STATUS_STEPS.map((step, i) => {
                      const Icon = step.icon;
                      const done = i <= currentStepIdx;
                      const active = i === currentStepIdx;
                      return (
                        <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-colors
                            ${done ? "bg-primary border-primary text-white" : "bg-background border-muted text-muted-foreground"}
                            ${active ? "ring-4 ring-primary/20" : ""}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <p className={`text-xs text-center max-w-[80px] ${done ? "text-primary font-medium" : "text-muted-foreground"}`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  Applied on {new Date(app.createdAt).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })}
                  {app.preferredGender && ` · Preferred: ${app.preferredGender} hostel`}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rejected banner */}
          {isRejected && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800 text-sm">Application Rejected</p>
                  <p className="text-sm text-red-700 mt-0.5">{app.rejectionReason ?? "No reason provided."}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Eligibility + apply form */}
          {!app && (
            <Card className={`border-2 ${data?.eligible ? "border-green-200" : "border-red-200"}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${data?.eligible ? "bg-green-100" : "bg-red-100"}`}>
                    {data?.eligible
                      ? <CheckCircle className="w-6 h-6 text-green-600" />
                      : <XCircle className="w-6 h-6 text-red-600" />
                    }
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${data?.eligible ? "text-green-800" : "text-red-800"}`}>
                      {data?.eligible ? "You are eligible to apply" : "Not eligible to apply"}
                    </h3>
                    {!data?.eligible && (
                      <p className="text-sm text-red-700 mt-1">{data?.reason}</p>
                    )}
                    {data?.eligible && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium block mb-1.5">Preferred Hostel Type</label>
                          <Select value={preferredGender} onValueChange={setPreferredGender}>
                            <SelectTrigger className="w-64">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">No preference</SelectItem>
                              <SelectItem value="male">Male Hostel</SelectItem>
                              <SelectItem value="female">Female Hostel</SelectItem>
                              <SelectItem value="mixed">Mixed Hostel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={() => applyMut.mutate()} disabled={applyMut.isPending} className="gap-2">
                          <Send className="w-4 h-4" />
                          {applyMut.isPending ? "Submitting..." : "Submit Application"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Eligibility requirements */}
          {!app && !data?.eligible && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-amber-800 flex items-center gap-2"><AlertCircle className="w-4 h-4" />Requirements to Apply</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-2">
                {[
                  "Academic standing must be Good Standing (not probation or withdrawal risk)",
                  "No unconfirmed or pending fee receipts",
                  "Must be actively enrolled in the current academic session",
                ].map(req => (
                  <div key={req} className="flex items-start gap-2 text-sm text-amber-700">
                    <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" /><span>{req}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Available hostels */}
          {hostels.length > 0 && (
            <div>
              <h2 className="text-base font-semibold mb-3">Available Hostels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hostels.map((h: any) => {
                  const pct = h.totalBeds > 0 ? ((h.occupiedBeds / h.totalBeds) * 100) : 0;
                  const full = pct >= 100;
                  const partial = pct > 0 && pct < 100;
                  return (
                    <Card key={h.id} className={`border-2 ${full ? "border-red-200" : partial ? "border-yellow-200" : "border-green-200"}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <p className="font-bold text-sm">{h.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{h.gender} · {h.location ?? "On campus"}</p>
                          </div>
                          <Badge className={full ? "bg-red-100 text-red-700 text-[10px]" : partial ? "bg-yellow-100 text-yellow-700 text-[10px]" : "bg-green-100 text-green-700 text-[10px]"}>
                            {full ? "Full" : partial ? "Partial" : "Available"}
                          </Badge>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{h.vacantBeds} vacant beds</span>
                            <span>{h.occupiedBeds}/{h.totalBeds}</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${full ? "bg-red-500" : partial ? "bg-yellow-500" : "bg-green-500"}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
