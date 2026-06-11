import React, { useState, useEffect } from "react";

/**
 * VamiAvatar component for displaying user avatars with initials fallback.
 * Incorporates online status badges and sizes from xs (24px) to 2xl (128px).
 *
 * @param {Object} props
 * @param {string} [props.src] - Image source URL
 * @param {string} [props.name='?'] - Name for initials generation fallback
 * @param {string} [props.size='md'] - Sizing option ('xs', 'sm', 'md', 'lg', 'xl', '2xl')
 * @param {string} [props.status=null] - Online status indicator ('online', 'idle', 'away', 'busy', 'offline')
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function VamiAvatar({
  src,
  name = "?",
  size = "md",
  status = null,
  className = "",
  ...props
}) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const sizes = {
    xs: "h-6 w-6 text-[10px] font-bold",
    sm: "h-8 w-8 text-xs font-bold",
    md: "h-12 w-12 text-sm font-bold",
    lg: "h-16 w-16 text-base font-bold",
    xl: "h-24 w-24 text-2xl font-bold",
    "2xl": "h-32 w-32 text-4xl font-bold",
  };

  const statusDotSizes = {
    xs: "h-2 w-2 border",
    sm: "h-2.5 w-2.5 border",
    md: "h-3.5 w-3.5 border-2",
    lg: "h-4 w-4 border-2",
    xl: "h-5 w-5 border-2",
    "2xl": "h-6 w-6 border-[3px]",
  };

  const statusColors = {
    online: "bg-success-500",
    away: "bg-warning-500",
    idle: "bg-warning-500",
    busy: "bg-error-500",
    offline: "bg-ink-400",
  };

  const getInitials = (text) => {
    if (!text) return "?";
    const parts = text.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return text[0].toUpperCase();
  };

  const sizeClass = sizes[size] || sizes.md;
  const wrapperClasses = `relative flex shrink-0 items-center justify-center rounded-full select-none overflow-hidden ${sizeClass} ${className}`;

  const hasStatus = status && statusColors[status] !== undefined;
  const dotSizeClass = statusDotSizes[size] || statusDotSizes.md;
  const statusColorClass = statusColors[status];

  const renderStatusDot = () => {
    if (!hasStatus) return null;
    return (
      <span
        data-testid="avatar-status"
        className={`absolute bottom-0 right-0 rounded-full border-surface-white ${dotSizeClass} ${statusColorClass}`}
      />
    );
  };

  if (src && !imgFailed) {
    return (
      <div className="relative inline-block select-none" {...props}>
        <div className={wrapperClasses}>
          <img
            src={src}
            alt={name}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
          />
        </div>
        {renderStatusDot()}
      </div>
    );
  }

  return (
    <div className="relative inline-block select-none" {...props}>
      <div
        className={`${wrapperClasses} bg-amber-500 text-ink-900 shadow-inner`}
      >
        {getInitials(name)}
      </div>
      {renderStatusDot()}
    </div>
  );
}
