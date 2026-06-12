import React from "react";
import { NavLink } from "react-router-dom";
import { VamiIcon } from "../atoms/VamiIcon";

/**
 * NavItem molecule component wrapping NavLink from react-router-dom.
 * Render optional left icon and text label with premium hover/active transitions.
 *
 * @param {Object} props
 * @param {string} props.to - Navigation target
 * @param {string} [props.icon] - Name of icon inside VamiIcon sprite
 * @param {boolean} [props.end=false] - If true, the link will only be active on exact path match
 * @param {string} [props.className=''] - Additional custom CSS classes
 * @param {React.ReactNode} props.children - Label or contents
 * @returns {React.JSX.Element}
 */
export function NavItem({
  to,
  icon,
  end = false,
  className = "",
  children,
  ...props
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => {
        const baseClasses =
          "flex items-center gap-3 px-4 py-2.5 rounded-lg font-ui text-sm font-semibold transition-all duration-200 select-none cursor-pointer outline-none";
        const stateClasses = isActive
          ? "bg-amber-100/10 text-amber-500 border-l-4 border-amber-500 pl-3.5"
          : "text-ink-600 hover:text-ink-900 hover:bg-ink-050/50 border-l-4 border-transparent";
        return `${baseClasses} ${stateClasses} ${className}`;
      }}
      {...props}
    >
      {icon && <VamiIcon name={icon} size="sm" />}
      <span>{children}</span>
    </NavLink>
  );
}
