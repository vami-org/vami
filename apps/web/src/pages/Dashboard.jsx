import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/authStore";
import { VamiButton } from "../components/VamiButton";
import { VamiAvatar } from "../components/VamiAvatar";
import { ProfileEditForm } from "../components/ProfileEditForm";
import { FollowRequestsList } from "../components/FollowRequestsList";
import * as authService from "../services/authService";

export function Dashboard() {
  const { user, accessToken, logout } = useAuth();
  const { setAuth } = useAuthStore();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleManualRefresh = async () => {
    setIsLoading(true);
    setStatusMsg("");
    setErrorMsg("");
    try {
      const response = await authService.refresh();
      if (response.success && response.accessToken) {
        setStatusMsg(
          "🔄 Token Rotated successfully! New Access Token issued in memory.",
        );
      } else {
        setErrorMsg("Failed to rotate refresh token session.");
      }
    } catch (err) {
      setErrorMsg("Error: Refreshed token session rejected by backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdateSuccess = (updatedUser) => {
    setAuth(updatedUser, accessToken);
  };

  return (
    <div className="min-h-screen bg-surface-warm p-6 transition-colors duration-300 font-ui text-ink-800">
      {/* Top Header */}
      <header className="mx-auto flex max-w-5xl items-center justify-between border-b border-border-default pb-4 mb-8">
        <span className="text-xl font-extrabold tracking-tight text-ink-900">
          VAMI COCKPIT
        </span>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="flex h-10 items-center justify-center rounded-md border border-border-strong bg-surface-elevated px-4 text-xs font-semibold text-ink-800 transition-all hover:bg-ink-050 active:scale-95 cursor-pointer shadow-sm"
          >
            {theme === "light" ? "Dark" : "Light"} Mode
          </button>
          <VamiButton
            variant="danger"
            onClick={logout}
            className="py-2 px-4 text-xs font-semibold"
          >
            Logout
          </VamiButton>
        </div>
      </header>

      {/* Main Content container */}
      <main className="mx-auto max-w-3xl space-y-6">
        {/* Status Alerts */}
        {statusMsg && (
          <div className="rounded-md bg-success-100 p-4 border border-success-500 text-success-500 text-sm font-semibold">
            {statusMsg}
          </div>
        )}
        {errorMsg && (
          <div className="rounded-md bg-error-100 p-4 border border-error-500 text-error-500 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="flex border-b border-border-default gap-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 text-sm font-bold tracking-tight transition-colors cursor-pointer border-b-2 ${
              activeTab === "overview"
                ? "border-amber-500 text-ink-900"
                : "border-transparent text-ink-400 hover:text-ink-600"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("edit-profile")}
            className={`pb-3 text-sm font-bold tracking-tight transition-colors cursor-pointer border-b-2 ${
              activeTab === "edit-profile"
                ? "border-amber-500 text-ink-900"
                : "border-transparent text-ink-400 hover:text-ink-600"
            }`}
          >
            Edit Settings
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`pb-3 text-sm font-bold tracking-tight transition-colors cursor-pointer border-b-2 ${
              activeTab === "requests"
                ? "border-amber-500 text-ink-900"
                : "border-transparent text-ink-400 hover:text-ink-600"
            }`}
          >
            Follow Requests {user?.is_private && "🔒"}
          </button>
        </nav>

        {/* Tab 1: Overview Panel */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <section className="rounded-xl border border-border-default bg-surface-elevated p-8 shadow-md transition-colors duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border-default">
                <div>
                  <h1 className="text-2xl font-extrabold text-ink-900 tracking-tight">
                    Welcome back,{" "}
                    {user?.display_name || user?.username || "User"}!
                  </h1>
                  <p className="text-sm text-ink-600 mt-1">
                    You are successfully authenticated using Magic Link
                    passwordless security.
                  </p>
                </div>

                {/* Scalable VamiAvatar */}
                <VamiAvatar
                  src={user?.avatar_url}
                  name={user?.display_name || user?.username || "User"}
                  size="lg"
                />
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-ink-400">
                    Email Address
                  </span>
                  <span className="text-sm font-semibold text-ink-900">
                    {user?.email}
                  </span>
                </div>

                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-ink-400">
                    Username
                  </span>
                  <span className="text-sm font-semibold text-ink-900">
                    @{user?.username || "not_assigned"}
                  </span>
                </div>

                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-ink-400">
                    Creator Account Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold mt-1 bg-amber-100 text-amber-500 border border-amber-400">
                    {user?.is_creator ? "Creator" : "Reader"}
                  </span>
                </div>

                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-ink-400">
                    Profile Privacy
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold mt-1 ${
                      user?.is_private
                        ? "bg-ink-100 text-ink-600 border border-ink-200"
                        : "bg-success-100 text-success-500 border border-success-500"
                    }`}
                  >
                    {user?.is_private ? "Private Account" : "Public Account"}
                  </span>
                </div>
              </div>

              {user?.username && (
                <div className="mt-6 border-t border-border-default pt-6 flex justify-end">
                  <Link
                    to={`/users/${user.username}`}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-500 px-5 py-2.5 font-ui text-sm font-bold text-ink-900 hover:bg-amber-400 transition"
                  >
                    View My Public Writer Profile
                  </Link>
                </div>
              )}
            </section>

            {/* Developer Sandbox Controls */}
            <section className="rounded-xl border border-border-default bg-surface-elevated p-8 shadow-sm transition-colors duration-300 space-y-4">
              <h2 className="text-lg font-bold text-ink-900">
                Session Security & Token Testing
              </h2>
              <p className="text-xs text-ink-600 leading-relaxed">
                Verify the secure local flow: the short-lived Bearer access
                token is held in-memory (Zustand state), and the long-lived
                refresh token session runs from an HTTP-only Lax cookie. Use the
                controls below to trigger custom interactions.
              </p>

              <div className="rounded-md bg-surface-sunken p-4 border border-border-default">
                <span className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">
                  In-Memory Access Token
                </span>
                <code className="block break-all font-mono text-[10px] bg-surface-white border border-border-default p-2 rounded text-ink-800 leading-normal">
                  {accessToken || "No access token in memory"}
                </code>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <VamiButton
                  variant="secondary"
                  isLoading={isLoading}
                  onClick={handleManualRefresh}
                  className="py-2.5 px-5 font-bold shadow-sm"
                >
                  Rotate Token (Manual Refresh)
                </VamiButton>
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Profile Settings Form */}
        {activeTab === "edit-profile" && (
          <section className="rounded-xl border border-border-default bg-surface-elevated p-8 shadow-md transition-colors duration-300">
            <h2 className="text-lg font-bold text-ink-900 mb-6 border-b border-border-default pb-3">
              Profile Settings
            </h2>
            <ProfileEditForm
              user={user}
              onSuccess={handleProfileUpdateSuccess}
            />
          </section>
        )}

        {/* Tab 3: Follow Requests Approvals Panel */}
        {activeTab === "requests" && (
          <section className="rounded-xl border border-border-default bg-surface-elevated p-8 shadow-md transition-colors duration-300 space-y-4">
            <div className="border-b border-border-default pb-3">
              <h2 className="text-lg font-bold text-ink-900">
                Pending Follow Requests
              </h2>
              <p className="text-xs text-ink-400 mt-1">
                Manage incoming user follow requests for your account. Followers
                will only be able to see your articles and statistics after
                approval.
              </p>
            </div>

            <FollowRequestsList />
          </section>
        )}
      </main>
    </div>
  );
}
