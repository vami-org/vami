import React from "react";

/**
 * VamiIconButton component for circular icons.
 * Enforces accessibility rules by warning if aria-label is missing in non-production.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.variant='secondary'] - Visual variant ('primary', 'secondary', 'ghost', 'danger')
 * @param {string} [props.size='md'] - Visual size scale ('sm', 'md', 'lg')
 * @param {boolean} [props.isLoading=false] - Show loading state spinner
 * @param {boolean} [props.disabled=false] - Disable interactions
 * @param {function} [props.onClick] - Click handler callback
 * @param {string} [props.className=''] - Additional classnames
 * @returns {React.JSX.Element}
 */
export function VamiIconButton({
  children,
  variant = "secondary",
  size = "md",
  isLoading = false,
  disabled = false,
  onClick,
  className = "",
  ...props
}) {
  // Enforce aria-label for accessibility in development
  if (
    import.meta.env?.DEV &&
    !props["aria-label"] &&
    !props["aria-labelledby"]
  ) {
    console.warn(
      "VamiIconButton: Missing required accessibility prop: 'aria-label' or 'aria-labelledby' is required for icon-only buttons.",
    );
  }

  const baseClasses =
    "inline-flex items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none active:scale-95";

  const variants = {
    primary: "bg-ink-900 text-surface-white hover:bg-ink-800",
    secondary:
      "bg-surface-white text-ink-900 border border-border-strong hover:bg-ink-050",
    ghost: "bg-transparent text-ink-800 hover:bg-ink-050",
    danger: "bg-error-500 text-surface-white hover:bg-opacity-90",
  };

  const sizes = {
    sm: "h-8 w-8 text-xs p-1",
    md: "h-10 w-10 text-sm p-2",
    lg: "h-12 w-12 text-base p-3",
  };

  const sizeClass = sizes[size] || sizes.md;
  const variantClass = variants[variant] || variants.secondary;

  const spinner = (
    <svg
      className="animate-spin text-current h-4 w-4"
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

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {isLoading ? spinner : children}
    </button>
  );
}
