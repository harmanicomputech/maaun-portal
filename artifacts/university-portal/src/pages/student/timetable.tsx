import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, User, BookOpen } from "lucide-react";

const BASE = () => (import.meta.env.BASE_URL?.replace(/\/$/, "") || "");
function authHeaders() { return { Authorization: `Bearer ${localStorage.getItem("maaun_token") || ""}` }; }

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
const HOURS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];

const DEPT_COLORS = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-orange-100 text-orange-800 border-orange-200",
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-teal-100 text-teal-800 border-teal-200",
  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "bg-red-100 text-red-800 border-red-200",
];

function deptColor(dept: string, depts: string[]) {
  const idx = depts.indexOf(dept);
  return DEPT_COLORS[idx % DEPT_COLORS.length];
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export default function StudentTimetable() {
  const [tooltip, setTooltip] = useState<any | null>(null);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["student-timetable"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE()}/api/timetables/student`, { headers: authHeaders() });
      return data;
    },
  });

  const depts = [...new Set<string>(entries.map((e: any) => e.department))];

  const byDayAndSlot = (day: string, hour: string) => {
    return entries.filter((e: any) => {
      if (e.dayOfWeek !== day) return false;
      const slotStart = timeToMinutes(hour);
      const slotEnd = slotStart + 60;
      const eStart = timeToMinutes(e.startTime);
      const eEnd = timeToMinutes(e.endTime);
      return eStart < slotEnd && eEnd > slotStart;
    });
  };

  // Find if entry starts at this exact hour slot
  const startsAt = (e: any, hour: string) => e.startTime === hour || (
    timeToMinutes(e.startTime) >= timeToMinutes(hour) && timeToMinutes(e.startTime) < timeToMinutes(hour) + 60
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Timetable</h1>
        <p className="text-muted-foreground mt-1">Weekly class schedule generated from your active enrollments</p>
      </div>

      {/* Legend */}
      {depts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {depts.map(d => (
            <Badge key={d} variant="outline" className={`${deptColor(d, depts)} text-xs`}>{d}</Badge>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : entries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16 text-muted-foreground">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No timetable entries yet</p>
            <p className="text-sm mt-1">Your schedule will appear here once lecturers publish class times for your enrolled courses.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile: day-by-day list */}
          <div className="md:hidden space-y-4">
            {DAYS.map(day => {
              const dayEntries = entries.filter((e: any) => e.dayOfWeek === day);
              if (dayEntries.length === 0) return null;
              return (
                <Card key={day}>
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-primary">{day}</CardTitle></CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    {dayEntries.sort((a: any, b: any) => a.startTime.localeCompare(b.startTime)).map((e: any) => (
                      <div key={e.id} className={`rounded-lg border p-3 ${deptColor(e.department, depts)}`}>
                        <p className="font-semibold text-sm">{e.courseCode} — {e.courseTitle}</p>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs opacity-80">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.startTime}–{e.endTime}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.venueName}</span>
                          <span className="flex items-center gap-1"><User className="w-3 h-3" />{e.lecturerName}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Desktop: full weekly grid */}
          <div className="hidden md:block overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-6 gap-px bg-border rounded-xl overflow-hidden border">
                {/* Header */}
                <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-3 flex items-center">Time</div>
                {DAYS.map(d => (
                  <div key={d} className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-3 text-center">{d}</div>
                ))}

                {/* Rows */}
                {HOURS.map(hour => (
                  <>
                    <div key={`t-${hour}`} className="bg-muted/60 text-xs text-muted-foreground px-3 py-2 font-mono flex items-start pt-2">{hour}</div>
                    {DAYS.map(day => {
                      const slotEntries = byDayAndSlot(day, hour).filter(e => startsAt(e, hour));
                      return (
                        <div key={`${day}-${hour}`} className="bg-background min-h-[52px] p-1 relative">
                          {slotEntries.map((e: any) => {
                            const durMin = timeToMinutes(e.endTime) - timeToMinutes(e.startTime);
                            const slots = durMin / 60;
                            return (
                              <div
                                key={e.id}
                                className={`rounded border px-2 py-1 text-xs cursor-pointer transition-all hover:shadow-md hover:scale-105 ${deptColor(e.department, depts)}`}
                                style={{ minHeight: `${slots * 52 - 2}px` }}
                                onMouseEnter={() => setTooltip(e)}
                                onMouseLeave={() => setTooltip(null)}
                              >
                                <p className="font-bold truncate">{e.courseCode}</p>
                                <p className="truncate opacity-70">{e.venueName}</p>
                                <p className="opacity-60">{e.startTime}–{e.endTime}</p>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            </div>
          </div>

          {/* Hover tooltip */}
          {tooltip && (
            <div className="fixed bottom-6 right-6 bg-gray-900 text-white rounded-xl shadow-2xl p-4 z-50 min-w-64 max-w-80 text-sm">
              <p className="font-bold text-base">{tooltip.courseCode}</p>
              <p className="text-gray-300 mb-2">{tooltip.courseTitle}</p>
              <div className="space-y-1 text-xs text-gray-400">
                <p><span className="text-white">Day:</span> {tooltip.dayOfWeek}</p>
                <p><span className="text-white">Time:</span> {tooltip.startTime} – {tooltip.endTime}</p>
                <p><span className="text-white">Venue:</span> {tooltip.venueName} {tooltip.venueLocation ? `(${tooltip.venueLocation})` : ""}</p>
                <p><span className="text-white">Lecturer:</span> {tooltip.lecturerName}</p>
                <p><span className="text-white">Dept:</span> {tooltip.department}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
