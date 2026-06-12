import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { AuthTemplate } from "../components/templates/AuthTemplate";
import { VamiButton } from "../components/atoms/VamiButton";

export function Login() {
  const { loginWithEmail, loginWithOAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleMagicLinkSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMsg("");
    try {
      const result = await loginWithEmail(email);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setErrorMsg(result.error || "Failed to send magic link");
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error ||
          "Network error. Make sure the server is running.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      // In development/local env, we login using the mock credentials provided by the backend API
      const result = await loginWithOAuth(
        provider,
        `mock_${provider}_auth_code`,
      );
      if (result.success) {
        // Redirection is handled by the App component routing since state changes
        window.location.href = "/dashboard";
      } else {
        setErrorMsg(result.error || `${provider} authentication failed`);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error || `Failed to authenticate with ${provider}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthTemplate subtitle="Check your email">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-500">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5"
              />
            </svg>
          </div>
          <p className="font-ui text-sm font-medium text-ink-800">
            We sent a secure sign-in link to:
          </p>
          <p className="mt-1 font-ui text-sm font-bold text-ink-900">{email}</p>
          <div className="my-6 rounded-md bg-surface-sunken p-4 text-left border border-border-default">
            <p className="font-ui text-xs text-ink-600 leading-relaxed">
              💡 **For Local Developers:**
              <br />
              Magic links are captured locally. Open MailHog at{" "}
              <a
                href="http://localhost:8025"
                target="_blank"
                rel="noreferrer"
                className="underline font-bold text-amber-500 hover:text-amber-400"
              >
                http://localhost:8025
              </a>{" "}
              to click the link and complete your sign-in.
            </p>
          </div>
          <VamiButton
            variant="secondary"
            onClick={() => setIsSubmitted(false)}
            className="w-full"
          >
            Back to Sign In
          </VamiButton>
        </div>
      </AuthTemplate>
    );
  }

  return (
    <AuthTemplate subtitle="Sign in to your account">
      {errorMsg && (
        <div className="mb-6 rounded-md bg-error-100 p-4 border border-error-500 text-error-500 font-ui text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Magic Link Form */}
      <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block font-ui text-xs font-bold uppercase tracking-wider text-ink-400 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full rounded-md border border-border-default bg-surface-white px-4 py-3 font-ui text-sm text-ink-900 transition focus-visible:outline-border-focus disabled:opacity-50"
          />
        </div>

        <VamiButton
          type="submit"
          isLoading={isLoading}
          disabled={!email}
          className="w-full justify-center"
        >
          Send Magic Link
        </VamiButton>
      </form>

      {/* Divider */}
      <div className="relative my-8 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-default" />
        </div>
        <span className="relative bg-surface-elevated px-4 font-ui text-xs font-bold uppercase tracking-wider text-ink-400">
          Or continue with
        </span>
      </div>

      {/* OAuth Buttons Grid */}
      <div className="grid grid-cols-2 gap-4">
        <VamiButton
          variant="secondary"
          icon="google"
          onClick={() => handleOAuthLogin("google")}
          disabled={isLoading}
          className="w-full font-bold shadow-sm"
        >
          Google
        </VamiButton>
        <VamiButton
          variant="secondary"
          icon="github"
          onClick={() => handleOAuthLogin("github")}
          disabled={isLoading}
          className="w-full font-bold shadow-sm"
        >
          GitHub
        </VamiButton>
      </div>
    </AuthTemplate>
  );
}
