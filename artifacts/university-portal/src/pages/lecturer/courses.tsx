import { useGetLecturerDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";

export default function LecturerCourses() {
  const { data: dashboard, isLoading } = useGetLecturerDashboard();

  if (isLoading) return <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;

  const courses = dashboard?.courses || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Assigned Courses</h1>
        <p className="text-muted-foreground mt-1">Courses you are responsible for this semester</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No courses assigned yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow" data-testid={`card-course-${course.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className="font-mono bg-primary/10 text-primary text-xs">{course.courseCode}</Badge>
                  <Badge variant="outline" className="text-xs capitalize">{course.semester} Semester</Badge>
                </div>
                <CardTitle className="text-base mt-2">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="bg-muted px-2 py-0.5 rounded">{course.unit} Units</span>
                  <span className="bg-muted px-2 py-0.5 rounded">{course.level} Level</span>
                  <span className="bg-muted px-2 py-0.5 rounded">{course.department}</span>
                </div>
                {course.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{course.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
