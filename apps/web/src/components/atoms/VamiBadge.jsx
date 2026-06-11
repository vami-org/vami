import React from "react";

/**
 * VamiBadge component for rendering inline status pill indicators or markers.
 * Maps badge style variations and visual layouts directly to token colors.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge inline text
 * @param {string} [props.variant='default'] - Visual theme color ('default', 'primary', 'success', 'warning', 'error', 'info')
 * @param {string} [props.type='label'] - Layout structure option ('label', 'dot', 'dot-label')
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function VamiBadge({
  children,
  variant = "default",
  type = "label",
  className = "",
  ...props
}) {
  const bgVariants = {
    default: "bg-surface-sunken text-ink-600 border border-border-default",
    primary: "bg-ink-900 text-surface-white border border-ink-900",
    success: "bg-success-500/10 text-success-500 border border-success-500/20",
    warning: "bg-warning-500/10 text-warning-500 border border-warning-500/20",
    error: "bg-error-500/10 text-error-500 border border-error-500/20",
    info: "bg-info-500/10 text-info-500 border border-info-500/20",
  };

  const dotColors = {
    default: "bg-ink-400",
    primary: "bg-ink-900",
    success: "bg-success-500",
    warning: "bg-warning-500",
    error: "bg-error-500",
    info: "bg-info-500",
  };

  const variantClass = bgVariants[variant] || bgVariants.default;
  const dotColorClass = dotColors[variant] || dotColors.default;

  const basePillClasses =
    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold font-ui leading-none select-none";

  if (type === "dot") {
    return (
      <span
        data-testid="badge-dot"
        className={`inline-block h-2.5 w-2.5 rounded-full ${dotColorClass} ${className}`}
        {...props}
      />
    );
  }

  if (type === "dot-label") {
    return (
      <span
        className={`${basePillClasses} ${variantClass} ${className}`}
        {...props}
      >
        <span
          data-testid="badge-dot-indicator"
          className={`h-1.5 w-1.5 rounded-full ${dotColorClass}`}
        />
        {children}
      </span>
    );
  }

  // Default type="label"
  return (
    <span
      className={`${basePillClasses} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
