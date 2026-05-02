import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/app-layout";
import NotFound from "@/pages/not-found";

import Login from "@/pages/login";
import Register from "@/pages/register";
import VerifyTranscript from "@/pages/verify-transcript";
import VerifyReceipt from "@/pages/verify-receipt";

import StudentDashboard from "@/pages/student/dashboard";
import StudentCourses from "@/pages/student/courses";
import StudentEnrollments from "@/pages/student/enrollments";
import StudentResults from "@/pages/student/results";
import StudentProfile from "@/pages/student/profile";
import StudentPayments from "@/pages/student/payments";
import StudentNotifications from "@/pages/student/notifications";
import StudentAcademicStanding from "@/pages/student/academic-standing";
import StudentReceipts from "@/pages/student/receipts";
import StudentTimetable from "@/pages/student/timetable";
import StudentGraduation from "@/pages/student/graduation";
import StudentHostel from "@/pages/student/hostel";
import StudentDisciplinary from "@/pages/student/disciplinary";

import LecturerDashboard from "@/pages/lecturer/dashboard";
import LecturerCourses from "@/pages/lecturer/courses";
import LecturerStudents from "@/pages/lecturer/students";
import LecturerResults from "@/pages/lecturer/results";
import LecturerTranscript from "@/pages/lecturer/transcript";
import LecturerTimetable from "@/pages/lecturer/timetable";

import AdminDashboard from "@/pages/admin/dashboard";
import AdminCourses from "@/pages/admin/courses";
import AdminStudents from "@/pages/admin/students";
import AdminLecturers from "@/pages/admin/lecturers";
import AdminResults from "@/pages/admin/results";
import AdminPayments from "@/pages/admin/payments";
import AdminSessions from "@/pages/admin/sessions";
import AdminNotifications from "@/pages/admin/notifications";
import AdminActivityLogs from "@/pages/admin/activity-logs";
import AdminAcademicStanding from "@/pages/admin/academic-standing";
import AdminTranscripts from "@/pages/admin/transcripts";
import AdminFinance from "@/pages/admin/finance";
import AdminTimetable from "@/pages/admin/timetable";
import AdminGraduation from "@/pages/admin/graduation";
import AdminHostel from "@/pages/admin/hostel";
import AdminDisciplinary from "@/pages/admin/disciplinary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/verify/transcript/:reference" component={VerifyTranscript} />
      <Route path="/verify/receipt/:reference" component={VerifyReceipt} />

      <Route path="/login"><AppLayout requireAuth={false}><Login /></AppLayout></Route>
      <Route path="/register"><AppLayout requireAuth={false}><Register /></AppLayout></Route>

      {/* Student Routes */}
      <Route path="/student/dashboard"><AppLayout><StudentDashboard /></AppLayout></Route>
      <Route path="/student/courses"><AppLayout><StudentCourses /></AppLayout></Route>
      <Route path="/student/enrollments"><AppLayout><StudentEnrollments /></AppLayout></Route>
      <Route path="/student/results"><AppLayout><StudentResults /></AppLayout></Route>
      <Route path="/student/profile"><AppLayout><StudentProfile /></AppLayout></Route>
      <Route path="/student/payments"><AppLayout><StudentPayments /></AppLayout></Route>
      <Route path="/student/receipts"><AppLayout><StudentReceipts /></AppLayout></Route>
      <Route path="/student/timetable"><AppLayout><StudentTimetable /></AppLayout></Route>
      <Route path="/student/notifications"><AppLayout><StudentNotifications /></AppLayout></Route>
      <Route path="/student/academic-standing"><AppLayout><StudentAcademicStanding /></AppLayout></Route>
      <Route path="/student/graduation"><AppLayout><StudentGraduation /></AppLayout></Route>
      <Route path="/student/hostel"><AppLayout><StudentHostel /></AppLayout></Route>
      <Route path="/student/disciplinary"><AppLayout><StudentDisciplinary /></AppLayout></Route>

      {/* Lecturer Routes */}
      <Route path="/lecturer/dashboard"><AppLayout><LecturerDashboard /></AppLayout></Route>
      <Route path="/lecturer/courses"><AppLayout><LecturerCourses /></AppLayout></Route>
      <Route path="/lecturer/students"><AppLayout><LecturerStudents /></AppLayout></Route>
      <Route path="/lecturer/results"><AppLayout><LecturerResults /></AppLayout></Route>
      <Route path="/lecturer/transcript"><AppLayout><LecturerTranscript /></AppLayout></Route>
      <Route path="/lecturer/timetable"><AppLayout><LecturerTimetable /></AppLayout></Route>

      {/* Admin Routes */}
      <Route path="/admin/dashboard"><AppLayout><AdminDashboard /></AppLayout></Route>
      <Route path="/admin/courses"><AppLayout><AdminCourses /></AppLayout></Route>
      <Route path="/admin/students"><AppLayout><AdminStudents /></AppLayout></Route>
      <Route path="/admin/lecturers"><AppLayout><AdminLecturers /></AppLayout></Route>
      <Route path="/admin/results"><AppLayout><AdminResults /></AppLayout></Route>
      <Route path="/admin/payments"><AppLayout><AdminPayments /></AppLayout></Route>
      <Route path="/admin/sessions"><AppLayout><AdminSessions /></AppLayout></Route>
      <Route path="/admin/notifications"><AppLayout><AdminNotifications /></AppLayout></Route>
      <Route path="/admin/activity-logs"><AppLayout><AdminActivityLogs /></AppLayout></Route>
      <Route path="/admin/academic-standing"><AppLayout><AdminAcademicStanding /></AppLayout></Route>
      <Route path="/admin/transcripts"><AppLayout><AdminTranscripts /></AppLayout></Route>
      <Route path="/admin/finance"><AppLayout><AdminFinance /></AppLayout></Route>
      <Route path="/admin/timetable"><AppLayout><AdminTimetable /></AppLayout></Route>
      <Route path="/admin/graduation"><AppLayout><AdminGraduation /></AppLayout></Route>
      <Route path="/admin/hostel"><AppLayout><AdminHostel /></AppLayout></Route>
      <Route path="/admin/disciplinary"><AppLayout><AdminDisciplinary /></AppLayout></Route>

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
