import React from "react";

/**
 * VamiBox component serving as a container utility block.
 * Dynamically binds styling attributes to tokens.css parameters.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number|string} [props.padding] - Spacing token index (0 to 32)
 * @param {number|string} [props.margin] - Spacing token index (0 to 32)
 * @param {string} [props.bg='transparent'] - Background variant ('white', 'warm', 'elevated', 'sunken', 'transparent')
 * @param {string} [props.radius='none'] - Radius token ('sm', 'md', 'lg', 'xl', '2xl', 'full', 'none')
 * @param {string} [props.shadow='none'] - Shadow token ('xs', 'sm', 'md', 'lg', 'xl', 'none')
 * @param {string} [props.border='none'] - Border variant ('default', 'strong', 'focus', 'none')
 * @param {React.ElementType} [props.as='div'] - HTML element tag override
 * @param {string} [props.className=''] - Additional classnames
 * @returns {React.JSX.Element}
 */
export function VamiBox({
  children,
  padding,
  margin,
  bg = "transparent",
  radius = "none",
  shadow = "none",
  border = "none",
  as: Component = "div",
  className = "",
  ...props
}) {
  const backgrounds = {
    white: "bg-surface-white",
    warm: "bg-surface-warm",
    elevated: "bg-surface-elevated",
    sunken: "bg-surface-sunken",
    transparent: "bg-transparent",
  };

  const borders = {
    default: "border border-border-default",
    strong: "border border-border-strong",
    focus: "border border-border-focus",
    none: "border-none",
  };

  const bgClass = backgrounds[bg] || "bg-transparent";
  const borderClass = borders[border] || "border-none";

  const boxStyle = {
    padding: padding !== undefined ? `var(--space-${padding})` : undefined,
    margin: margin !== undefined ? `var(--space-${margin})` : undefined,
    borderRadius:
      radius && radius !== "none" ? `var(--radius-${radius})` : undefined,
    boxShadow:
      shadow && shadow !== "none" ? `var(--shadow-${shadow})` : undefined,
  };

  return (
    <Component
      style={boxStyle}
      className={`${bgClass} ${borderClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
