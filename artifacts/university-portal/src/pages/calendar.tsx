import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  List,
  BookOpen,
  Megaphone,
  CreditCard,
  AlertTriangle,
  GraduationCap,
  Heart,
  Home,
  Loader2,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Config ────────────────────────────────────────────────────────────────────

const EVENT_CFG: Record<
  EventType,
  { label: string; color: string; bg: string; text: string; icon: React.ElementType }
> = {
  class: {
    label: "Class",
    color: "bg-blue-500",
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
    icon: BookOpen,
  },
  announcement: {
    label: "Announcement",
    color: "bg-amber-500",
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-800",
    icon: Megaphone,
  },
  payment: {
    label: "Payment",
    color: "bg-emerald-500",
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-800",
    icon: CreditCard,
  },
  disciplinary: {
    label: "Disciplinary",
    color: "bg-red-500",
    bg: "bg-red-50 border-red-200",
    text: "text-red-800",
    icon: AlertTriangle,
  },
  graduation: {
    label: "Graduation",
    color: "bg-purple-500",
    bg: "bg-purple-50 border-purple-200",
    text: "text-purple-800",
    icon: GraduationCap,
  },
  welfare: {
    label: "Welfare",
    color: "bg-rose-500",
    bg: "bg-rose-50 border-rose-200",
    text: "text-rose-800",
    icon: Heart,
  },
  hostel: {
    label: "Hostel",
    color: "bg-teal-500",
    bg: "bg-teal-50 border-teal-200",
    text: "text-teal-800",
    icon: Home,
  },
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Fetch hook ────────────────────────────────────────────────────────────────

const BASE_URL = (import.meta.env.BASE_URL || "").replace(/\/$/, "");

function useCalendarEvents(monthKey: string) {
  const token = localStorage.getItem("maaun_token");
  return useQuery<{ events: CalendarEvent[]; month: string }>({
    queryKey: ["calendar", monthKey],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/calendar?month=${monthKey}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch calendar");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ── Event chip (calendar grid) ────────────────────────────────────────────────

function EventChip({
  event,
  onClick,
}: {
  event: CalendarEvent;
  onClick: (e: CalendarEvent) => void;
}) {
  const cfg = EVENT_CFG[event.type];
  const Icon = cfg.icon;
  const time = new Date(event.startDate).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => onClick(event)}
          className={cn(
            "w-full text-left text-[10px] leading-tight px-1.5 py-0.5 rounded border truncate flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer",
            cfg.bg,
            cfg.text,
          )}
        >
          <span className={cn("size-1.5 rounded-full shrink-0", cfg.color)} />
          <span className="truncate font-medium">{event.title.replace(/^[^\w]+/, "")}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-[260px] p-3">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="size-3.5" />
          <span className="font-semibold text-sm">{event.title}</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-0.5">
          <div>{time}</div>
          {event.endDate && (
            <div>
              Ends:{" "}
              {new Date(event.endDate).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          )}
          {event.location && <div>📍 {event.location}</div>}
          <div className="mt-1 font-medium text-blue-600">Click to navigate →</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// ── Monthly grid ──────────────────────────────────────────────────────────────

function MonthGrid({
  year,
  month,
  events,
  onNavigate,
}: {
  year: number;
  month: number;
  events: CalendarEvent[];
  onNavigate: (route: string) => void;
}) {
  const today = new Date();

  // Group events by day-of-month
  const byDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    for (const e of events) {
      const d = new Date(e.startDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        map[day] = map[day] ?? [];
        map[day].push(e);
      }
    }
    return map;
  }, [events, year, month]);

  // Build grid cells: blanks + days
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<{ type: "blank" } | { type: "day"; day: number }> = [
    ...Array.from({ length: firstDow }, () => ({ type: "blank" as const })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      type: "day" as const,
      day: i + 1,
    })),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push({ type: "blank" });

  const isToday = (day: number) =>
    year === today.getFullYear() &&
    month === today.getMonth() &&
    day === today.getDate();

  return (
    <div className="flex flex-col">
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 border-b">
        {DOW_SHORT.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Weeks */}
      {Array.from({ length: cells.length / 7 }, (_, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {cells.slice(wi * 7, wi * 7 + 7).map((cell, ci) => {
            if (cell.type === "blank") {
              return (
                <div
                  key={`blank-${wi}-${ci}`}
                  className="min-h-[100px] border-r border-b bg-gray-50/50 last:border-r-0"
                />
              );
            }

            const { day } = cell;
            const dayEvents = byDay[day] ?? [];
            const visible = dayEvents.slice(0, 3);
            const overflow = dayEvents.length - visible.length;

            return (
              <div
                key={day}
                className="min-h-[100px] border-r border-b p-1 last:border-r-0 flex flex-col gap-0.5"
              >
                <span
                  className={cn(
                    "text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-0.5 self-start",
                    isToday(day)
                      ? "bg-[#0B3CFE] text-white"
                      : "text-gray-700",
                  )}
                >
                  {day}
                </span>

                {visible.map((ev) => (
                  <EventChip key={ev.id} event={ev} onClick={(e) => onNavigate(e.route)} />
                ))}

                {overflow > 0 && (
                  <span className="text-[10px] text-muted-foreground px-1 font-medium">
                    +{overflow} more
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Agenda list ───────────────────────────────────────────────────────────────

function AgendaList({
  events,
  year,
  month,
  onNavigate,
}: {
  events: CalendarEvent[];
  year: number;
  month: number;
  onNavigate: (route: string) => void;
}) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <CalendarDays className="size-10 mb-3 opacity-40" />
        <p className="text-sm">No events this month</p>
      </div>
    );
  }

  // Group by date string
  const grouped: Record<string, CalendarEvent[]> = {};
  for (const e of events) {
    const d = new Date(e.startDate);
    if (d.getFullYear() !== year || d.getMonth() !== month) continue;
    const key = d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    grouped[key] = grouped[key] ?? [];
    grouped[key].push(e);
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="divide-y">
      {Object.entries(grouped).map(([dateStr, dayEvents]) => (
        <div key={dateStr} className="py-4 px-4">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={cn(
                "text-sm font-semibold",
                dateStr === today ? "text-[#0B3CFE]" : "text-gray-700",
              )}
            >
              {dateStr}
            </span>
            {dateStr === today && (
              <Badge className="bg-[#0B3CFE]/10 text-[#0B3CFE] border-[#0B3CFE]/20 text-[10px]">
                Today
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            {dayEvents.map((ev) => {
              const cfg = EVENT_CFG[ev.type];
              const Icon = cfg.icon;
              const time = new Date(ev.startDate).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });
              const endTime = ev.endDate
                ? new Date(ev.endDate).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : null;

              return (
                <button
                  key={ev.id}
                  onClick={() => onNavigate(ev.route)}
                  className={cn(
                    "w-full text-left flex items-start gap-3 p-3 rounded-lg border hover:shadow-sm transition-shadow cursor-pointer",
                    cfg.bg,
                  )}
                >
                  <span className={cn("size-2 rounded-full shrink-0 mt-1.5", cfg.color)} />
                  <div className="flex-1 min-w-0">
                    <div className={cn("text-sm font-medium truncate", cfg.text)}>
                      {ev.title.replace(/^[^\w]+/, "")}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {time}
                        {endTime ? ` – ${endTime}` : ""}
                      </span>
                      {ev.location && (
                        <span className="text-xs text-muted-foreground truncate">
                          📍 {ev.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Icon className={cn("size-3.5", cfg.text)} />
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] border", cfg.text, cfg.bg)}
                    >
                      {cfg.label}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────

function Legend({ types }: { types: EventType[] }) {
  if (types.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-3 px-1">
      {types.map((t) => {
        const cfg = EVENT_CFG[t];
        return (
          <div key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn("size-2 rounded-full", cfg.color)} />
            {cfg.label}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [view, setView] = useState<"month" | "agenda">("month");

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const { data, isLoading } = useCalendarEvents(monthKey);

  const events = data?.events ?? [];

  // Determine which types exist (for legend)
  const presentTypes = useMemo(() => {
    const s = new Set(events.map((e) => e.type));
    return (Object.keys(EVENT_CFG) as EventType[]).filter((t) => s.has(t));
  }, [events]);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }
  function goToday() {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  }

  function handleNavigate(route: string) {
    const base = (import.meta.env.BASE_URL || "").replace(/\/$/, "");
    navigate(route.startsWith("/") ? route : `/${route}`);
    void base;
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-4 pt-4 pb-3 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Academic Calendar</h1>
            <p className="text-sm text-muted-foreground capitalize">
              Your {user?.role?.replace("_", " ")} schedule for {MONTH_NAMES[month]} {year}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Month / Agenda toggle */}
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setView("month")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors",
                  view === "month"
                    ? "bg-[#0B3CFE] text-white"
                    : "text-gray-600 hover:bg-gray-100",
                )}
              >
                <CalendarDays className="size-3.5" />
                <span className="hidden sm:inline">Month</span>
              </button>
              <button
                onClick={() => setView("agenda")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors",
                  view === "agenda"
                    ? "bg-[#0B3CFE] text-white"
                    : "text-gray-600 hover:bg-gray-100",
                )}
              >
                <List className="size-3.5" />
                <span className="hidden sm:inline">Agenda</span>
              </button>
            </div>

            {/* Month navigation */}
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={prevMonth} className="size-8">
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToday}
                className="text-xs h-8 px-3"
              >
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth} className="size-8">
                <ChevronRight className="size-4" />
              </Button>
            </div>

            {/* Month/year label */}
            <span className="text-sm font-semibold text-gray-900 min-w-[120px] text-right hidden sm:block">
              {MONTH_NAMES[month]} {year}
            </span>
          </div>
        </div>

        {/* Legend + event count */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Legend types={presentTypes} />
          {!isLoading && (
            <span className="text-xs text-muted-foreground">
              {events.length} event{events.length !== 1 ? "s" : ""} this month
            </span>
          )}
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="size-6 animate-spin text-[#0B3CFE]" />
          </div>
        ) : view === "month" ? (
          <MonthGrid
            year={year}
            month={month}
            events={events}
            onNavigate={handleNavigate}
          />
        ) : (
          <AgendaList
            year={year}
            month={month}
            events={events}
            onNavigate={handleNavigate}
          />
        )}
      </div>
    </div>
  );
}
