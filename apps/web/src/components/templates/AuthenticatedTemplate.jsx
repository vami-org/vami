import React from "react";
import { Outlet } from "react-router-dom";
import { TopNavigation } from "../organisms/TopNavigation";

/**
 * AuthenticatedTemplate layout wrapper.
 * Mandates TopNavigation, authenticated sidebar layouts, and body layouts.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Children elements
 * @returns {React.JSX.Element}
 */
export function AuthenticatedTemplate({ children }) {
  return (
    <div className="min-h-screen bg-surface-warm transition-colors duration-300 font-ui text-ink-800">
      <TopNavigation />
      <main className="pt-[64px] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children || <Outlet />}
      </main>
    </div>
  );
}
