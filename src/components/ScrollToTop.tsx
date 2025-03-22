import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component that scrolls to the top of the page when the route changes.
 * Intended to be used once in your app, typically near the root.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when the route (pathname) changes
    window.scrollTo({
      top: 0,
      behavior: "instant" // Use "smooth" for animated scrolling
    });
  }, [pathname]);

  // This component doesn't render anything
  return null;
} 