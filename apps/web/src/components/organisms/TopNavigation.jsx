import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { NavItem } from "../molecules/NavItem";
import { SearchBox } from "../molecules/SearchBox";
import { VamiAvatar } from "../atoms/VamiAvatar";
import { VamiIconButton } from "../atoms/VamiIconButton";
import { VamiIcon } from "../atoms/VamiIcon";
import { MobileNavDrawer } from "./MobileNavDrawer";

/**
 * TopNavigation organism rendered at the top of pages.
 * Handles scroll visibility (hide scroll-down, reveal scroll-up),
 * user menus, mobile drawer triggering, search input, and routing.
 *
 * @returns {React.JSX.Element}
 */
export function TopNavigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchVal, setSearchVal] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const prevScrollY = useRef(0);
  const dropdownRef = useRef(null);

  // Scroll visibility side effects
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const threshold = 15; // scroll tolerance

      if (currentScrollY <= 64) {
        setIsVisible(true);
      } else if (Math.abs(currentScrollY - prevScrollY.current) > threshold) {
        setIsVisible(currentScrollY < prevScrollY.current);
      }
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dropdown close listener (outside clicks)
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 h-[64px] border-b border-border-default bg-surface-elevated/90 backdrop-blur-md transition-transform duration-300 font-ui text-ink-800 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left Logo and Brand Section */}
          <div className="flex items-center gap-6">
            {/* Mobile hamburger icon menu trigger */}
            <VamiIconButton
              variant="ghost"
              size="md"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden text-ink-800 active:scale-95"
            >
              <VamiIcon name="menu" size="md" />
            </VamiIconButton>

            {/* Brand Logo Link */}
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-ink-900"
            >
              {/* Premium custom SVG logo mark */}
              <svg
                className="h-6 w-6 text-amber-500 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 22h20L12 2zm0 4l6.4 12.8H5.6L12 6z" />
              </svg>
              <span>VAMI</span>
            </Link>

            {/* Desktop link nav panel */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavItem to="/dashboard" icon="home" end>
                Home
              </NavItem>
              <NavItem to="/dev-sandbox" icon="settings">
                Sandbox
              </NavItem>
            </nav>
          </div>

          {/* Search Box center panel */}
          <div className="hidden md:block w-full max-w-sm px-4">
            <SearchBox
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search articles..."
            />
          </div>

          {/* Right Action buttons and user controls */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Creator Write button */}
                {user?.is_creator && (
                  <Link
                    to="/write"
                    className="hidden sm:inline-flex h-9 items-center justify-center rounded-lg bg-amber-500 px-4 text-xs font-bold text-ink-900 border border-amber-500 transition-all hover:bg-amber-400 active:scale-95 shadow-sm"
                  >
                    <VamiIcon name="plus" size="sm" className="mr-1.5" />
                    Write
                  </Link>
                )}

                {/* Profile menu dropdown button */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center focus:outline-none cursor-pointer rounded-full p-0.5 hover:ring-2 hover:ring-border-strong transition-all duration-150"
                    aria-label="User account dropdown"
                  >
                    <VamiAvatar
                      name={user?.name || user?.username || "Vami User"}
                      src={user?.avatar_url}
                      size="sm"
                    />
                  </button>

                  {/* Dropdown Card overlay */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-border-default bg-surface-elevated p-2 shadow-xl animate-fade-in z-50">
                      {/* User Context header */}
                      <div className="border-b border-border-default px-3 py-2 mb-1">
                        <span className="block text-xs font-bold text-ink-900 truncate">
                          {user?.name || `@${user?.username}`}
                        </span>
                        <span className="block text-[10px] text-ink-400 truncate mt-0.5">
                          {user?.email}
                        </span>
                      </div>

                      {/* Dropdown Actions */}
                      <Link
                        to={`/users/${user?.username}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded text-xs font-semibold text-ink-600 hover:text-ink-900 hover:bg-ink-050 transition-colors"
                      >
                        <VamiIcon name="user" size="sm" />
                        My Profile
                      </Link>
                      <Link
                        to="/dev-sandbox"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded text-xs font-semibold text-ink-600 hover:text-ink-900 hover:bg-ink-050 transition-colors"
                      >
                        <VamiIcon name="settings" size="sm" />
                        Settings
                      </Link>

                      <hr className="border-border-default my-1" />

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded text-xs font-semibold text-error-500 hover:bg-error-100/10 transition-colors text-left cursor-pointer"
                      >
                        <VamiIcon name="delete" size="sm" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex h-9 items-center justify-center rounded-lg bg-ink-900 px-4 text-xs font-bold text-surface-white hover:bg-ink-800 transition-all active:scale-95 shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Render Mobile Draw overlay */}
      <MobileNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
