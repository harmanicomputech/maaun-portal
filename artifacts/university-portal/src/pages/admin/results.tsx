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
import { Plus, Pencil, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const gradeColors: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-orange-100 text-orange-800",
  F: "bg-red-100 text-red-800",
};

export default function AdminResults() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<any>(null);
  const [form, setForm] = useState({ studentId: "", courseId: "", semester: "first", academicYear: "2024/2025", caScore: "", examScore: "" });

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
    if (editingResult) {
      updateMutation.mutate({ id: editingResult.id, data: { caScore: parseFloat(form.caScore), examScore: parseFloat(form.examScore) } });
    } else {
      submitMutation.mutate({ data: { studentId: parseInt(form.studentId), courseId: parseInt(form.courseId), semester: form.semester, academicYear: form.academicYear, caScore: parseFloat(form.caScore) || 0, examScore: parseFloat(form.examScore) || 0 } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Results Management</h1>
          <p className="text-muted-foreground mt-1">View and manage all student results</p>
        </div>
        {selectedStudentId && (
          <Button onClick={openNew} data-testid="button-add-result"><Plus className="w-4 h-4 mr-2" />Add Result</Button>
        )}
      </div>

      <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
        <SelectTrigger className="w-full sm:w-96" data-testid="select-student">
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
                      <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Course</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Semester</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">CA</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Exam</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Total</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Grade</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id} className="border-b hover:bg-muted/20 transition-colors" data-testid={`row-result-${result.id}`}>
                        <td className="px-6 py-4">
                          <p className="font-medium">{result.course?.courseCode || `#${result.courseId}`}</p>
                          <p className="text-xs text-muted-foreground">{result.course?.title}</p>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground hidden sm:table-cell capitalize">{result.semester} · {result.academicYear}</td>
                        <td className="px-4 py-4 text-center">{result.caScore ?? "—"}</td>
                        <td className="px-4 py-4 text-center">{result.examScore ?? "—"}</td>
                        <td className="px-4 py-4 text-center font-semibold">{result.totalScore ?? "—"}</td>
                        <td className="px-4 py-4 text-center">
                          <Badge className={gradeColors[result.grade || ""] || "bg-gray-100"} variant="secondary">{result.grade || "—"}</Badge>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(result)}><Pencil className="w-3.5 h-3.5" /></Button>
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
                  <div>
                    <Label>Academic Year</Label>
                    <Input value={form.academicYear} onChange={(e) => setForm(f => ({ ...f, academicYear: e.target.value }))} placeholder="2024/2025" />
                  </div>
                </div>
              </>
            )}
            <div>
              <Label>CA Score (30 max)</Label>
              <Input type="number" min="0" max="30" value={form.caScore} onChange={(e) => setForm(f => ({ ...f, caScore: e.target.value }))} data-testid="input-ca-score" />
            </div>
            <div>
              <Label>Exam Score (70 max)</Label>
              <Input type="number" min="0" max="70" value={form.examScore} onChange={(e) => setForm(f => ({ ...f, examScore: e.target.value }))} data-testid="input-exam-score" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitMutation.isPending || updateMutation.isPending} data-testid="button-save-result">
              {(submitMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
