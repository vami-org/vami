import React, { useState } from "react";
import apiClient from "../services/apiClient";
import { VamiAvatar } from "./atoms/VamiAvatar";
import { VamiButton } from "./atoms/VamiButton";

export function ProfileHero({ profile, currentUserId, onFollowChange }) {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState("");

  const isOwnProfile = currentUserId === profile.id;

  const handleFollowToggle = async () => {
    if (isActionLoading) return;
    setIsActionLoading(true);
    setError("");

    const previousStatus = profile.follow_status;
    const previousFollowers = profile.followers_count;

    // Determine target action
    const isUnfollowing =
      previousStatus === "accepted" || previousStatus === "pending";

    // Optimistic Update
    let optimisticStatus = null;
    let optimisticFollowers = previousFollowers;

    if (!isUnfollowing) {
      optimisticStatus = profile.is_private ? "pending" : "accepted";
      if (!profile.is_private) {
        optimisticFollowers += 1;
      }
    } else {
      optimisticStatus = null;
      if (previousStatus === "accepted") {
        optimisticFollowers = Math.max(0, previousFollowers - 1);
      }
    }

    onFollowChange({
      ...profile,
      follow_status: optimisticStatus,
      followers_count: optimisticFollowers,
    });

    try {
      if (isUnfollowing) {
        // DELETE /v1/follows/:userId
        const { data } = await apiClient.delete(`/v1/follows/${profile.id}`);
        if (!data.success) throw new Error();
      } else {
        // POST /v1/follows/:userId
        const { data } = await apiClient.post(`/v1/follows/${profile.id}`);
        if (!data.success) throw new Error();

        // Update to actual final status returned by API
        onFollowChange({
          ...profile,
          follow_status: data.status,
          followers_count:
            data.status === "accepted"
              ? previousFollowers + 1
              : previousFollowers,
        });
      }
    } catch (err) {
      console.error("Follow operation failed:", err);
      setError("Failed to update follow relationship. Retrying...");

      // Rollback to previous state on error
      onFollowChange({
        ...profile,
        follow_status: previousStatus,
        followers_count: previousFollowers,
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const renderFollowButton = () => {
    if (isOwnProfile || !currentUserId) return null;

    if (profile.follow_status === "accepted") {
      return (
        <VamiButton
          variant="secondary"
          onClick={handleFollowToggle}
          isLoading={isActionLoading}
          className="border-error-500 text-error-500 hover:bg-error-100 hover:bg-opacity-20 font-bold"
        >
          Unfollow
        </VamiButton>
      );
    }

    if (profile.follow_status === "pending") {
      return (
        <VamiButton
          variant="secondary"
          onClick={handleFollowToggle}
          isLoading={isActionLoading}
          className="font-bold border-ink-200 text-ink-400 bg-surface-sunken"
        >
          Requested
        </VamiButton>
      );
    }

    return (
      <VamiButton
        variant="primary"
        onClick={handleFollowToggle}
        isLoading={isActionLoading}
        className="font-bold bg-amber-500 text-ink-900 hover:bg-amber-400"
      >
        Follow
      </VamiButton>
    );
  };

  return (
    <div className="rounded-xl border border-border-default bg-surface-elevated p-8 shadow-md transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b border-border-default text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <VamiAvatar
            src={profile.avatar_url}
            name={profile.display_name || profile.username}
            size="lg"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-ink-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
              {profile.display_name || profile.username}
              {profile.is_private && (
                <svg
                  className="h-4 w-4 text-ink-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </h1>
            <p className="text-sm text-ink-600">@{profile.username}</p>
          </div>
        </div>

        <div className="mt-2 md:mt-0">{renderFollowButton()}</div>
      </div>

      {/* Profile Bio & Website */}
      <div className="py-6 border-b border-border-default space-y-3">
        {profile.bio ? (
          <p className="font-reading text-sm text-ink-800 leading-relaxed max-w-2xl">
            {profile.bio}
          </p>
        ) : (
          <p className="font-reading text-xs italic text-ink-400">
            No bio provided.
          </p>
        )}

        {profile.website_url && (
          <a
            href={profile.website_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 hover:text-amber-400 underline"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            {profile.website_url.replace(/^https?:\/\//i, "")}
          </a>
        )}
      </div>

      {/* Social connection counts */}
      <div className="flex justify-around md:justify-start gap-12 pt-6">
        <div>
          <span className="block text-xl font-extrabold text-ink-900">
            {profile.followers_count}
          </span>
          <span className="block text-xs font-bold uppercase tracking-wider text-ink-400 mt-1">
            Followers
          </span>
        </div>
        <div>
          <span className="block text-xl font-extrabold text-ink-900">
            {profile.following_count}
          </span>
          <span className="block text-xs font-bold uppercase tracking-wider text-ink-400 mt-1">
            Following
          </span>
        </div>
        <div>
          <span className="block text-xl font-extrabold text-ink-900">
            {profile.quality_score}
          </span>
          <span className="block text-xs font-bold uppercase tracking-wider text-ink-400 mt-1">
            Quality Score
          </span>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-center md:text-left text-xs font-semibold text-error-500">
          {error}
        </p>
      )}
    </div>
  );
}
