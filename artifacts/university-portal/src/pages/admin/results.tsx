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
import { validateRequired, hasErrors, type FormErrors } from "@/lib/form-utils";
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

export default function AdminResults() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [form, setForm] = useState({ studentId: "", courseId: "", semester: "first", academicYear: "2024/2025", caScore: "", examScore: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const token = localStorage.getItem("maaun_token") || "";
  const { data: students = [] } = useListStudents();
  const { data: courses = [] } = useListCourses();
  const { data: results = [], isLoading } = useListResults(
    selectedStudentId ? { studentId: parseInt(selectedStudentId) } : undefined,
    { query: { enabled: !!selectedStudentId } }
  );

  const submitMutation = useSubmitResult({
    mutation: {
      onSuccess: () => { toast({ title: "Result saved successfully" }); queryClient.invalidateQueries({ queryKey: getListResultsQueryKey() }); closeDialog(); },
      onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed to save result", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateResult({
    mutation: {
      onSuccess: () => { toast({ title: "Result updated successfully" }); queryClient.invalidateQueries({ queryKey: getListResultsQueryKey() }); closeDialog(); },
      onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed to update result", variant: "destructive" }),
    },
  });

  const closeDialog = () => { setDialogOpen(false); setEditingResult(null); setErrors({}); setForm({ studentId: "", courseId: "", semester: "first", academicYear: "2024/2025", caScore: "", examScore: "" }); };

  const openNew = () => { setEditingResult(null); setErrors({}); setForm({ studentId: selectedStudentId, courseId: "", semester: "first", academicYear: "2024/2025", caScore: "", examScore: "" }); setDialogOpen(true); };

  const openEdit = (result: any) => {
    setEditingResult(result);
    setErrors({});
    setForm({ studentId: String(result.studentId), courseId: String(result.courseId), semester: result.semester, academicYear: result.academicYear, caScore: String(result.caScore ?? ""), examScore: String(result.examScore ?? "") });
    setDialogOpen(true);
  };

  const setField = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const handleSubmit = () => {
    const errs: FormErrors = {};

    if (!editingResult) {
      const baseErrs = validateRequired({
        studentId: { value: form.studentId, label: "Student" },
        courseId:  { value: form.courseId,  label: "Course" },
      });
      Object.assign(errs, baseErrs);
    }

    const ca = parseFloat(form.caScore);
    const exam = parseFloat(form.examScore);
    if (form.caScore === "" || isNaN(ca) || ca < 0 || ca > 30) errs.caScore = "CA score must be between 0 and 30";
    if (form.examScore === "" || isNaN(exam) || exam < 0 || exam > 70) errs.examScore = "Exam score must be between 0 and 70";

    if (hasErrors(errs)) {
      setErrors(errs);
      toast({ title: "Please fix the highlighted fields", variant: "destructive" });
      return;
    }

    if (editingResult) {
      updateMutation.mutate({ id: editingResult.id, data: { caScore: ca, examScore: exam } });
    } else {
      submitMutation.mutate({ data: { studentId: parseInt(form.studentId), courseId: parseInt(form.courseId), semester: form.semester, academicYear: form.academicYear, caScore: ca || 0, examScore: exam || 0 } });
    }
  };

  const handleAction = async (id: number, action: "approve" | "lock") => {
    setActionLoading(id);
    try {
      const baseUrl = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
      await axios.put(`${baseUrl}/api/results/${id}/${action}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast({ title: `Result ${action === "approve" ? "approved" : "locked"} successfully` });
      queryClient.invalidateQueries({ queryKey: getListResultsQueryKey() });
    } catch (err: any) {
      toast({ title: err?.response?.data?.error ?? `Failed to ${action} result`, variant: "destructive" });
    }
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

      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) closeDialog(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingResult ? "Edit Result" : "Submit Result"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {!editingResult && (
              <>
                <div>
                  <Label>Student <span className="text-red-500">*</span></Label>
                  <Select value={form.studentId} onValueChange={(v) => setField("studentId", v)}>
                    <SelectTrigger className={errors.studentId ? "border-red-400" : ""}><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>{students.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                  {errors.studentId && <p className="text-xs text-red-500 mt-1">{errors.studentId}</p>}
                </div>
                <div>
                  <Label>Course <span className="text-red-500">*</span></Label>
                  <Select value={form.courseId} onValueChange={(v) => setField("courseId", v)}>
                    <SelectTrigger className={errors.courseId ? "border-red-400" : ""}><SelectValue placeholder="Select course" /></SelectTrigger>
                    <SelectContent>{courses.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.courseCode} — {c.title}</SelectItem>)}</SelectContent>
                  </Select>
                  {errors.courseId && <p className="text-xs text-red-500 mt-1">{errors.courseId}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Semester</Label>
                    <Select value={form.semester} onValueChange={(v) => setField("semester", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="first">First</SelectItem><SelectItem value="second">Second</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Academic Year</Label>
                    <Input value={form.academicYear} onChange={(e) => setField("academicYear", e.target.value)} />
                  </div>
                </div>
              </>
            )}
            <div>
              <Label>CA Score (0–30) <span className="text-red-500">*</span></Label>
              <Input type="number" min="0" max="30" value={form.caScore} onChange={(e) => setField("caScore", e.target.value)} className={errors.caScore ? "border-red-400" : ""} />
              {errors.caScore && <p className="text-xs text-red-500 mt-1">{errors.caScore}</p>}
            </div>
            <div>
              <Label>Exam Score (0–70) <span className="text-red-500">*</span></Label>
              <Input type="number" min="0" max="70" value={form.examScore} onChange={(e) => setField("examScore", e.target.value)} className={errors.examScore ? "border-red-400" : ""} />
              {errors.examScore && <p className="text-xs text-red-500 mt-1">{errors.examScore}</p>}
            </div>
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
