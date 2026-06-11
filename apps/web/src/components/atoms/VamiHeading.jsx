import React from "react";

/**
 * VamiHeading component for header tags (H1-H6).
 * Consumes design tokens via Tailwind v4 mapped utility classes.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number|string} [props.level=1] - Semantic heading level (1 to 6)
 * @param {string} [props.size] - Visual font size override ('base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl')
 * @param {string} [props.weight='bold'] - Font weight ('regular', 'medium', 'semibold', 'bold', 'extrabold')
 * @param {React.ElementType} [props.as] - HTML element tag override (defaults to h[level])
 * @param {string} [props.className=''] - Additional classnames
 * @returns {React.JSX.Element}
 */
export function VamiHeading({
  children,
  level = 1,
  size,
  weight = "bold",
  as,
  className = "",
  ...props
}) {
  const numericLevel = parseInt(level, 10) || 1;
  const clampedLevel = Math.min(Math.max(numericLevel, 1), 6);
  const defaultTag = `h${clampedLevel}`;
  const Component = as || defaultTag;

  const defaultSizes = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: "text-base",
  };

  const sizes = {
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
  };

  const weights = {
    regular: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  };

  const sizeClass = size ? sizes[size] || size : defaultSizes[clampedLevel];
  const weightClass = weights[weight] || "font-bold";
  const baseClasses = "font-ui text-ink-900 tracking-tight leading-tight";

  return (
    <Component
      className={`${baseClasses} ${sizeClass} ${weightClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
