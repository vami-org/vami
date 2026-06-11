import React from "react";
import { ErrorTemplate } from "../components/templates/ErrorTemplate";
import { VamiButton } from "../components/atoms/VamiButton";

/**
 * ServerError page displaying 500 errors.
 *
 * @param {Object} props
 * @param {Error} [props.error] - Runtime error object caught by ErrorBoundary
 * @returns {React.JSX.Element}
 */
export function ServerError({ error }) {
  const isDev = import.meta.env.DEV;

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <ErrorTemplate>
      <div className="flex flex-col items-center">
        {/* Error/Warning Icon */}
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

        {/* Title & Description */}
        <h1 className="font-ui text-2xl font-bold text-ink-900">
          Internal Server Error
        </h1>
        <p className="mt-2 text-sm text-ink-600 max-w-sm mb-6 leading-relaxed">
          Something went wrong on our end. We have been notified and are looking
          into it.
        </p>

        {/* Development debug info panel */}
        {isDev && error && (
          <div className="w-full text-left bg-surface-sunken p-4 rounded-lg border border-border-default mb-6 font-mono text-xs text-error-500 overflow-auto max-h-48 whitespace-pre-wrap select-text">
            <div className="font-bold border-b border-border-default pb-1 mb-2">
              Debug Info: {error.name || "Error"}
            </div>
            {error.message}
            {error.stack && (
              <div className="mt-2 opacity-80 overflow-x-auto">
                {error.stack}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 w-full">
          <VamiButton
            variant="secondary"
            onClick={() => (window.location.href = "/dashboard")}
            className="flex-1 justify-center"
          >
            Back to Dashboard
          </VamiButton>
          <VamiButton
            variant="primary"
            onClick={handleReload}
            className="flex-1 justify-center"
          >
            Reload Page
          </VamiButton>
        </div>
      </div>
    </ErrorTemplate>
  );
}
