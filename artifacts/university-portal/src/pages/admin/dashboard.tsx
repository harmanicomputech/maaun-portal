import { useGetAdminDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, GraduationCap, BookOpen, ClipboardList, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: dashboard, isLoading } = useGetAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (!dashboard) return <div className="text-muted-foreground">Dashboard data unavailable.</div>;

  const { totalStudents, totalLecturers, totalCourses, totalEnrollments, studentsByDepartment, coursesByFaculty } = dashboard;
  const totalRevenue = (dashboard as any).totalRevenue ?? 0;

  const stats = [
    { icon: Users, label: "Total Students", value: totalStudents, color: "text-blue-600", bg: "bg-blue-50", href: "/admin/students" },
    { icon: GraduationCap, label: "Total Lecturers", value: totalLecturers, color: "text-green-600", bg: "bg-green-50", href: "/admin/lecturers" },
    { icon: BookOpen, label: "Total Courses", value: totalCourses, color: "text-purple-600", bg: "bg-purple-50", href: "/admin/courses" },
    { icon: ClipboardList, label: "Enrollments", value: totalEnrollments, color: "text-orange-600", bg: "bg-orange-50", href: "/admin/results" },
    { icon: DollarSign, label: "Revenue (₦)", value: `${totalRevenue.toLocaleString()}`, color: "text-emerald-600", bg: "bg-emerald-50", href: "/admin/payments" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">University overview and statistics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map(({ icon: Icon, label, value, color, bg, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg} mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Students by Department</CardTitle></CardHeader>
          <CardContent>
            {studentsByDepartment.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No data available.</div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={studentsByDepartment} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="department" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0B3CFE" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Courses by Faculty</CardTitle></CardHeader>
          <CardContent>
            {coursesByFaculty.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No data available.</div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={coursesByFaculty} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="faculty" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
