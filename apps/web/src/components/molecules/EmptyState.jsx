import React from "react";
import { VamiIcon } from "../atoms/VamiIcon";
import { VamiHeading } from "../atoms/VamiHeading";
import { VamiText } from "../atoms/VamiText";
import { VamiButton } from "../atoms/VamiButton";

/**
 * EmptyState molecule representing placeholders when a list or view has no data.
 *
 * @param {Object} props
 * @param {string} props.title - Main header title
 * @param {string} props.description - Body description paragraph text
 * @param {string} [props.iconName='info'] - Name of VamiIcon vector to render
 * @param {string} [props.actionLabel] - Call to action button text label
 * @param {function} [props.onAction] - Button action click callback
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function EmptyState({
  title,
  description,
  iconName = "info",
  actionLabel,
  onAction,
  className = "",
  ...props
}) {
  return (
    <div
      data-testid="empty-state"
      className={`flex flex-col items-center justify-center text-center p-8 border border-border-default rounded-xl bg-surface-warm select-none ${className}`}
      {...props}
    >
      {/* Icon header */}
      <div className="h-14 w-14 rounded-full bg-surface-sunken flex items-center justify-center text-ink-600 border border-border-default mb-4">
        <VamiIcon name={iconName} size="lg" />
      </div>

      {/* Heading */}
      <VamiHeading level={3} size="xl" weight="bold" className="mb-2">
        {title}
      </VamiHeading>

      {/* Description */}
      <VamiText variant="secondary" size="sm" className="max-w-xs mb-6">
        {description}
      </VamiText>

      {/* Optional CTA Action button */}
      {actionLabel && onAction && (
        <VamiButton variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </VamiButton>
      )}
    </div>
  );
}
