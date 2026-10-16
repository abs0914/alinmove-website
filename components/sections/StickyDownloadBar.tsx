"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { showStickyDownloadBar } from "@/lib/launch-mode";
import { trackEvent } from "@/lib/analytics";
import { StoreBadges } from "@/components/brand/StoreBadges";
import { cn } from "@/lib/utils";

export function StickyDownloadBar() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const isTrackingPage = pathname === "/tracking" || pathname === "/track";
  // /download already shows every store badge.
  const enabled = showStickyDownloadBar() && !isTrackingPage && pathname !== "/download";

  // Rider sub-tree shows the rider variant; everything else, the customer.
  const audience = pathname?.startsWith("/drive") ? "rider" : "customer";
  const headline = audience === "rider" ? "Get the Rider App" : "Get the App";

  useEffect(() => {
    if (!enabled) return;
    const handler = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      setVisible(scrolled / total >= 0.35);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 border-t border-alin-border bg-alin-black/95 px-4 py-3 backdrop-blur transition-transform duration-200 lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      onTransitionEnd={() => {
        if (visible) trackEvent("sticky_download_bar_click", { phase: "shown", audience });
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-alin-white">{headline}</span>
        <StoreBadges audience={audience} size="sm" />
      </div>
    </div>
  );
}
