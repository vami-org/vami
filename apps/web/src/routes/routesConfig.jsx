import React from "react";

// Lazy-loaded page components
const Login = React.lazy(() =>
  import("../pages/Login").then((module) => ({ default: module.Login })),
);
const Verify = React.lazy(() =>
  import("../pages/Verify").then((module) => ({ default: module.Verify })),
);
const Dashboard = React.lazy(() =>
  import("../pages/Dashboard").then((module) => ({
    default: module.Dashboard,
  })),
);
const DevSandbox = React.lazy(() =>
  import("../pages/DevSandbox").then((module) => ({
    default: module.DevSandbox,
  })),
);
const UserProfile = React.lazy(() =>
  import("../pages/UserProfile").then((module) => ({
    default: module.UserProfile,
  })),
);
const NotFound = React.lazy(() =>
  import("../pages/NotFound").then((module) => ({ default: module.NotFound })),
);

/**
 * Scalable routes configuration dictionary.
 * Group routing tables by domains or resource domains as needed.
 */
export const routesConfig = [
  {
    path: "/login",
    element: <Login />,
    layout: "auth",
    protected: false,
    title: "Sign In",
  },
  {
    path: "/auth/verify",
    element: <Verify />,
    layout: "auth",
    protected: false,
    title: "Verify Session",
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    layout: "authenticated",
    protected: true,
    title: "Cockpit Dashboard",
  },
  {
    path: "/dev-sandbox",
    element: <DevSandbox />,
    layout: "authenticated",
    protected: false,
    title: "Developer Sandbox",
  },
  {
    path: "/users/:username",
    element: <UserProfile />,
    layout: "public",
    protected: false,
    title: "User Profile",
  },
  {
    path: "*",
    element: <NotFound />,
    layout: "error",
    protected: false,
    title: "Page Not Found",
  },
];
