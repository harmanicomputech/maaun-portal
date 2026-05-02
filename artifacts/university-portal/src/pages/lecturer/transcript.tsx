import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Search, FileText, RefreshCw, Eye, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
function authHeaders() { return { Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` }; }

export default function LecturerTranscript() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [generated, setGenerated] = useState<Record<number, string>>({});

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["lecturer-my-students"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/transcripts/my-students`, { headers: authHeaders() });
      return data;
    },
  });

  const generateMut = useMutation({
    mutationFn: async (studentId: number) => {
      const { data } = await axios.post(`${BASE()}/api/transcripts`, { studentId }, { headers: authHeaders() });
      return data;
    },
    onSuccess: (data, studentId) => {
      setGenerated(prev => ({ ...prev, [studentId]: data.referenceNumber }));
      toast({ title: "Transcript request created", description: `Ref: ${data.referenceNumber} — awaiting admin review` });
      qc.invalidateQueries({ queryKey: ["lecturer-my-students"] });
    },
    onError: () => toast({ title: "Failed to generate transcript", variant: "destructive" }),
  });

  const filtered = students.filter((s: any) =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.matricNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transcript Requests</h1>
        <p className="text-muted-foreground mt-1">Generate draft transcript requests for students enrolled in your courses</p>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Lecturer Permissions</p>
            <p className="mt-0.5">You can generate draft transcript requests for your assigned students. All transcripts require admin review and approval before becoming official.</p>
          </div>
        </CardContent>
      </Card>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4" />Assigned Students ({filtered.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No students assigned to your courses yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Student</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Matric No</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Department</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Level</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s: any) => (
                    <tr key={s.id} className="border-b hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">{s.matricNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">{s.department}</td>
                      <td className="px-4 py-3 text-center"><Badge variant="outline">{s.level} Level</Badge></td>
                      <td className="px-4 py-3 text-center">
                        {generated[s.id] ? (
                          <div className="flex flex-col items-center gap-1">
                            <Badge className="bg-green-100 text-green-700 text-xs">Draft Created</Badge>
                            <span className="text-xs text-muted-foreground font-mono">{generated[s.id]}</span>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateMut.mutate(s.id)}
                            disabled={generateMut.isPending}
                          >
                            {generateMut.isPending && generateMut.variables === s.id
                              ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              : <FileText className="w-3 h-3 mr-1" />}
                            Request Transcript
                          </Button>
                        )}
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
