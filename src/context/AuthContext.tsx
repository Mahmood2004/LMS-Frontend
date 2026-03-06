import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import authService from "@/services/authService";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

interface TokenPayload {
  id: string;
  username: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("accessToken");

  const decodeRole = (token: string | null): string | null => {
    if (!token) return null;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.role;
    } catch {
      return null;
    }
  };

  const [accessToken, setAccessToken] = useState<string | null>(getToken());
  const [role, setRole] = useState<string | null>(decodeRole(getToken()));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = getToken();
    const refreshToken = Cookies.get("refreshToken");
    return !!(token && refreshToken);
  });

  // Login function
  const login = async (username: string, password: string) => {
    const res = await authService.login(username, password);

    const token = res.accessToken;
    const decoded = jwtDecode<TokenPayload>(token);

    const userRole = decoded.role;

    localStorage.setItem("accessToken", token);

    setAccessToken(token);
    setRole(userRole);
    setIsAuthenticated(true);

    if (userRole === "admin") navigate("/dashboard/admin");
    else if (userRole === "instructor") navigate("/dashboard/instructor");
    else navigate("/dashboard/student");
  };

  // Logout function
  const logout = async () => {
    await authService.logout();

    localStorage.removeItem("accessToken");

    setAccessToken(null);
    setRole(null);
    setIsAuthenticated(false);

    navigate("/login");
  };

  // Refresh access token function
  const refreshAccessToken = async () => {
    try {
      const newToken = await authService.refreshAccessToken();

      const decoded = jwtDecode<TokenPayload>(newToken);
      const newRole = decoded.role;

      localStorage.setItem("accessToken", newToken);

      setAccessToken(newToken);
      setRole(newRole);
      setIsAuthenticated(true);
    } catch {
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        accessToken,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
