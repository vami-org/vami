import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollRestoration } from "./components/ScrollRestoration";
import { TitleManager } from "./components/TitleManager";
import { routesConfig } from "./routes/routesConfig";
import { VamiSpinner } from "./components/atoms/VamiSpinner";
import { AuthenticatedTemplate } from "./components/templates/AuthenticatedTemplate";
import { PublicPageTemplate } from "./components/templates/PublicPageTemplate";
import { AuthTemplate } from "./components/templates/AuthTemplate";
import { ErrorTemplate } from "./components/templates/ErrorTemplate";

import "./styles/globals.css";
import "./styles/typography.css";

// Resolve template elements by layout keys dynamically
const layoutMap = {
  authenticated: AuthenticatedTemplate,
  public: PublicPageTemplate,
  auth: AuthTemplate,
  error: ErrorTemplate,
};

function RouteWrapper({ route }) {
  let content = route.element;

  // Apply ProtectedRoute wrapper if authentication required
  if (route.protected) {
    content = <ProtectedRoute>{content}</ProtectedRoute>;
  }

  // Apply corresponding Layout Template
  const Layout = layoutMap[route.layout];
  if (Layout) {
    // Note: Since AuthTemplate and ErrorTemplate are already rendered inside
    // their subpages (Login, Verify, NotFound, ServerError) to support granular titles/props,
    // we only wrap layout: "auth" and "error" if we don't want page-specific control.
    // However, to keep it clean and robust, we can just let layout wrap them here,
    // or keep them self-wrapped.
    // To prevent double nesting for pages already wrapping themselves:
    if (route.layout !== "auth" && route.layout !== "error") {
      content = <Layout>{content}</Layout>;
    }
  }

  return content;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            {/* Navigation side effects */}
            <ScrollRestoration />
            <TitleManager />

            {/* Suspense fallback for chunk lazy loading */}
            <Suspense
              fallback={
                <div className="flex h-screen items-center justify-center bg-surface-warm transition-colors duration-300">
                  <VamiSpinner size="lg" />
                </div>
              }
            >
              <Routes>
                {routesConfig.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<RouteWrapper route={route} />}
                  />
                ))}
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
