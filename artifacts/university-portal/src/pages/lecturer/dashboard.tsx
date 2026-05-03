import { useGetLecturerDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Users, ClipboardList, GraduationCap } from "lucide-react";
import { StatCard, HeroCard } from "@/components/ui/stat-card";
import { motion } from "framer-motion";

export default function LecturerDashboard() {
  const { data: dashboard, isLoading } = useGetLecturerDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-36 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (!dashboard) return <div className="text-muted-foreground">Dashboard data unavailable.</div>;

  const { lecturer, assignedCourses, totalStudentsTeaching, pendingResults, courses, recentResults } = dashboard;

  return (
    <div className="space-y-7">
      {/* Hero */}
      <HeroCard
        title={`Welcome, ${lecturer?.name?.split(" ")[0] ?? "Lecturer"}`}
        subtitle={`${lecturer?.designation ?? ""} · ${lecturer?.department ?? ""}`}
        chips={[
          { label: "Staff ID", value: lecturer?.staffId ?? "—" },
          { label: "Faculty",  value: lecturer?.faculty  ?? "—" },
        ]}
        icon={GraduationCap}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={BookOpen}
          label="Assigned Courses"
          value={assignedCourses}
          iconColor="text-primary"
          iconBg="bg-primary/10"
          href="/lecturer/courses"
          index={0}
        />
        <StatCard
          icon={Users}
          label="Students Teaching"
          value={totalStudentsTeaching}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          href="/lecturer/students"
          index={1}
        />
        <StatCard
          icon={ClipboardList}
          label="Pending Results"
          value={pendingResults}
          iconColor={pendingResults > 0 ? "text-amber-600" : "text-muted-foreground"}
          iconBg={pendingResults > 0 ? "bg-amber-50" : "bg-muted"}
          href="/lecturer/results"
          index={2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.28 }}
        >
          <Card className="border-border/60 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                My Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {courses.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-10 bg-muted/30 rounded-xl">
                  No courses assigned yet.
                </p>
              ) : courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{course.courseCode}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">{course.title}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <Badge variant="secondary" className="text-xs">{course.unit} units</Badge>
                    <Badge variant="outline" className="text-xs capitalize">{course.semester}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Results */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <Card className="border-border/60 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-primary" />
                Recent Results Submitted
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {recentResults.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-10 bg-muted/30 rounded-xl">
                  No results submitted yet.
                </p>
              ) : recentResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">Student #{result.studentId}</p>
                    <p className="text-xs text-muted-foreground">Course #{result.courseId}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
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
        </motion.div>
      </div>
    </div>
  );
}
