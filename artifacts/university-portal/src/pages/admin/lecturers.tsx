import { useState } from "react";
import { useListLecturers } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users } from "lucide-react";

export default function AdminLecturers() {
  const [search, setSearch] = useState("");
  const { data: lecturers = [], isLoading } = useListLecturers();

  const filtered = lecturers.filter((l) =>
    !search ||
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.staffId.toLowerCase().includes(search.toLowerCase()) ||
    l.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lecturers</h1>
        <p className="text-muted-foreground mt-1">{lecturers.length} academic staff members</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name, staff ID, or department..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search" />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No lecturers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((lecturer) => {
            const initials = lecturer.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
            return (
              <Card key={lecturer.id} className="hover:shadow-md transition-shadow" data-testid={`card-lecturer-${lecturer.id}`}>
                <CardContent className="p-5 flex items-center gap-4">
                  <Avatar className="w-12 h-12 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{lecturer.name}</p>
                    <p className="text-xs text-muted-foreground">{lecturer.email}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Badge variant="secondary" className="text-xs">{lecturer.designation}</Badge>
                      <Badge variant="outline" className="text-xs font-mono">{lecturer.staffId}</Badge>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground hidden sm:block shrink-0">
                    <p className="font-medium text-foreground">{lecturer.department}</p>
                    <p>{lecturer.faculty}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
