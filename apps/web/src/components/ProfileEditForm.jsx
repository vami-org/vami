import React, { useState } from "react";
import apiClient from "../services/apiClient";
import { AvatarUpload } from "./AvatarUpload";
import { VamiButton } from "./atoms/VamiButton";

export function ProfileEditForm({ user, onSuccess }) {
  const [displayName, setDisplayName] = useState(user.display_name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [websiteUrl, setWebsiteUrl] = useState(user.website_url || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "");
  const [isPrivate, setIsPrivate] = useState(!!user.is_private);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data } = await apiClient.patch("/v1/users/me", {
        displayName,
        bio,
        avatarUrl,
        websiteUrl,
        isPrivate,
      });

      if (data.success && data.user) {
        setSuccessMsg("✨ Profile settings updated successfully!");
        onSuccess(data.user);
      } else {
        setErrorMsg(data.error || "Failed to update profile parameters");
      }
    } catch (err) {
      console.error("Profile edit failed:", err);
      setErrorMsg(
        err.response?.data?.error ||
          "A connection issue occurred saving profile.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMsg && (
        <div className="rounded-md bg-success-100 p-4 border border-success-500 text-success-500 font-ui text-sm font-semibold">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="rounded-md bg-error-100 p-4 border border-error-500 text-error-500 font-ui text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Direct Image upload */}
      <div className="border-b border-border-default pb-6 flex justify-center">
        <AvatarUpload
          currentAvatarUrl={avatarUrl}
          onUploadSuccess={(url) => setAvatarUrl(url)}
          name={displayName || user.username || "User"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Display Name */}
        <div>
          <label
            htmlFor="displayName"
            className="block font-ui text-xs font-bold uppercase tracking-wider text-ink-400 mb-2"
          >
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            placeholder="John Doe"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isLoading}
            className="w-full rounded-md border border-border-default bg-surface-white px-4 py-3 font-ui text-sm text-ink-900 transition focus-visible:outline-border-focus disabled:opacity-50"
          />
        </div>

        {/* Website URL */}
        <div>
          <label
            htmlFor="websiteUrl"
            className="block font-ui text-xs font-bold uppercase tracking-wider text-ink-400 mb-2"
          >
            Website URL
          </label>
          <input
            id="websiteUrl"
            type="url"
            placeholder="https://example.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            disabled={isLoading}
            className="w-full rounded-md border border-border-default bg-surface-white px-4 py-3 font-ui text-sm text-ink-900 transition focus-visible:outline-border-focus disabled:opacity-50"
          />
        </div>
      </div>

      {/* Bio text area */}
      <div>
        <label
          htmlFor="bio"
          className="block font-ui text-xs font-bold uppercase tracking-wider text-ink-400 mb-2"
        >
          Bio / Description
          <span className="ml-1 font-normal text-ink-200 lowercase">
            ({bio.length}/1000)
          </span>
        </label>
        <textarea
          id="bio"
          placeholder="Tell other readers about yourself..."
          rows={4}
          maxLength={1000}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-md border border-border-default bg-surface-white px-4 py-3 font-ui text-sm text-ink-900 transition focus-visible:outline-border-focus disabled:opacity-50 resize-y"
        />
      </div>

      {/* Profile Privacy Toggle */}
      <div className="rounded-lg border border-border-default bg-surface-sunken/50 p-4 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <label
            htmlFor="isPrivate"
            className="block font-ui text-sm font-bold text-ink-900 cursor-pointer"
          >
            Private Profile
          </label>
          <span className="block font-ui text-xs text-ink-400 leading-relaxed">
            When enabled, other users must request to follow you. Only approved
            followers can view your published articles, statistics, and
            connections list.
          </span>
        </div>
        <div className="relative flex items-center h-6">
          <input
            id="isPrivate"
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            disabled={isLoading}
            className="h-5 w-5 rounded border-border-strong text-amber-500 focus:ring-amber-500 cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-border-default pt-4">
        <VamiButton type="submit" isLoading={isLoading} className="font-bold">
          Save Settings
        </VamiButton>
      </div>
    </form>
  );
}
