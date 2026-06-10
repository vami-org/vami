import React, { useState, useEffect } from "react";
import "./styles/globals.css";
import "./styles/typography.css";

export default function App() {
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
    <div style={{ padding: "2rem var(--space-8)" }}>
      {/* Header Layout */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "var(--max-width-page)",
          margin: "0 auto var(--space-8) auto",
          borderBottom:
            "var(--border-width-thin) solid var(--border-color-default)",
          paddingBottom: "var(--space-4)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontWeight: "var(--weight-extrabold)",
            fontSize: "var(--text-2xl)",
            color: "var(--color-ink-900)",
          }}
        >
          VAMI
        </span>
        <button
          onClick={toggleTheme}
          style={{
            fontFamily: "var(--font-ui)",
            fontWeight: "var(--weight-semibold)",
            fontSize: "var(--text-sm)",
            backgroundColor: "var(--color-ink-900)",
            color: "var(--color-surface-white)",
            border: "none",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-2) var(--space-4)",
            cursor: "pointer",
            transition: "opacity var(--duration-fast) var(--ease-default)",
          }}
          className="theme-toggle-btn"
        >
          Toggle {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </header>

      {/* Main Content (Centered Article Layout) */}
      <main className="article-container">
        <article>
          <h1 className="article-title">Week 2: Design Tokens & CI/CD</h1>
          <p
            style={{
              color: "var(--color-ink-600)",
              marginBottom: "var(--space-6)",
              fontFamily: "var(--font-ui)",
              fontSize: "var(--text-sm)",
            }}
          >
            Published on June 10, 2026 • 2 min read
          </p>

          <div className="article-body">
            <p>
              Welcome to the foundation of the VAMI platform! In this second
              week, we have established our CSS custom property design tokens.
              This includes color scales (Ink, Amber, Surface, Semantic), font
              properties, margins, paddings, borders, shadows, and transition
              attributes.
            </p>
            <p>
              By utilizing these CSS variables in components, we ensure that
              changing themes is as simple as toggling a data attribute on the
              HTML element. Dark mode is dynamically rendered without
              duplicating stylesheets or adding inline Tailwind helper strings.
            </p>

            <h2
              style={{
                fontSize: "var(--text-2xl)",
                marginBottom: "var(--space-4)",
                color: "var(--color-ink-900)",
              }}
            >
              Example Code Block
            </h2>
            <pre className="code-block">
              {`:root {
  --color-ink-900: #1c1c1e;
  --color-amber-500: #f5a623;
  --color-surface-warm: #f9f8f5;
}`}
            </pre>

            <p>
              Next, we will proceed to Phase 1 (Week 3 onwards) to design our
              database schema, node migrations, and backend authentication
              layers. Keep building!
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
