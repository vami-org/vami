import React, { createContext, useContext } from "react";

const RadioGroupContext = createContext(null);

/**
 * VamiRadioGroup component context wrapper.
 * Coordinates input names, values, and onChange selections across children radios.
 *
 * @param {Object} props
 * @param {string} props.name - Radio input group name
 * @param {string} props.value - Active selection value
 * @param {function} props.onChange - Selection trigger callback
 * @param {React.ReactNode} props.children
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function VamiRadioGroup({
  name,
  value,
  onChange,
  children,
  className = "",
  ...props
}) {
  return (
    <RadioGroupContext.Provider value={{ name, value, onChange }}>
      <div className={`flex flex-col gap-2 ${className}`} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

/**
 * VamiRadio component for custom styled radio selection items.
 * Must be wrapped inside a VamiRadioGroup context.
 *
 * @param {Object} props
 * @param {string} props.value - Radio select value coordinate
 * @param {React.ReactNode} [props.label] - Inline label text or element
 * @param {boolean} [props.disabled=false] - Disable input interactions
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function VamiRadio({
  value,
  label,
  disabled = false,
  className = "",
  id,
  ...props
}) {
  const group = useContext(RadioGroupContext);

  if (!group) {
    console.warn(
      "VamiRadio: Must be rendered inside a VamiRadioGroup wrapper.",
    );
  }

  const name = group?.name;
  const isChecked = group ? group.value === value : false;
  const onChange = group?.onChange;

  const radioId = id || `radio-${name || "grp"}-${value}`;

  return (
    <label
      htmlFor={radioId}
      className={`inline-flex items-center gap-3 cursor-pointer select-none text-sm font-ui text-ink-800 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Hidden native input */}
        <input
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={isChecked}
          disabled={disabled}
          onChange={onChange}
          className="peer sr-only"
          {...props}
        />
        {/* Custom styled radio ring */}
        <div
          data-testid="radio-indicator"
          className="h-5 w-5 rounded-full border border-border-strong bg-surface-white transition-all duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-border-focus peer-checked:border-ink-900 flex items-center justify-center"
        >
          {/* Inner circle shown when selected */}
          {isChecked && (
            <span
              data-testid="radio-dot"
              className="h-2.5 w-2.5 rounded-full bg-ink-900"
            />
          )}
        </div>
      </div>
      {label && <span>{label}</span>}
    </label>
  );
}
