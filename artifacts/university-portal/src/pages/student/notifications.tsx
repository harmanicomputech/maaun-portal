import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell, CheckCheck, Loader2, CreditCard, BookOpen,
  GraduationCap, AlertTriangle, Info, CheckCircle,
} from "lucide-react";
import { useNotifications, type AppNotification } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

const TYPE_META: Record<
  AppNotification["type"],
  { icon: React.ElementType; label: string; badge: string; border: string }
> = {
  result:     { icon: GraduationCap, label: "Result",     badge: "bg-blue-100 text-blue-700",   border: "border-blue-400"   },
  payment:    { icon: CreditCard,    label: "Payment",    badge: "bg-green-100 text-green-700",  border: "border-green-400"  },
  enrollment: { icon: BookOpen,      label: "Enrollment", badge: "bg-purple-100 text-purple-700",border: "border-purple-400" },
  warning:    { icon: AlertTriangle, label: "Warning",    badge: "bg-yellow-100 text-yellow-700",border: "border-amber-400"  },
  success:    { icon: CheckCircle,   label: "Success",    badge: "bg-emerald-100 text-emerald-700",border:"border-emerald-400"},
  info:       { icon: Info,          label: "Info",       badge: "bg-slate-100 text-slate-600",  border: "border-slate-300"  },
};

export default function StudentNotifications() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={() => markAllAsRead()}
            className="gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4" />
            All Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>You have no notifications yet.</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => {
                const meta = TYPE_META[n.type] ?? TYPE_META.info;
                const Icon = meta.icon;
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && markAsRead(n.id)}
                    className={cn(
                      "flex items-start gap-4 px-6 py-4 transition-colors border-l-2",
                      "hover:bg-muted/20",
                      n.isRead ? "border-l-transparent" : meta.border,
                      !n.isRead && "bg-primary/[0.03] cursor-pointer",
                    )}
                  >
                    {/* Type icon */}
                    <div className="mt-0.5 shrink-0">
                      <Badge className={cn(meta.badge, "gap-1 text-xs")} variant="secondary">
                        <Icon className="w-3 h-3" />
                        {meta.label}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm", !n.isRead ? "font-semibold" : "font-medium")}>
                        {n.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {new Date(n.createdAt).toLocaleString("en-NG", {
                          dateStyle: "medium", timeStyle: "short",
                        })}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
