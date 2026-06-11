import React from "react";
import { Link, Outlet } from "react-router-dom";

/**
 * ErrorTemplate layout wrapper.
 * Provides centered cards and decorative backdrops for error status reporting.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Children elements
 * @returns {React.JSX.Element}
 */
export function ErrorTemplate({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-surface-warm p-6 transition-colors duration-300 font-ui text-ink-800">
      {/* Decorative gradient backdrops */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 h-[80vw] w-[80vw] rounded-full bg-radial from-error-100/20 to-transparent dark:from-error-500/5" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[80vw] w-[80vw] rounded-full bg-radial from-ink-100/40 to-transparent dark:from-ink-900/10" />
      </div>

      {/* Top Header */}
      <header className="absolute top-6 left-6">
        <Link
          to="/dashboard"
          className="font-ui text-xl font-extrabold tracking-tight text-ink-900 flex items-center gap-2"
        >
          <svg
            className="h-6 w-6 text-amber-500 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 22h20L12 2zm0 4l6.4 12.8H5.6L12 6z" />
          </svg>
          <span>VAMI</span>
        </Link>
      </header>

      {/* Centered Error Container */}
      <main className="w-full max-w-lg z-10">
        <div className="rounded-xl border border-border-default bg-surface-elevated/85 p-8 shadow-xl backdrop-blur-md text-center">
          {children || <Outlet />}
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 font-ui text-xs text-ink-400 font-medium">
        &copy; {new Date().getFullYear()} Vami. All rights reserved.
      </footer>
    </div>
  );
}
