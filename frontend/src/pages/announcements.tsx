import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, Pin, Clock, Users, BookOpen, AlertCircle } from "lucide-react";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

const ROLE_COLORS: Record<string, string> = {
  student: "bg-sky-100 text-sky-700", lecturer: "bg-teal-100 text-teal-700",
  counsellor: "bg-purple-100 text-purple-700", bursar: "bg-green-100 text-green-700",
  registrar: "bg-blue-100 text-blue-700", hod: "bg-indigo-100 text-indigo-700",
  dean: "bg-violet-100 text-violet-700", admin: "bg-orange-100 text-orange-700",
  super_admin: "bg-red-100 text-red-700",
};

export default function AnnouncementsPage() {
  const { data: announcements = [], isLoading } = useQuery<any[]>({
    queryKey: ["my-announcements"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/announcements`, { headers: authHeaders() });
      return data;
    },
  });

  const pinned = announcements.filter((a: any) => a.isPinned);
  const regular = announcements.filter((a: any) => !a.isPinned);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Announcements</h1>
        <p className="text-muted-foreground mt-1">University-wide notices and updates for you</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
      ) : announcements.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center text-muted-foreground">
            <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No announcements at the moment</p>
            <p className="text-xs mt-1">Check back later for university news and updates.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Pinned Section */}
          {pinned.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-amber-800 uppercase tracking-wider">Pinned Announcements</h2>
              </div>
              {pinned.map((ann: any) => (
                <AnnouncementCard key={ann.id} ann={ann} pinned />
              ))}
            </div>
          )}

          {/* Regular Section */}
          {regular.length > 0 && (
            <div className="space-y-3">
              {pinned.length > 0 && (
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">All Announcements</h2>
                </div>
              )}
              {regular.map((ann: any) => (
                <AnnouncementCard key={ann.id} ann={ann} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AnnouncementCard({ ann, pinned = false }: { ann: any; pinned?: boolean }) {
  const hasExpiry = !!ann.expiresAt;
  const daysLeft = hasExpiry ? Math.ceil((new Date(ann.expiresAt).getTime() - Date.now()) / 86400000) : null;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 3 && daysLeft > 0;

  return (
    <Card className={`transition-all ${pinned ? "border-amber-300 bg-gradient-to-br from-amber-50/60 to-white shadow-sm" : "border hover:border-primary/30"}`}>
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${pinned ? "bg-amber-100" : "bg-primary/10"}`}>
            {pinned ? <Pin className="w-4 h-4 text-amber-600" /> : <Megaphone className="w-4 h-4 text-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {pinned && <Badge className="text-[10px] bg-amber-100 text-amber-700 border-amber-300">
                <Pin className="w-2.5 h-2.5 mr-0.5" />Pinned
              </Badge>}
              {isExpiringSoon && <Badge className="text-[10px] bg-orange-100 text-orange-700">
                <AlertCircle className="w-2.5 h-2.5 mr-0.5" />Expires in {daysLeft}d
              </Badge>}
              {(ann.targetRoles ?? []).map((r: string) => (
                <span key={r} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${ROLE_COLORS[r] ?? "bg-gray-100 text-gray-600"}`}>{r}</span>
              ))}
            </div>

            <h3 className="font-bold text-base">{ann.title}</h3>

            {/* Content */}
            <div className="mt-2 text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">
              {ann.content}
            </div>

            {/* Footer meta */}
            <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground flex-wrap border-t pt-2">
              <span className="flex items-center gap-1">
                <Megaphone className="w-3 h-3" />Posted by {ann.createdByName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />{new Date(ann.createdAt).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })}
              </span>
              {ann.targetDepartments?.length > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />{ann.targetDepartments.join(", ")}
                </span>
              )}
              {ann.targetLevels?.length > 0 && (
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />Level {ann.targetLevels.join(", ")}
                </span>
              )}
              {hasExpiry && (
                <span className={`flex items-center gap-1 ${isExpiringSoon ? "text-orange-600 font-medium" : ""}`}>
                  <Clock className="w-3 h-3" />Until {new Date(ann.expiresAt).toLocaleDateString("en-NG")}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
