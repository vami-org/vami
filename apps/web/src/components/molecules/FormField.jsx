import React from "react";
import { VamiLabel, VamiText } from "../atoms";

/**
 * FormField molecule wrapping inputs with accessible labels, errors, and descriptors.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The input atom (e.g. VamiInput, VamiTextarea)
 * @param {string} [props.label] - Input field label description
 * @param {string} [props.error] - Validation failure description text
 * @param {string} [props.helperText] - Subtitle helper text descriptions
 * @param {boolean} [props.required=false] - Display asterisk indicator for required parameters
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function FormField({
  children,
  label,
  error,
  helperText,
  required = false,
  className = "",
  ...props
}) {
  // Extract input ID from children to map label links
  const childId = React.isValidElement(children)
    ? children.props.id
    : undefined;
  const errorId = childId ? `${childId}-error` : undefined;
  const helperId = childId ? `${childId}-helper` : undefined;

  // Clone child elements to pass down aria associations automatically
  const clonedInput = React.isValidElement(children)
    ? React.cloneElement(children, {
        error: error ? true : undefined,
        "aria-describedby":
          [error ? errorId : null, helperText ? helperId : null]
            .filter(Boolean)
            .join(" ") || undefined,
      })
    : children;

  return (
    <div className={`flex flex-col w-full font-ui ${className}`} {...props}>
      {label && (
        <VamiLabel htmlFor={childId}>
          {label}
          {required && <span className="text-error-500 ml-1 font-bold">*</span>}
        </VamiLabel>
      )}

      {clonedInput}

      {error && (
        <span
          id={errorId}
          data-testid="form-field-error"
          className="text-xs font-semibold text-error-500 mt-1.5 leading-none"
        >
          {error}
        </span>
      )}

      {!error && helperText && (
        <VamiText
          id={helperId}
          variant="secondary"
          size="xs"
          className="mt-1.5 leading-none"
        >
          {helperText}
        </VamiText>
      )}
    </div>
  );
}
