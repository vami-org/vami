import React from "react";

/**
 * VamiRow layout component aligning elements horizontally.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number|string} [props.gap] - Spacing token index (0 to 32)
 * @param {string} [props.align='center'] - Flex alignment ('start', 'center', 'end', 'stretch')
 * @param {string} [props.justify='start'] - Flex distribution ('start', 'center', 'end', 'between', 'around')
 * @param {boolean} [props.wrap=false] - Apply flex wrap spacing
 * @param {React.ElementType} [props.as='div'] - HTML element tag override
 * @param {string} [props.className=''] - Additional classnames
 * @returns {React.JSX.Element}
 */
export function VamiRow({
  children,
  gap,
  align = "center",
  justify = "start",
  wrap = false,
  as: Component = "div",
  className = "",
  ...props
}) {
  const alignments = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const distributions = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  const alignClass = alignments[align] || "items-center";
  const justifyClass = distributions[justify] || "justify-start";
  const wrapClass = wrap ? "flex-wrap" : "flex-nowrap";

  const rowStyle = {
    gap: gap !== undefined ? `var(--space-${gap})` : undefined,
  };

  return (
    <Component
      style={rowStyle}
      className={`flex flex-row ${alignClass} ${justifyClass} ${wrapClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
