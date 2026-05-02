import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "wouter";

export function AppLayout({ children, requireAuth = true }: { children: ReactNode; requireAuth?: boolean }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Redirect to="/login" />;
  }

  if (!requireAuth && user) {
    return <Redirect to={`/${user.role}/dashboard`} />;
  }

  if (!requireAuth) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
