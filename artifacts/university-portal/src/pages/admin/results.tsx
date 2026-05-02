import { useState } from "react";
import { useListResults, useListStudents, useListCourses, useSubmitResult, useUpdateResult, getListResultsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Loader2, CheckCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const gradeColors: Record<string, string> = {
  A: "bg-green-100 text-green-800", B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800", D: "bg-orange-100 text-orange-800",
  E: "bg-orange-100 text-orange-800", F: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600", submitted: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700", locked: "bg-blue-100 text-blue-700",
};

async function apiAction(method: string, url: string, token: string) {
  const baseUrl = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
  await axios({ method, url: `${baseUrl}${url}`, headers: { Authorization: `Bearer ${token}` } });
}

export default function AdminResults() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [form, setForm] = useState({ studentId: "", courseId: "", semester: "first", academicYear: "2024/2025", caScore: "", examScore: "" });

  const token = localStorage.getItem("maaun_token") || "";
  const { data: students = [] } = useListStudents();
  const { data: courses = [] } = useListCourses();
  const { data: results = [], isLoading } = useListResults(
    selectedStudentId ? { studentId: parseInt(selectedStudentId) } : undefined,
    { query: { enabled: !!selectedStudentId } }
  );

  const submitMutation = useSubmitResult({
    mutation: {
      onSuccess: () => { toast({ title: "Result saved" }); queryClient.invalidateQueries({ queryKey: getListResultsQueryKey() }); closeDialog(); },
      onError: () => toast({ title: "Failed to save", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateResult({
    mutation: {
      onSuccess: () => { toast({ title: "Result updated" }); queryClient.invalidateQueries({ queryKey: getListResultsQueryKey() }); closeDialog(); },
      onError: () => toast({ title: "Failed to update", variant: "destructive" }),
    },
  });

  const closeDialog = () => { setDialogOpen(false); setEditingResult(null); setForm({ studentId: "", courseId: "", semester: "first", academicYear: "2024/2025", caScore: "", examScore: "" }); };
  const openNew = () => { setEditingResult(null); setForm({ studentId: selectedStudentId, courseId: "", semester: "first", academicYear: "2024/2025", caScore: "", examScore: "" }); setDialogOpen(true); };
  const openEdit = (result: any) => {
    setEditingResult(result);
    setForm({ studentId: String(result.studentId), courseId: String(result.courseId), semester: result.semester, academicYear: result.academicYear, caScore: String(result.caScore ?? ""), examScore: String(result.examScore ?? "") });
    setDialogOpen(true);
  };
  const handleSubmit = () => {
    if (editingResult) updateMutation.mutate({ id: editingResult.id, data: { caScore: parseFloat(form.caScore), examScore: parseFloat(form.examScore) } });
    else submitMutation.mutate({ data: { studentId: parseInt(form.studentId), courseId: parseInt(form.courseId), semester: form.semester, academicYear: form.academicYear, caScore: parseFloat(form.caScore) || 0, examScore: parseFloat(form.examScore) || 0 } });
  };

  const handleAction = async (id: number, action: "approve" | "lock") => {
    setActionLoading(id);
    try {
      const baseUrl = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
      await axios.put(`${baseUrl}/api/results/${id}/${action}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast({ title: `Result ${action}d successfully` });
      queryClient.invalidateQueries({ queryKey: getListResultsQueryKey() });
    } catch { toast({ title: `Failed to ${action}`, variant: "destructive" }); }
    finally { setActionLoading(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Results Management</h1>
          <p className="text-muted-foreground mt-1">View, approve, and lock student results</p>
        </div>
        {selectedStudentId && (
          <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Add Result</Button>
        )}
      </div>

      <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
        <SelectTrigger className="w-full sm:w-96">
          <SelectValue placeholder="Select a student to view results" />
        </SelectTrigger>
        <SelectContent>
          {students.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.name} — {s.matricNumber}</SelectItem>)}
        </SelectContent>
      </Select>

      {!selectedStudentId ? (
        <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
          <p>Select a student above to view their results.</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-base">Academic Results</CardTitle></CardHeader>
          <CardContent className="p-0">
            {results.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No results recorded for this student.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Course</th>
                      <th className="text-center px-3 py-3 font-semibold text-muted-foreground">CA</th>
                      <th className="text-center px-3 py-3 font-semibold text-muted-foreground">Exam</th>
                      <th className="text-center px-3 py-3 font-semibold text-muted-foreground">Total</th>
                      <th className="text-center px-3 py-3 font-semibold text-muted-foreground">Grade</th>
                      <th className="text-center px-3 py-3 font-semibold text-muted-foreground">Status</th>
                      <th className="text-center px-3 py-3 font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id} className="border-b hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium">{result.course?.courseCode || `#${result.courseId}`}</p>
                          <p className="text-xs text-muted-foreground">{result.course?.title}</p>
                        </td>
                        <td className="px-3 py-3 text-center">{result.caScore ?? "—"}</td>
                        <td className="px-3 py-3 text-center">{result.examScore ?? "—"}</td>
                        <td className="px-3 py-3 text-center font-semibold">{result.totalScore ?? "—"}</td>
                        <td className="px-3 py-3 text-center">
                          <Badge className={gradeColors[result.grade || ""] || "bg-gray-100"} variant="secondary">{result.grade || "—"}</Badge>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <Badge className={statusColors[(result as any).status || "draft"]} variant="secondary">
                            {(result as any).status || "draft"}
                          </Badge>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => openEdit(result)} disabled={(result as any).status === "locked"}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            {(result as any).status !== "locked" && (result as any).status !== "approved" && (
                              <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-800 hover:bg-green-50"
                                onClick={() => handleAction(result.id, "approve")} disabled={actionLoading === result.id}>
                                {actionLoading === result.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                              </Button>
                            )}
                            {(result as any).status === "approved" && (
                              <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                onClick={() => handleAction(result.id, "lock")} disabled={actionLoading === result.id}>
                                {actionLoading === result.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingResult ? "Edit Result" : "Submit Result"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {!editingResult && (
              <>
                <div>
                  <Label>Student</Label>
                  <Select value={form.studentId} onValueChange={(v) => setForm(f => ({ ...f, studentId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>{students.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Course</Label>
                  <Select value={form.courseId} onValueChange={(v) => setForm(f => ({ ...f, courseId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                    <SelectContent>{courses.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.courseCode} — {c.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Semester</Label>
                    <Select value={form.semester} onValueChange={(v) => setForm(f => ({ ...f, semester: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="first">First</SelectItem><SelectItem value="second">Second</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label>Academic Year</Label><Input value={form.academicYear} onChange={(e) => setForm(f => ({ ...f, academicYear: e.target.value }))} /></div>
                </div>
              </>
            )}
            <div><Label>CA Score (30 max)</Label><Input type="number" min="0" max="30" value={form.caScore} onChange={(e) => setForm(f => ({ ...f, caScore: e.target.value }))} /></div>
            <div><Label>Exam Score (70 max)</Label><Input type="number" min="0" max="70" value={form.examScore} onChange={(e) => setForm(f => ({ ...f, examScore: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitMutation.isPending || updateMutation.isPending}>
              {(submitMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
