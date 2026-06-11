import React from "react";

/**
 * VamiSkeleton component for displaying card or element loading placeholder states.
 * Employs animated pulsing effects and three variant layouts (text, circle, rect).
 *
 * @param {Object} props
 * @param {string} [props.variant='rect'] - Layout format shape ('text', 'circle', 'rect')
 * @param {string|number} [props.width] - Element layout width override
 * @param {string|number} [props.height] - Element layout height override
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function VamiSkeleton({
  variant = "rect",
  width,
  height,
  className = "",
  ...props
}) {
  const shapes = {
    circle: "rounded-full shrink-0",
    text: "rounded h-4 w-full",
    rect: "rounded-lg w-full",
  };

  const shapeClass = shapes[variant] || shapes.rect;

  const skeletonStyle = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };

  return (
    <div
      style={skeletonStyle}
      className={`animate-pulse bg-surface-sunken border border-border-default ${shapeClass} ${className}`}
      {...props}
    />
  );
}
