import { useState } from "react";
import { useListStudents } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users } from "lucide-react";

function getCgpaColor(cgpa: number) {
  if (cgpa >= 4.5) return "text-green-600";
  if (cgpa >= 3.5) return "text-blue-600";
  if (cgpa >= 2.5) return "text-yellow-600";
  return "text-red-600";
}

export default function AdminStudents() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const { data: students = [], isLoading } = useListStudents();

  const departments = [...new Set(students.map((s) => s.department))];

  const filtered = students.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.matricNumber.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "all" || s.level === levelFilter;
    const matchDept = deptFilter === "all" || s.department === deptFilter;
    return matchSearch && matchLevel && matchDept;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">{students.length} registered students</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, matric, or email..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search" />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {["100","200","300","400","500"].map(l => <SelectItem key={l} value={l}>{l} Level</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No students found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((student) => {
            const initials = student.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
            return (
              <Card key={student.id} className="hover:shadow-sm transition-shadow" data-testid={`card-student-${student.id}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="w-10 h-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{student.name}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs font-mono text-muted-foreground">{student.matricNumber}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{student.email}</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">{student.level} Level</Badge>
                      <Badge variant="secondary" className="text-xs">{student.department}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{student.faculty}</p>
                  </div>
                  {student.cgpa !== null && student.cgpa !== undefined && (
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">CGPA</p>
                      <p className={`font-bold text-lg ${getCgpaColor(student.cgpa)}`}>{student.cgpa.toFixed(2)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
