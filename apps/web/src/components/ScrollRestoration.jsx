import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollRestoration component resets scroll offset to top on pathname changes.
 *
 * @returns {null}
 */
export function ScrollRestoration() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
