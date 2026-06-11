import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/authStore";
import { VamiButton } from "../components/atoms/VamiButton";
import { VamiAvatar } from "../components/atoms/VamiAvatar";
import { ProfileEditForm } from "../components/ProfileEditForm";
import { FollowRequestsList } from "../components/FollowRequestsList";
import * as authService from "../services/authService";

export function Dashboard() {
  const { user, accessToken } = useAuth();
  const { setAuth } = useAuthStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="space-y-6">
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
          Edit Profile
        </button>
      </nav>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Left: User Context Info */}
          <section className="md:col-span-1 rounded-xl border border-border-default bg-surface-elevated p-6 shadow-md transition-colors duration-300 space-y-6">
            <div className="flex flex-col items-center text-center">
              <VamiAvatar
                name={user?.name || user?.username || "Vami User"}
                src={user?.avatar_url}
                size="lg"
                className="mb-4"
              />
              <h2 className="text-lg font-bold text-ink-900 leading-tight">
                {user?.name || "Anonymous User"}
              </h2>
              <span className="text-xs font-semibold text-ink-400 mt-1">
                @{user?.username}
              </span>
            </div>

            <hr className="border-border-default" />

            <div className="space-y-4">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-ink-400">
                  Email Address
                </span>
                <span className="block text-sm font-semibold text-ink-800 mt-1 truncate">
                  {user?.email}
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
          </section>

          {/* Card Right: Diagnostics / Action Console */}
          <section className="md:col-span-2 rounded-xl border border-border-default bg-surface-elevated p-6 shadow-md transition-colors duration-300 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-ink-900">
                Session Cockpit Console
              </h2>
              <p className="text-xs text-ink-400 mt-1 leading-relaxed">
                Execute local authorization tokens, rotation cycles, and sandbox
                checks on client state.
              </p>
            </div>

            <div className="rounded-lg bg-surface-sunken p-4 border border-border-default space-y-3 font-mono text-xs select-all overflow-x-auto text-ink-800">
              <div className="flex justify-between gap-4">
                <span className="font-bold text-ink-900">User ID:</span>
                <span className="truncate max-w-[260px]">{user?.id}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-bold text-ink-900">Role Profile:</span>
                <span>
                  {user?.is_creator ? "Creator Account" : "Standard Reader"}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-border-default">
                <span className="font-bold text-ink-900">
                  Active Access Token:
                </span>
                <span className="block truncate bg-surface-elevated p-2 rounded border border-border-default select-text">
                  {accessToken || "null"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <VamiButton
                variant="primary"
                onClick={handleManualRefresh}
                loading={isLoading}
                className="py-2.5 px-4 font-semibold text-xs flex items-center gap-1.5"
              >
                Rotate Session Tokens
              </VamiButton>

              <Link
                to={`/users/${user?.username}`}
                className="inline-flex h-10 items-center justify-center rounded-md border border-border-strong bg-surface-elevated px-4 text-xs font-semibold text-ink-850 hover:bg-ink-050 transition-all shadow-sm"
              >
                Go to Public Profile
              </Link>
            </div>
          </section>
        </div>
      )}

      {activeTab === "edit-profile" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section className="rounded-xl border border-border-default bg-surface-elevated p-8 shadow-md transition-colors duration-300">
              <ProfileEditForm
                user={user}
                onSuccess={handleProfileUpdateSuccess}
              />
            </section>
          </div>
        </div>
      )}

      {/* Conditionally display follow requests list for private accounts */}
      {user?.is_private && activeTab === "overview" && (
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
    </div>
  );
}
