import React from "react";
import { useToastStore } from "../../store/toastStore";
import { VamiIcon } from "../atoms/VamiIcon";
import { VamiIconButton } from "../atoms/VamiIconButton";

const variantStyles = {
  success:
    "bg-success-500/10 text-success-500 border-success-500/20 icon-check",
  error: "bg-error-500/10 text-error-500 border-error-500/20 icon-error",
  warning:
    "bg-warning-500/10 text-warning-500 border-warning-500/20 icon-warning",
  info: "bg-info-500/10 text-info-500 border-info-500/20 icon-info",
};

const iconNames = {
  success: "check",
  error: "error",
  warning: "warning",
  info: "info",
};

/**
 * ToastItem component rendering a single glassmorphic card.
 *
 * @param {Object} props
 * @param {string} props.id - The unique toast identifier
 * @param {string} props.message - Notification message text
 * @param {'success'|'error'|'warning'|'info'} props.variant - Alert severity variant
 * @returns {React.JSX.Element}
 */
export function ToastItem({ id, message, variant }) {
  const removeToast = useToastStore((state) => state.removeToast);

  const styleClass = variantStyles[variant] || variantStyles.info;
  const iconName = iconNames[variant] || iconNames.info;

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid={`toast-${variant}`}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg bg-surface-white backdrop-blur-md max-w-sm w-80 transition-all duration-300 animate-slide-in font-ui text-sm font-semibold ${styleClass}`}
    >
      <VamiIcon name={iconName} size="sm" />
      <span className="flex-1 text-ink-800 leading-snug">{message}</span>
      <VamiIconButton
        type="button"
        size="sm"
        variant="ghost"
        aria-label="Dismiss notification"
        onClick={() => removeToast(id)}
        className="text-ink-600 hover:text-ink-900 ml-auto shrink-0"
      >
        <VamiIcon name="close" size="sm" />
      </VamiIconButton>
    </div>
  );
}

/**
 * ToastContainer component overlaying active notifications onto the viewport.
 * Render this component once in the root React tree.
 *
 * @returns {React.JSX.Element}
 */
export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div
      data-testid="toast-container"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem {...toast} />
        </div>
      ))}
    </div>
  );
}
