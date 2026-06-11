import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Verify } from "./pages/Verify";
import { Dashboard } from "./pages/Dashboard";
import { DevSandbox } from "./pages/DevSandbox";

import "./styles/globals.css";
import "./styles/typography.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/verify" element={<Verify />} />

          {/* Protected Application Cockpit */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Developer Sandbox Testing route */}
          <Route path="/dev-sandbox" element={<DevSandbox />} />

          {/* Root Redirect mapping */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Wildcard Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
