import { useState } from "react";
import { useListStudents, useListResults, useSubmitResult, useUpdateResult, useGetLecturerDashboard, getListResultsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Plus, Pencil, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateRequired, hasErrors, type FormErrors } from "@/lib/form-utils";
import axios from "axios";

const ACADEMIC_YEAR = "2024/2025";
const SEMESTER = "first";

const gradeColors: Record<string, string> = {
  A: "bg-green-100 text-green-800", B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800", D: "bg-orange-100 text-orange-800",
  E: "bg-orange-100 text-orange-800", F: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-500", submitted: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700", locked: "bg-blue-100 text-blue-700",
};

export default function LecturerResults() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<any>(null);
  const [formData, setFormData] = useState({ studentId: "", caScore: "", examScore: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState<number | null>(null);

  const token = localStorage.getItem("maaun_token") || "";
  const { data: dashboard } = useGetLecturerDashboard();
  const { data: students = [] } = useListStudents();
  const { data: results = [], isLoading } = useListResults(
    selectedCourseId ? { courseId: parseInt(selectedCourseId), academicYear: ACADEMIC_YEAR } : undefined,
    { query: { enabled: !!selectedCourseId } }
  );

  const submitMutation = useSubmitResult({
    mutation: {
      onSuccess: () => { toast({ title: "Result saved successfully" }); queryClient.invalidateQueries({ queryKey: getListResultsQueryKey() }); setDialogOpen(false); setFormData({ studentId: "", caScore: "", examScore: "" }); setEditingResult(null); setErrors({}); },
      onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed to save result", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateResult({
    mutation: {
      onSuccess: () => { toast({ title: "Result updated successfully" }); queryClient.invalidateQueries({ queryKey: getListResultsQueryKey() }); setDialogOpen(false); setEditingResult(null); setErrors({}); },
      onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed to update result", variant: "destructive" }),
    },
  });

  const handleSubmitForReview = async (id: number) => {
    setSubmitting(id);
    try {
      const baseUrl = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
      await axios.put(`${baseUrl}/api/results/${id}/submit`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast({ title: "Result submitted for review" });
      queryClient.invalidateQueries({ queryKey: getListResultsQueryKey() });
    } catch (err: any) {
      toast({ title: err?.response?.data?.error ?? "Failed to submit result", variant: "destructive" });
    }
    finally { setSubmitting(null); }
  };

  const setField = (key: string, value: string) => {
    setFormData(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const handleSave = () => {
    const errs: FormErrors = {};

    if (!editingResult) {
      const baseErrs = validateRequired({ studentId: { value: formData.studentId, label: "Student" } });
      Object.assign(errs, baseErrs);
    }

    const ca = parseFloat(formData.caScore);
    const exam = parseFloat(formData.examScore);
    if (formData.caScore === "" || isNaN(ca) || ca < 0 || ca > 30) errs.caScore = "CA score must be between 0 and 30";
    if (formData.examScore === "" || isNaN(exam) || exam < 0 || exam > 70) errs.examScore = "Exam score must be between 0 and 70";

    if (hasErrors(errs)) {
      setErrors(errs);
      toast({ title: "Please fix the highlighted fields", variant: "destructive" });
      return;
    }

    if (editingResult) {
      updateMutation.mutate({ id: editingResult.id, data: { caScore: ca, examScore: exam } });
    } else if (formData.studentId && selectedCourseId) {
      submitMutation.mutate({ data: { studentId: parseInt(formData.studentId), courseId: parseInt(selectedCourseId), semester: SEMESTER, academicYear: ACADEMIC_YEAR, caScore: ca || 0, examScore: exam || 0 } });
    }
  };

  const openEdit = (result: any) => { setEditingResult(result); setErrors({}); setFormData({ studentId: String(result.studentId), caScore: String(result.caScore ?? ""), examScore: String(result.examScore ?? "") }); setDialogOpen(true); };
  const openNew = () => { setEditingResult(null); setErrors({}); setFormData({ studentId: "", caScore: "", examScore: "" }); setDialogOpen(true); };
  const closeDialog = () => { setDialogOpen(false); setEditingResult(null); setErrors({}); setFormData({ studentId: "", caScore: "", examScore: "" }); };

  const courses = dashboard?.courses || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Results Entry</h1>
          <p className="text-muted-foreground mt-1">Enter and manage results for your courses</p>
        </div>
        {selectedCourseId && (
          <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Add Result</Button>
        )}
      </div>

      <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
        <SelectTrigger className="w-full sm:w-96">
          <SelectValue placeholder="Select a course to view results" />
        </SelectTrigger>
        <SelectContent>
          {courses.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.courseCode} — {c.title}</SelectItem>)}
        </SelectContent>
      </Select>

      {!selectedCourseId ? (
        <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
          <p>Select a course above to view its results.</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-base">Student Results</CardTitle></CardHeader>
          <CardContent className="p-0">
            {results.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No results recorded for this course yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Student</th>
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
                          <p className="font-medium">{(result as any).student?.name || `Student #${result.studentId}`}</p>
                          <p className="text-xs text-muted-foreground">{(result as any).student?.matricNumber}</p>
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
                            <Button size="sm" variant="ghost" onClick={() => openEdit(result)} disabled={(result as any).status !== "draft"}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            {(result as any).status === "draft" && (
                              <Button size="sm" variant="ghost" className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                                onClick={() => handleSubmitForReview(result.id)} disabled={submitting === result.id}>
                                {submitting === result.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
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

      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) closeDialog(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingResult ? "Edit Result" : "Add Result"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {!editingResult && (
              <div>
                <Label>Student <span className="text-red-500">*</span></Label>
                <Select value={formData.studentId} onValueChange={(v) => setField("studentId", v)}>
                  <SelectTrigger className={errors.studentId ? "border-red-400" : ""}><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>{students.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
                {errors.studentId && <p className="text-xs text-red-500 mt-1">{errors.studentId}</p>}
              </div>
            )}
            <div>
              <Label>CA Score (0–30) <span className="text-red-500">*</span></Label>
              <Input type="number" min="0" max="30" value={formData.caScore} onChange={(e) => setField("caScore", e.target.value)} className={errors.caScore ? "border-red-400" : ""} />
              {errors.caScore && <p className="text-xs text-red-500 mt-1">{errors.caScore}</p>}
            </div>
            <div>
              <Label>Exam Score (0–70) <span className="text-red-500">*</span></Label>
              <Input type="number" min="0" max="70" value={formData.examScore} onChange={(e) => setField("examScore", e.target.value)} className={errors.examScore ? "border-red-400" : ""} />
              {errors.examScore && <p className="text-xs text-red-500 mt-1">{errors.examScore}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSave} disabled={submitMutation.isPending || updateMutation.isPending}>
              {(submitMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
