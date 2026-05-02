import { useState } from "react";
import { useListStudents, useListResults, useSubmitResult, useUpdateResult, getListResultsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetLecturerDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Plus, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ACADEMIC_YEAR = "2024/2025";
const SEMESTER = "first";

const gradeColors: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-orange-100 text-orange-800",
  F: "bg-red-100 text-red-800",
};

export default function LecturerResults() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<any>(null);
  const [formData, setFormData] = useState({ studentId: "", caScore: "", examScore: "" });

  const { data: dashboard } = useGetLecturerDashboard();
  const { data: students = [] } = useListStudents();
  const { data: results = [], isLoading } = useListResults(
    selectedCourseId ? { courseId: parseInt(selectedCourseId), academicYear: ACADEMIC_YEAR } : undefined,
    { query: { enabled: !!selectedCourseId } }
  );

  const submitMutation = useSubmitResult({
    mutation: {
      onSuccess: () => {
        toast({ title: "Result saved successfully" });
        queryClient.invalidateQueries({ queryKey: getListResultsQueryKey() });
        setDialogOpen(false);
        setFormData({ studentId: "", caScore: "", examScore: "" });
        setEditingResult(null);
      },
      onError: () => toast({ title: "Failed to save result", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateResult({
    mutation: {
      onSuccess: () => {
        toast({ title: "Result updated" });
        queryClient.invalidateQueries({ queryKey: getListResultsQueryKey() });
        setDialogOpen(false);
        setEditingResult(null);
      },
      onError: () => toast({ title: "Failed to update", variant: "destructive" }),
    },
  });

  const handleSubmit = () => {
    if (editingResult) {
      updateMutation.mutate({ id: editingResult.id, data: { caScore: parseFloat(formData.caScore), examScore: parseFloat(formData.examScore) } });
    } else {
      if (!formData.studentId || !selectedCourseId) return;
      submitMutation.mutate({ data: { studentId: parseInt(formData.studentId), courseId: parseInt(selectedCourseId), semester: SEMESTER, academicYear: ACADEMIC_YEAR, caScore: parseFloat(formData.caScore) || 0, examScore: parseFloat(formData.examScore) || 0 } });
    }
  };

  const openEdit = (result: any) => {
    setEditingResult(result);
    setFormData({ studentId: String(result.studentId), caScore: String(result.caScore ?? ""), examScore: String(result.examScore ?? "") });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditingResult(null);
    setFormData({ studentId: "", caScore: "", examScore: "" });
    setDialogOpen(true);
  };

  const courses = dashboard?.courses || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Results Management</h1>
          <p className="text-muted-foreground mt-1">Enter and manage student results</p>
        </div>
        {selectedCourseId && (
          <Button onClick={openNew} data-testid="button-add-result">
            <Plus className="w-4 h-4 mr-2" /> Add Result
          </Button>
        )}
      </div>

      <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
        <SelectTrigger className="w-full sm:w-80" data-testid="select-course">
          <SelectValue placeholder="Select a course to view results" />
        </SelectTrigger>
        <SelectContent>
          {courses.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>{c.courseCode} — {c.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!selectedCourseId ? (
        <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
          <p>Select a course above to view and manage results.</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Results for {courses.find(c => String(c.id) === selectedCourseId)?.courseCode || "Course"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {results.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No results entered yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Student</th>
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
                        <td className="px-6 py-4">Student #{result.studentId}</td>
                        <td className="px-4 py-4 text-center">{result.caScore ?? "—"}</td>
                        <td className="px-4 py-4 text-center">{result.examScore ?? "—"}</td>
                        <td className="px-4 py-4 text-center font-semibold">{result.totalScore ?? "—"}</td>
                        <td className="px-4 py-4 text-center">
                          <Badge className={gradeColors[result.grade || ""] || "bg-gray-100"} variant="secondary">
                            {result.grade || "—"}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(result)} data-testid={`button-edit-result-${result.id}`}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
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
          <DialogHeader>
            <DialogTitle>{editingResult ? "Edit Result" : "Enter Result"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!editingResult && (
              <div>
                <Label>Student</Label>
                <Select value={formData.studentId} onValueChange={(v) => setFormData(f => ({ ...f, studentId: v }))}>
                  <SelectTrigger data-testid="select-student"><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>
                    {students.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name} — {s.matricNumber}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>CA Score (30 max)</Label>
              <Input type="number" min="0" max="30" placeholder="0" value={formData.caScore}
                onChange={(e) => setFormData(f => ({ ...f, caScore: e.target.value }))} data-testid="input-ca-score" />
            </div>
            <div>
              <Label>Exam Score (70 max)</Label>
              <Input type="number" min="0" max="70" placeholder="0" value={formData.examScore}
                onChange={(e) => setFormData(f => ({ ...f, examScore: e.target.value }))} data-testid="input-exam-score" />
            </div>
            {formData.caScore && formData.examScore && (
              <p className="text-sm text-muted-foreground">Total: <strong>{parseFloat(formData.caScore || "0") + parseFloat(formData.examScore || "0")}/100</strong></p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitMutation.isPending || updateMutation.isPending} data-testid="button-save-result">
              {(submitMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Result
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
