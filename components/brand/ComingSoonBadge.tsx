import { cn } from "@/lib/utils";

/**
 * Coming-soon overlay used in place of real App Store / Play Store badges
 * during the waitlist window. Visual frame matches the real badges.
 */
export function ComingSoonBadge({
  platform,
  size = "md",
  className,
}: {
  platform: "ios" | "android";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-9 px-3 text-[10px]",
    md: "h-12 px-4 text-xs",
    lg: "h-14 px-5 text-sm",
  } as const;
  return (
    <span
      role="img"
      aria-label={`Coming soon to ${platform === "ios" ? "App Store" : "Google Play"}`}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-lg border border-alin-border bg-alin-near-black font-medium text-alin-white",
        sizes[size],
        className,
      )}
    >
      <span aria-hidden className="text-alin-muted">
        {platform === "ios" ? "App Store" : "Google Play"}
      </span>
      <span className="absolute -top-2 -right-2 rounded-full bg-alin-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-alin-black">
        Soon
      </span>
    </span>
  );
}
