"use client";

import Image from "next/image";
import { downloadHref, type DownloadAudience, type StorePlatform } from "@/lib/launch-mode";
import { trackEvent, type EventName } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

// Official badge artwork, 469 × 163.
const BADGE: Record<StorePlatform, { src: string; store: string }> = {
  ios: { src: "/img/badges/app-store.png", store: "the App Store" },
  android: { src: "/img/badges/google-play.png", store: "Google Play" },
};

const HEIGHT: Record<Size, string> = {
  sm: "h-9",
  md: "h-12",
  lg: "h-14",
};

function StoreBadge({
  platform,
  audience,
  size,
  event: eventOverride,
}: {
  platform: StorePlatform;
  audience: DownloadAudience;
  size: Size;
  event?: EventName;
}) {
  const { src, store } = BADGE[platform];
  const event =
    eventOverride ?? (platform === "ios" ? "store_badge_ios_click" : "store_badge_android_click");

  return (
    <a
      href={downloadHref(audience, platform)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent(event, { audience })}
      aria-label={`Download ${audience === "rider" ? "ALiN Move Driver" : "ALiN Move"} on ${store}`}
      className="inline-flex shrink-0 rounded-lg transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alin-gold focus-visible:ring-offset-2 focus-visible:ring-offset-alin-black"
    >
      <Image src={src} alt="" width={469} height={163} className={cn("w-auto", HEIGHT[size])} />
    </a>
  );
}

export function StoreBadges({
  audience = "customer",
  size = "md",
  platforms = ["ios", "android"],
  events,
  className,
}: {
  audience?: DownloadAudience;
  size?: Size;
  /** Which platforms to render. Default: both. */
  platforms?: StorePlatform[];
  /** Per-platform analytics event, replacing the generic store_badge_* events. */
  events?: Partial<Record<StorePlatform, EventName>>;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {platforms.map((p) => (
        <StoreBadge key={p} platform={p} audience={audience} size={size} event={events?.[p]} />
      ))}
    </div>
  );
}
