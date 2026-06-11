import React from "react";

/**
 * VamiDivider visual separator component.
 *
 * @param {Object} props
 * @param {string} [props.orientation='horizontal'] - Divider layout direction ('horizontal', 'vertical')
 * @param {string} [props.className=''] - Additional classnames
 * @returns {React.JSX.Element}
 */
export function VamiDivider({
  orientation = "horizontal",
  className = "",
  ...props
}) {
  const isHorizontal = orientation === "horizontal";
  const dividerClass = isHorizontal
    ? "w-full border-t border-border-default my-4"
    : "h-auto self-stretch border-l border-border-default mx-4";

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`${dividerClass} ${className}`}
      {...props}
    />
  );
}
