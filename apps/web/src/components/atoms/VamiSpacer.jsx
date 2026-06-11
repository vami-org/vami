import React from "react";

/**
 * VamiSpacer component for explicit spacing offsets.
 *
 * @param {Object} props
 * @param {number|string} [props.size=4] - Spacing token index (0 to 32)
 * @param {string} [props.axis='vertical'] - Spacer direction axis ('vertical', 'horizontal')
 * @param {string} [props.className=''] - Additional classnames
 * @returns {React.JSX.Element}
 */
export function VamiSpacer({
  size = 4,
  axis = "vertical",
  className = "",
  ...props
}) {
  const isVertical = axis === "vertical";

  const spacerStyle = {
    display: isVertical ? "block" : "inline-block",
    width: isVertical ? "1px" : `var(--space-${size})`,
    height: isVertical ? `var(--space-${size})` : "1px",
  };

  return (
    <span
      style={spacerStyle}
      className={`shrink-0 select-none pointer-events-none ${className}`}
      {...props}
    />
  );
}
