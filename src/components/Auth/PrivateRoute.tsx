import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface PrivateRouteProps {
  requiredRole?: "student" | "instructor" | "admin";
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, role, accessToken } = useAuth();

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    const redirectRoutes = {
      admin: "/dashboard/admin",
      instructor: "/dashboard/instructor",
      student: "/dashboard/student",
    };

    if (role && redirectRoutes[role]) {
      return <Navigate to={redirectRoutes[role]} replace />;
    }

  }

  return <Outlet />;
};

export default PrivateRoute;
