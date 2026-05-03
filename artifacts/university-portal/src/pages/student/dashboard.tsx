import { useGetStudentDashboard } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, GraduationCap, Trophy, AlertCircle,
  Pin, Megaphone, Clock, FileText,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { StatCard, HeroCard } from "@/components/ui/stat-card";
import { motion } from "framer-motion";
import { TodaySchedule } from "@/components/dashboard/today-schedule";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

export default function StudentDashboard() {
  const { data: dashboard, isLoading } = useGetStudentDashboard();

  const { data: pinnedAnnouncements = [] } = useQuery<any[]>({
    queryKey: ["pinned-announcements"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/announcements?pinned=true`, { headers: authHeaders() });
      return data;
    },
  });

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

  if (!dashboard || !dashboard.student) {
    return <div className="text-muted-foreground py-8 text-center">No dashboard data found.</div>;
  }

  const { student, cgpa, currentSemesterCourses, totalUnits, recentResults, notifications } = dashboard;

  const getCgpaColor = (val: number) => {
    if (val >= 4.5) return "text-green-600";
    if (val >= 3.5) return "text-blue-600";
    if (val >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-green-100 text-green-800 border-green-200";
      case "B": return "bg-blue-100 text-blue-800 border-blue-200";
      case "C": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "D": return "bg-orange-100 text-orange-800 border-orange-200";
      case "F": return "bg-red-100 text-red-800 border-red-200";
      default:  return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const cgpaValue = cgpa ?? 0;

  return (
    <div className="space-y-7">
      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pin className="w-3.5 h-3.5 text-amber-600" />
              <h2 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pinned Announcements</h2>
            </div>
            <Link href="/announcements">
              <span className="text-xs text-primary hover:underline cursor-pointer">View all</span>
            </Link>
          </div>
          {pinnedAnnouncements.map((ann: any) => (
            <div
              key={ann.id}
              className="flex items-start gap-3 p-3 rounded-xl border border-amber-200 bg-amber-50/70"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Megaphone className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-900">{ann.title}</p>
                <p className="text-xs text-amber-800/75 mt-0.5 line-clamp-2">{ann.content}</p>
                <p className="text-[10px] text-amber-700/60 mt-1 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {new Date(ann.createdAt).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })}
                  {ann.expiresAt && ` · Expires ${new Date(ann.expiresAt).toLocaleDateString("en-NG")}`}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Welcome hero card */}
      <HeroCard
        title={`Welcome back, ${student.name.split(" ")[0]}`}
        subtitle={`${student.faculty} · Level ${student.level}`}
        chips={[
          { label: "Matric", value: student.matricNumber },
          { label: "Dept",   value: student.department },
          { label: "Level",  value: String(student.level) },
        ]}
        icon={GraduationCap}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Trophy}
          label="Current CGPA"
          value={cgpaValue > 0 ? cgpaValue.toFixed(2) : "N/A"}
          iconColor={cgpaValue > 0 ? getCgpaColor(cgpaValue) : "text-muted-foreground"}
          iconBg={cgpaValue >= 4.5 ? "bg-green-50" : cgpaValue >= 3.5 ? "bg-blue-50" : cgpaValue >= 2.5 ? "bg-yellow-50" : "bg-red-50"}
          href="/student/results"
          index={0}
        />
        <StatCard
          icon={BookOpen}
          label="Current Courses"
          value={currentSemesterCourses}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
          href="/student/enrollments"
          index={1}
        />
        <StatCard
          icon={GraduationCap}
          label="Total Units"
          value={totalUnits}
          iconColor="text-primary"
          iconBg="bg-primary/10"
          index={2}
        />
      </div>

      <TodaySchedule />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.28 }}
        >
          <Card className="border-border/60 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Recent Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentResults.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground bg-muted/30 rounded-xl text-sm">
                  No results published yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-sm">{result.course?.courseCode}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[180px]">{result.course?.title}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <Badge
                          variant="secondary"
                          className={`text-xs px-2 border ${getGradeColor(result.grade || "")}`}
                        >
                          {result.grade || "—"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{result.totalScore}/100</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <Card className="border-border/60 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications && notifications.length > 0 ? (
                <div className="space-y-2.5">
                  {notifications.slice(0, 5).map((n: any) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl border text-sm transition-colors ${!n.isRead ? "bg-primary/[0.04] border-primary/20" : "hover:bg-muted/30"}`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className={`text-sm leading-snug ${!n.isRead ? "font-semibold" : "font-medium"}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link href="/student/notifications">
                    <p className="text-xs text-center text-primary hover:underline cursor-pointer pt-1">
                      View all notifications
                    </p>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground bg-muted/30 rounded-xl text-sm">
                  No notifications yet.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
