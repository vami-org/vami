import React from "react";

/**
 * VamiLabel component for standard, accessible form labels.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.htmlFor] - Associated input element ID
 * @param {string} [props.className=''] - Additional classnames
 * @returns {React.JSX.Element}
 */
export function VamiLabel({ children, htmlFor, className = "", ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block font-ui text-xs font-bold uppercase tracking-wider text-ink-400 mb-2 cursor-pointer select-none ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
