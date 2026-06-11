import React from "react";

/**
 * VamiCode component for inline monospace styling.
 * Consumes design tokens via Tailwind v4 mapped utility classes.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className=''] - Additional classnames
 * @returns {React.JSX.Element}
 */
export function VamiCode({ children, className = "", ...props }) {
  return (
    <code
      className={`font-mono text-sm px-1.5 py-0.5 rounded bg-surface-sunken text-ink-900 border border-border-default ${className}`}
      {...props}
    >
      {children}
    </code>
  );
}
