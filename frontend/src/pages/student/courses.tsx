import { useState } from "react";
import { useListCourses, useEnrollCourse, getListEnrollmentsQueryKey, getListCoursesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Search, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CURRENT_YEAR = "2024/2025";
const CURRENT_SEMESTER = "first";

export default function StudentCourses() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [enrolling, setEnrolling] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading } = useListCourses();

  const enrollMutation = useEnrollCourse({
    mutation: {
      onSuccess: () => {
        toast({ title: "Enrolled successfully", description: "You have been enrolled in the course." });
        queryClient.invalidateQueries({ queryKey: getListEnrollmentsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
        setEnrolling(null);
      },
      onError: (err: any) => {
        toast({ title: "Enrollment failed", description: err?.message || "Could not enroll. You may already be enrolled.", variant: "destructive" });
        setEnrolling(null);
      },
    },
  });

  const filtered = courses.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.courseCode.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "all" || c.level === levelFilter;
    const matchSemester = semesterFilter === "all" || c.semester === semesterFilter;
    return matchSearch && matchLevel && matchSemester;
  });

  const handleEnroll = (courseId: number) => {
    setEnrolling(courseId);
    enrollMutation.mutate({ data: { courseId, semester: CURRENT_SEMESTER, academicYear: CURRENT_YEAR } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Available Courses</h1>
        <p className="text-muted-foreground mt-1">Browse and register for courses this semester</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by course code or title..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search" />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full sm:w-40" data-testid="select-level">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="100">100 Level</SelectItem>
            <SelectItem value="200">200 Level</SelectItem>
            <SelectItem value="300">300 Level</SelectItem>
            <SelectItem value="400">400 Level</SelectItem>
            <SelectItem value="500">500 Level</SelectItem>
          </SelectContent>
        </Select>
        <Select value={semesterFilter} onValueChange={setSemesterFilter}>
          <SelectTrigger className="w-full sm:w-44" data-testid="select-semester">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            <SelectItem value="first">First Semester</SelectItem>
            <SelectItem value="second">Second Semester</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No courses found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow" data-testid={`card-course-${course.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="text-xs font-mono bg-primary/10 text-primary">{course.courseCode}</Badge>
                  <Badge variant="outline" className="text-xs">{course.semester === "first" ? "1st" : "2nd"} Sem</Badge>
                </div>
                <CardTitle className="text-base font-semibold leading-snug mt-2">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="bg-muted px-2 py-0.5 rounded">{course.unit} Units</span>
                  <span className="bg-muted px-2 py-0.5 rounded">{course.level} Level</span>
                  <span className="bg-muted px-2 py-0.5 rounded">{course.department}</span>
                </div>
                {course.lecturerName && (
                  <p className="text-xs text-muted-foreground">Lecturer: <span className="font-medium text-foreground">{course.lecturerName}</span></p>
                )}
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleEnroll(course.id)}
                  disabled={enrolling === course.id || enrollMutation.isPending}
                  data-testid={`button-enroll-${course.id}`}
                >
                  {enrolling === course.id ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Plus className="w-3 h-3 mr-1.5" />}
                  Enroll
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
