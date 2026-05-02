import { useGetLecturerDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Users, ClipboardList, GraduationCap } from "lucide-react";

export default function LecturerDashboard() {
  const { data: dashboard, isLoading } = useGetLecturerDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  if (!dashboard) return <div className="text-muted-foreground">Dashboard data unavailable.</div>;

  const { lecturer, assignedCourses, totalStudentsTeaching, pendingResults, courses, recentResults } = dashboard;

  return (
    <div className="space-y-8">
      <Card className="bg-primary text-primary-foreground border-0 shadow-lg overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <GraduationCap className="w-64 h-64 -mt-10 -mr-10" />
        </div>
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold mb-1">Welcome, {lecturer?.name || "Lecturer"}</h2>
          <p className="text-primary-foreground/80 text-sm">{lecturer?.designation} · {lecturer?.department}</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <div className="bg-primary-foreground/10 px-3 py-1.5 rounded-md text-sm">
              <span className="font-semibold text-white">Staff ID:</span> {lecturer?.staffId}
            </div>
            <div className="bg-primary-foreground/10 px-3 py-1.5 rounded-md text-sm">
              <span className="font-semibold text-white">Faculty:</span> {lecturer?.faculty}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: BookOpen, label: "Assigned Courses", value: assignedCourses },
          { icon: Users, label: "Students Teaching", value: totalStudentsTeaching },
          { icon: ClipboardList, label: "Pending Results", value: pendingResults },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-3xl font-bold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">My Courses</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {courses.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No courses assigned yet.</p>
            ) : courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/40 transition-colors">
                <div>
                  <p className="font-medium text-sm">{course.courseCode}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{course.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{course.unit} units</Badge>
                  <Badge variant="outline" className="text-xs capitalize">{course.semester}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent Results Submitted</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentResults.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No results submitted yet.</p>
            ) : recentResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Student #{result.studentId}</p>
                  <p className="text-xs text-muted-foreground">Course #{result.courseId}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant="secondary"
                    className={
                      result.grade === "A" ? "bg-green-100 text-green-800" :
                      result.grade === "B" ? "bg-blue-100 text-blue-800" :
                      result.grade === "F" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {result.grade || "—"}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{result.totalScore}/100</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
