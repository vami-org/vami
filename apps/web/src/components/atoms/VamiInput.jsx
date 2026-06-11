import React from "react";

/**
 * VamiInput component for accessible form text field captures.
 * Incorporates success, error, and disabled states mapped to design tokens.
 *
 * @param {Object} props
 * @param {string} [props.type='text'] - Input type (text, email, password, etc.)
 * @param {string|boolean} [props.error] - Validation error message or flag
 * @param {boolean} [props.success] - Validation success state indicator
 * @param {boolean} [props.disabled] - Disable inputs interactions
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function VamiInput({
  type = "text",
  error,
  success,
  disabled,
  className = "",
  ...props
}) {
  const baseClasses =
    "w-full px-4 py-2.5 rounded-lg border text-sm font-ui bg-surface-sunken text-ink-900 placeholder-ink-400 transition-all duration-200 outline-none";
  const focusClasses =
    "focus:bg-surface-white focus:border-border-focus focus:ring-2 focus:ring-border-focus/20";
  const disabledClasses = "disabled:opacity-50 disabled:cursor-not-allowed";

  let stateClasses = "border-border-default";
  if (error) {
    stateClasses =
      "border-error-500 focus:border-error-500 focus:ring-error-500/20";
  } else if (success) {
    stateClasses =
      "border-success-500 focus:border-success-500 focus:ring-success-500/20";
  }

  const errorId = props.id ? `${props.id}-error` : undefined;

  return (
    <input
      type={type}
      disabled={disabled}
      aria-invalid={!!error}
      aria-describedby={error && errorId ? errorId : undefined}
      className={`${baseClasses} ${focusClasses} ${disabledClasses} ${stateClasses} ${className}`}
      {...props}
    />
  );
}
