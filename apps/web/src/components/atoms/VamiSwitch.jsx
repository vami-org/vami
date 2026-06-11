import React from "react";

/**
 * VamiSwitch component rendering a pill-toggle switch.
 * Employs accessible aria role="switch" and handles spacing margins cleanly.
 *
 * @param {Object} props
 * @param {boolean} props.checked - Switch state
 * @param {function} props.onChange - Switch callback toggled on state shift
 * @param {React.ReactNode} [props.label] - Optional descriptive inline text
 * @param {boolean} [props.disabled=false] - Disable user interactions
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function VamiSwitch({
  checked = false,
  onChange,
  label,
  disabled = false,
  className = "",
  id,
  ...props
}) {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  const handleToggle = () => {
    if (disabled || !onChange) return;
    onChange(!checked);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <label
      htmlFor={switchId}
      className={`inline-flex items-center gap-3 cursor-pointer select-none text-sm font-ui text-ink-800 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <div className="relative flex items-center">
        {/* Accessible hidden interactive button */}
        <button
          type="button"
          id={switchId}
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className="peer sr-only"
          {...props}
        />
        {/* Toggle sliding container track */}
        <div
          data-testid="switch-track"
          className={`w-10 h-6 rounded-full border border-border-strong transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-border-focus ${
            checked ? "bg-ink-900 border-ink-900" : "bg-surface-sunken"
          }`}
        >
          {/* Inner circle thumb slider */}
          <div
            data-testid="switch-thumb"
            className={`w-4.5 h-4.5 rounded-full bg-surface-white border border-border-default shadow-sm transition-transform duration-200 mt-[2px] ml-[2px] ${
              checked ? "transform translate-x-4" : ""
            }`}
          />
        </div>
      </div>
      {label && <span>{label}</span>}
    </label>
  );
}
