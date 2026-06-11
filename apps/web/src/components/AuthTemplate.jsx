import React, { useState, useEffect } from "react";

export function AuthTemplate({
  children,
  subtitle = "Sign in to your account",
}) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-surface-warm p-6 transition-colors duration-300">
      {/* Decorative background radial gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 h-[80vw] w-[80vw] rounded-full bg-radial from-amber-100/30 to-transparent dark:from-amber-500/5" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[80vw] w-[80vw] rounded-full bg-radial from-ink-100/40 to-transparent dark:from-ink-900/10" />
      </div>

      {/* Top Header / Mode Switcher */}
      <header className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <span className="font-ui text-xl font-extrabold tracking-tight text-ink-900">
          VAMI
        </span>
        <button
          onClick={toggleTheme}
          className="flex h-10 items-center justify-center rounded-md border border-border-strong bg-surface-elevated px-4 font-ui text-xs font-semibold text-ink-800 transition-all hover:bg-ink-050 active:scale-95 cursor-pointer shadow-sm"
        >
          {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </header>

      {/* Glassmorphic Login Card */}
      <main className="w-full max-w-[440px] z-10">
        <div className="rounded-xl border border-border-default bg-surface-elevated/80 p-8 shadow-xl backdrop-blur-md transition-colors duration-300">
          {/* Logo Brand Title */}
          <div className="mb-8 text-center">
            <h1 className="font-ui text-3xl font-extrabold tracking-tight text-ink-900">
              VAMI
            </h1>
            <p className="mt-2 font-ui text-sm text-ink-600 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Child content (e.g. Login form) */}
          {children}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="absolute bottom-6 font-ui text-xs text-ink-400 font-medium">
        &copy; {new Date().getFullYear()} Vami. All rights reserved.
      </footer>
    </div>
  );
}
