import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect, useLocation } from "wouter";
import { ErrorBoundary } from "@/components/error-boundary";
import { GraduationCap } from "lucide-react";
import { getDashboardRoute, getAllowedRoles } from "@/lib/role-utils";

function FullPageSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <GraduationCap className="w-7 h-7 text-primary" />
        </div>
        <span className="absolute -inset-1 rounded-2xl border-2 border-primary/30 animate-ping" />
      </div>
      <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading MAAUN Portal…</p>
    </div>
  );
}

export function AppLayout({ children, requireAuth = true }: { children: ReactNode; requireAuth?: boolean }) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) return <FullPageSpinner />;

  // Unauthenticated user hitting a protected route → login
  if (requireAuth && !user) return <Redirect to="/login" />;

  // Authenticated user hitting a public-only route (login/register) → their dashboard
  if (!requireAuth && user) return <Redirect to={getDashboardRoute(user.role)} />;

  // Public route (no auth required, no user) → render normally
  if (!requireAuth) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  // ── Role guard ────────────────────────────────────────────────────────────
  // If the current path is restricted to specific roles and the logged-in user
  // doesn't have one of those roles, silently redirect them to their own dashboard.
  if (user) {
    const allowedRoles = getAllowedRoles(location);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Redirect to={getDashboardRoute(user.role)} />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="p-4 md:p-8"
          >
            <div className="max-w-6xl mx-auto">
              <ErrorBoundary resetKey={location}>
                {children}
              </ErrorBoundary>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
