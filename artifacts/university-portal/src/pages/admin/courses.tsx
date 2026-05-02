import { useState } from "react";
import { useListCourses, useCreateCourse, useUpdateCourse, useDeleteCourse, useListLecturers, getListCoursesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Loader2, Search, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CourseForm = { courseCode: string; title: string; unit: string; department: string; faculty: string; level: string; semester: string; description: string; lecturerId: string };
const emptyForm: CourseForm = { courseCode: "", title: "", unit: "3", department: "", faculty: "", level: "100", semester: "first", description: "", lecturerId: "" };

export default function AdminCourses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm);

  const { data: courses = [], isLoading } = useListCourses();
  const { data: lecturers = [] } = useListLecturers();

  const createMutation = useCreateCourse({
    mutation: {
      onSuccess: () => { toast({ title: "Course created" }); queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() }); closeDialog(); },
      onError: () => toast({ title: "Failed to create course", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateCourse({
    mutation: {
      onSuccess: () => { toast({ title: "Course updated" }); queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() }); closeDialog(); },
      onError: () => toast({ title: "Failed to update course", variant: "destructive" }),
    },
  });

  const deleteMutation = useDeleteCourse({
    mutation: {
      onSuccess: () => { toast({ title: "Course deleted" }); queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() }); },
      onError: () => toast({ title: "Failed to delete", variant: "destructive" }),
    },
  });

  const closeDialog = () => { setDialogOpen(false); setEditing(null); setForm(emptyForm); };

  const openNew = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };

  const openEdit = (course: any) => {
    setEditing(course.id);
    setForm({ courseCode: course.courseCode, title: course.title, unit: String(course.unit), department: course.department, faculty: course.faculty, level: course.level, semester: course.semester, description: course.description || "", lecturerId: String(course.lecturerId || "") });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const data = { courseCode: form.courseCode, title: form.title, unit: parseInt(form.unit), department: form.department, faculty: form.faculty, level: form.level, semester: form.semester as "first" | "second", description: form.description || undefined, lecturerId: form.lecturerId ? parseInt(form.lecturerId) : undefined };
    if (editing !== null) updateMutation.mutate({ id: editing, data });
    else createMutation.mutate({ data });
  };

  const filtered = courses.filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.courseCode.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Course Management</h1>
          <p className="text-muted-foreground mt-1">Create, edit, and manage all courses</p>
        </div>
        <Button onClick={openNew} data-testid="button-new-course"><Plus className="w-4 h-4 mr-2" />New Course</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search courses..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search" />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No courses found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((course) => (
            <Card key={course.id} className="hover:shadow-sm transition-shadow" data-testid={`card-course-${course.id}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge className="font-mono bg-primary/10 text-primary text-xs">{course.courseCode}</Badge>
                    <Badge variant="outline" className="text-xs">{course.unit} units</Badge>
                    <Badge variant="outline" className="text-xs">{course.level} Level</Badge>
                    <Badge variant="outline" className="text-xs capitalize">{course.semester}</Badge>
                  </div>
                  <p className="font-semibold truncate">{course.title}</p>
                  <p className="text-xs text-muted-foreground">{course.department} · {course.faculty}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(course)} data-testid={`button-edit-course-${course.id}`}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => deleteMutation.mutate({ id: course.id })} data-testid={`button-delete-course-${course.id}`}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing !== null ? "Edit Course" : "Create Course"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Course Code</Label><Input value={form.courseCode} onChange={(e) => setForm(f => ({ ...f, courseCode: e.target.value }))} placeholder="CSC 301" data-testid="input-course-code" /></div>
              <div><Label>Units</Label><Input type="number" min="1" max="6" value={form.unit} onChange={(e) => setForm(f => ({ ...f, unit: e.target.value }))} data-testid="input-units" /></div>
            </div>
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Introduction to Computing" data-testid="input-title" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Level</Label>
                <Select value={form.level} onValueChange={(v) => setForm(f => ({ ...f, level: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["100","200","300","400","500"].map(l => <SelectItem key={l} value={l}>{l} Level</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Semester</Label>
                <Select value={form.semester} onValueChange={(v) => setForm(f => ({ ...f, semester: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first">First</SelectItem>
                    <SelectItem value="second">Second</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Department</Label><Input value={form.department} onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))} placeholder="Computer Science" data-testid="input-department" /></div>
            <div><Label>Faculty</Label><Input value={form.faculty} onChange={(e) => setForm(f => ({ ...f, faculty: e.target.value }))} placeholder="Science and Technology" data-testid="input-faculty" /></div>
            <div>
              <Label>Assigned Lecturer (optional)</Label>
              <Select value={form.lecturerId} onValueChange={(v) => setForm(f => ({ ...f, lecturerId: v }))}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {lecturers.map(l => <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Description (optional)</Label><Input value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Course description..." data-testid="input-description" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-course">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing !== null ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
