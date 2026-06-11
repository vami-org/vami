import React from "react";
import { Link } from "react-router-dom";

/**
 * VamiLink component that decides whether to render a react-router-dom Link
 * or a standard anchor <a> tag depending on the path provided.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.to] - Target client-side routing path
 * @param {string} [props.href] - Target URL path
 * @param {boolean} [props.external] - Force rendering external link
 * @param {string} [props.className=''] - Additional classnames
 * @returns {React.JSX.Element}
 */
export function VamiLink({
  children,
  to,
  href,
  external,
  className = "",
  ...props
}) {
  const targetPath = to || href || "";
  const isExternal =
    external ||
    targetPath.startsWith("http://") ||
    targetPath.startsWith("https://") ||
    targetPath.startsWith("mailto:") ||
    targetPath.startsWith("tel:");

  const linkClasses = `text-amber-500 hover:text-amber-400 font-medium underline transition-colors duration-200 cursor-pointer ${className}`;

  if (isExternal) {
    return (
      <a
        href={targetPath}
        target="_blank"
        rel="noreferrer"
        className={linkClasses}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={targetPath} className={linkClasses} {...props}>
      {children}
    </Link>
  );
}
