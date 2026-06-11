import React, { useState, useRef } from "react";

/**
 * VamiFileUpload component for drag-and-drop or click file selection.
 *
 * @param {Object} props
 * @param {function} props.onFileSelect - Callback returning selected File(s)
 * @param {string} [props.accept] - Allowed file extensions or MIME types
 * @param {boolean} [props.multiple=false] - Allow choosing multiple files
 * @param {boolean} [props.disabled=false] - Disable upload controls interaction
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {React.JSX.Element}
 */
export function VamiFileUpload({
  onFileSelect,
  accept,
  multiple = false,
  disabled = false,
  className = "",
  ...props
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      if (onFileSelect) {
        onFileSelect(multiple ? files : files[0]);
      }
    }
  };

  const handleInputChange = (e) => {
    if (disabled) return;
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      if (onFileSelect) {
        onFileSelect(multiple ? files : files[0]);
      }
    }
  };

  const onButtonClick = () => {
    if (disabled) return;
    fileInputRef.current.click();
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onButtonClick();
    }
  };

  const dragClass = isDragActive
    ? "border-border-focus bg-amber-500/5"
    : "border-border-default hover:border-border-strong hover:bg-ink-050/30";

  const disabledClass = disabled
    ? "opacity-50 cursor-not-allowed bg-surface-sunken"
    : "cursor-pointer";

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload files"
      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus ${dragClass} ${disabledClass} ${className}`}
      {...props}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        className="hidden"
        tabIndex={-1}
      />
      <svg
        className="h-8 w-8 text-ink-600 mb-2 opacity-75"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
        />
      </svg>
      <span className="text-sm font-semibold font-ui text-ink-800">
        Drag and drop files here, or click to browse
      </span>
      {accept && (
        <span className="text-xs text-ink-400 font-ui mt-1">
          Supports: {accept}
        </span>
      )}
    </div>
  );
}
