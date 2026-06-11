import React, { useState } from "react";
import axios from "axios";
import apiClient from "../services/apiClient";
import { VamiAvatar } from "./VamiAvatar";

export function AvatarUpload({ currentAvatarUrl, onUploadSuccess, name }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic file validation
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("File size exceeds 2MB limit.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      // 1. Fetch signed credentials from our backend
      const { data: creds } = await apiClient.post("/v1/media/upload-url");
      if (!creds.success) {
        throw new Error(creds.error || "Failed to generate upload URL");
      }

      const { signature, timestamp, apiKey, cloudName, uploadUrl } = creds;

      // 2. Prepare FormData
      const formData = new FormData();
      formData.append("file", file);

      // Append credentials if not in mock local upload mode
      if (cloudName !== "mock_cloudinary_cloud_name") {
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", "avatars");
      }

      // 3. Post directly to the upload URL (Cloudinary or local Mock upload)
      const res = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.secure_url) {
        onUploadSuccess(res.data.secure_url);
      } else {
        throw new Error("Upload response did not contain secure URL");
      }
    } catch (err) {
      console.error("Avatar upload failure:", err);
      setError(
        err.response?.data?.error ||
          "Failed to upload image. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <VamiAvatar src={currentAvatarUrl} name={name} size="xl" />

      <div className="flex flex-col items-center">
        <label className="relative cursor-pointer">
          <span className="inline-flex items-center justify-center rounded-md border border-border-strong bg-surface-elevated px-4 py-2 text-xs font-semibold text-ink-800 transition hover:bg-ink-050 select-none shadow-sm active:scale-98">
            {isUploading ? "Uploading..." : "Change Avatar"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>

        {error && (
          <p className="mt-2 font-ui text-xs font-semibold text-error-500">
            {error}
          </p>
        )}
        <p className="mt-1 font-ui text-[10px] text-ink-400">
          Max size: 2MB. JPG, PNG, or SVG.
        </p>
      </div>
    </div>
  );
}
