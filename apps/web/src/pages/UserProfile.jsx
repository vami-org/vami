import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import apiClient from "../services/apiClient";
import { ProfileHero } from "../components/ProfileHero";

export function UserProfile() {
  const { username } = useParams();
  const { user: currentUser, isLoading: authLoading } = useAuth();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (authLoading) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const { data } = await apiClient.get(`/v1/users/${username}`);
        if (data.success) {
          setProfile(data.profile);
        } else {
          setErrorMsg("User profile lookup failed.");
        }
      } catch (err) {
        console.error("Profile load failure:", err);
        setErrorMsg(
          err.response?.status === 404
            ? "The requested user profile does not exist."
            : "Connection issue. Unable to fetch user profile.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username, currentUser?.id, authLoading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-warm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ink-100 border-t-amber-500" />
          <span className="font-ui text-sm font-medium text-ink-600 animate-pulse">
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface-warm p-6 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error-100 text-error-500">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="font-ui text-xl font-bold text-ink-900">
          Profile Error
        </h2>
        <p className="mt-2 max-w-sm font-ui text-sm text-ink-600 mb-6">
          {errorMsg}
        </p>
        <Link
          to="/dashboard"
          className="rounded-md bg-ink-900 px-6 py-3 font-ui text-sm font-semibold text-surface-white hover:bg-ink-800 transition shadow"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-warm p-6 transition-colors duration-300 font-ui text-ink-800">
      {/* Navigation header */}
      <header className="mx-auto flex max-w-5xl items-center justify-between border-b border-border-default pb-4 mb-8">
        <Link
          to="/dashboard"
          className="text-xl font-extrabold tracking-tight text-ink-900"
        >
          VAMI
        </Link>
        <Link
          to="/dashboard"
          className="flex h-10 items-center justify-center rounded-md border border-border-strong bg-surface-elevated px-4 text-xs font-semibold text-ink-800 transition-all hover:bg-ink-050 active:scale-95 shadow-sm"
        >
          Back to Cockpit
        </Link>
      </header>

      <main className="mx-auto max-w-3xl space-y-8">
        {profile && (
          <>
            {/* Hero Header */}
            <ProfileHero
              profile={profile}
              currentUserId={currentUser?.id}
              onFollowChange={(updatedProfile) => setProfile(updatedProfile)}
            />

            {/* Privacy Check Block */}
            {profile.is_content_hidden ? (
              <section className="rounded-xl border border-border-default bg-surface-elevated p-12 text-center shadow-sm flex flex-col items-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface-sunken text-ink-400">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-ink-900">
                  This Account is Private
                </h3>
                <p className="mt-2 max-w-md text-xs text-ink-400 leading-relaxed">
                  Only approved followers can view this user&apos;s published
                  articles, posts, and subscriber lists. Follow this user to
                  send a follow request.
                </p>
              </section>
            ) : (
              // Public articles tab feed
              <section className="rounded-xl border border-border-default bg-surface-elevated p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-ink-900 border-b border-border-default pb-3">
                  Articles Published
                </h2>

                <div className="text-center py-12 border border-dashed border-border-default rounded-md bg-surface-sunken/10">
                  <p className="text-sm font-semibold text-ink-400">
                    No articles published yet.
                  </p>
                  <p className="text-xs text-ink-400 mt-1">
                    When this author publishes content, it will appear here.
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
