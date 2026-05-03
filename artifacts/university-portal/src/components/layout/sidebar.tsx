import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, BookOpen, GraduationCap, FileText, Users, LogOut,
  User as UserIcon, CreditCard, Bell, CalendarDays, Activity, DollarSign,
  Award, ScrollText, Receipt, Calendar, Home, ShieldAlert, Heart,
  Crown, UserCog, Scale, Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ROLE_LINKS: Record<string, { href: string; label: string; icon: any }[]> = {
  student: [
    { href: "/student/dashboard",         label: "Dashboard",          icon: LayoutDashboard },
    { href: "/announcements",             label: "Announcements",      icon: Megaphone },
    { href: "/student/timetable",         label: "My Timetable",       icon: Calendar },
    { href: "/student/courses",           label: "Browse Courses",     icon: BookOpen },
    { href: "/student/enrollments",       label: "My Enrollments",     icon: GraduationCap },
    { href: "/student/results",           label: "Academic Results",   icon: FileText },
    { href: "/student/academic-standing", label: "Academic Standing",  icon: Award },
    { href: "/student/graduation",        label: "Graduation",         icon: GraduationCap },
    { href: "/student/hostel",            label: "Hostel",             icon: Home },
    { href: "/student/disciplinary",      label: "Disciplinary",       icon: ShieldAlert },
    { href: "/student/welfare",           label: "Welfare & Support",  icon: Heart },
    { href: "/student/payments",          label: "Fee Payments",       icon: CreditCard },
    { href: "/student/receipts",          label: "My Receipts",        icon: Receipt },
    { href: "/student/notifications",     label: "Notifications",      icon: Bell },
    { href: "/student/profile",           label: "My Profile",         icon: UserIcon },
  ],
  counsellor: [
    { href: "/announcements",             label: "Announcements",      icon: Megaphone },
    { href: "/counsellor/welfare",        label: "My Assigned Cases",  icon: Heart },
  ],
  bursar: [
    { href: "/announcements",             label: "Announcements",      icon: Megaphone },
    { href: "/bursar/finance",            label: "Finance & Receipts", icon: Receipt },
    { href: "/bursar/payments",           label: "Payments & Fees",    icon: DollarSign },
  ],
  registrar: [
    { href: "/announcements",             label: "Announcements",      icon: Megaphone },
    { href: "/registrar/results",         label: "All Results",        icon: FileText },
    { href: "/registrar/graduation",      label: "Graduation",         icon: GraduationCap },
    { href: "/registrar/transcripts",     label: "Transcripts",        icon: ScrollText },
  ],
  hod: [
    { href: "/announcements",             label: "Announcements",      icon: Megaphone },
    { href: "/hod/courses",              label: "Manage Courses",     icon: BookOpen },
    { href: "/hod/timetable",            label: "Timetable",          icon: Calendar },
    { href: "/hod/results",              label: "All Results",        icon: FileText },
  ],
  dean: [
    { href: "/announcements",             label: "Announcements",      icon: Megaphone },
    { href: "/dean/results",             label: "All Results",        icon: FileText },
    { href: "/dean/graduation",          label: "Graduation",         icon: GraduationCap },
  ],
  lecturer: [
    { href: "/lecturer/dashboard",        label: "Dashboard",          icon: LayoutDashboard },
    { href: "/announcements",             label: "Announcements",      icon: Megaphone },
    { href: "/lecturer/timetable",        label: "Teaching Schedule",  icon: Calendar },
    { href: "/lecturer/courses",          label: "My Courses",         icon: BookOpen },
    { href: "/lecturer/students",         label: "Students",           icon: Users },
    { href: "/lecturer/results",          label: "Manage Results",     icon: FileText },
    { href: "/lecturer/transcript",       label: "Transcript Requests",icon: ScrollText },
  ],
  admin: [
    { href: "/admin/dashboard",          label: "Dashboard",          icon: LayoutDashboard },
    { href: "/admin/announcements",      label: "Announcements",      icon: Megaphone },
    { href: "/admin/timetable",          label: "Timetable",          icon: Calendar },
    { href: "/admin/graduation",         label: "Graduation",         icon: GraduationCap },
    { href: "/admin/hostel",             label: "Hostel",             icon: Home },
    { href: "/admin/disciplinary",       label: "Disciplinary",       icon: ShieldAlert },
    { href: "/admin/welfare",            label: "Student Welfare",    icon: Heart },
    { href: "/admin/courses",            label: "Manage Courses",     icon: BookOpen },
    { href: "/admin/students",           label: "Students",           icon: Users },
    { href: "/admin/lecturers",          label: "Lecturers",          icon: GraduationCap },
    { href: "/admin/results",            label: "All Results",        icon: FileText },
    { href: "/admin/academic-standing",  label: "Academic Standings", icon: Award },
    { href: "/admin/transcripts",        label: "Transcripts",        icon: ScrollText },
    { href: "/admin/finance",            label: "Finance & Receipts", icon: Receipt },
    { href: "/admin/payments",           label: "Payments & Fees",    icon: DollarSign },
    { href: "/admin/sessions",           label: "Academic Sessions",  icon: CalendarDays },
    { href: "/admin/notifications",      label: "Notifications",      icon: Bell },
    { href: "/admin/activity-logs",      label: "Audit Log",          icon: Activity },
    { href: "/admin/user-management",    label: "User & Roles",       icon: UserCog },
  ],
  super_admin: [
    { href: "/admin/dashboard",          label: "Dashboard",          icon: LayoutDashboard },
    { href: "/admin/announcements",      label: "Announcements",      icon: Megaphone },
    { href: "/admin/timetable",          label: "Timetable",          icon: Calendar },
    { href: "/admin/graduation",         label: "Graduation",         icon: GraduationCap },
    { href: "/admin/hostel",             label: "Hostel",             icon: Home },
    { href: "/admin/disciplinary",       label: "Disciplinary",       icon: ShieldAlert },
    { href: "/admin/welfare",            label: "Student Welfare",    icon: Heart },
    { href: "/admin/courses",            label: "Manage Courses",     icon: BookOpen },
    { href: "/admin/students",           label: "Students",           icon: Users },
    { href: "/admin/lecturers",          label: "Lecturers",          icon: GraduationCap },
    { href: "/admin/results",            label: "All Results",        icon: FileText },
    { href: "/admin/academic-standing",  label: "Academic Standings", icon: Award },
    { href: "/admin/transcripts",        label: "Transcripts",        icon: ScrollText },
    { href: "/admin/finance",            label: "Finance & Receipts", icon: Receipt },
    { href: "/admin/payments",           label: "Payments & Fees",    icon: DollarSign },
    { href: "/admin/sessions",           label: "Academic Sessions",  icon: CalendarDays },
    { href: "/admin/notifications",      label: "Notifications",      icon: Bell },
    { href: "/admin/activity-logs",      label: "Audit Log",          icon: Activity },
    { href: "/admin/user-management",    label: "User & Roles",       icon: UserCog },
  ],
};

const ROLE_DISPLAY: Record<string, { label: string; color: string }> = {
  student:     { label: "Student",     color: "text-primary-foreground/70" },
  lecturer:    { label: "Lecturer",    color: "text-primary-foreground/70" },
  counsellor:  { label: "Counsellor",  color: "text-purple-300" },
  bursar:      { label: "Bursar",      color: "text-green-300" },
  registrar:   { label: "Registrar",   color: "text-blue-300" },
  hod:         { label: "Head of Dept",color: "text-indigo-300" },
  dean:        { label: "Dean",        color: "text-violet-300" },
  admin:       { label: "Admin",       color: "text-orange-300" },
  super_admin: { label: "Super Admin", color: "text-red-300" },
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const links = ROLE_LINKS[user.role as keyof typeof ROLE_LINKS] || [];
  const roleDisplay = ROLE_DISPLAY[user.role] ?? { label: user.role, color: "text-primary-foreground/70" };
  const isSuperAdmin = user.role === "super_admin";

  return (
    <div className="w-64 bg-primary text-primary-foreground h-full flex flex-col hidden md:flex shrink-0">
      <div className="p-5 pb-3">
        <h1 className="text-xl font-bold tracking-tight leading-tight">MAAUN</h1>
        <p className="text-primary-foreground/70 text-[10px] mt-0.5 uppercase tracking-wider font-medium">
          Management Portal
        </p>
      </div>

      <div className="px-4 pb-3">
        <div className="bg-primary-foreground/10 rounded-lg p-3">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium truncate flex-1">{user.name}</p>
            {isSuperAdmin && <Crown className="w-3.5 h-3.5 text-red-300 shrink-0" />}
          </div>
          <p className={`text-xs mt-0.5 flex items-center gap-1 ${roleDisplay.color}`}>
            {isSuperAdmin && <Scale className="w-2.5 h-2.5" />}
            {roleDisplay.label}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href || location.startsWith(link.href + "/");
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-white text-primary font-semibold shadow-sm"
                    : "text-primary-foreground/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "opacity-80"}`} />
                <span className="text-[13px] leading-tight">{link.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-primary-foreground/10">
        <Button
          variant="ghost"
          className="w-full justify-start text-primary-foreground/85 hover:text-white hover:bg-primary-foreground/10 h-9"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span className="text-sm">Logout</span>
        </Button>
      </div>
    </div>
  );
}
