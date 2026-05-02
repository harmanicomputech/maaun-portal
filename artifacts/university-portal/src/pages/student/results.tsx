import { useListResults, useGetStudentCgpa } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, TrendingUp } from "lucide-react";

const gradeColors: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-orange-100 text-orange-800",
  E: "bg-orange-100 text-orange-800",
  F: "bg-red-100 text-red-800",
};

function getCgpaColor(cgpa: number) {
  if (cgpa >= 4.5) return "text-green-600";
  if (cgpa >= 3.5) return "text-blue-600";
  if (cgpa >= 2.5) return "text-yellow-600";
  return "text-red-600";
}

export default function StudentResults() {
  const { user } = useAuth();
  const studentId = user?.studentProfile?.id;

  const { data: results = [], isLoading } = useListResults(
    studentId ? { studentId } : undefined,
    { query: { enabled: !!studentId } }
  );

  const { data: cgpaData, isLoading: cgpaLoading } = useGetStudentCgpa(
    studentId!,
    { query: { enabled: !!studentId } }
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Academic Results</h1>
        <p className="text-muted-foreground mt-1">Your semester results and cumulative GPA</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cumulative GPA</p>
              {cgpaLoading ? (
                <Skeleton className="h-8 w-20 mt-1" />
              ) : (
                <p className={`text-3xl font-bold ${cgpaData ? getCgpaColor(cgpaData.cgpa) : ""}`}>
                  {cgpaData ? cgpaData.cgpa.toFixed(2) : "N/A"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Units Attempted</p>
              <p className="text-3xl font-bold">{cgpaData?.totalUnitsAttempted ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
              <span className="font-bold text-primary text-sm">QP</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quality Points</p>
              <p className="text-3xl font-bold">{cgpaData?.totalQualityPoints?.toFixed(1) ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Results Transcript</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No results published yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Course</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Semester</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">CA</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Exam</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Total</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Grade</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">GP</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-b hover:bg-muted/20 transition-colors" data-testid={`row-result-${result.id}`}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{result.course?.courseCode || `Course #${result.courseId}`}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{result.course?.title}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground hidden sm:table-cell capitalize">
                        {result.semester} · {result.academicYear}
                      </td>
                      <td className="px-4 py-4 text-center">{result.caScore ?? "—"}</td>
                      <td className="px-4 py-4 text-center">{result.examScore ?? "—"}</td>
                      <td className="px-4 py-4 text-center font-semibold">{result.totalScore ?? "—"}</td>
                      <td className="px-4 py-4 text-center">
                        <Badge className={`${gradeColors[result.grade || ""] || "bg-gray-100 text-gray-600"}`} variant="secondary">
                          {result.grade || "—"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-center font-medium text-primary">
                        {result.gradePoint?.toFixed(1) ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
