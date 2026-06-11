import React, { useState, useEffect } from "react";
import apiClient from "../services/apiClient";
import { VamiAvatar } from "./atoms/VamiAvatar";
import { VamiButton } from "./atoms/VamiButton";

export function FollowRequestsList() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchRequests = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const { data } = await apiClient.get("/v1/follows/requests");
      if (data.success) {
        setRequests(data.requests || []);
      } else {
        setErrorMsg("Failed to retrieve follow requests.");
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
      setErrorMsg("Connection issue. Unable to load follow requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (followerId, action) => {
    setActionLoadingId(followerId);
    setErrorMsg("");
    try {
      const endpoint =
        action === "accept"
          ? `/v1/follows/requests/${followerId}/accept`
          : `/v1/follows/requests/${followerId}/reject`;

      const method = action === "accept" ? "put" : "delete";

      const { data } = await apiClient[method](endpoint);
      if (data.success) {
        // Remove from list optimistically
        setRequests((prev) => prev.filter((req) => req.id !== followerId));
      } else {
        setErrorMsg(`Failed to ${action} follow request.`);
      }
    } catch (err) {
      console.error(`Request action error:`, err);
      setErrorMsg(`An error occurred. Unable to ${action} request.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink-100 border-t-amber-500" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="rounded-md bg-error-100 p-4 border border-error-500 text-error-500 font-ui text-xs font-semibold">
        {errorMsg}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-6 border border-dashed border-border-default rounded-md bg-surface-sunken/10">
        <p className="font-ui text-xs text-ink-400 font-semibold">
          No pending follow requests.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-ui text-sm font-bold text-ink-900 mb-2">
        Pending Requests ({requests.length})
      </h3>
      <div className="divide-y divide-border-default border border-border-default rounded-md bg-surface-white">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-4 gap-4"
          >
            <div className="flex items-center gap-3">
              <VamiAvatar
                src={request.avatar_url}
                name={request.display_name || request.username}
                size="md"
              />
              <div>
                <span className="block font-ui text-sm font-bold text-ink-900 leading-tight">
                  {request.display_name || request.username}
                </span>
                <span className="block font-ui text-xs text-ink-400">
                  @{request.username}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <VamiButton
                variant="primary"
                onClick={() => handleAction(request.id, "accept")}
                disabled={actionLoadingId !== null}
                isLoading={actionLoadingId === request.id}
                className="py-1 px-3 text-xs font-bold"
              >
                Approve
              </VamiButton>
              <VamiButton
                variant="secondary"
                onClick={() => handleAction(request.id, "reject")}
                disabled={actionLoadingId !== null}
                className="py-1 px-3 text-xs font-bold"
              >
                Ignore
              </VamiButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
