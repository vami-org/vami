import React, { useState, useEffect } from "react";

/**
 * VamiImage component providing image frames with lazy loading and fallback assets.
 * Maps layout constraints to aspect ratios.
 *
 * @param {Object} props
 * @param {string} props.src - Image file URL path
 * @param {string} props.alt - Alternative text reader descriptions
 * @param {string} [props.aspectRatio='auto'] - Layout constraints ('square', 'video', 'auto')
 * @param {string} [props.fallbackSrc] - Fallback placeholder image URL rendered on error
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function VamiImage({
  src,
  alt,
  aspectRatio = "auto",
  fallbackSrc,
  className = "",
  ...props
}) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const ratios = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "aspect-auto",
  };

  const ratioClass = ratios[aspectRatio] || ratios.auto;

  // Render SVG placeholder icon if image failed and no fallback is specified
  const renderFallbackPlaceholder = () => {
    if (fallbackSrc) {
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      );
    }

    return (
      <div
        data-testid="image-fallback-placeholder"
        className="h-full w-full flex flex-col items-center justify-center bg-surface-sunken border border-border-default text-ink-400 gap-2 font-ui text-xs"
      >
        <svg
          className="h-8 w-8 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        <span>Image Unavailable</span>
      </div>
    );
  };

  return (
    <div
      className={`relative overflow-hidden rounded-lg w-full ${ratioClass} ${className}`}
      {...props}
    >
      {src && !imgFailed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
      ) : (
        renderFallbackPlaceholder()
      )}
    </div>
  );
}
