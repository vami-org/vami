import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { NavItem } from "./components/molecules/NavItem";
import { TopNavigation } from "./components/organisms/TopNavigation";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useAuth } from "./hooks/useAuth";
import { ServerError } from "./pages/ServerError";

// Mock matchMedia for window theme matching
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock useAuth hook
vi.mock("./hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

// Helper component to test useTheme hook context values
function ThemeTester() {
  const { theme, activeTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-val">{theme}</span>
      <span data-testid="active-theme">{activeTheme}</span>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
      <button onClick={() => setTheme("system")}>Set System</button>
    </div>
  );
}

describe("App Shell, Nav, Layout & Theme tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");

    // Redefine matchMedia mock since vi.restoreAllMocks() clears global vi.fn() implementations
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: "u1", username: "creator1", is_creator: true },
      logout: vi.fn(),
    });
  });

  describe("ThemeContext & persistent preferences", () => {
    it("should default to system configuration", () => {
      render(
        <ThemeProvider>
          <ThemeTester />
        </ThemeProvider>,
      );
      expect(screen.getByTestId("theme-val").textContent).toBe("system");
      expect(screen.getByTestId("active-theme").textContent).toBe("light");
      expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    });

    it("should change theme and persist to localStorage", () => {
      render(
        <ThemeProvider>
          <ThemeTester />
        </ThemeProvider>,
      );

      fireEvent.click(screen.getByText("Set Dark"));
      expect(screen.getByTestId("theme-val").textContent).toBe("dark");
      expect(screen.getByTestId("active-theme").textContent).toBe("dark");
      expect(localStorage.getItem("vami-theme")).toBe("dark");
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    });
  });

  describe("NavItem component", () => {
    it("should render NavItem label and icon", () => {
      render(
        <BrowserRouter>
          <NavItem to="/test" icon="home">
            Test Link
          </NavItem>
        </BrowserRouter>,
      );
      expect(screen.getByText("Test Link")).toBeDefined();
    });
  });

  describe("TopNavigation & MobileNavDrawer integration", () => {
    it("should render TopNavigation logo, write button, and search input", () => {
      render(
        <ThemeProvider>
          <BrowserRouter>
            <TopNavigation />
          </BrowserRouter>
        </ThemeProvider>,
      );

      expect(screen.getByText("VAMI")).toBeDefined();
      expect(screen.getByPlaceholderText("Search articles...")).toBeDefined();
      expect(screen.getByText("Write")).toBeDefined();
    });

    it("should open mobile drawer on hamburger button click", () => {
      render(
        <ThemeProvider>
          <BrowserRouter>
            <TopNavigation />
          </BrowserRouter>
        </ThemeProvider>,
      );

      // Trigger drawer menu toggle
      const menuButton = screen.getByLabelText("Open navigation menu");
      fireEvent.click(menuButton);

      // Check drawer elements render
      expect(screen.getByText("Interface Theme")).toBeDefined();
    });
  });

  describe("ErrorBoundary component & ServerError interface", () => {
    it("should render children when no errors occur", () => {
      render(
        <ErrorBoundary>
          <div data-testid="healthy">Healthy Children</div>
        </ErrorBoundary>,
      );
      expect(screen.getByTestId("healthy").textContent).toBe(
        "Healthy Children",
      );
    });

    it("should render ServerError interface when passed an error object", () => {
      const mockError = new Error("Simulated test database failure");
      render(
        <BrowserRouter>
          <ServerError error={mockError} />
        </BrowserRouter>,
      );

      expect(screen.getByText("Internal Server Error")).toBeDefined();
      expect(screen.getByText("Simulated test database failure")).toBeDefined();
    });
  });
});
