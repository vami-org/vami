import React from "react";
import { VamiRow } from "../atoms/VamiRow";
import { VamiText } from "../atoms/VamiText";

/**
 * ReadTimeDisplay molecule showing clock helper indicator and text.
 *
 * @param {Object} props
 * @param {number} props.minutes - Estimated reading length duration in minutes
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function ReadTimeDisplay({ minutes = 1, className = "", ...props }) {
  const roundedMinutes = Math.max(Math.round(minutes), 1);

  return (
    <VamiRow
      gap={1.5}
      className={`inline-flex items-center text-ink-600 select-none ${className}`}
      {...props}
    >
      {/* Clock icon SVG */}
      <svg
        data-testid="clock-svg"
        className="h-4 w-4 stroke-current shrink-0 align-middle"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <VamiText variant="secondary" size="xs" weight="medium">
        {roundedMinutes} min read
      </VamiText>
    </VamiRow>
  );
}
