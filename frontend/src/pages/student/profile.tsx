import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GraduationCap, Mail, Hash, BookOpen, Building2, Calendar } from "lucide-react";

export default function StudentProfile() {
  const { user } = useAuth();
  const student = user?.studentProfile;

  if (!student) {
    return <div className="text-muted-foreground p-8">Profile not found.</div>;
  }

  const initials = student.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const cgpaColor = student.cgpa
    ? student.cgpa >= 4.5 ? "text-green-600" : student.cgpa >= 3.5 ? "text-blue-600" : student.cgpa >= 2.5 ? "text-yellow-600" : "text-red-600"
    : "text-muted-foreground";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">Your academic profile information</p>
      </div>

      <Card>
        <CardContent className="pt-8 pb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="w-24 h-24 bg-primary text-white text-2xl font-bold">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">{student.name}</h2>
            <p className="text-muted-foreground">{student.email}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Student</Badge>
              <Badge variant="outline">{student.level} Level</Badge>
              <Badge variant="outline">{student.department}</Badge>
            </div>
          </div>
          <div className="sm:ml-auto text-center sm:text-right">
            <p className="text-sm text-muted-foreground">Current CGPA</p>
            <p className={`text-4xl font-bold mt-1 ${cgpaColor}`}>
              {student.cgpa ? student.cgpa.toFixed(2) : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Academic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { icon: Hash, label: "Matric Number", value: student.matricNumber },
            { icon: Building2, label: "Faculty", value: student.faculty },
            { icon: GraduationCap, label: "Department", value: student.department },
            { icon: BookOpen, label: "Level", value: `${student.level} Level` },
            { icon: Calendar, label: "Enrollment Year", value: student.enrollmentYear },
            { icon: Mail, label: "Email", value: student.email },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
                <p className="font-semibold mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
