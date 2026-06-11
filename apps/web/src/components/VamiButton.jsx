import React from "react";

export function VamiButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  icon = null,
  className = "",
  ...props
}) {
  // Base theme classes
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-md font-ui text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none py-3 px-6 active:scale-98";

  const variants = {
    primary: "bg-ink-900 text-surface-white hover:bg-ink-800",
    secondary:
      "bg-surface-white text-ink-900 border border-border-strong hover:bg-ink-050",
    ghost: "bg-transparent text-ink-800 hover:bg-ink-050",
    danger: "bg-error-500 text-surface-white hover:bg-opacity-90",
  };

  // Google SVG Icon
  const googleIcon = (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 5.04c1.67 0 3.17.58 4.35 1.71l3.25-3.25C17.63 1.58 14.97 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.85 3C6.25 7.54 8.87 5.04 12 5.04z"
      />
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.48c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.69-4.91 3.69-8.58z"
      />
      <path
        fill="#FBBC05"
        d="M5.35 14.5c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 6.9C.54 8.82 0 10.96 0 13.2s.54 4.38 1.5 6.3l3.85-3z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1-3.13 0-5.75-2.5-6.65-5.46L1.5 15.86C3.4 19.7 7.35 23 12 23z"
      />
    </svg>
  );

  // GitHub SVG Icon
  const githubIcon = (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );

  const resolveIcon = () => {
    if (isLoading) {
      return (
        <svg
          className="h-4.5 w-4.5 animate-spin text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );
    }
    if (icon === "google") return googleIcon;
    if (icon === "github") return githubIcon;
    return icon;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {resolveIcon()}
      {children}
    </button>
  );
}
