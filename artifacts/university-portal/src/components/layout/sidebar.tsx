import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  Users,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ROLE_LINKS = {
  student: [
    { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/courses", label: "Browse Courses", icon: BookOpen },
    { href: "/student/enrollments", label: "My Enrollments", icon: GraduationCap },
    { href: "/student/results", label: "Academic Results", icon: FileText },
    { href: "/student/profile", label: "My Profile", icon: UserIcon },
  ],
  lecturer: [
    { href: "/lecturer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/lecturer/courses", label: "My Courses", icon: BookOpen },
    { href: "/lecturer/students", label: "Students", icon: Users },
    { href: "/lecturer/results", label: "Manage Results", icon: FileText },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/courses", label: "Manage Courses", icon: BookOpen },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/lecturers", label: "Lecturers", icon: Users },
    { href: "/admin/results", label: "All Results", icon: FileText },
  ],
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const links = ROLE_LINKS[user.role as keyof typeof ROLE_LINKS] || [];

  return (
    <div className="w-64 bg-primary text-primary-foreground h-full flex flex-col hidden md:flex shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">MAAUN</h1>
        <p className="text-primary-foreground/80 text-xs mt-1 uppercase tracking-wider font-medium">
          Management Portal
        </p>
      </div>

      <div className="px-4 pb-4">
        <div className="bg-primary-foreground/10 rounded-lg p-3">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-primary-foreground/70 capitalize mt-0.5">{user.role}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? "bg-white text-primary font-medium shadow-sm"
                    : "text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                <span className="text-sm">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary-foreground/10">
        <Button
          variant="ghost"
          className="w-full justify-start text-primary-foreground/90 hover:text-white hover:bg-primary-foreground/10"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
