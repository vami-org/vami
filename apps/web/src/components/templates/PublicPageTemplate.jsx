import React from "react";
import { Outlet } from "react-router-dom";
import { TopNavigation } from "../organisms/TopNavigation";

/**
 * PublicPageTemplate layout wrapper.
 * Integrates TopNavigation and handles standard guest container sizing.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Children elements
 * @returns {React.JSX.Element}
 */
export function PublicPageTemplate({ children }) {
  return (
    <div className="min-h-screen bg-surface-warm transition-colors duration-300 font-ui text-ink-800">
      <TopNavigation />
      <main className="pt-[64px] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children || <Outlet />}
      </main>
    </div>
  );
}
