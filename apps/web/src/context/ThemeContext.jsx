import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("vami-theme") || "system";
  });

  const [activeTheme, setActiveTheme] = useState("light");

  const setTheme = (newTheme) => {
    if (newTheme === "light" || newTheme === "dark" || newTheme === "system") {
      setThemeState(newTheme);
      localStorage.setItem("vami-theme", newTheme);
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      let resolvedTheme = "light";

      if (theme === "dark") {
        resolvedTheme = "dark";
      } else if (theme === "light") {
        resolvedTheme = "light";
      } else if (theme === "system") {
        resolvedTheme = mediaQuery
          ? mediaQuery.matches
            ? "dark"
            : "light"
          : "light";
      }

      setActiveTheme(resolvedTheme);
      document.documentElement.setAttribute("data-theme", resolvedTheme);
    };

    updateTheme();

    // Add listener for OS preferences changing in real-time
    const listener = () => {
      if (theme === "system") {
        updateTheme();
      }
    };

    if (mediaQuery) {
      mediaQuery.addEventListener("change", listener);
    }
    return () => {
      if (mediaQuery) {
        mediaQuery.removeEventListener("change", listener);
      }
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, activeTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
