import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Megaphone, Plus, Pin, PinOff, Trash2, RefreshCw, Clock,
  Users, CheckCircle, XCircle, Edit2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

const ALL_ROLES = ["student", "lecturer", "counsellor", "bursar", "registrar", "hod", "dean", "admin", "super_admin"];

const ROLE_COLORS: Record<string, string> = {
  student: "bg-sky-100 text-sky-700", lecturer: "bg-teal-100 text-teal-700",
  counsellor: "bg-purple-100 text-purple-700", bursar: "bg-green-100 text-green-700",
  registrar: "bg-blue-100 text-blue-700", hod: "bg-indigo-100 text-indigo-700",
  dean: "bg-violet-100 text-violet-700", admin: "bg-orange-100 text-orange-700",
  super_admin: "bg-red-100 text-red-700",
};

const DEPT_OPTIONS = [
  "Computer Science", "Medicine", "Business Administration", "Law",
  "Engineering", "Pharmacy", "Nursing", "Accounting", "Economics", "Mass Communication",
];

const LEVEL_OPTIONS = ["100", "200", "300", "400", "500"];

const BLANK_FORM = {
  title: "", content: "", targetRoles: ["student"] as string[], targetDepartments: [] as string[],
  targetLevels: [] as string[], isPinned: false, expiresAt: "",
};

export default function AdminAnnouncements() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [form, setForm] = useState({ ...BLANK_FORM });

  const { data: announcements = [], isLoading, refetch, isFetching } = useQuery<any[]>({
    queryKey: ["admin-announcements"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/announcements/admin/all`, { headers: authHeaders() }); return data; },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-announcements"] });

  const createMut = useMutation({
    mutationFn: async (f: typeof form) => { const { data } = await axios.post(`${BASE()}/api/announcements/admin`, f, { headers: authHeaders() }); return data; },
    onSuccess: () => { toast({ title: "Announcement published" }); invalidate(); setCreateOpen(false); setForm({ ...BLANK_FORM }); },
    onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed", variant: "destructive" }),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, ...data }: any) => { const { data: r } = await axios.patch(`${BASE()}/api/announcements/admin/${id}`, data, { headers: authHeaders() }); return r; },
    onSuccess: () => { toast({ title: "Updated" }); invalidate(); setEditTarget(null); },
    onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed", variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: number) => { await axios.delete(`${BASE()}/api/announcements/admin/${id}`, { headers: authHeaders() }); },
    onSuccess: () => { toast({ title: "Announcement deleted" }); invalidate(); },
    onError: () => toast({ title: "Failed to delete", variant: "destructive" }),
  });

  const togglePin = (ann: any) =>
    updateMut.mutate({ id: ann.id, isPinned: !ann.isPinned });

  const openEdit = (ann: any) => {
    setEditTarget(ann);
    setForm({
      title: ann.title, content: ann.content,
      targetRoles: ann.targetRoles ?? [], targetDepartments: ann.targetDepartments ?? [],
      targetLevels: ann.targetLevels ?? [], isPinned: ann.isPinned,
      expiresAt: ann.expiresAt ? ann.expiresAt.slice(0, 10) : "",
    });
  };

  const toggleRole = (role: string) =>
    setForm(p => ({ ...p, targetRoles: p.targetRoles.includes(role) ? p.targetRoles.filter(r => r !== role) : [...p.targetRoles, role] }));

  const toggleDept = (dept: string) =>
    setForm(p => ({ ...p, targetDepartments: p.targetDepartments.includes(dept) ? p.targetDepartments.filter(d => d !== dept) : [...p.targetDepartments, dept] }));

  const toggleLevel = (level: string) =>
    setForm(p => ({ ...p, targetLevels: p.targetLevels.includes(level) ? p.targetLevels.filter(l => l !== level) : [...p.targetLevels, level] }));

  const pinnedCount = announcements.filter((a: any) => a.isPinned && !a.isExpired).length;
  const stats = {
    total: announcements.length,
    pinned: pinnedCount,
    expired: announcements.filter((a: any) => a.isExpired).length,
    active: announcements.filter((a: any) => !a.isExpired).length,
  };

  const FormPanel = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Title <span className="text-red-500">*</span></label>
        <Input placeholder="Announcement title..." value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Content <span className="text-red-500">*</span></label>
        <Textarea placeholder="Write your announcement here..." rows={5} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
        <p className="text-[10px] text-muted-foreground mt-1">{form.content.length} characters</p>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Target Roles <span className="text-red-500">*</span></label>
        <div className="flex flex-wrap gap-2">
          {ALL_ROLES.map(role => (
            <button key={role} type="button" onClick={() => toggleRole(role)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${form.targetRoles.includes(role) ? `${ROLE_COLORS[role]} border-current ring-1 ring-current/30` : "border-border text-muted-foreground hover:bg-muted/40"}`}>
              {role}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">Click to toggle. Selected roles will see this announcement.</p>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Target Departments <span className="text-muted-foreground text-xs">(optional — leave blank for all)</span></label>
        <div className="flex flex-wrap gap-1.5">
          {DEPT_OPTIONS.map(dept => (
            <button key={dept} type="button" onClick={() => toggleDept(dept)}
              className={`px-2 py-1 rounded text-[10px] font-medium border transition-all ${form.targetDepartments.includes(dept) ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:bg-muted/40"}`}>
              {dept}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Target Levels <span className="text-muted-foreground text-xs">(optional — leave blank for all)</span></label>
        <div className="flex gap-2 flex-wrap">
          {LEVEL_OPTIONS.map(lvl => (
            <button key={lvl} type="button" onClick={() => toggleLevel(lvl)}
              className={`px-3 py-1 rounded text-xs font-semibold border transition-all ${form.targetLevels.includes(lvl) ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:bg-muted/40"}`}>
              {lvl}L
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Expiry Date <span className="text-muted-foreground text-xs">(optional)</span></label>
          <Input type="date" value={form.expiresAt} onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Pin to Dashboard</label>
          <div className="flex items-center gap-2 mt-2">
            <Switch checked={form.isPinned} onCheckedChange={v => setForm(p => ({ ...p, isPinned: v }))} />
            <span className="text-sm text-muted-foreground">{form.isPinned ? `Pinned (${pinnedCount}/3)` : "Not pinned"}</span>
          </div>
        </div>
      </div>

      <Button className="w-full" disabled={!form.title || !form.content || form.targetRoles.length === 0 || createMut.isPending || updateMut.isPending}
        onClick={onSubmit}>
        {createMut.isPending || updateMut.isPending ? "Publishing..." : submitLabel}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-muted-foreground mt-1">Broadcast messages to targeted groups across the university</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />Refresh
          </Button>
          <Button size="sm" onClick={() => { setForm({ ...BLANK_FORM }); setCreateOpen(true); }}>
            <Plus className="w-4 h-4 mr-1.5" />New Announcement
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-primary" },
          { label: "Active", value: stats.active, color: "text-green-600" },
          { label: "Pinned", value: `${stats.pinned}/3`, color: "text-amber-600" },
          { label: "Expired", value: stats.expired, color: "text-red-500" },
        ].map(({ label, value, color }) => (
          <Card key={label}><CardContent className="p-3 text-center">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann: any) => (
            <Card key={ann.id} className={`${ann.isPinned && !ann.isExpired ? "border-amber-300 bg-amber-50/40" : ""} ${ann.isExpired ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      {ann.isPinned && !ann.isExpired && <Badge className="text-[10px] bg-amber-100 text-amber-700"><Pin className="w-2.5 h-2.5 mr-0.5" />Pinned</Badge>}
                      {ann.isExpired && <Badge className="text-[10px] bg-red-100 text-red-600"><Clock className="w-2.5 h-2.5 mr-0.5" />Expired</Badge>}
                      {(ann.targetRoles ?? []).map((r: string) => (
                        <span key={r} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${ROLE_COLORS[r] ?? "bg-gray-100 text-gray-600"}`}>{r}</span>
                      ))}
                    </div>
                    <p className="font-semibold text-sm">{ann.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ann.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground flex-wrap">
                      <span>By {ann.createdByName}</span>
                      <span>{new Date(ann.createdAt).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      {ann.expiresAt && <span className={ann.isExpired ? "text-red-500" : "text-amber-600"}>Expires {new Date(ann.expiresAt).toLocaleDateString("en-NG")}</span>}
                      {ann.targetDepartments?.length > 0 && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ann.targetDepartments.join(", ")}</span>}
                      {ann.targetLevels?.length > 0 && <span>Levels: {ann.targetLevels.join(", ")}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Edit"
                      onClick={() => openEdit(ann)}><Edit2 className="w-3.5 h-3.5" /></Button>
                    <Button size="sm" variant="ghost" className={`h-7 w-7 p-0 ${ann.isPinned ? "text-amber-600" : "text-muted-foreground"}`}
                      title={ann.isPinned ? "Unpin" : "Pin"} disabled={updateMut.isPending}
                      onClick={() => togglePin(ann)}>
                      {ann.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                      title="Delete" disabled={deleteMut.isPending}
                      onClick={() => { if (confirm(`Delete "${ann.title}"?`)) deleteMut.mutate(ann.id); }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={o => !o && setCreateOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Megaphone className="w-5 h-5" />New Announcement
            </DialogTitle>
          </DialogHeader>
          <FormPanel onSubmit={() => createMut.mutate(form)} submitLabel="Publish Announcement" />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={o => !o && setEditTarget(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Edit2 className="w-5 h-5" />Edit Announcement
            </DialogTitle>
          </DialogHeader>
          <FormPanel onSubmit={() => editTarget && updateMut.mutate({ id: editTarget.id, ...form })} submitLabel="Save Changes" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
