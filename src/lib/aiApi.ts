import axios from "axios";
import authService from "@/services/authService";

// Create axios instance for AI backend
const aiApi = axios.create({
  baseURL: "",
  withCredentials: true,
});

// Attach access token automatically (same as main API)
aiApi.interceptors.request.use(
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
aiApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await authService.refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return aiApi(originalRequest);
      } catch (err) {
        await authService.logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default aiApi;
