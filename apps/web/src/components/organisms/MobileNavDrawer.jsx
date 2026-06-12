import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { NavItem } from "../molecules/NavItem";
import { VamiIconButton } from "../atoms/VamiIconButton";
import { VamiIcon } from "../atoms/VamiIcon";
import { useAuth } from "../../hooks/useAuth";

/**
 * MobileNavDrawer organism providing slide-out overlay for navigation on smaller viewports.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Open state
 * @param {function} props.onClose - Close callback
 * @returns {React.JSX.Element}
 */
export function MobileNavDrawer({ isOpen, onClose }) {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex font-ui select-none">
      {/* Dimmed backdrop background overlay */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        data-testid="drawer-backdrop"
      />

      {/* Drawer content sliding from the left */}
      <div className="relative flex w-full max-w-xs flex-col bg-surface-elevated border-r border-border-default h-full p-6 shadow-2xl z-10 transition-transform duration-300 transform translate-x-0 animate-slide-in">
        <div className="flex items-center justify-between border-b border-border-default pb-4 mb-6">
          <span className="text-xl font-extrabold tracking-tight text-ink-900">
            VAMI
          </span>
          <VamiIconButton
            variant="ghost"
            size="md"
            onClick={onClose}
            aria-label="Close menu"
          >
            <VamiIcon name="close" size="md" className="text-ink-800" />
          </VamiIconButton>
        </div>

        {/* Navigation Link list */}
        <nav className="flex-1 space-y-2">
          <NavItem to="/dashboard" icon="home" onClick={onClose} end>
            Home
          </NavItem>

          {isAuthenticated ? (
            <>
              {user?.is_creator && (
                <NavItem to="/write" icon="plus" onClick={onClose}>
                  Write
                </NavItem>
              )}
              <NavItem
                to={`/users/${user?.username}`}
                icon="user"
                onClick={onClose}
              >
                Profile
              </NavItem>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 text-error-500 hover:bg-error-100/15 border-l-4 border-transparent outline-none cursor-pointer"
              >
                <VamiIcon name="delete" size="sm" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <NavItem to="/login" icon="user" onClick={onClose}>
              Sign In
            </NavItem>
          )}

          <NavItem to="/dev-sandbox" icon="settings" onClick={onClose}>
            Dev Sandbox
          </NavItem>
        </nav>

        {/* Theme Settings Switcher in drawer footer */}
        <div className="border-t border-border-default pt-6 mt-6">
          <span className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-3">
            Interface Theme
          </span>
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-surface-sunken p-1 border border-border-default">
            {["light", "dark", "system"].map((mode) => {
              const isActive = theme === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className={`py-1.5 px-2 rounded font-ui text-xs font-semibold capitalize transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-surface-elevated text-ink-900 shadow-sm border border-border-strong"
                      : "text-ink-600 hover:text-ink-900"
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
