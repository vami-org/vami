import React, { createContext, useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const { user, accessToken, isAuthenticated, setAuth, clearAuth } =
    useAuthStore();

  // On initial load, try a silent token refresh using the HTTP-only cookie
  useEffect(() => {
    async function initAuth() {
      try {
        const refreshData = await authService.refresh();
        if (refreshData.success && refreshData.accessToken) {
          const profileData = await authService.fetchProfile();
          setAuth(profileData.user, refreshData.accessToken);
        } else {
          clearAuth();
        }
      } catch (err) {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, [setAuth, clearAuth]);

  const loginWithEmail = async (email) => {
    return await authService.requestMagicLink(email);
  };

  const verifyEmailToken = async (token) => {
    const data = await authService.verifyMagicLink(token);
    if (data.success && data.accessToken) {
      setAuth(data.user, data.accessToken);
    }
    return data;
  };

  const loginWithOAuth = async (provider, code) => {
    const data = await authService.oauthLogin(provider, code);
    if (data.success && data.accessToken) {
      setAuth(data.user, data.accessToken);
    }
    return data;
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout request failed, clearing local state anyway", err);
    } finally {
      clearAuth();
    }
  };

  const value = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    loginWithEmail,
    verifyEmailToken,
    loginWithOAuth,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
