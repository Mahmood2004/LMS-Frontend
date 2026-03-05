import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Index from "@/pages/Index";

const HomeRedirect: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated && role) {
    const roleRedirects = {
      admin: "/dashboard/admin",
      instructor: "/dashboard/instructor",
      student: "/dashboard/student",
    };

    return <Navigate to={roleRedirects[role]} replace />;
  }

  return <Index />;
};

export default HomeRedirect;
