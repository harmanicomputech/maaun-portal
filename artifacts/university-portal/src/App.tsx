import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/app-layout";
import NotFound from "@/pages/not-found";

import Login from "@/pages/login";
import Register from "@/pages/register";

import StudentDashboard from "@/pages/student/dashboard";
import StudentCourses from "@/pages/student/courses";
import StudentEnrollments from "@/pages/student/enrollments";
import StudentResults from "@/pages/student/results";
import StudentProfile from "@/pages/student/profile";

import LecturerDashboard from "@/pages/lecturer/dashboard";
import LecturerCourses from "@/pages/lecturer/courses";
import LecturerStudents from "@/pages/lecturer/students";
import LecturerResults from "@/pages/lecturer/results";

import AdminDashboard from "@/pages/admin/dashboard";
import AdminCourses from "@/pages/admin/courses";
import AdminStudents from "@/pages/admin/students";
import AdminLecturers from "@/pages/admin/lecturers";
import AdminResults from "@/pages/admin/results";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/login">
        <AppLayout requireAuth={false}>
          <Login />
        </AppLayout>
      </Route>
      <Route path="/register">
        <AppLayout requireAuth={false}>
          <Register />
        </AppLayout>
      </Route>
      
      {/* Student Routes */}
      <Route path="/student/dashboard"><AppLayout><StudentDashboard /></AppLayout></Route>
      <Route path="/student/courses"><AppLayout><StudentCourses /></AppLayout></Route>
      <Route path="/student/enrollments"><AppLayout><StudentEnrollments /></AppLayout></Route>
      <Route path="/student/results"><AppLayout><StudentResults /></AppLayout></Route>
      <Route path="/student/profile"><AppLayout><StudentProfile /></AppLayout></Route>

      {/* Lecturer Routes */}
      <Route path="/lecturer/dashboard"><AppLayout><LecturerDashboard /></AppLayout></Route>
      <Route path="/lecturer/courses"><AppLayout><LecturerCourses /></AppLayout></Route>
      <Route path="/lecturer/students"><AppLayout><LecturerStudents /></AppLayout></Route>
      <Route path="/lecturer/results"><AppLayout><LecturerResults /></AppLayout></Route>

      {/* Admin Routes */}
      <Route path="/admin/dashboard"><AppLayout><AdminDashboard /></AppLayout></Route>
      <Route path="/admin/courses"><AppLayout><AdminCourses /></AppLayout></Route>
      <Route path="/admin/students"><AppLayout><AdminStudents /></AppLayout></Route>
      <Route path="/admin/lecturers"><AppLayout><AdminLecturers /></AppLayout></Route>
      <Route path="/admin/results"><AppLayout><AdminResults /></AppLayout></Route>
      
      {/* Redirect root to login/dashboard (handled by AppLayout logic indirectly, but let's be explicit) */}
      <Route path="/">
        <AppLayout>
          <div className="flex items-center justify-center h-full">Redirecting...</div>
        </AppLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
