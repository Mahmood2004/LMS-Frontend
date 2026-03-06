import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import PrivateRoute from "@/components/Auth/PrivateRoute";
import PublicRoute from "@/components/Auth/PublicRoute";
import HomeRedirect from "@/components/Auth/HomeRedirect";
import StudentDashboard from "./pages/dashboard/student";
import InstructorDashboard from "./pages/dashboard/instructor";
import AdminDashboard from "./pages/dashboard/admin";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<PrivateRoute requiredRole="student" />}>
            <Route
              path="/dashboard/student/:section?"
              element={<StudentDashboard />}
            />
          </Route>
          <Route element={<PrivateRoute requiredRole="instructor" />}>
            <Route
              path="/dashboard/instructor/:section?"
              element={<InstructorDashboard />}
            />
          </Route>
          <Route element={<PrivateRoute requiredRole="admin" />}>
            <Route
              path="/dashboard/admin/:section?"
              element={<AdminDashboard />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
