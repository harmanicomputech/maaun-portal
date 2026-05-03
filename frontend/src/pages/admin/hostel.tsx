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
import {
  Building2, BedDouble, Plus, Trash2, CheckCircle, XCircle, Clock,
  Users, Home, MapPin, Zap, Search, RefreshCw, AlertCircle, Key,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

const APP_STATUS: Record<string, { color: string; label: string }> = {
  applied:      { color: "bg-blue-100 text-blue-700",    label: "Applied" },
  under_review: { color: "bg-yellow-100 text-yellow-700",label: "Under Review" },
  approved:     { color: "bg-green-100 text-green-700",  label: "Approved" },
  allocated:    { color: "bg-emerald-100 text-emerald-700",label: "Allocated" },
  rejected:     { color: "bg-red-100 text-red-700",      label: "Rejected" },
};

const ROOM_STATUS_COLOR: Record<string, string> = {
  available:   "border-green-300 bg-green-50",
  full:        "border-red-300 bg-red-50",
  maintenance: "border-gray-300 bg-gray-100",
};

export default function AdminHostel() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [appFilter, setAppFilter] = useState("all");
  const [rejectTarget, setRejectTarget] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [allocTarget, setAllocTarget] = useState<any | null>(null);
  const [selectedBed, setSelectedBed] = useState("");
  const [hostelDialog, setHostelDialog] = useState(false);
  const [roomDialog, setRoomDialog] = useState(false);

  const [hostelForm, setHostelForm] = useState({ name: "", gender: "mixed", totalRooms: "", location: "", description: "" });
  const [roomForm, setRoomForm] = useState({ hostelId: "", roomNumber: "", capacity: "2", floor: "1" });

  // Queries
  const { data: apps = [], isLoading: appsLoading, refetch: refetchApps } = useQuery<any[]>({
    queryKey: ["admin-hostel-apps"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/hostels/admin/applications`, { headers: authHeaders() }); return data; },
  });

  const { data: rooms = [], isLoading: roomsLoading, refetch: refetchRooms } = useQuery<any[]>({
    queryKey: ["admin-hostel-rooms"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/hostels/admin/rooms`, { headers: authHeaders() }); return data; },
  });

  const { data: allocs = [], isLoading: allocsLoading, refetch: refetchAllocs } = useQuery<any[]>({
    queryKey: ["admin-hostel-allocs"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/hostels/admin/allocations`, { headers: authHeaders() }); return data; },
  });

  const { data: hostels = [] } = useQuery<any[]>({
    queryKey: ["admin-hostel-all"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/hostels/admin/all`, { headers: authHeaders() }); return data; },
  });

  const { data: vacantBeds = [] } = useQuery<any[]>({
    queryKey: ["admin-hostel-vacant"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/hostels/admin/vacant-beds`, { headers: authHeaders() }); return data; },
    enabled: !!allocTarget,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-hostel-apps"] });
    qc.invalidateQueries({ queryKey: ["admin-hostel-rooms"] });
    qc.invalidateQueries({ queryKey: ["admin-hostel-allocs"] });
    qc.invalidateQueries({ queryKey: ["admin-hostel-vacant"] });
    qc.invalidateQueries({ queryKey: ["admin-hostel-all"] });
  };

  const approveMut = useMutation({
    mutationFn: async (id: number) => { const { data } = await axios.patch(`${BASE()}/api/hostels/applications/${id}/approve`, {}, { headers: authHeaders() }); return data; },
    onSuccess: () => { toast({ title: "Application moved to review" }); invalidate(); },
    onError: () => toast({ title: "Failed", variant: "destructive" }),
  });

  const rejectMut = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const { data } = await axios.patch(`${BASE()}/api/hostels/applications/${id}/reject`, { reason }, { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Application rejected" }); invalidate(); setRejectTarget(null); setRejectReason(""); },
    onError: () => toast({ title: "Failed", variant: "destructive" }),
  });

  const allocMut = useMutation({
    mutationFn: async ({ studentId, bedSpaceId }: { studentId: number; bedSpaceId: number }) => {
      const { data } = await axios.post(`${BASE()}/api/hostels/allocate`, { studentId, bedSpaceId }, { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Room allocated!" }); invalidate(); setAllocTarget(null); setSelectedBed(""); },
    onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed", variant: "destructive" }),
  });

  const vacateMut = useMutation({
    mutationFn: async (id: number) => { const { data } = await axios.patch(`${BASE()}/api/hostels/allocations/${id}/vacate`, {}, { headers: authHeaders() }); return data; },
    onSuccess: () => { toast({ title: "Bed vacated" }); invalidate(); },
    onError: () => toast({ title: "Failed", variant: "destructive" }),
  });

  const autoAllocMut = useMutation({
    mutationFn: async () => { const { data } = await axios.post(`${BASE()}/api/hostels/auto-allocate`, {}, { headers: authHeaders() }); return data; },
    onSuccess: (d) => { toast({ title: `Auto-allocated ${d.allocated} student(s)` }); invalidate(); },
    onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed", variant: "destructive" }),
  });

  const createHostelMut = useMutation({
    mutationFn: async (form: typeof hostelForm) => {
      const { data } = await axios.post(`${BASE()}/api/hostels/admin/hostel`,
        { ...form, totalRooms: parseInt(form.totalRooms) || 0 }, { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Hostel created" }); invalidate(); setHostelDialog(false); setHostelForm({ name: "", gender: "mixed", totalRooms: "", location: "", description: "" }); },
    onError: () => toast({ title: "Failed", variant: "destructive" }),
  });

  const createRoomMut = useMutation({
    mutationFn: async (form: typeof roomForm) => {
      const { data } = await axios.post(`${BASE()}/api/hostels/admin/room`,
        { hostelId: parseInt(form.hostelId), roomNumber: form.roomNumber, capacity: parseInt(form.capacity), floor: parseInt(form.floor) },
        { headers: authHeaders() }); return data;
    },
    onSuccess: () => { toast({ title: "Room created with beds" }); invalidate(); setRoomDialog(false); setRoomForm({ hostelId: "", roomNumber: "", capacity: "2", floor: "1" }); },
    onError: () => toast({ title: "Failed", variant: "destructive" }),
  });

  const deleteRoomMut = useMutation({
    mutationFn: async (id: number) => { await axios.delete(`${BASE()}/api/hostels/admin/room/${id}`, { headers: authHeaders() }); },
    onSuccess: () => { toast({ title: "Room deleted" }); invalidate(); },
    onError: () => toast({ title: "Failed to delete room", variant: "destructive" }),
  });

  // Stats
  const totalBeds = rooms.reduce((s: number, r: any) => s + (r.beds?.length ?? 0), 0);
  const occupiedBeds = rooms.reduce((s: number, r: any) => s + (r.occupiedCount ?? 0), 0);
  const vacantCount = totalBeds - occupiedBeds;
  const pendingApps = apps.filter((a: any) => a.status === "applied").length;

  const filteredApps = apps.filter((a: any) => {
    const ms = !search || a.studentName.toLowerCase().includes(search.toLowerCase()) || a.matricNumber.toLowerCase().includes(search.toLowerCase());
    if (!ms) return false;
    if (appFilter === "all") return true;
    return a.status === appFilter;
  });

  // Group rooms by hostel
  const hostelRoomMap = rooms.reduce((acc: Record<number, any[]>, r: any) => {
    if (!acc[r.hostelId]) acc[r.hostelId] = [];
    acc[r.hostelId].push(r);
    return acc;
  }, {});

  const hostelMap = new Map(hostels.map((h: any) => [h.id, h]));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Hostel Management</h1>
          <p className="text-muted-foreground mt-1">Manage accommodation blocks, rooms, and student allocations</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setHostelDialog(true)} size="sm"><Plus className="w-4 h-4 mr-1.5" />Add Hostel</Button>
          <Button variant="outline" onClick={() => setRoomDialog(true)} size="sm"><Plus className="w-4 h-4 mr-1.5" />Add Room</Button>
          <Button onClick={() => autoAllocMut.mutate()} disabled={autoAllocMut.isPending} size="sm" className="gap-2">
            <Zap className="w-4 h-4" />{autoAllocMut.isPending ? "Running..." : "Auto-Allocate"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Beds",    value: totalBeds,                    color: "text-primary" },
          { label: "Occupied",      value: occupiedBeds,                 color: "text-red-600" },
          { label: "Vacant",        value: vacantCount,                  color: "text-green-600" },
          { label: "Pending Apps",  value: pendingApps,                  color: "text-yellow-600" },
          { label: "Allocations",   value: allocs.length,                color: "text-primary" },
        ].map(({ label, value, color }) => (
          <Card key={label}><CardContent className="p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="applications">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
        </TabsList>

        {/* ── Applications Tab ─────────────────────────────────────────────── */}
        <TabsContent value="applications" className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={appFilter} onValueChange={setAppFilter}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="allocated">Allocated</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Card><CardContent className="p-0">
            {appsLoading ? <div className="p-4 space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
            : filteredApps.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>No applications found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted/40">
                    {["Student","Dept / Level","CGPA","Priority","Pref.","Status","Allocation","Actions"].map(h => (
                      <th key={h} className="text-left px-3 py-2.5 font-semibold text-muted-foreground text-xs whitespace-nowrap">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filteredApps.map((a: any) => {
                      const sc = APP_STATUS[a.status];
                      return (
                        <tr key={a.id} className="border-b hover:bg-muted/20 transition-colors">
                          <td className="px-3 py-2.5"><p className="font-medium text-xs">{a.studentName}</p><p className="text-[10px] text-muted-foreground">{a.matricNumber}</p></td>
                          <td className="px-3 py-2.5 text-xs text-muted-foreground">{a.department}<br /><span className="text-[10px]">Level {a.level}</span></td>
                          <td className="px-3 py-2.5 text-xs font-bold text-primary">{(a.cgpa ?? 0).toFixed(2)}</td>
                          <td className="px-3 py-2.5 text-xs">{(a.priorityScore ?? 0).toFixed(1)}</td>
                          <td className="px-3 py-2.5 text-xs capitalize text-muted-foreground">{a.preferredGender ?? "Any"}</td>
                          <td className="px-3 py-2.5"><Badge className={`${sc?.color ?? "bg-gray-100 text-gray-600"} text-[10px]`}>{sc?.label ?? a.status}</Badge></td>
                          <td className="px-3 py-2.5">
                            {a.allocation
                              ? <span className="text-xs text-emerald-700 font-medium">{a.allocation.hostelName} · {a.allocation.roomNumber}{a.allocation.bedLabel}</span>
                              : <span className="text-xs text-muted-foreground">—</span>}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex gap-1 flex-wrap">
                              {(a.status === "applied" || a.status === "under_review") && !a.allocation && (
                                <>
                                  <Button size="sm" className="h-6 px-2 text-[10px] bg-primary" onClick={() => setAllocTarget(a)}>Allocate</Button>
                                  {a.status === "applied" && <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" onClick={() => approveMut.mutate(a.id)}>Review</Button>}
                                  <Button size="sm" variant="outline" className="h-6 px-2 text-[10px] text-red-600 border-red-300" onClick={() => setRejectTarget(a)}>Reject</Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent></Card>
        </TabsContent>

        {/* ── Rooms Tab ────────────────────────────────────────────────────── */}
        <TabsContent value="rooms" className="mt-4 space-y-6">
          {roomsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40" />)}
            </div>
          ) : Object.keys(hostelRoomMap).length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No hostels or rooms yet.</p>
              <p className="text-xs mt-1">Add a hostel block then create rooms.</p>
            </div>
          ) : Object.entries(hostelRoomMap).map(([hostelId, hostelRooms]) => {
            const hostel = hostelMap.get(parseInt(hostelId));
            return (
              <div key={hostelId}>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm">{hostel?.name ?? `Hostel ${hostelId}`}</h3>
                  <Badge className="text-[10px] bg-muted text-muted-foreground capitalize">{hostel?.gender ?? "mixed"}</Badge>
                  {hostel?.location && <span className="text-xs text-muted-foreground">· {hostel.location}</span>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {(hostelRooms as any[]).map(room => {
                    const pct = room.capacity > 0 ? (room.occupiedCount / room.capacity) * 100 : 0;
                    return (
                      <Card key={room.id} className={`border-2 ${ROOM_STATUS_COLOR[room.status] ?? "border-muted"}`}>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-bold text-sm">Room {room.roomNumber}</p>
                              <p className="text-[10px] text-muted-foreground">Floor {room.floor ?? 1}</p>
                            </div>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              onClick={() => { if (confirm("Delete this room?")) deleteRoomMut.mutate(room.id); }}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          {/* Bed grid */}
                          <div className="grid grid-cols-2 gap-1 mb-2">
                            {(room.beds as any[] ?? []).map((bed: any) => (
                              <div key={bed.id}
                                className={`rounded text-center py-1 text-[10px] font-bold border ${bed.status === "vacant" ? "bg-green-50 border-green-300 text-green-700" : bed.status === "reserved" ? "bg-yellow-50 border-yellow-300 text-yellow-700" : "bg-red-50 border-red-300 text-red-700"}`}>
                                {bed.bedLabel}
                              </div>
                            ))}
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${pct >= 100 ? "bg-red-500" : pct > 0 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">{room.occupiedCount}/{room.capacity} occupied</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </TabsContent>

        {/* ── Allocations Tab ──────────────────────────────────────────────── */}
        <TabsContent value="allocations" className="mt-4">
          <Card><CardContent className="p-0">
            {allocsLoading ? <div className="p-4 space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
            : allocs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Key className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>No active allocations.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted/40">
                    {["Student","Dept / Level","Hostel","Room","Bed","Allocated","Status","Action"].map(h => (
                      <th key={h} className="text-left px-3 py-2.5 font-semibold text-muted-foreground text-xs whitespace-nowrap">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {allocs.map((a: any) => (
                      <tr key={a.id} className="border-b hover:bg-muted/20">
                        <td className="px-3 py-2.5"><p className="font-medium text-xs">{a.studentName}</p><p className="text-[10px] text-muted-foreground">{a.matricNumber}</p></td>
                        <td className="px-3 py-2.5 text-xs text-muted-foreground">{a.department}<br /><span className="text-[10px]">Level {a.level}</span></td>
                        <td className="px-3 py-2.5 text-xs font-medium">{a.hostelName}</td>
                        <td className="px-3 py-2.5 text-xs">{a.roomNumber}</td>
                        <td className="px-3 py-2.5"><span className="inline-flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary text-xs font-bold">{a.bedLabel}</span></td>
                        <td className="px-3 py-2.5 text-xs text-muted-foreground">{new Date(a.allocatedAt).toLocaleDateString("en-NG")}</td>
                        <td className="px-3 py-2.5"><Badge className={`${a.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"} text-[10px]`}>{a.status}</Badge></td>
                        <td className="px-3 py-2.5">
                          {a.status === "active" && (
                            <Button size="sm" variant="outline" className="h-6 px-2 text-[10px] text-red-600 border-red-300"
                              onClick={() => { if (confirm("Vacate this bed?")) vacateMut.mutate(a.id); }}>
                              Vacate
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* ── Allocate bed dialog ─────────────────────────────────────────────── */}
      <Dialog open={!!allocTarget} onOpenChange={o => !o && (setAllocTarget(null), setSelectedBed(""))}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Key className="w-5 h-5 text-primary" />Allocate Bed</DialogTitle></DialogHeader>
          <div className="py-2 space-y-3">
            <div className="bg-muted/40 rounded-lg p-3 text-sm">
              <p className="font-semibold">{allocTarget?.studentName}</p>
              <p className="text-muted-foreground text-xs">{allocTarget?.matricNumber} · {allocTarget?.department} · Level {allocTarget?.level}</p>
              <p className="text-xs mt-1">Preferred: <span className="capitalize">{allocTarget?.preferredGender ?? "Any"}</span> · Priority: {(allocTarget?.priorityScore ?? 0).toFixed(1)}</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Select Bed Space <span className="text-red-500">*</span></label>
              {vacantBeds.length === 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />No vacant beds available.
                </div>
              ) : (
                <Select value={selectedBed} onValueChange={setSelectedBed}>
                  <SelectTrigger><SelectValue placeholder="Choose a bed..." /></SelectTrigger>
                  <SelectContent>
                    {vacantBeds.map((b: any) => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.hostelName} · Room {b.roomNumber} · Bed {b.bedLabel} ({b.hostelGender})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAllocTarget(null); setSelectedBed(""); }}>Cancel</Button>
            <Button disabled={!selectedBed || allocMut.isPending}
              onClick={() => allocTarget && allocMut.mutate({ studentId: allocTarget.studentId, bedSpaceId: parseInt(selectedBed) })}>
              {allocMut.isPending ? "Allocating..." : "Allocate Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reject dialog ──────────────────────────────────────────────────── */}
      <Dialog open={!!rejectTarget} onOpenChange={o => !o && (setRejectTarget(null), setRejectReason(""))}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-red-700"><XCircle className="w-5 h-5" />Reject Application</DialogTitle></DialogHeader>
          <div className="py-2 space-y-3">
            <p className="text-sm text-muted-foreground">Rejecting application for <strong>{rejectTarget?.studentName}</strong>.</p>
            <div>
              <label className="text-sm font-medium mb-1 block">Reason <span className="text-red-500">*</span></label>
              <Input placeholder="e.g. Incomplete documentation..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectTarget(null); setRejectReason(""); }}>Cancel</Button>
            <Button variant="destructive" disabled={!rejectReason.trim() || rejectMut.isPending}
              onClick={() => rejectTarget && rejectMut.mutate({ id: rejectTarget.id, reason: rejectReason })}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Create hostel dialog ────────────────────────────────────────────── */}
      <Dialog open={hostelDialog} onOpenChange={setHostelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Building2 className="w-5 h-5 text-primary" />Add Hostel Block</DialogTitle></DialogHeader>
          <div className="py-2 space-y-3">
            {[
              { label: "Hostel Name *", key: "name", placeholder: "e.g. Block A — Female Hostel" },
              { label: "Location", key: "location", placeholder: "e.g. North Campus" },
              { label: "Description", key: "description", placeholder: "Optional notes..." },
            ].map(f => (
              <div key={f.key}>
                <label className="text-sm font-medium mb-1 block">{f.label}</label>
                <Input placeholder={f.placeholder} value={(hostelForm as any)[f.key]} onChange={e => setHostelForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label className="text-sm font-medium mb-1 block">Gender</label>
              <Select value={hostelForm.gender} onValueChange={v => setHostelForm(p => ({ ...p, gender: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHostelDialog(false)}>Cancel</Button>
            <Button disabled={!hostelForm.name.trim() || createHostelMut.isPending} onClick={() => createHostelMut.mutate(hostelForm)}>
              {createHostelMut.isPending ? "Creating..." : "Create Hostel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Create room dialog ──────────────────────────────────────────────── */}
      <Dialog open={roomDialog} onOpenChange={setRoomDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Home className="w-5 h-5 text-primary" />Add Room</DialogTitle></DialogHeader>
          <div className="py-2 space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Hostel Block *</label>
              <Select value={roomForm.hostelId} onValueChange={v => setRoomForm(p => ({ ...p, hostelId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select hostel..." /></SelectTrigger>
                <SelectContent>
                  {hostels.map((h: any) => <SelectItem key={h.id} value={String(h.id)}>{h.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {[
              { label: "Room Number *", key: "roomNumber", placeholder: "e.g. 101" },
              { label: "Floor", key: "floor", placeholder: "1", type: "number" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-sm font-medium mb-1 block">{f.label}</label>
                <Input type={f.type ?? "text"} placeholder={f.placeholder} value={(roomForm as any)[f.key]} onChange={e => setRoomForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label className="text-sm font-medium mb-1 block">Capacity (beds)</label>
              <Select value={roomForm.capacity} onValueChange={v => setRoomForm(p => ({ ...p, capacity: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["1","2","3","4","6","8"].map(n => <SelectItem key={n} value={n}>{n} bed{parseInt(n) > 1 ? "s" : ""}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-xs text-blue-700">
              Bed spaces (A, B, C…) will be auto-created based on capacity.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoomDialog(false)}>Cancel</Button>
            <Button disabled={!roomForm.hostelId || !roomForm.roomNumber || createRoomMut.isPending} onClick={() => createRoomMut.mutate(roomForm)}>
              {createRoomMut.isPending ? "Creating..." : "Create Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
