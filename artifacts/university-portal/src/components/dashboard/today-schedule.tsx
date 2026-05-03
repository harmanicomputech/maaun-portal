import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import {
  CalendarDays,
  BookOpen,
  Megaphone,
  CreditCard,
  AlertTriangle,
  GraduationCap,
  Heart,
  Home,
  ArrowRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// ── Types (mirrors calendar.tsx) ─────────────────────────────────────────────

type EventType =
  | "class"
  | "announcement"
  | "payment"
  | "disciplinary"
  | "graduation"
  | "welfare"
  | "hostel";

interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  startDate: string;
  endDate?: string;
  location?: string;
  route: string;
}

// ── Config (mirrors calendar.tsx) ─────────────────────────────────────────────

const EVENT_CFG: Record<
  EventType,
  { dot: string; bg: string; text: string; border: string; icon: React.ElementType }
> = {
  class:        { dot: "bg-blue-500",    bg: "bg-blue-50",    text: "text-blue-800",    border: "border-blue-200",    icon: BookOpen },
  announcement: { dot: "bg-amber-500",   bg: "bg-amber-50",   text: "text-amber-800",   border: "border-amber-200",   icon: Megaphone },
  payment:      { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200", icon: CreditCard },
  disciplinary: { dot: "bg-red-500",     bg: "bg-red-50",     text: "text-red-800",     border: "border-red-200",     icon: AlertTriangle },
  graduation:   { dot: "bg-purple-500",  bg: "bg-purple-50",  text: "text-purple-800",  border: "border-purple-200",  icon: GraduationCap },
  welfare:      { dot: "bg-rose-500",    bg: "bg-rose-50",    text: "text-rose-800",    border: "border-rose-200",    icon: Heart },
  hostel:       { dot: "bg-teal-500",    bg: "bg-teal-50",    text: "text-teal-800",    border: "border-teal-200",    icon: Home },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const BASE_URL = (import.meta.env.BASE_URL || "").replace(/\/$/, "");

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function getMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Returns true if the event falls on (or spans) today in the user's local timezone */
function isToday(event: CalendarEvent): boolean {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const todayEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const start = new Date(event.startDate);
  const end   = event.endDate ? new Date(event.endDate) : start;

  // Overlaps today if event starts before end of today AND ends after start of today
  return start <= todayEnd && end >= todayStart;
}

// ── Fetch — reuses the same QueryClient cache key as /calendar ───────────────

function useTodayEvents() {
  const monthKey = getMonthKey();
  const token = localStorage.getItem("maaun_token");

  const { data, isLoading } = useQuery<{ events: CalendarEvent[] }>({
    queryKey: ["calendar", monthKey],            // ← same key as CalendarPage
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/calendar?month=${monthKey}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch calendar");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,                    // 5 min — stays fresh all session
  });

  const todayEvents = useMemo(() => {
    if (!data?.events) return [];
    return data.events
      .filter(isToday)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [data]);

  return { todayEvents, isLoading };
}

// ── Single event row ──────────────────────────────────────────────────────────

function EventRow({
  event,
  onNavigate,
}: {
  event: CalendarEvent;
  onNavigate: (route: string) => void;
}) {
  const cfg  = EVENT_CFG[event.type];
  const Icon = cfg.icon;
  const time = formatTime(event.startDate);
  const endTime = event.endDate ? formatTime(event.endDate) : null;

  // Check if this event is currently happening
  const now  = new Date();
  const start = new Date(event.startDate);
  const end   = event.endDate ? new Date(event.endDate) : start;
  const isNow = now >= start && now <= end;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => onNavigate(event.route)}
          className={cn(
            "group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all hover:shadow-sm cursor-pointer text-left",
            cfg.bg,
            cfg.border,
            isNow && "ring-2 ring-offset-1 ring-current/30",
          )}
        >
          {/* Time column */}
          <div className="shrink-0 w-14 text-right">
            <span className={cn("text-[11px] font-semibold tabular-nums", cfg.text)}>
              {time}
            </span>
          </div>

          {/* Divider dot */}
          <div className="relative shrink-0 flex flex-col items-center">
            <span className={cn(
              "size-2 rounded-full",
              isNow ? `${cfg.dot} ring-2 ring-offset-1 ring-current` : cfg.dot,
            )} />
          </div>

          {/* Title + icon */}
          <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className={cn("text-xs font-semibold leading-tight truncate", cfg.text)}>
                {event.title.replace(/^[^\w]+/, "")}
              </p>
              {event.location && (
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  📍 {event.location}
                </p>
              )}
            </div>
            <Icon className={cn("size-3 shrink-0 opacity-60", cfg.text)} />
          </div>

          {/* "Now" badge */}
          {isNow && (
            <span className={cn(
              "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0",
              cfg.bg, cfg.text, "border", cfg.border,
            )}>
              Now
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-[220px] p-3 text-xs space-y-1">
        <p className="font-semibold">{event.title.replace(/^[^\w]+/, "")}</p>
        <p className="text-muted-foreground">
          {time}{endTime ? ` – ${endTime}` : ""}
        </p>
        {event.location && <p className="text-muted-foreground">📍 {event.location}</p>}
        <p className="text-blue-600 font-medium mt-1">Click to open →</p>
      </TooltipContent>
    </Tooltip>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────

interface TodayScheduleProps {
  /** Visual variant: card (default) wraps in a bordered card, or bare renders inline */
  variant?: "card" | "bare";
  /** Max events before "+N more" truncation. Default: 5 */
  maxVisible?: number;
}

export function TodaySchedule({ variant = "card", maxVisible = 5 }: TodayScheduleProps) {
  const { todayEvents, isLoading } = useTodayEvents();
  const [, navigate] = useLocation();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  function handleNavigate(route: string) {
    navigate(route);
  }

  const visible  = todayEvents.slice(0, maxVisible);
  const overflow = todayEvents.length - visible.length;

  const inner = (
    <div className="space-y-1.5">
      {isLoading ? (
        <div className="space-y-2 py-1">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
          <CalendarDays className="size-8 mb-2 opacity-30" />
          <p className="text-xs">No events scheduled for today</p>
        </div>
      ) : (
        <>
          {visible.map(ev => (
            <EventRow key={ev.id} event={ev} onNavigate={handleNavigate} />
          ))}
          {overflow > 0 && (
            <p className="text-[10px] text-center text-muted-foreground pt-0.5">
              +{overflow} more event{overflow !== 1 ? "s" : ""}
            </p>
          )}
        </>
      )}

      {/* Footer link */}
      <div className="pt-1">
        <Link href="/calendar">
          <button className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#0B3CFE] hover:underline py-1.5 rounded-lg hover:bg-[#0B3CFE]/5 transition-colors">
            View full calendar
            <ArrowRight className="size-3" />
          </button>
        </Link>
      </div>
    </div>
  );

  if (variant === "bare") return inner;

  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-[#0B3CFE]/10 flex items-center justify-center">
            <CalendarDays className="size-3.5 text-[#0B3CFE]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight">Today's Schedule</h3>
            <p className="text-[10px] text-muted-foreground">{today}</p>
          </div>
        </div>
        {!isLoading && todayEvents.length > 0 && (
          <span className="text-[10px] font-semibold bg-[#0B3CFE]/10 text-[#0B3CFE] px-2 py-0.5 rounded-full">
            {todayEvents.length} event{todayEvents.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3">{inner}</div>
    </div>
  );
}
