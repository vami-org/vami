import React, { useState, useEffect } from "react";
import "../styles/globals.css";
import "../styles/typography.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function DevSandbox() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Auth Sandbox states
  const [email, setEmail] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Read verification token from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setTokenInput(token);
      setMessage(
        "✓ Verification token detected in URL! Click 'Verify Magic Link' to login.",
      );
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleRequestMagicLink = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage("");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/auth/magic-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(
          "✨ Magic link sent! Check MailHog (http://localhost:8025) for the link.",
        );
      } else {
        setErrorMsg(data.error || "Failed to send magic link");
      }
    } catch (err) {
      setErrorMsg(
        "Network error: Make sure the API server is running on port 3000",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMagicLink = async (e) => {
    e.preventDefault();
    if (!tokenInput) return;
    setLoading(true);
    setMessage("");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/auth/verify-magic-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAccessToken(data.accessToken);
        setUser(data.user);
        setMessage("🎉 Logged in successfully!");
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      } else {
        setErrorMsg(data.error || "Verification failed");
      }
    } catch (err) {
      setErrorMsg("Network error verifying token");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchProfile = async () => {
    if (!accessToken) {
      setErrorMsg("Please login first to get an access token.");
      return;
    }
    setLoading(true);
    setMessage("");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setMessage(
          "✓ Successfully fetched profile from protected route GET /auth/me!",
        );
      } else {
        setErrorMsg(data.error || "Failed to fetch profile");
      }
    } catch (err) {
      setErrorMsg("Network error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    setLoading(true);
    setMessage("");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAccessToken(data.accessToken);
        setMessage("🔄 Refresh Token Rotated! New Access Token issued.");
      } else {
        setErrorMsg(data.error || "Failed to rotate tokens");
      }
    } catch (err) {
      setErrorMsg("Network error rotating tokens");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthMockLogin = async (provider) => {
    setLoading(true);
    setMessage("");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/auth/oauth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, code: `mock_${provider}_auth_code` }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAccessToken(data.accessToken);
        setUser(data.user);
        setMessage(`🎉 Logged in with Mock ${provider.toUpperCase()}!`);
      } else {
        setErrorMsg(data.error || "Mock OAuth failed");
      }
    } catch (err) {
      setErrorMsg("Network error during OAuth");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setMessage("");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAccessToken("");
        setUser(null);
        setTokenInput("");
        setMessage("👋 Logged out successfully. Refresh cookies cleared.");
      } else {
        setErrorMsg(data.error || "Logout failed");
      }
    } catch (err) {
      setErrorMsg("Network error during logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem var(--space-8)" }}>
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
          VAMI DEVPORTAL
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

      <main
        className="article-container"
        style={{ maxWidth: "800px", margin: "0 auto" }}
      >
        <h1
          className="article-title"
          style={{ textAlign: "center", marginBottom: "var(--space-6)" }}
        >
          Week 4: Authentication Sandbox
        </h1>

        {message && (
          <div
            style={{
              backgroundColor: "rgba(52, 199, 89, 0.15)",
              color: "#34c759",
              border: "1px solid #34c759",
              padding: "var(--space-4)",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--space-6)",
              fontFamily: "var(--font-ui)",
              fontSize: "var(--text-sm)",
            }}
          >
            {message}
          </div>
        )}
        {errorMsg && (
          <div
            style={{
              backgroundColor: "rgba(255, 59, 48, 0.15)",
              color: "#ff3b30",
              border: "1px solid #ff3b30",
              padding: "var(--space-4)",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--space-6)",
              fontFamily: "var(--font-ui)",
              fontSize: "var(--text-sm)",
            }}
          >
            {errorMsg}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-6)",
            marginBottom: "var(--space-8)",
          }}
        >
          <section
            style={{
              border:
                "var(--border-width-thin) solid var(--border-color-default)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-6)",
              backgroundColor: "var(--color-surface-warm)",
            }}
          >
            <h2
              style={{
                fontSize: "var(--text-lg)",
                marginBottom: "var(--space-4)",
                color: "var(--color-ink-900)",
              }}
            >
              Step 1: Request Magic Link
            </h2>
            <form
              onSubmit={handleRequestMagicLink}
              style={{ display: "flex", gap: "var(--space-4)" }}
            >
              <input
                type="email"
                placeholder="Enter email (e.g. dev@vami.org)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  border:
                    "var(--border-width-thin) solid var(--border-color-default)",
                  fontFamily: "var(--font-ui)",
                  fontSize: "var(--text-sm)",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "var(--color-ink-900)",
                  color: "var(--color-surface-white)",
                  padding: "var(--space-3) var(--space-6)",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-ui)",
                  fontWeight: "var(--weight-semibold)",
                  fontSize: "var(--text-sm)",
                  cursor: "pointer",
                }}
              >
                Send Email
              </button>
            </form>
          </section>

          <section
            style={{
              border:
                "var(--border-width-thin) solid var(--border-color-default)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-6)",
              backgroundColor: "var(--color-surface-warm)",
            }}
          >
            <h2
              style={{
                fontSize: "var(--text-lg)",
                marginBottom: "var(--space-4)",
                color: "var(--color-ink-900)",
              }}
            >
              Step 2: Verify Token & Log In
            </h2>
            <form
              onSubmit={handleVerifyMagicLink}
              style={{ display: "flex", gap: "var(--space-4)" }}
            >
              <input
                type="text"
                placeholder="Enter verification token"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  border:
                    "var(--border-width-thin) solid var(--border-color-default)",
                  fontFamily: "var(--font-ui)",
                  fontSize: "var(--text-sm)",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "var(--color-amber-500)",
                  color: "var(--color-ink-900)",
                  padding: "var(--space-3) var(--space-6)",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-ui)",
                  fontWeight: "var(--weight-bold)",
                  fontSize: "var(--text-sm)",
                  cursor: "pointer",
                }}
              >
                Verify Token
              </button>
            </form>
          </section>

          <section
            style={{
              border:
                "var(--border-width-thin) solid var(--border-color-default)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-6)",
              backgroundColor: "var(--color-surface-warm)",
            }}
          >
            <h2
              style={{
                fontSize: "var(--text-lg)",
                marginBottom: "var(--space-4)",
                color: "var(--color-ink-900)",
              }}
            >
              Alternative: Third-Party Mock Login
            </h2>
            <div style={{ display: "flex", gap: "var(--space-4)" }}>
              <button
                onClick={() => handleOAuthMockLogin("google")}
                disabled={loading}
                style={{
                  flex: 1,
                  backgroundColor: "#ea4335",
                  color: "#ffffff",
                  padding: "var(--space-3)",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-ui)",
                  fontWeight: "var(--weight-semibold)",
                  cursor: "pointer",
                }}
              >
                Login with Google (Mock)
              </button>
              <button
                onClick={() => handleOAuthMockLogin("github")}
                disabled={loading}
                style={{
                  flex: 1,
                  backgroundColor: "#24292e",
                  color: "#ffffff",
                  padding: "var(--space-3)",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-ui)",
                  fontWeight: "var(--weight-semibold)",
                  cursor: "pointer",
                }}
              >
                Login with GitHub (Mock)
              </button>
            </div>
          </section>

          {accessToken && (
            <section
              style={{
                border:
                  "var(--border-width-thin) solid var(--border-color-default)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-6)",
                backgroundColor: "var(--color-surface-warm)",
              }}
            >
              <h2
                style={{
                  fontSize: "var(--text-lg)",
                  marginBottom: "var(--space-4)",
                  color: "var(--color-ink-900)",
                }}
              >
                Active Session
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-4)",
                }}
              >
                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-ink-500)",
                      textTransform: "uppercase",
                    }}
                  >
                    Access Token
                  </strong>
                  <pre
                    style={{
                      backgroundColor: "var(--color-surface-white)",
                      padding: "var(--space-3)",
                      borderRadius: "var(--radius-md)",
                      overflowX: "auto",
                      fontSize: "var(--text-xs)",
                      wordBreak: "break-all",
                    }}
                  >
                    {accessToken}
                  </pre>
                </div>

                {user && (
                  <div>
                    <strong
                      style={{
                        display: "block",
                        fontSize: "var(--text-xs)",
                        color: "var(--color-ink-500)",
                        textTransform: "uppercase",
                      }}
                    >
                      User Details (req.user Profile)
                    </strong>
                    <pre
                      style={{
                        backgroundColor: "var(--color-surface-white)",
                        padding: "var(--space-3)",
                        borderRadius: "var(--radius-md)",
                        overflowX: "auto",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      {JSON.stringify(user, null, 2)}
                    </pre>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-4)",
                    marginTop: "var(--space-2)",
                  }}
                >
                  <button
                    onClick={handleFetchProfile}
                    disabled={loading}
                    style={{
                      flex: 1,
                      backgroundColor: "var(--color-ink-800)",
                      color: "#fff",
                      padding: "var(--space-3)",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      fontFamily: "var(--font-ui)",
                      fontWeight: "var(--weight-semibold)",
                      cursor: "pointer",
                    }}
                  >
                    Fetch Profile (Me)
                  </button>
                  <button
                    onClick={handleRefreshToken}
                    disabled={loading}
                    style={{
                      flex: 1,
                      backgroundColor: "var(--color-ink-800)",
                      color: "#fff",
                      padding: "var(--space-3)",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      fontFamily: "var(--font-ui)",
                      fontWeight: "var(--weight-semibold)",
                      cursor: "pointer",
                    }}
                  >
                    Rotate Token (Refresh)
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    style={{
                      flex: 1,
                      backgroundColor: "#ff3b30",
                      color: "#fff",
                      padding: "var(--space-3)",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      fontFamily: "var(--font-ui)",
                      fontWeight: "var(--weight-semibold)",
                      cursor: "pointer",
                    }}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
