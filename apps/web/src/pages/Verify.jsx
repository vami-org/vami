import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthTemplate } from "../components/AuthTemplate";
import { VamiButton } from "../components/VamiButton";

export function Verify() {
  const { verifyEmailToken } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);

  // Use a ref to prevent double-execution in React 19 StrictMode
  const verificationAttempted = useRef(false);

  useEffect(() => {
    if (verificationAttempted.current) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setErrorMsg("Verification token is missing in the URL.");
      setIsVerifying(false);
      return;
    }

    async function attemptVerification() {
      verificationAttempted.current = true;
      try {
        const result = await verifyEmailToken(token);
        if (result.success) {
          navigate("/dashboard", { replace: true });
        } else {
          setErrorMsg(result.error || "Token is invalid or expired.");
        }
      } catch (err) {
        setErrorMsg(
          err.response?.data?.error ||
            "A connection issue occurred while verifying your link.",
        );
      } finally {
        setIsVerifying(false);
      }
    }

    attemptVerification();
  }, [verifyEmailToken, navigate]);

  if (isVerifying) {
    return (
      <AuthTemplate subtitle="Verifying code link">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-ink-100 border-t-amber-500 mb-6" />
          <p className="font-ui text-sm font-semibold text-ink-800 animate-pulse">
            Authenticating and initializing your session...
          </p>
        </div>
      </AuthTemplate>
    );
  }

  return (
    <AuthTemplate subtitle="Authentication failed">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error-100 text-error-500">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="font-ui text-sm font-medium text-ink-800 leading-relaxed">
          {errorMsg}
        </p>
        <p className="mt-2 font-ui text-xs text-ink-500 leading-relaxed mb-6">
          The link might have expired (valid for 15 minutes) or been used
          already. Please request a new magic link.
        </p>
        <VamiButton
          variant="primary"
          onClick={() => navigate("/login", { replace: true })}
          className="w-full justify-center"
        >
          Return to Sign In
        </VamiButton>
      </div>
    </AuthTemplate>
  );
}
