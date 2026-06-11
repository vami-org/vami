import React, { useState, useEffect } from "react";

export function VamiAvatar({ src, name = "?", size = "md", className = "" }) {
  const [imgFailed, setImgFailed] = useState(false);

  // Reset image failure state if src changes
  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const sizes = {
    sm: "h-8 w-8 text-xs font-bold",
    md: "h-12 w-12 text-sm font-bold",
    lg: "h-16 w-16 text-base font-extrabold",
    xl: "h-24 w-24 text-2xl font-extrabold",
  };

  const getInitials = (text) => {
    if (!text) return "?";
    const parts = text.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return text[0].toUpperCase();
  };

  const wrapperClasses = `relative flex shrink-0 items-center justify-center rounded-full select-none overflow-hidden ${sizes[size]} ${className}`;

  if (src && !imgFailed) {
    return (
      <div className={wrapperClasses}>
        <img
          src={src}
          alt={name}
          onError={() => setImgFailed(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${wrapperClasses} bg-amber-500 text-ink-900 shadow-inner`}>
      {getInitials(name)}
    </div>
  );
}
