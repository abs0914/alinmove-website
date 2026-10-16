"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * The base code in `<head>` (see MetaPixelHead) tracks the first PageView.
 * App Router navigations don't reload the page, so later route changes are
 * tracked here.
 */
export function MetaPixelPageViews() {
  const pathname = usePathname();
  const firstView = useRef(true);

  useEffect(() => {
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
