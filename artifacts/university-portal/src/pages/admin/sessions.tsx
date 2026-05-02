import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Plus, Zap, Trash2, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
function authHeaders() { return { Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` }; }

export default function AdminSessions() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [semDialogOpen, setSemDialogOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newSemName, setNewSemName] = useState("");
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [acting, setActing] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE()}/api/sessions`, { headers: authHeaders() });
      setSessions(data);
    } catch { toast({ title: "Failed to load sessions", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const createSession = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await axios.post(`${BASE()}/api/sessions`, { name: newName.trim() }, { headers: authHeaders() });
      toast({ title: "Session created" });
      setDialogOpen(false); setNewName("");
      await load();
    } catch { toast({ title: "Failed to create session", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const activateSession = async (id: number) => {
    setActing(id);
    try {
      await axios.put(`${BASE()}/api/sessions/${id}/activate`, {}, { headers: authHeaders() });
      toast({ title: "Session activated" });
      await load();
    } catch { toast({ title: "Failed to activate", variant: "destructive" }); }
    finally { setActing(null); }
  };

  const deleteSession = async (id: number) => {
    setActing(id);
    try {
      await axios.delete(`${BASE()}/api/sessions/${id}`, { headers: authHeaders() });
      toast({ title: "Session deleted" });
      await load();
    } catch { toast({ title: "Failed to delete", variant: "destructive" }); }
    finally { setActing(null); }
  };

  const createSemester = async () => {
    if (!newSemName.trim() || !activeSessionId) return;
    setSaving(true);
    try {
      await axios.post(`${BASE()}/api/sessions/${activeSessionId}/semesters`, { name: newSemName.trim() }, { headers: authHeaders() });
      toast({ title: "Semester added" });
      setSemDialogOpen(false); setNewSemName(""); setActiveSessionId(null);
      await load();
    } catch { toast({ title: "Failed to add semester", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const activateSemester = async (sessionId: number, semId: number) => {
    setActing(semId);
    try {
      await axios.put(`${BASE()}/api/sessions/${sessionId}/semesters/${semId}/activate`, {}, { headers: authHeaders() });
      toast({ title: "Semester activated" });
      await load();
    } catch { toast({ title: "Failed to activate", variant: "destructive" }); }
    finally { setActing(null); }
  };

  const toggleExpand = (id: number) => setExpanded(ex => ex.includes(id) ? ex.filter(e => e !== id) : [...ex, id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Academic Sessions</h1>
          <p className="text-muted-foreground mt-1">Manage academic years and semesters</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />New Session</Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No academic sessions created yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => {
            const isExpanded = expanded.includes(session.id);
            return (
              <Card key={session.id} className={session.isActive ? "border-primary/40 bg-primary/5" : ""}>
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 px-6 py-4">
                    <button onClick={() => toggleExpand(session.id)} className="text-muted-foreground">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <CalendarDays className={`w-5 h-5 ${session.isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{session.name}</span>
                        {session.isActive && <Badge className="bg-green-100 text-green-700">Active</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{session.semesters?.length || 0} semester(s)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!session.isActive && (
                        <Button size="sm" variant="outline" onClick={() => activateSession(session.id)} disabled={acting === session.id}>
                          {acting === session.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 mr-1" />}Activate
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => { setActiveSessionId(session.id); setSemDialogOpen(true); }}>
                        <Plus className="w-3.5 h-3.5 mr-1" />Semester
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => deleteSession(session.id)} disabled={acting === session.id}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  {isExpanded && session.semesters?.length > 0 && (
                    <div className="border-t bg-muted/20 px-12 py-3 space-y-2">
                      {session.semesters.map((sem: any) => (
                        <div key={sem.id} className="flex items-center gap-3">
                          <div className="flex-1 flex items-center gap-2">
                            <span className="text-sm font-medium">{sem.name}</span>
                            {sem.isActive && <Badge className="bg-blue-100 text-blue-700 text-xs">Active</Badge>}
                          </div>
                          {!sem.isActive && (
                            <Button size="sm" variant="ghost" onClick={() => activateSemester(session.id, sem.id)} disabled={acting === sem.id}>
                              {acting === sem.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Activate"}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Academic Session</DialogTitle></DialogHeader>
          <div><Label>Session Name</Label><Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. 2024/2025 Academic Session" /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={createSession} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={semDialogOpen} onOpenChange={setSemDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Semester</DialogTitle></DialogHeader>
          <div><Label>Semester Name</Label><Input value={newSemName} onChange={e => setNewSemName(e.target.value)} placeholder="e.g. First Semester" /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSemDialogOpen(false)}>Cancel</Button>
            <Button onClick={createSemester} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
