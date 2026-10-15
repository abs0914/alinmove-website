"use client";

import Link from "next/link";
import { Apple, Play } from "lucide-react";
import { downloadHref, type DownloadAudience } from "@/lib/launch-mode";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";
type Platform = "ios" | "android";

const SIZE: Record<Size, { h: string; px: string; iconBox: string; iconStroke: number; eyebrow: string; wordmark: string }> = {
  sm: { h: "h-10", px: "px-3", iconBox: "h-5 w-5", iconStroke: 1.75, eyebrow: "text-[9px]", wordmark: "text-sm" },
  md: { h: "h-12", px: "px-4", iconBox: "h-6 w-6", iconStroke: 1.75, eyebrow: "text-[10px]", wordmark: "text-base" },
  lg: { h: "h-14", px: "px-5", iconBox: "h-7 w-7", iconStroke: 1.5, eyebrow: "text-xs", wordmark: "text-lg" },
};

function StoreBadge({
  platform,
  audience,
  size,
}: {
  platform: Platform;
  audience: DownloadAudience;
  size: Size;
}) {
  const s = SIZE[size];
  const Icon = platform === "ios" ? Apple : Play;
  const eyebrow = platform === "ios" ? "Download on the" : "GET IT ON";
  const wordmark = platform === "ios" ? "App Store" : "Google Play";
  const event = platform === "ios" ? "store_badge_ios_click" : "store_badge_android_click";

  return (
    <Link
      href={downloadHref(audience, platform)}
      onClick={() => trackEvent(event, { audience })}
      aria-label={`Download ${audience === "rider" ? "ALiN Move Rider" : "ALiN Move"} on ${wordmark}`}
      className={cn(
        "inline-flex items-center gap-3 rounded-xl border border-alin-border bg-alin-black text-alin-white transition-colors hover:bg-alin-near-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alin-gold focus-visible:ring-offset-2 focus-visible:ring-offset-alin-black",
        s.h,
        s.px,
      )}
    >
      <Icon className={s.iconBox} strokeWidth={s.iconStroke} aria-hidden />
      <span className="flex flex-col items-start leading-none">
        <span className={cn("uppercase tracking-wide text-alin-muted", s.eyebrow)}>{eyebrow}</span>
        <span className={cn("font-semibold", s.wordmark)}>{wordmark}</span>
      </span>
    </Link>
  );
}

export function StoreBadges({
  audience = "customer",
  size = "md",
  platforms,
  className,
}: {
  audience?: DownloadAudience;
  size?: Size;
  /** Which platforms to render. Default: both for customer, android-only for rider. */
  platforms?: Platform[];
  className?: string;
}) {
  const list: Platform[] = platforms ?? (audience === "rider" ? ["android"] : ["ios", "android"]);
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {list.map((p) => (
        <StoreBadge key={p} platform={p} audience={audience} size={size} />
      ))}
    </div>
  );
}
