import { useListEnrollments, useDropCourse, getListEnrollmentsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  dropped: "bg-gray-100 text-gray-600",
  completed: "bg-blue-100 text-blue-800",
};

export default function StudentEnrollments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dropping, setDropping] = useState<number | null>(null);

  const studentId = user?.studentProfile?.id;

  const { data: enrollments = [], isLoading } = useListEnrollments(
    studentId ? { studentId } : undefined,
    { query: { enabled: !!studentId, queryKey: [] } as any }
  );

  const dropMutation = useDropCourse({
    mutation: {
      onSuccess: () => {
        toast({ title: "Course dropped", description: "You have successfully dropped this course." });
        queryClient.invalidateQueries({ queryKey: getListEnrollmentsQueryKey() });
        setDropping(null);
      },
      onError: () => {
        toast({ title: "Failed to drop course", variant: "destructive" });
        setDropping(null);
      },
    },
  });

  const handleDrop = (id: number) => {
    setDropping(id);
    dropMutation.mutate({ id });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Enrollments</h1>
        <p className="text-muted-foreground mt-1">Courses you are registered for</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No enrolled courses</p>
          <p className="text-sm mt-1">Visit the Courses page to register for courses.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id} className="hover:shadow-sm transition-shadow" data-testid={`card-enrollment-${enrollment.id}`}>
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {enrollment.course?.courseCode || `Course #${enrollment.courseId}`}
                    </span>
                    <Badge className={`text-xs ${statusColors[enrollment.status] || ""}`} variant="secondary">
                      {enrollment.status}
                    </Badge>
                  </div>
                  <p className="font-semibold mt-1 truncate">{enrollment.course?.title || "—"}</p>
                  <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{enrollment.course?.unit} units</span>
                    <span>{enrollment.semester === "first" ? "First" : "Second"} Semester</span>
                    <span>{enrollment.academicYear}</span>
                  </div>
                </div>
                {enrollment.status === "active" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                    onClick={() => handleDrop(enrollment.id)}
                    disabled={dropping === enrollment.id}
                    data-testid={`button-drop-${enrollment.id}`}
                  >
                    {dropping === enrollment.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    <span className="ml-1.5 hidden sm:inline">Drop</span>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
