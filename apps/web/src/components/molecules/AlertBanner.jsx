import React from "react";
import { VamiIcon } from "../atoms/VamiIcon";

const variantStyles = {
  success: "bg-success-500/10 text-success-500 border-success-500/20",
  error: "bg-error-500/10 text-error-500 border-error-500/20",
  warning: "bg-warning-500/10 text-warning-500 border-warning-500/20",
  info: "bg-info-500/10 text-info-500 border-info-500/20",
};

const iconNames = {
  success: "check",
  error: "error",
  warning: "warning",
  info: "info",
};

/**
 * AlertBanner molecule for inline messages and alerts.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Banner body content description
 * @param {string} [props.title] - Optional bold title text
 * @param {'success'|'error'|'warning'|'info'} [props.variant='info'] - Alert severity variant
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function AlertBanner({
  children,
  title,
  variant = "info",
  className = "",
  ...props
}) {
  const styleClass = variantStyles[variant] || variantStyles.info;
  const iconName = iconNames[variant] || iconNames.info;

  return (
    <div
      role="alert"
      data-testid={`alert-${variant}`}
      className={`flex gap-3 p-4 rounded-lg border font-ui text-sm ${styleClass} ${className}`}
      {...props}
    >
      <VamiIcon name={iconName} size="sm" className="mt-0.5 shrink-0" />
      <div className="flex flex-col gap-1 text-ink-800">
        {title && <h5 className="font-bold leading-none">{title}</h5>}
        <div className="font-medium leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
