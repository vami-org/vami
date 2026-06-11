import React from "react";

/**
 * VamiTag component for interactive keyword chips.
 * Supports dismissal close triggers and focus outline states.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Tag text content
 * @param {string} [props.variant='default'] - Tag color style ('default', 'primary', 'success', 'error')
 * @param {function} [props.onClick] - Optional click handler callback
 * @param {function} [props.onClose] - Optional close deletion handler callback
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function VamiTag({
  children,
  variant = "default",
  onClick,
  onClose,
  className = "",
  ...props
}) {
  const bgVariants = {
    default: "bg-surface-sunken text-ink-800 border border-border-default",
    primary: "bg-amber-100 text-ink-900 border border-amber-500/20",
    success: "bg-success-500/10 text-success-500 border border-success-500/20",
    error: "bg-error-500/10 text-error-500 border border-error-500/20",
  };

  const variantClass = bgVariants[variant] || bgVariants.default;

  const baseTagClasses =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-ui leading-none border transition-all duration-150 select-none";

  const interactiveClasses = onClick
    ? "cursor-pointer hover:bg-opacity-80 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
    : "";

  const handleKeyDown = (e) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <span
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`${baseTagClasses} ${variantClass} ${interactiveClasses} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {onClose && (
        <button
          type="button"
          data-testid="tag-close-btn"
          onClick={(e) => {
            e.stopPropagation(); // Avoid triggering parent tag onClick
            onClose(e);
          }}
          className="hover:bg-ink-100 rounded-full p-0.5 ml-0.5 text-current outline-none transition-colors"
          aria-label="Remove tag"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
