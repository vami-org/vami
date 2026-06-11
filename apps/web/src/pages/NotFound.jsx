import React from "react";
import { Link } from "react-router-dom";
import { ErrorTemplate } from "../components/templates/ErrorTemplate";

/**
 * NotFound page displaying 404 error routes.
 *
 * @returns {React.JSX.Element}
 */
export function NotFound() {
  return (
    <ErrorTemplate>
      <div className="flex flex-col items-center">
        {/* Error icon */}
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

        {/* Title */}
        <h1 className="font-ui text-2xl font-bold text-ink-900">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-ink-600 max-w-sm mb-6 leading-relaxed">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        {/* Return Button */}
        <Link
          to="/dashboard"
          className="w-full flex h-10 items-center justify-center rounded-lg bg-ink-900 px-4 text-xs font-bold text-surface-white hover:bg-ink-800 transition-all active:scale-95 shadow-sm"
        >
          Return to Dashboard
        </Link>
      </div>
    </ErrorTemplate>
  );
}
