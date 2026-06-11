import React, { useState, useRef, useEffect } from "react";

/**
 * VamiSelect component for custom styled selection dropdowns.
 * Enforces accessibility standards via ARIA listbox specifications and keyboard events.
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string}>} props.options - Selectable options list
 * @param {string} props.value - Selected option value
 * @param {function} props.onChange - Selection trigger callback
 * @param {string} [props.placeholder='Select an option...'] - Placeholder text
 * @param {string|boolean} [props.error] - Validation error message or flag
 * @param {boolean} [props.disabled=false] - Disable interactions
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function VamiSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select an option...",
  error,
  disabled = false,
  className = "",
  id,
  name,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync activeIndex with current value on open
  useEffect(() => {
    if (isOpen) {
      const idx = options.findIndex((opt) => opt.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
    } else {
      setActiveIndex(-1);
    }
  }, [isOpen, value, options]);

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(0);
      } else {
        setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(options.length - 1);
      } else {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isOpen && activeIndex >= 0 && activeIndex < options.length) {
        if (onChange) onChange(options[activeIndex].value);
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  const handleSelect = (val) => {
    if (onChange) onChange(val);
    setIsOpen(false);
  };

  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const listboxId = `${selectId}-listbox`;
  const activeDescendantId =
    activeIndex >= 0 ? `${selectId}-opt-${activeIndex}` : undefined;

  let stateClasses = "border-border-default";
  if (error) {
    stateClasses = "border-error-500 focus:border-error-500";
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      {...props}
    >
      {/* Hidden standard select for HTML form submissions */}
      <select
        name={name}
        id={selectId}
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Accessible trigger combobox button */}
      <button
        type="button"
        role="combobox"
        disabled={disabled}
        data-testid="select-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-invalid={!!error}
        aria-activedescendant={activeDescendantId}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm font-ui bg-surface-sunken text-ink-900 placeholder-ink-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 outline-none focus:bg-surface-white focus:border-border-focus focus:ring-2 focus:ring-border-focus/20 ${stateClasses}`}
      >
        <span className={selectedOption ? "text-ink-900" : "text-ink-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`h-4 w-4 text-ink-600 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {/* Popover options panel listbox */}
      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 w-full mt-1 bg-surface-white border border-border-strong rounded-lg shadow-lg max-h-60 overflow-y-auto py-1 outline-none"
        >
          {options.length === 0 ? (
            <li className="px-4 py-2 text-sm text-ink-400 font-ui italic">
              No options available
            </li>
          ) : (
            options.map((option, idx) => {
              const isSelected = option.value === value;
              const isActive = idx === activeIndex;

              return (
                <li
                  key={option.value}
                  id={`${selectId}-opt-${idx}`}
                  role="option"
                  tabIndex={-1}
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect(option.value);
                    }
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`px-4 py-2 text-sm font-ui cursor-pointer select-none transition-colors duration-150 ${
                    isSelected
                      ? "bg-amber-100 text-ink-900 font-semibold"
                      : isActive
                        ? "bg-ink-050 text-ink-900"
                        : "text-ink-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {isSelected && (
                      <svg
                        className="h-4 w-4 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
