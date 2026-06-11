import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "./store/authStore";
import apiClient from "./services/apiClient";

describe("Frontend Auth System Tests", () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useAuthStore.getState().clearAuth();
    vi.restoreAllMocks();
  });

  describe("Zustand Auth Store", () => {
    it("should initialize with correct default state", () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it("should set authentication state correctly", () => {
      const mockUser = { id: "1", email: "test@vami.org", username: "tester" };
      const mockToken = "mock_access_token";

      useAuthStore.getState().setAuth(mockUser, mockToken);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe(mockToken);
      expect(state.isAuthenticated).toBe(true);
    });

    it("should clear authentication state correctly on logout", () => {
      const mockUser = { id: "1", email: "test@vami.org", username: "tester" };
      const mockToken = "mock_access_token";

      useAuthStore.getState().setAuth(mockUser, mockToken);
      useAuthStore.getState().clearAuth();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe("Axios Request Interceptor", () => {
    it("should append Authorization header when access token is present in store", async () => {
      const mockToken = "super-secret-jwt";
      useAuthStore.getState().setAuth({ id: "1" }, mockToken);

      // Find the request interceptor handler
      const requestHandlers = apiClient.interceptors.request.handlers;
      expect(requestHandlers.length).toBeGreaterThan(0);

      const interceptor = requestHandlers[0].fulfilled;
      const mockConfig = { headers: {} };

      const modifiedConfig = interceptor(mockConfig);

      expect(modifiedConfig.headers["Authorization"]).toBe(
        `Bearer ${mockToken}`,
      );
    });

    it("should not append Authorization header when access token is missing", async () => {
      // Access token is missing initially (null)
      const requestHandlers = apiClient.interceptors.request.handlers;
      const interceptor = requestHandlers[0].fulfilled;
      const mockConfig = { headers: {} };

      const modifiedConfig = interceptor(mockConfig);

      expect(modifiedConfig.headers["Authorization"]).toBeUndefined();
    });
  });
});
