import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const PublicRoute: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated && role) {
    const roleRedirects = {
      admin: "/dashboard/admin",
      instructor: "/dashboard/instructor",
      student: "/dashboard/student",
    };

    return <Navigate to={roleRedirects[role]} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
