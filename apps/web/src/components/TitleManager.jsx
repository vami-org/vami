import { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { routesConfig } from "../routes/routesConfig";

/**
 * TitleManager component monitors navigation transitions and matches routes
 * to set document page title tags dynamically.
 *
 * @returns {null}
 */
export function TitleManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Traverse the routes config array to find matching path configurations
    const matchedRoute = routesConfig.find((route) =>
      matchPath({ path: route.path, end: true }, pathname),
    );

    let titleText = "Vami";

    if (matchedRoute?.title) {
      titleText = `${matchedRoute.title} | Vami`;
    } else if (pathname.startsWith("/users/")) {
      const username = pathname.split("/")[2];
      titleText = `@${username} | Vami`;
    }

    document.title = titleText;
  }, [pathname]);

  return null;
}
