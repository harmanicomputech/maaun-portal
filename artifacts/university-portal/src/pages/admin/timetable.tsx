import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar, Plus, Trash2, Clock, MapPin, AlertTriangle,
  Building2, Search, RefreshCw, Shield, Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
function authHeaders() { return { Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` }; }

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
const TIME_SLOTS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

const DEPT_COLORS = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-orange-100 text-orange-800 border-orange-200",
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-teal-100 text-teal-800 border-teal-200",
  "bg-yellow-100 text-yellow-800 border-yellow-200",
];
function deptColor(dept: string, depts: string[]) {
  const idx = depts.indexOf(dept);
  return DEPT_COLORS[idx % DEPT_COLORS.length];
}

function timesOverlap(s1: string, e1: string, s2: string, e2: string) {
  return s1 < e2 && s2 < e1;
}

function detectConflicts(entries: any[]) {
  const conflicts: { ids: number[]; type: string; message: string }[] = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i], b = entries[j];
      if (a.dayOfWeek !== b.dayOfWeek) continue;
      if (!timesOverlap(a.startTime, a.endTime, b.startTime, b.endTime)) continue;
      if (a.lecturerId === b.lecturerId) {
        conflicts.push({ ids: [a.id, b.id], type: "Lecturer", message: `${a.lecturerName} double-booked on ${a.dayOfWeek} (${a.courseCode} & ${b.courseCode})` });
      }
      if (a.venueId === b.venueId) {
        conflicts.push({ ids: [a.id, b.id], type: "Venue", message: `${a.venueName} double-booked on ${a.dayOfWeek} (${a.courseCode} & ${b.courseCode})` });
      }
    }
  }
  return conflicts;
}

export default function AdminTimetable() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterVenue, setFilterVenue] = useState("all");
  const [filterLecturer, setFilterLecturer] = useState("all");
  const [venueOpen, setVenueOpen] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [venueForm, setVenueForm] = useState({ name: "", capacity: "50", location: "" });
  const [entryForm, setEntryForm] = useState({ courseId: "", lecturerId: "", venueId: "", dayOfWeek: "", startTime: "", endTime: "" });

  const { data: timetables = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-timetable"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/timetables`, { headers: authHeaders() }); return data; },
  });

  const { data: venues = [] } = useQuery({
    queryKey: ["venues"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/venues`, { headers: authHeaders() }); return data; },
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/courses`, { headers: authHeaders() }); return data; },
  });

  const { data: lecturers = [] } = useQuery({
    queryKey: ["lecturers"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/lecturers`, { headers: authHeaders() }); return data; },
  });

  const depts = [...new Set<string>(timetables.map((e: any) => e.department))];
  const conflicts = detectConflicts(timetables);
  const conflictIds = new Set(conflicts.flatMap(c => c.ids));

  const filtered = timetables.filter((e: any) => {
    const ms = !search || e.courseCode.toLowerCase().includes(search.toLowerCase()) || e.courseTitle.toLowerCase().includes(search.toLowerCase()) || e.lecturerName.toLowerCase().includes(search.toLowerCase());
    const md = filterDept === "all" || e.department === filterDept;
    const mv = filterVenue === "all" || String(e.venueId) === filterVenue;
    const ml = filterLecturer === "all" || String(e.lecturerId) === filterLecturer;
    return ms && md && mv && ml;
  });

  const createVenueMut = useMutation({
    mutationFn: async (p: any) => { const { data } = await axios.post(`${BASE()}/api/venues`, p, { headers: authHeaders() }); return data; },
    onSuccess: () => { toast({ title: "Venue created" }); qc.invalidateQueries({ queryKey: ["venues"] }); setVenueOpen(false); setVenueForm({ name: "", capacity: "50", location: "" }); },
    onError: () => toast({ title: "Failed to create venue", variant: "destructive" }),
  });

  const createEntryMut = useMutation({
    mutationFn: async (p: any) => { const { data } = await axios.post(`${BASE()}/api/timetables`, p, { headers: authHeaders() }); return data; },
    onSuccess: () => { toast({ title: "Timetable entry added" }); qc.invalidateQueries({ queryKey: ["admin-timetable"] }); setEntryOpen(false); setEntryForm({ courseId: "", lecturerId: "", venueId: "", dayOfWeek: "", startTime: "", endTime: "" }); },
    onError: (err: any) => { const msg = err?.response?.data?.message || "Conflict detected"; toast({ title: "Conflict", description: msg, variant: "destructive" }); },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: number) => { await axios.delete(`${BASE()}/api/timetables/${id}`, { headers: authHeaders() }); },
    onSuccess: () => { toast({ title: "Entry deleted" }); qc.invalidateQueries({ queryKey: ["admin-timetable"] }); },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Timetable Management</h1>
          <p className="text-muted-foreground mt-1">Full academic schedule overview with conflict detection</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />Refresh
          </Button>
          <Button variant="outline" onClick={() => setVenueOpen(true)}><Building2 className="w-4 h-4 mr-2" />Add Venue</Button>
          <Button onClick={() => setEntryOpen(true)}><Plus className="w-4 h-4 mr-2" />Add Entry</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Entries", value: timetables.length, color: "text-primary" },
          { label: "Venues", value: venues.length, color: "text-green-600" },
          { label: "Conflicts", value: conflicts.length, color: conflicts.length > 0 ? "text-red-600" : "text-green-600" },
          { label: "Departments", value: depts.length, color: "text-purple-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}><CardContent className="p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Weekly Grid</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="conflicts" className={conflicts.length > 0 ? "text-red-600" : ""}>
            {conflicts.length > 0 && <AlertTriangle className="w-3.5 h-3.5 mr-1" />}
            Conflicts ({conflicts.length})
          </TabsTrigger>
          <TabsTrigger value="venues">Venues ({venues.length})</TabsTrigger>
        </TabsList>

        {/* Weekly Grid Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="w-48"><SelectValue placeholder="All Departments" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {depts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterVenue} onValueChange={setFilterVenue}>
              <SelectTrigger className="w-48"><SelectValue placeholder="All Venues" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Venues</SelectItem>
                {venues.map((v: any) => <SelectItem key={v.id} value={String(v.id)}>{v.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-6 gap-px bg-border rounded-xl overflow-hidden border">
                  <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-3">Time</div>
                  {DAYS.map(d => <div key={d} className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-3 text-center">{d}</div>)}
                  {TIME_SLOTS.slice(0, 10).map(hour => (
                    <>
                      <div key={`t-${hour}`} className="bg-muted/60 text-xs text-muted-foreground px-3 py-2 font-mono flex items-start pt-2">{hour}</div>
                      {DAYS.map(day => {
                        const slotEntries = filtered.filter((e: any) => {
                          if (e.dayOfWeek !== day) return false;
                          const sh = parseInt(hour.split(":")[0]);
                          const es = parseInt(e.startTime.split(":")[0]);
                          const ee = parseInt(e.endTime.split(":")[0]);
                          return es <= sh && ee > sh;
                        }).filter((e: any) => e.startTime.split(":")[0] === hour.split(":")[0]);
                        return (
                          <div key={`${day}-${hour}`} className="bg-background min-h-[52px] p-1">
                            {slotEntries.map((e: any) => (
                              <div key={e.id}
                                className={`rounded border px-2 py-1 text-xs group relative ${conflictIds.has(e.id) ? "bg-red-100 text-red-800 border-red-300" : deptColor(e.department, depts)}`}>
                                <p className="font-bold truncate">{e.courseCode}</p>
                                <p className="truncate opacity-70 text-[10px]">{e.venueName}</p>
                                {conflictIds.has(e.id) && <AlertTriangle className="w-2.5 h-2.5 absolute top-1 right-1 text-red-600" />}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </>
                  ))}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* List View Tab */}
        <TabsContent value="list" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search entries..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={filterLecturer} onValueChange={setFilterLecturer}>
              <SelectTrigger className="w-48"><SelectValue placeholder="All Lecturers" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lecturers</SelectItem>
                {lecturers.map((l: any) => <SelectItem key={l.id} value={String(l.id)}>{l.userName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-muted/40">
                      {["Course","Lecturer","Venue","Day","Time","Dept",""].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {filtered.map((e: any) => (
                        <tr key={e.id} className={`border-b hover:bg-muted/20 transition-colors ${conflictIds.has(e.id) ? "bg-red-50" : ""}`}>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-xs text-primary">{e.courseCode}</p>
                            <p className="text-xs text-muted-foreground">{e.courseTitle}</p>
                          </td>
                          <td className="px-4 py-3 text-xs">{e.lecturerName}</td>
                          <td className="px-4 py-3 text-xs">{e.venueName}</td>
                          <td className="px-4 py-3 text-xs">{e.dayOfWeek}</td>
                          <td className="px-4 py-3 text-xs font-mono">{e.startTime}–{e.endTime}</td>
                          <td className="px-4 py-3">
                            <Badge className={`${deptColor(e.department, depts)} text-[10px]`}>{e.department}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 h-6 w-6 p-0" onClick={() => deleteMut.mutate(e.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>No entries found.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conflicts Tab */}
        <TabsContent value="conflicts">
          {conflicts.length === 0 ? (
            <Card><CardContent className="text-center py-12">
              <Shield className="w-10 h-10 mx-auto mb-3 text-green-500" />
              <p className="font-semibold text-green-700">No conflicts detected</p>
              <p className="text-sm text-muted-foreground mt-1">All timetable entries are consistent.</p>
            </CardContent></Card>
          ) : (
            <div className="space-y-3">
              {conflicts.map((c, i) => (
                <Card key={i} className="border-red-200">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <Badge className="bg-red-100 text-red-700 text-xs mb-1">{c.type} Conflict</Badge>
                      <p className="text-sm text-red-800">{c.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">Entry IDs: {c.ids.join(", ")}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Venues Tab */}
        <TabsContent value="venues">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {venues.map((v: any) => (
              <Card key={v.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold">{v.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Users className="w-3 h-3" />Capacity: {v.capacity}</p>
                      {v.location && <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{v.location}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {venues.length === 0 && (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>No venues configured.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Venue Dialog */}
      <Dialog open={venueOpen} onOpenChange={setVenueOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Venue</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label>Name</Label><Input placeholder="e.g. Lecture Hall A" value={venueForm.name} onChange={e => setVenueForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Capacity</Label><Input type="number" placeholder="50" value={venueForm.capacity} onChange={e => setVenueForm(f => ({ ...f, capacity: e.target.value }))} /></div>
            <div><Label>Location (optional)</Label><Input placeholder="e.g. Block C, Floor 2" value={venueForm.location} onChange={e => setVenueForm(f => ({ ...f, location: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVenueOpen(false)}>Cancel</Button>
            <Button onClick={() => createVenueMut.mutate(venueForm)} disabled={!venueForm.name || createVenueMut.isPending}>Create Venue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Entry (Admin Override) Dialog */}
      <Dialog open={entryOpen} onOpenChange={setEntryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-primary" />Admin Override — Add Timetable Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>Course</Label>
              <Select value={entryForm.courseId} onValueChange={v => setEntryForm(f => ({ ...f, courseId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>{courses.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.courseCode} — {c.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Lecturer</Label>
              <Select value={entryForm.lecturerId} onValueChange={v => setEntryForm(f => ({ ...f, lecturerId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select lecturer" /></SelectTrigger>
                <SelectContent>{lecturers.map((l: any) => <SelectItem key={l.id} value={String(l.id)}>{l.userName} — {l.department}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Venue</Label>
              <Select value={entryForm.venueId} onValueChange={v => setEntryForm(f => ({ ...f, venueId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select venue" /></SelectTrigger>
                <SelectContent>{venues.map((v: any) => <SelectItem key={v.id} value={String(v.id)}>{v.name} (cap: {v.capacity})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Day</Label>
              <Select value={entryForm.dayOfWeek} onValueChange={v => setEntryForm(f => ({ ...f, dayOfWeek: v }))}>
                <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
                <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Time</Label>
                <Select value={entryForm.startTime} onValueChange={v => setEntryForm(f => ({ ...f, startTime: v }))}>
                  <SelectTrigger><SelectValue placeholder="Start" /></SelectTrigger>
                  <SelectContent>{TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>End Time</Label>
                <Select value={entryForm.endTime} onValueChange={v => setEntryForm(f => ({ ...f, endTime: v }))}>
                  <SelectTrigger><SelectValue placeholder="End" /></SelectTrigger>
                  <SelectContent>{TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEntryOpen(false)}>Cancel</Button>
            <Button onClick={() => createEntryMut.mutate(entryForm)} disabled={createEntryMut.isPending}>Add Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
