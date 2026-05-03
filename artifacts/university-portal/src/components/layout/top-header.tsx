import { useLocation } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "./sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationBell } from "./notification-bell";

const PAGE_TITLES: Record<string, string> = {
  dashboard:        "Dashboard",
  courses:          "Courses",
  enrollments:      "My Enrollments",
  results:          "Academic Results",
  profile:          "My Profile",
  payments:         "Fee Payments",
  receipts:         "Receipts",
  timetable:        "Timetable",
  notifications:    "Notifications",
  "academic-standing": "Academic Standing",
  graduation:       "Graduation",
  hostel:           "Hostel",
  disciplinary:     "Disciplinary",
  welfare:          "Welfare & Support",
  students:         "Students",
  lecturers:        "Lecturers",
  sessions:         "Academic Sessions",
  finance:          "Financial Records",
  transcripts:      "Transcripts",
  "activity-logs":  "Activity Logs",
  "user-management":"User Management",
  announcements:    "Announcements",
  appeals:          "Appeals",
};

export function TopHeader() {
  const [location] = useLocation();
  const { user } = useAuth();

  const getPageTitle = () => {
    const segments = location.split("/").filter(Boolean);
    const last = segments[segments.length - 1] ?? "";
    return PAGE_TITLES[last] ?? (last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ") || "Dashboard");
  };

  const initials = user?.name
    ?.split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "?";

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Left: mobile menu + page title */}
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div>
          <h2 className="text-[15px] font-semibold leading-tight text-foreground">
            {getPageTitle()}
          </h2>
          <p className="text-[11px] text-muted-foreground hidden sm:block mt-0.5 truncate max-w-xs">
            {location}
          </p>
        </div>
      </div>

      {/* Right: bell + user */}
      <div className="flex items-center gap-2">
        {/* Notification bell — only when authenticated */}
        {user && <NotificationBell />}

        {/* User avatar */}
        {user && (
          <div className="flex items-center gap-2.5 pl-2 border-l ml-1">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium leading-tight">{user.name}</p>
              <p className="text-[11px] text-muted-foreground capitalize">{user.role.replace(/_/g, " ")}</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=0B3CFE&textColor=ffffff`}
              />
              <AvatarFallback className="bg-primary text-white text-xs">{initials}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </header>
  );
}
