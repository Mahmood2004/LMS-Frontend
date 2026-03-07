import axios from "axios";
import authService from "@/services/authService";

// Create axios instance
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Attach access token automatically
api.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle expired access tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired → try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await authService.refreshAccessToken();

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        await authService.logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
