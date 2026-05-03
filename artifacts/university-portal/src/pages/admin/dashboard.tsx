import { useGetAdminDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, GraduationCap, BookOpen, ClipboardList, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatCard } from "@/components/ui/stat-card";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { data: dashboard, isLoading } = useGetAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (!dashboard) return <div className="text-muted-foreground">Dashboard data unavailable.</div>;

  const { totalStudents, totalLecturers, totalCourses, totalEnrollments, studentsByDepartment, coursesByFaculty } = dashboard;
  const totalRevenue = (dashboard as any).totalRevenue ?? 0;

  const stats = [
    { icon: Users,         label: "Total Students",  value: totalStudents,                     iconColor: "text-blue-600",    iconBg: "bg-blue-50",    href: "/admin/students" },
    { icon: GraduationCap, label: "Total Lecturers", value: totalLecturers,                    iconColor: "text-green-600",   iconBg: "bg-green-50",   href: "/admin/lecturers" },
    { icon: BookOpen,      label: "Total Courses",   value: totalCourses,                      iconColor: "text-violet-600",  iconBg: "bg-violet-50",  href: "/admin/courses" },
    { icon: ClipboardList, label: "Enrollments",     value: totalEnrollments,                  iconColor: "text-orange-600",  iconBg: "bg-orange-50",  href: "/admin/results" },
    { icon: DollarSign,    label: "Revenue (₦)",     value: `₦${Number(totalRevenue).toLocaleString()}`, iconColor: "text-emerald-600", iconBg: "bg-emerald-50", href: "/admin/payments" },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">University overview and live statistics</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Students by Department</CardTitle>
            </CardHeader>
            <CardContent>
              {studentsByDepartment.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm bg-muted/30 rounded-xl">
                  No department data available yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={studentsByDepartment} margin={{ top: 5, right: 10, left: -20, bottom: 64 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="department" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }}
                      cursor={{ fill: "hsl(var(--muted)/0.5)" }}
                    />
                    <Bar dataKey="count" fill="#0B3CFE" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.42 }}
        >
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Courses by Faculty</CardTitle>
            </CardHeader>
            <CardContent>
              {coursesByFaculty.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm bg-muted/30 rounded-xl">
                  No faculty data available yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={coursesByFaculty} margin={{ top: 5, right: 10, left: -20, bottom: 64 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="faculty" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }}
                      cursor={{ fill: "hsl(var(--muted)/0.5)" }}
                    />
                    <Bar dataKey="count" fill="#22c55e" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
