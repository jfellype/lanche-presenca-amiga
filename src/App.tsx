import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/ui/loading";
import { PageTransition } from "@/components/PageTransition";

// Lazy load pages for better performance
const Login = lazy(() => import("@/components/Login"));
const Auth = lazy(() => import("@/components/Auth"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const StudentPortal = lazy(() => import("@/pages/StudentPortal"));
const TeacherDashboard = lazy(() => import("@/pages/TeacherDashboard"));
const KitchenDashboard = lazy(() => import("@/pages/KitchenDashboard"));
const LibraryDashboard = lazy(() => import("@/pages/LibraryDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("@/pages/Profile"));
const SIGEAAssistant = lazy(() => import("@/pages/SIGEAAssistant"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return null; // Initial splash handled by pages
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<Loading size="lg" className="min-h-screen" />}>
        <PageTransition>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </PageTransition>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loading size="lg" className="min-h-screen" />}>
      <PageTransition>
        <Routes>
          <Route path="/" element={
            user?.role === 'admin' ? <AdminDashboard /> :
            user?.role === 'teacher' ? <TeacherDashboard /> :
            user?.role === 'kitchen' ? <KitchenDashboard /> :
            user?.role === 'library' ? <LibraryDashboard /> :
            <StudentPortal />
          } />
          <Route path="/auth" element={<Navigate to="/" replace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sigea-assistant" element={<SIGEAAssistant />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/student" element={<StudentPortal />} />
          <Route path="/kitchen" element={<KitchenDashboard />} />
          <Route path="/library" element={<LibraryDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
