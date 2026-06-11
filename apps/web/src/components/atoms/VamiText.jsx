import React from "react";

/**
 * VamiText component for standard typography and paragraph renders.
 * Consumes design tokens via Tailwind v4 mapped utility classes.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.variant='primary'] - Color scale variant ('primary', 'secondary', 'muted', 'error', 'success', 'warning', 'info', 'white')
 * @param {string} [props.size='base'] - Font size scale ('xs', 'sm', 'base', 'lg', 'xl', '2xl')
 * @param {string} [props.weight='regular'] - Font weight ('regular', 'medium', 'semibold', 'bold', 'extrabold')
 * @param {string} [props.align='left'] - Text alignment ('left', 'center', 'right', 'justify')
 * @param {boolean} [props.truncate=false] - Apply text truncation ellipsis
 * @param {React.ElementType} [props.as='span'] - HTML element tag override
 * @param {string} [props.className=''] - Additional classnames
 * @returns {React.JSX.Element}
 */
export function VamiText({
  children,
  variant = "primary",
  size = "base",
  weight = "regular",
  align = "left",
  truncate = false,
  as: Component = "span",
  className = "",
  ...props
}) {
  const variants = {
    primary: "text-ink-800",
    secondary: "text-ink-600",
    muted: "text-ink-400",
    error: "text-error-500",
    success: "text-success-500",
    warning: "text-warning-500",
    info: "text-info-500",
    white: "text-surface-white",
  };

  const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };

  const weights = {
    regular: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  };

  const alignments = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  const baseClasses = "font-ui leading-relaxed";
  const alignmentClass = alignments[align] || "text-left";
  const sizeClass = sizes[size] || "text-base";
  const weightClass = weights[weight] || "font-normal";
  const variantClass = variants[variant] || "text-ink-800";
  const truncateClass = truncate ? "truncate block" : "";

  return (
    <Component
      className={`${baseClasses} ${variantClass} ${sizeClass} ${weightClass} ${alignmentClass} ${truncateClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
