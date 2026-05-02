import { useGetStudentDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Trophy, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDashboard() {
  const { data: dashboard, isLoading } = useGetStudentDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
        </div>
      </div>
    );
  }

  if (!dashboard || !dashboard.student) {
    return <div>No dashboard data found.</div>;
  }

  const { student, cgpa, currentSemesterCourses, totalUnits, recentResults, enrolledCourses, notifications } = dashboard;

  const getCgpaColor = (cgpa: number) => {
    if (cgpa >= 4.5) return "text-green-600";
    if (cgpa >= 3.5) return "text-blue-600";
    if (cgpa >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-green-100 text-green-800";
      case "B": return "bg-blue-100 text-blue-800";
      case "C": return "bg-yellow-100 text-yellow-800";
      case "D": return "bg-orange-100 text-orange-800";
      case "F": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <Card className="bg-primary text-primary-foreground overflow-hidden relative border-0 shadow-lg">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <GraduationCap className="w-64 h-64 -mt-10 -mr-10" />
        </div>
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {student.name}</h2>
          <div className="flex flex-wrap gap-4 text-primary-foreground/80 mt-4">
            <div className="flex items-center gap-1.5 bg-primary-foreground/10 px-3 py-1.5 rounded-md">
              <span className="font-semibold text-white">Matric:</span> {student.matricNumber}
            </div>
            <div className="flex items-center gap-1.5 bg-primary-foreground/10 px-3 py-1.5 rounded-md">
              <span className="font-semibold text-white">Dept:</span> {student.department}
            </div>
            <div className="flex items-center gap-1.5 bg-primary-foreground/10 px-3 py-1.5 rounded-md">
              <span className="font-semibold text-white">Level:</span> {student.level}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current CGPA</p>
              <h3 className={`text-3xl font-bold mt-2 ${cgpa ? getCgpaColor(cgpa) : ""}`}>
                {cgpa ? cgpa.toFixed(2) : "N/A"}
              </h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Trophy className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Courses</p>
              <h3 className="text-3xl font-bold mt-2">{currentSemesterCourses}</h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <BookOpen className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Units</p>
              <h3 className="text-3xl font-bold mt-2">{totalUnits}</h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <GraduationCap className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Recent Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
                No recent results published.
              </div>
            ) : (
              <div className="space-y-4">
                {recentResults.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">{result.course?.courseCode}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">{result.course?.title}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getGradeColor(result.grade || "")} variant="secondary">
                        {result.grade || "P"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{result.totalScore} / 100</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications && notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((note) => (
                  <div key={note.id} className="p-4 border-l-4 border-primary bg-muted/20 rounded-r-lg">
                    <p className="text-sm">{note.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(note.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
                You're all caught up! No new notifications.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Just importing this for the icon above
import { FileText } from "lucide-react";
