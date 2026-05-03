import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Trash2, Clock, MapPin, AlertCircle, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
function authHeaders() { return { Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` }; }

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
const TIME_SLOTS = [
  "08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"
];

const DAY_COLORS: Record<string, string> = {
  Monday: "bg-blue-100 text-blue-800 border-blue-300",
  Tuesday: "bg-green-100 text-green-800 border-green-300",
  Wednesday: "bg-purple-100 text-purple-800 border-purple-300",
  Thursday: "bg-orange-100 text-orange-800 border-orange-300",
  Friday: "bg-rose-100 text-rose-800 border-rose-300",
};

export default function LecturerTimetable() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ courseId: "", venueId: "", dayOfWeek: "", startTime: "", endTime: "" });

  const { data: myTimetable = [], isLoading } = useQuery({
    queryKey: ["lecturer-timetable"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/timetables/my`, { headers: authHeaders() });
      return data;
    },
  });

  const { data: myCourses = [] } = useQuery({
    queryKey: ["my-courses"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/courses`, { headers: authHeaders() });
      return data.filter((c: any) => c.lecturerId != null);
    },
  });

  const { data: venues = [] } = useQuery({
    queryKey: ["venues"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/venues`, { headers: authHeaders() });
      return data;
    },
  });

  const { data: authUser } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/auth/me`, { headers: authHeaders() });
      return data;
    },
  });

  const { data: lecturers = [] } = useQuery({
    queryKey: ["lecturers"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/lecturers`, { headers: authHeaders() });
      return data;
    },
  });

  const myLecturer = lecturers.find((l: any) => l.userId === authUser?.id);

  const createMut = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axios.post(`${BASE()}/api/timetables`, payload, { headers: authHeaders() });
      return data;
    },
    onSuccess: () => {
      toast({ title: "Class scheduled successfully" });
      qc.invalidateQueries({ queryKey: ["lecturer-timetable"] });
      setOpen(false);
      setForm({ courseId: "", venueId: "", dayOfWeek: "", startTime: "", endTime: "" });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Failed to create schedule";
      toast({ title: "Scheduling conflict", description: msg, variant: "destructive" });
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${BASE()}/api/timetables/${id}`, { headers: authHeaders() });
    },
    onSuccess: () => { toast({ title: "Entry removed" }); qc.invalidateQueries({ queryKey: ["lecturer-timetable"] }); },
    onError: () => toast({ title: "Failed to delete", variant: "destructive" }),
  });

  function handleSubmit() {
    if (!form.courseId || !form.venueId || !form.dayOfWeek || !form.startTime || !form.endTime) {
      toast({ title: "All fields are required", variant: "destructive" }); return;
    }
    if (!myLecturer) { toast({ title: "Lecturer profile not found", variant: "destructive" }); return; }
    createMut.mutate({ ...form, lecturerId: myLecturer.id });
  }

  const byDay = (day: string) => myTimetable.filter((e: any) => e.dayOfWeek === day);
  const totalHours = myTimetable.reduce((s: number, e: any) => {
    const [sh, sm] = e.startTime.split(":").map(Number);
    const [eh, em] = e.endTime.split(":").map(Number);
    return s + (eh * 60 + em - sh * 60 - sm) / 60;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Teaching Schedule</h1>
          <p className="text-muted-foreground mt-1">Manage class timetable for your assigned courses</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" />Schedule Class</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Scheduled Classes", value: myTimetable.length, color: "text-primary" },
          { label: "Teaching Hours/Week", value: `${totalHours.toFixed(1)}h`, color: "text-green-600" },
          { label: "Venues Used", value: new Set(myTimetable.map((e: any) => e.venueId)).size, color: "text-purple-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}><CardContent className="p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Weekly grid */}
      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : myTimetable.length === 0 ? (
        <Card><CardContent className="text-center py-16 text-muted-foreground">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No classes scheduled yet</p>
          <p className="text-sm mt-1">Click "Schedule Class" to add your first timetable entry.</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {DAYS.map(day => {
            const entries = byDay(day);
            return (
              <div key={day} className="space-y-2">
                <div className={`rounded-lg px-3 py-1.5 border text-center text-sm font-semibold ${DAY_COLORS[day]}`}>{day}</div>
                {entries.length === 0 ? (
                  <div className="border border-dashed rounded-lg h-20 flex items-center justify-center text-xs text-muted-foreground">Free</div>
                ) : (
                  entries.sort((a: any, b: any) => a.startTime.localeCompare(b.startTime)).map((e: any) => (
                    <div key={e.id} className="border rounded-lg p-2.5 bg-white shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-primary truncate">{e.courseCode}</p>
                          <p className="text-xs text-muted-foreground truncate">{e.courseTitle}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 h-5 w-5 p-0 text-red-500 hover:text-red-700 shrink-0"
                          onClick={() => deleteMut.mutate(e.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                        <p className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.startTime}–{e.endTime}</p>
                        <p className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.venueName}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" />Schedule a Class</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Course</Label>
              <Select value={form.courseId} onValueChange={v => setForm(f => ({ ...f, courseId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select your course" /></SelectTrigger>
                <SelectContent>
                  {myCourses.map((c: any) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.courseCode} — {c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Venue</Label>
              <Select value={form.venueId} onValueChange={v => setForm(f => ({ ...f, venueId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select venue" /></SelectTrigger>
                <SelectContent>
                  {venues.map((v: any) => (
                    <SelectItem key={v.id} value={String(v.id)}>{v.name} (cap: {v.capacity}){v.location ? ` — ${v.location}` : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Day of Week</Label>
              <Select value={form.dayOfWeek} onValueChange={v => setForm(f => ({ ...f, dayOfWeek: v }))}>
                <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
                <SelectContent>
                  {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Time</Label>
                <Select value={form.startTime} onValueChange={v => setForm(f => ({ ...f, startTime: v }))}>
                  <SelectTrigger><SelectValue placeholder="Start" /></SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>End Time</Label>
                <Select value={form.endTime} onValueChange={v => setForm(f => ({ ...f, endTime: v }))}>
                  <SelectTrigger><SelectValue placeholder="End" /></SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>The system will automatically check for lecturer, venue, and course conflicts before saving.</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMut.isPending}>
              {createMut.isPending ? "Checking conflicts..." : "Save Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
