import React from "react";

/**
 * VamiGrid layout component mapping items to a grid pattern.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number|string} [props.cols=1] - Grid columns count (1 to 12)
 * @param {number|string} [props.gap] - Spacing token index (0 to 32)
 * @param {React.ElementType} [props.as='div'] - HTML element tag override
 * @param {string} [props.className=''] - Additional classnames
 * @returns {React.JSX.Element}
 */
export function VamiGrid({
  children,
  cols = 1,
  gap,
  as: Component = "div",
  className = "",
  ...props
}) {
  const gridStyle = {
    gridTemplateColumns: cols ? `repeat(${cols}, minmax(0, 1fr))` : undefined,
    gap: gap !== undefined ? `var(--space-${gap})` : undefined,
  };

  return (
    <Component style={gridStyle} className={`grid ${className}`} {...props}>
      {children}
    </Component>
  );
}
