import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, BookOpen, GraduationCap, FileText, Users, LogOut,
  User as UserIcon, CreditCard, Bell, CalendarDays, Activity, DollarSign,
  Award, ScrollText, Receipt, Calendar, Home, ShieldAlert, Heart,
  Crown, UserCog, Scale, Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

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
    { href: "/counsellor/dashboard",      label: "Dashboard",          icon: LayoutDashboard },
    { href: "/announcements",             label: "Announcements",      icon: Megaphone },
    { href: "/counsellor/welfare",        label: "My Assigned Cases",  icon: Heart },
  ],
  bursar: [
    { href: "/bursar/dashboard",          label: "Dashboard",          icon: LayoutDashboard },
    { href: "/announcements",             label: "Announcements",      icon: Megaphone },
    { href: "/bursar/finance",            label: "Finance & Receipts", icon: Receipt },
    { href: "/bursar/payments",           label: "Payments & Fees",    icon: DollarSign },
  ],
  registrar: [
    { href: "/registrar/dashboard",       label: "Dashboard",          icon: LayoutDashboard },
    { href: "/announcements",             label: "Announcements",      icon: Megaphone },
    { href: "/registrar/results",         label: "All Results",        icon: FileText },
    { href: "/registrar/graduation",      label: "Graduation",         icon: GraduationCap },
    { href: "/registrar/transcripts",     label: "Transcripts",        icon: ScrollText },
  ],
  hod: [
    { href: "/hod/dashboard",             label: "Dashboard",          icon: LayoutDashboard },
    { href: "/announcements",             label: "Announcements",      icon: Megaphone },
    { href: "/hod/courses",               label: "Manage Courses",     icon: BookOpen },
    { href: "/hod/timetable",             label: "Timetable",          icon: Calendar },
    { href: "/hod/results",               label: "All Results",        icon: FileText },
  ],
  dean: [
    { href: "/dean/dashboard",            label: "Dashboard",          icon: LayoutDashboard },
    { href: "/announcements",             label: "Announcements",      icon: Megaphone },
    { href: "/dean/results",              label: "All Results",        icon: FileText },
    { href: "/dean/graduation",           label: "Graduation",         icon: GraduationCap },
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
    { href: "/admin/dashboard",           label: "Dashboard",          icon: LayoutDashboard },
    { href: "/admin/announcements",       label: "Announcements",      icon: Megaphone },
    { href: "/admin/timetable",           label: "Timetable",          icon: Calendar },
    { href: "/admin/graduation",          label: "Graduation",         icon: GraduationCap },
    { href: "/admin/hostel",              label: "Hostel",             icon: Home },
    { href: "/admin/disciplinary",        label: "Disciplinary",       icon: ShieldAlert },
    { href: "/admin/welfare",             label: "Student Welfare",    icon: Heart },
    { href: "/admin/courses",             label: "Manage Courses",     icon: BookOpen },
    { href: "/admin/students",            label: "Students",           icon: Users },
    { href: "/admin/lecturers",           label: "Lecturers",          icon: GraduationCap },
    { href: "/admin/results",             label: "All Results",        icon: FileText },
    { href: "/admin/academic-standing",   label: "Academic Standings", icon: Award },
    { href: "/admin/transcripts",         label: "Transcripts",        icon: ScrollText },
    { href: "/admin/finance",             label: "Finance & Receipts", icon: Receipt },
    { href: "/admin/payments",            label: "Payments & Fees",    icon: DollarSign },
    { href: "/admin/sessions",            label: "Academic Sessions",  icon: CalendarDays },
    { href: "/admin/notifications",       label: "Notifications",      icon: Bell },
    { href: "/admin/activity-logs",       label: "Audit Log",          icon: Activity },
    { href: "/admin/user-management",     label: "User & Roles",       icon: UserCog },
  ],
  super_admin: [
    { href: "/admin/dashboard",           label: "Dashboard",          icon: LayoutDashboard },
    { href: "/admin/announcements",       label: "Announcements",      icon: Megaphone },
    { href: "/admin/timetable",           label: "Timetable",          icon: Calendar },
    { href: "/admin/graduation",          label: "Graduation",         icon: GraduationCap },
    { href: "/admin/hostel",              label: "Hostel",             icon: Home },
    { href: "/admin/disciplinary",        label: "Disciplinary",       icon: ShieldAlert },
    { href: "/admin/welfare",             label: "Student Welfare",    icon: Heart },
    { href: "/admin/courses",             label: "Manage Courses",     icon: BookOpen },
    { href: "/admin/students",            label: "Students",           icon: Users },
    { href: "/admin/lecturers",           label: "Lecturers",          icon: GraduationCap },
    { href: "/admin/results",             label: "All Results",        icon: FileText },
    { href: "/admin/academic-standing",   label: "Academic Standings", icon: Award },
    { href: "/admin/transcripts",         label: "Transcripts",        icon: ScrollText },
    { href: "/admin/finance",             label: "Finance & Receipts", icon: Receipt },
    { href: "/admin/payments",            label: "Payments & Fees",    icon: DollarSign },
    { href: "/admin/sessions",            label: "Academic Sessions",  icon: CalendarDays },
    { href: "/admin/notifications",       label: "Notifications",      icon: Bell },
    { href: "/admin/activity-logs",       label: "Audit Log",          icon: Activity },
    { href: "/admin/user-management",     label: "User & Roles",       icon: UserCog },
  ],
};

const ROLE_DISPLAY: Record<string, { label: string; color: string }> = {
  student:     { label: "Student",      color: "text-primary-foreground/70" },
  lecturer:    { label: "Lecturer",     color: "text-primary-foreground/70" },
  counsellor:  { label: "Counsellor",   color: "text-purple-300" },
  bursar:      { label: "Bursar",       color: "text-green-300" },
  registrar:   { label: "Registrar",    color: "text-blue-300" },
  hod:         { label: "Head of Dept", color: "text-indigo-300" },
  dean:        { label: "Dean",         color: "text-violet-300" },
  admin:       { label: "Admin",        color: "text-orange-300" },
  super_admin: { label: "Super Admin",  color: "text-red-300" },
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!user) return null;

  const links = ROLE_LINKS[user.role as keyof typeof ROLE_LINKS] || [];
  const roleDisplay = ROLE_DISPLAY[user.role] ?? { label: user.role, color: "text-primary-foreground/70" };
  const isSuperAdmin = (user.role as string) === "super_admin";

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <>
      <div className="w-64 bg-primary text-primary-foreground h-full flex flex-col hidden md:flex shrink-0">
        {/* Logo */}
        <div className="p-5 pb-3">
          <h1 className="text-xl font-bold tracking-tight leading-tight">MAAUN</h1>
          <p className="text-primary-foreground/60 text-[10px] mt-0.5 uppercase tracking-wider font-medium">
            Management Portal
          </p>
        </div>

        {/* User card */}
        <div className="px-4 pb-3">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold truncate flex-1">{user.name}</p>
              {isSuperAdmin && <Crown className="w-3.5 h-3.5 text-red-300 shrink-0" />}
            </div>
            <p className={`text-xs mt-0.5 flex items-center gap-1 ${roleDisplay.color}`}>
              {isSuperAdmin && <Scale className="w-2.5 h-2.5" />}
              {roleDisplay.label}
            </p>
          </div>
        </div>

        {/* Nav links */}
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
                  <span className="text-[13px] leading-tight flex-1">{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-3 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start text-primary-foreground/80 hover:text-white hover:bg-white/10 h-9 rounded-lg"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut className="w-4 h-4 mr-3 shrink-0" />
            <span className="text-sm">Sign out</span>
          </Button>
        </div>
      </div>

      {/* ── Logout confirmation modal ──────────────────────────────────────── */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Sign out?</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to sign out of MAAUN Portal? Any unsaved work may be lost.
            </DialogDescription>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-muted/40 rounded-xl border"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{roleDisplay.label}</p>
            </div>
          </motion.div>

          <DialogFooter className="flex-row gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Yes, sign out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
