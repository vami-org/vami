import React from "react";

/**
 * VamiSpinner component for indeterminate spinning loaders.
 * Supports multiple sizes from sm to xl.
 *
 * @param {Object} props
 * @param {string} [props.size='md'] - Spinner scale size ('sm', 'md', 'lg', 'xl')
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function VamiSpinner({ size = "md", className = "", ...props }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const sizeClass = sizes[size] || sizes.md;

  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      className={`animate-spin text-ink-900 shrink-0 ${sizeClass} ${className}`}
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
