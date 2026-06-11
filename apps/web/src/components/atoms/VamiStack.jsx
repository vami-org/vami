import React from "react";

/**
 * VamiStack layout component aligning elements vertically.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number|string} [props.gap] - Spacing token index (0 to 32)
 * @param {string} [props.align='stretch'] - Flex alignment ('start', 'center', 'end', 'stretch')
 * @param {string} [props.justify='start'] - Flex distribution ('start', 'center', 'end', 'between', 'around')
 * @param {React.ElementType} [props.as='div'] - HTML element tag override
 * @param {string} [props.className=''] - Additional classnames
 * @returns {React.JSX.Element}
 */
export function VamiStack({
  children,
  gap,
  align = "stretch",
  justify = "start",
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

  const alignClass = alignments[align] || "items-stretch";
  const justifyClass = distributions[justify] || "justify-start";

  const stackStyle = {
    gap: gap !== undefined ? `var(--space-${gap})` : undefined,
  };

  return (
    <Component
      style={stackStyle}
      className={`flex flex-col ${alignClass} ${justifyClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
