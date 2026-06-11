import React from "react";
import { VamiInput } from "../atoms/VamiInput";
import { VamiIcon } from "../atoms/VamiIcon";
import { VamiIconButton } from "../atoms/VamiIconButton";

/**
 * SearchBox molecule combining a search field with start icons and clear inputs.
 *
 * @param {Object} props
 * @param {string} props.value - Search value string
 * @param {function} props.onChange - Search value change callback
 * @param {function} [props.onClear] - Explicit clear action callback (defaults to empty onChange string)
 * @param {string} [props.placeholder='Search...'] - Placeholder text
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function SearchBox({
  value = "",
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
  ...props
}) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      // Simulate input event
      const event = { target: { value: "" } };
      onChange(event);
    }
  };

  return (
    <div
      className={`relative flex items-center w-full select-none ${className}`}
    >
      {/* Search icon at start */}
      <span
        data-testid="search-icon-wrapper"
        className="absolute left-3.5 text-ink-600 flex items-center pointer-events-none"
      >
        <VamiIcon name="search" size="sm" />
      </span>

      {/* Standard Input block with padding offsets */}
      <VamiInput
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 pr-10"
        {...props}
      />

      {/* Clear button shown when text is present */}
      {value && (
        <VamiIconButton
          type="button"
          size="sm"
          variant="ghost"
          aria-label="Clear search query"
          onClick={handleClear}
          className="absolute right-1 text-ink-600 hover:text-ink-900 active:scale-90"
        >
          <VamiIcon name="close" size="sm" />
        </VamiIconButton>
      )}
    </div>
  );
}
