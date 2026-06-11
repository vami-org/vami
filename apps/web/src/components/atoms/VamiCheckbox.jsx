import React, { useRef, useEffect } from "react";

/**
 * VamiCheckbox component for custom styled selection boxes.
 * Supports checked, unchecked, and indeterminate (partially selected) states.
 *
 * @param {Object} props
 * @param {boolean} [props.checked=false] - Checkbox check state
 * @param {boolean} [props.indeterminate=false] - Checkbox indeterminate state
 * @param {boolean} [props.disabled=false] - Disable checkbox interactions
 * @param {React.ReactNode} [props.label] - Inline label string or elements
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function VamiCheckbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  className = "",
  onChange,
  id,
  ...props
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const checkboxId =
    id ||
    (label ? `checkbox-${Math.random().toString(36).substr(2, 9)}` : undefined);

  return (
    <label
      htmlFor={checkboxId}
      className={`inline-flex items-center gap-3 cursor-pointer select-none text-sm font-ui text-ink-800 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Hidden native input */}
        <input
          ref={inputRef}
          type="checkbox"
          id={checkboxId}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="peer sr-only"
          {...props}
        />
        {/* Custom styled checkbox indicator */}
        <div
          data-testid="checkbox-indicator"
          className="h-5 w-5 rounded border border-border-strong bg-surface-white transition-all duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-border-focus peer-checked:bg-ink-900 peer-checked:border-ink-900 peer-indeterminate:bg-ink-900 peer-indeterminate:border-ink-900 flex items-center justify-center"
        >
          {/* Checked Checkmark Icon */}
          {checked && !indeterminate && (
            <svg
              className="h-3.5 w-3.5 text-surface-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          )}
          {/* Indeterminate Minus Icon */}
          {indeterminate && (
            <span
              data-testid="checkbox-minus"
              className="w-2.5 h-[2.5px] bg-surface-white rounded-sm"
            />
          )}
        </div>
      </div>
      {label && <span>{label}</span>}
    </label>
  );
}
