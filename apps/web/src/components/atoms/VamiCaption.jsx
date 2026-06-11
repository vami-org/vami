import React from "react";

/**
 * VamiCaption component for metadata, subtitles, or small descriptive elements.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {React.ElementType} [props.as='span'] - HTML element tag override
 * @param {string} [props.className=''] - Additional classnames
 * @returns {React.JSX.Element}
 */
export function VamiCaption({
  children,
  as: Component = "span",
  className = "",
  ...props
}) {
  return (
    <Component
      className={`font-ui text-xs text-ink-400 leading-normal ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
