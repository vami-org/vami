import React from "react";

/**
 * VamiProgressBar component displaying percentage completion.
 * Employs accessible progressbar roles.
 *
 * @param {Object} props
 * @param {number} props.value - Current progress indicator
 * @param {number} [props.max=100] - Maximum progress bound
 * @param {boolean} [props.showLabel=false] - Display inline percentage metrics
 * @param {boolean} [props.animated=false] - Enable active slider pulsing animation
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function VamiProgressBar({
  value = 0,
  max = 100,
  showLabel = false,
  animated = false,
  className = "",
  ...props
}) {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? Math.round((clampedValue / max) * 100) : 0;

  const animatedClass = animated ? "animate-pulse" : "";

  return (
    <div
      className={`w-full flex items-center gap-3 font-ui text-xs font-semibold text-ink-800 select-none ${className}`}
      {...props}
    >
      {/* ProgressBar track */}
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        className="w-full h-2 bg-surface-sunken rounded-full overflow-hidden border border-border-default"
      >
        {/* Inner fill progress */}
        <div
          data-testid="progress-fill"
          style={{ width: `${percent}%` }}
          className={`h-full bg-ink-900 rounded-full transition-all duration-300 ${animatedClass}`}
        />
      </div>
      {showLabel && <span className="shrink-0">{percent}%</span>}
    </div>
  );
}
