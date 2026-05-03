import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Users, Search, RefreshCw, ShieldCheck, UserCog, AlertTriangle,
  Crown, Shield, Heart, DollarSign, FileText, BookOpen, GraduationCap,
  Scale,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` });

const ALL_ROLES = ["student", "lecturer", "counsellor", "bursar", "registrar", "hod", "dean", "admin", "super_admin"];
const RESTRICTED = ["admin", "super_admin"];

const ROLE_CFG: Record<string, { label: string; color: string; bg: string; icon: any; desc: string }> = {
  student:     { label: "Student",      color: "text-sky-700",    bg: "bg-sky-100",    icon: BookOpen,      desc: "Access to own academic, welfare, and finance pages" },
  lecturer:    { label: "Lecturer",     color: "text-teal-700",   bg: "bg-teal-100",   icon: GraduationCap, desc: "Can enter results, manage courses, view timetable" },
  counsellor:  { label: "Counsellor",   color: "text-purple-700", bg: "bg-purple-100", icon: Heart,         desc: "Views and manages assigned welfare cases" },
  bursar:      { label: "Bursar",       color: "text-green-700",  bg: "bg-green-100",  icon: DollarSign,    desc: "Finance and payment management access" },
  registrar:   { label: "Registrar",    color: "text-blue-700",   bg: "bg-blue-100",   icon: FileText,      desc: "Approves results, graduation, transcripts" },
  hod:         { label: "HoD",          color: "text-indigo-700", bg: "bg-indigo-100", icon: Users,         desc: "Departmental courses, results, and timetable" },
  dean:        { label: "Dean",         color: "text-violet-700", bg: "bg-violet-100", icon: Scale,         desc: "Faculty-level graduation and result approvals" },
  admin:       { label: "Admin",        color: "text-orange-700", bg: "bg-orange-100", icon: Shield,        desc: "Full system management (except super_admin features)" },
  super_admin: { label: "Super Admin",  color: "text-red-700",    bg: "bg-red-100",    icon: Crown,         desc: "Full system override — can assign any role" },
};

function initials(name: string) {
  return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function AdminUserManagement() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === "super_admin";

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [roleTarget, setRoleTarget] = useState<any | null>(null);
  const [newRole, setNewRole] = useState("");

  const { data: users = [], isLoading, refetch, isFetching } = useQuery<any[]>({
    queryKey: ["all-users", filterRole, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterRole !== "all") params.set("role", filterRole);
      if (search) params.set("search", search);
      const { data } = await axios.get(`${BASE()}/api/admin/users/all?${params}`, { headers: authHeaders() });
      return data;
    },
  });

  const { data: stats } = useQuery<{ total: number; byRole: Record<string, number> }>({
    queryKey: ["user-stats"],
    queryFn: async () => { const { data } = await axios.get(`${BASE()}/api/admin/users/stats`, { headers: authHeaders() }); return data; },
  });

  const roleMut = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      const { data } = await axios.patch(`${BASE()}/api/admin/users/${id}/role`, { role }, { headers: authHeaders() });
      return data;
    },
    onSuccess: (updated) => {
      toast({ title: "Role updated", description: `${updated.name} is now ${updated.role}.` });
      qc.invalidateQueries({ queryKey: ["all-users"] });
      qc.invalidateQueries({ queryKey: ["user-stats"] });
      setRoleTarget(null);
      setNewRole("");
    },
    onError: (err: any) => toast({ title: err?.response?.data?.error ?? "Failed to update role", variant: "destructive" }),
  });

  const openRoleDialog = (u: any) => {
    setRoleTarget(u);
    setNewRole(u.role);
  };

  const assignableRoles = isSuperAdmin ? ALL_ROLES : ALL_ROLES.filter(r => !RESTRICTED.includes(r));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">User & Role Management</h1>
          <p className="text-muted-foreground mt-1">
            Assign and manage system roles across all users
            {isSuperAdmin && <span className="ml-2 inline-flex items-center gap-1 text-red-600 text-xs font-semibold"><Crown className="w-3 h-3" />Super Admin Mode</span>}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />Refresh
        </Button>
      </div>

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {ALL_ROLES.map(role => {
            const cfg = ROLE_CFG[role];
            const Icon = cfg.icon;
            const count = stats.byRole[role] ?? 0;
            return (
              <button key={role} onClick={() => setFilterRole(filterRole === role ? "all" : role)}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all ${filterRole === role ? `${cfg.bg} border-current ring-2 ring-current/30` : "border-border hover:border-primary/30 hover:bg-muted/40"}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${cfg.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                </div>
                <p className={`text-base font-bold leading-none ${filterRole === role ? cfg.color : ""}`}>{count}</p>
                <p className="text-[9px] text-muted-foreground leading-tight text-center">{cfg.label}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name or email..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Roles" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles ({stats?.total ?? "…"})</SelectItem>
            {ALL_ROLES.map(r => (
              <SelectItem key={r} value={r}>{ROLE_CFG[r].label} ({stats?.byRole[r] ?? 0})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Permission reference */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {ALL_ROLES.map(role => {
          const cfg = ROLE_CFG[role];
          const Icon = cfg.icon;
          return (
            <div key={role} className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/30 border border-border/50">
              <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg}`}>
                <Icon className={`w-3 h-3 ${cfg.color}`} />
              </div>
              <div>
                <p className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{cfg.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* User list */}
      {isLoading ? (
        <div className="space-y-2">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>No users found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u: any) => {
            const cfg = ROLE_CFG[u.role] ?? ROLE_CFG.student;
            const Icon = cfg.icon;
            const isMe = u.id === currentUser?.id;
            const isProtected = u.role === "super_admin" && !isSuperAdmin;
            const canChange = !isMe && !isProtected;

            return (
              <Card key={u.id} className={`${u.role === "super_admin" ? "border-red-200 bg-red-50/30" : ""}`}>
                <CardContent className="p-3 flex items-center gap-3">
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">{initials(u.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{u.name}</p>
                      {isMe && <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">You</span>}
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-2.5 h-2.5" />{cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{u.email}{u.context ? ` · ${u.context}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="text-[10px] text-muted-foreground hidden sm:block">{new Date(u.createdAt).toLocaleDateString("en-NG")}</p>
                    {canChange ? (
                      <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]" onClick={() => openRoleDialog(u)}>
                        <UserCog className="w-3 h-3 mr-1" />Change Role
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        {isMe ? <ShieldCheck className="w-3.5 h-3.5" /> : <Crown className="w-3.5 h-3.5 text-red-500" />}
                        {isMe ? "Your account" : "Protected"}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Role change dialog */}
      <Dialog open={!!roleTarget} onOpenChange={o => !o && (setRoleTarget(null), setNewRole(""))}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5 text-primary" />Change User Role
            </DialogTitle>
          </DialogHeader>
          {roleTarget && (
            <div className="py-2 space-y-4">
              <div className="bg-muted/40 rounded-lg p-3 flex items-center gap-3">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">{initials(roleTarget.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{roleTarget.name}</p>
                  <p className="text-xs text-muted-foreground">{roleTarget.email}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Assign Role</label>
                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {assignableRoles.map(role => {
                    const cfg = ROLE_CFG[role];
                    const Icon = cfg.icon;
                    const isRestricted = RESTRICTED.includes(role) && !isSuperAdmin;
                    return (
                      <label key={role} className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${newRole === role ? `${cfg.bg} border-current ${cfg.color}` : "border-border hover:bg-muted/30"} ${isRestricted ? "opacity-40 cursor-not-allowed" : ""}`}>
                        <input type="radio" className="mt-0.5 accent-primary" value={role} checked={newRole === role}
                          disabled={isRestricted} onChange={() => !isRestricted && setNewRole(role)} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-3.5 h-3.5 ${newRole === role ? cfg.color : "text-muted-foreground"}`} />
                            <p className={`text-sm font-semibold ${newRole === role ? cfg.color : ""}`}>{cfg.label}</p>
                            {RESTRICTED.includes(role) && <Crown className="w-3 h-3 text-red-400" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{cfg.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {RESTRICTED.includes(newRole) && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p><strong>Warning:</strong> You are assigning a high-privilege role. This user will have broad system access. Confirm carefully.</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRoleTarget(null); setNewRole(""); }}>Cancel</Button>
            <Button
              disabled={!newRole || newRole === roleTarget?.role || roleMut.isPending}
              onClick={() => roleTarget && roleMut.mutate({ id: roleTarget.id, role: newRole })}>
              {roleMut.isPending ? "Updating…" : "Confirm Role Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
