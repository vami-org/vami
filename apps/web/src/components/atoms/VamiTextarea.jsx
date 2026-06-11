import React, { useRef, useEffect, useCallback } from "react";

/**
 * VamiTextarea component for multiline inputs.
 * Supports height auto-resizing based on text content layout space.
 *
 * @param {Object} props
 * @param {boolean} [props.autoResize=false] - Auto adjust height based on text content
 * @param {string|boolean} [props.error] - Validation error message or flag
 * @param {boolean} [props.success] - Validation success state indicator
 * @param {boolean} [props.disabled] - Disable text input interactions
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function VamiTextarea({
  autoResize = false,
  error,
  success,
  disabled,
  className = "",
  onChange,
  value,
  rows = 3,
  ...props
}) {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback(() => {
    if (autoResize && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [autoResize]);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleTextareaChange = (e) => {
    adjustHeight();
    if (onChange) {
      onChange(e);
    }
  };

  const baseClasses =
    "w-full px-4 py-2.5 rounded-lg border text-sm font-ui bg-surface-sunken text-ink-900 placeholder-ink-400 transition-all duration-200 outline-none resize-none";
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
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleTextareaChange}
      disabled={disabled}
      rows={rows}
      aria-invalid={!!error}
      aria-describedby={error && errorId ? errorId : undefined}
      className={`${baseClasses} ${focusClasses} ${disabledClasses} ${stateClasses} ${className}`}
      {...props}
    />
  );
}
