import { useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  Bell, CheckCheck, CreditCard, BookOpen, GraduationCap,
  AlertTriangle, Info, CheckCircle, X, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, type AppNotification } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

// ─── Time ago ─────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000)       return "just now";
  if (diff < 3_600_000)    return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000)   return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 604_800_000)  return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(iso).toLocaleDateString();
}

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  AppNotification["type"],
  { icon: React.ElementType; color: string; bg: string; border: string }
> = {
  result:     { icon: GraduationCap, color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-400"   },
  payment:    { icon: CreditCard,    color: "text-green-600",  bg: "bg-green-50",  border: "border-green-400"  },
  enrollment: { icon: BookOpen,      color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-400" },
  warning:    { icon: AlertTriangle, color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-400"  },
  success:    { icon: CheckCircle,   color: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-400" },
  info:       { icon: Info,          color: "text-slate-600",  bg: "bg-slate-50",  border: "border-slate-300"  },
};

// ─── Navigation helper ────────────────────────────────────────────────────────

function notifLink(type: AppNotification["type"], role: string): string {
  const base = `/${role}`;
  if (role === "student") {
    if (type === "result")     return "/student/results";
    if (type === "payment")    return "/student/payments";
    if (type === "enrollment") return "/student/enrollments";
    if (type === "warning")    return "/student/disciplinary";
    return "/student/notifications";
  }
  if (role === "lecturer") return type === "result" ? "/lecturer/results" : "/announcements";
  if (["admin","super_admin"].includes(role)) return "/admin/notifications";
  return "/announcements";
}

// ─── Single notification row ──────────────────────────────────────────────────

function NotifRow({
  n, onRead, onNavigate,
}: {
  n: AppNotification;
  onRead: (id: number) => void;
  onNavigate: (link: string) => void;
}) {
  const { user } = useAuth();
  const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.info;
  const Icon = cfg.icon;
  const link = notifLink(n.type, user?.role ?? "student");

  const handleClick = () => {
    if (!n.isRead) onRead(n.id);
    onNavigate(link);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full text-left flex items-start gap-3 px-4 py-3 transition-colors group",
        "border-l-2 hover:bg-muted/40",
        n.isRead ? "border-l-transparent" : cfg.border,
        !n.isRead && "bg-primary/[0.03]",
      )}
    >
      {/* Icon */}
      <div className={cn("mt-0.5 rounded-full p-1.5 shrink-0", cfg.bg)}>
        <Icon className={cn("w-3.5 h-3.5", cfg.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className={cn("text-sm leading-snug line-clamp-1", !n.isRead ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>
          {n.title}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{n.message}</p>
        <p className="text-[10px] text-muted-foreground/70">{timeAgo(n.createdAt)}</p>
      </div>

      {/* Unread dot */}
      {!n.isRead && (
        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
      )}
    </button>
  );
}

// ─── Notification Bell ────────────────────────────────────────────────────────

export function NotificationBell() {
  const { notifications, unreadCount, hasNew, markAsRead, markAllAsRead } = useNotifications();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

  const preview = notifications.slice(0, 8);
  const viewAllLink = notifLink("info", user?.role ?? "student");

  const handleNavigate = (link: string) => {
    setOpen(false);
    navigate(link);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          {/* Bell with ring animation when hasNew */}
          <Bell
            className={cn(
              "w-5 h-5 transition-transform",
              hasNew && "animate-bell-ring",
            )}
          />

          {/* Pulse ring when hasNew */}
          {hasNew && (
            <span className="absolute inset-0 rounded-md animate-ping bg-primary/20 pointer-events-none" />
          )}

          {/* Unread badge */}
          {unreadCount > 0 && (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1",
                "flex items-center justify-center rounded-full",
                "bg-red-500 text-white text-[10px] font-bold leading-none",
                "border-2 border-background",
                hasNew && "animate-bounce",
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-96 p-0 shadow-xl border rounded-xl overflow-hidden"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 text-[10px] px-1.5">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                onClick={() => markAllAsRead()}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* List */}
        {preview.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-25" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[420px]">
            <div className="divide-y divide-border/50">
              {preview.map(n => (
                <NotifRow
                  key={n.id}
                  n={n}
                  onRead={markAsRead}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t px-4 py-2.5 bg-muted/30">
            <button
              onClick={() => handleNavigate(viewAllLink)}
              className="w-full text-center text-xs text-primary hover:underline flex items-center justify-center gap-1"
            >
              View all notifications
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
