import axios from "axios";
import Cookies from "js-cookie";

const API_BASE = "/api/auth";

interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

const authService = {
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_BASE}/login`,
        { username, password },
        { withCredentials: true },
      );

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);

      Cookies.set("refreshToken", refreshToken, {
        secure: true,
        sameSite: "strict",
        expires: 7,
      });

      return response.data;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    }
  },

  logout: async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) return;

      await axios.post(
        `${API_BASE}/logout`,
        { token: refreshToken },
        { withCredentials: true },
      );

      localStorage.removeItem("accessToken");
      Cookies.remove("refreshToken");
    } catch (err: any) {
      console.error("Logout failed:", err);
    }
  },

  refreshAccessToken: async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) throw new Error("No refresh token found");

      const response = await axios.post<{ token: string }>(
        `${API_BASE}/reftoken`,
        { token: refreshToken },
        { withCredentials: true },
      );

      const { token } = response.data;
      localStorage.setItem("accessToken", token);
      return token;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to refresh access token",
      );
    }
  },

  getAccessToken: () => localStorage.getItem("accessToken"),
};

export default authService;
