import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Crucial for sending/receiving secure cookies
});

// Request Interceptor: Attach access token from Zustand store
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Variables for refresh queueing
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If request failed with 401 and was not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we are already trying to refresh or this is the refresh request itself
      if (
        originalRequest.url === "/auth/refresh" ||
        originalRequest.url === "/auth/logout"
      ) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request and return a promise that resolves when the refresh is done
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call the backend refresh endpoint
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const { accessToken } = response.data;

        // Fetch the user profile if it's missing in store
        let currentUser = useAuthStore.getState().user;
        if (!currentUser) {
          const profileResponse = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          currentUser = profileResponse.data.user;
        }

        // Update the Zustand store
        useAuthStore.getState().setAuth(currentUser, accessToken);

        // Process all queued requests
        processQueue(null, accessToken);

        // Retry the original request
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
