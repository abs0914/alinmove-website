/**
 * Launch-mode flag — single source of truth for CTA destinations and the
 * waitlist-vs-live swap.
 *
 * Reference: CLAUDE.md rule #2.
 *
 * The site ships in **`live`** mode by default. Apps may not be in the stores
 * yet at the moment a given PR lands — the canonical CTA helper is
 * `downloadHref(audience)`, which uses the configured store URL or the
 * official ALiN Move Play Store URL by default.
 *
 * The legacy `customerPrimaryCta()` / `driverPrimaryCta()` / `storeBadgeMode()`
 * helpers are kept for backward compatibility but should not be added to new
 * call sites. Use the new buttons in `components/brand/` instead.
 */

export type LaunchMode = "waitlist" | "live";

export const LAUNCH_MODE: LaunchMode =
  (process.env.NEXT_PUBLIC_LAUNCH_MODE as LaunchMode) ?? "live";

export const isWaitlist = () => LAUNCH_MODE === "waitlist";
export const isLive = () => LAUNCH_MODE === "live";

export type DownloadAudience = "customer" | "rider";

export const CUSTOMER_PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim() ||
  "https://play.google.com/store/apps/details?id=com.alinmove.customer&pcampaignid=web_share";

export const RIDER_PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL_RIDER?.trim() ||
  "https://play.google.com/store/apps/details?id=com.alinmove.driver&pcampaignid=web_share";

/**
 * Canonical CTA helper. Android and generic download actions resolve to the
 * official Play Store listing. The customer iOS action uses the App Store URL
 * when configured and otherwise falls back to the internal download page.
 *
 * Customer apps target both iOS and Android. Rider app is Android-only at
 * launch. Generic download buttons use the corresponding Android listing.
 */
export function downloadHref(audience: DownloadAudience, platform?: "ios" | "android"): string {
  const ios = process.env.NEXT_PUBLIC_APP_STORE_URL;
  const android = audience === "rider" ? RIDER_PLAY_STORE_URL : CUSTOMER_PLAY_STORE_URL;

  if (platform === "ios" && ios && audience === "customer") return ios;
  if (platform === "android") return android;

  if (!platform) return android;

  return audience === "rider" ? "/download?intent=rider" : "/download";
}

/** Customer secondary CTA — same in both modes. */
export const customerSecondaryCta = () => ({
  label: "How it works",
  href: "/how-it-works",
});

/** /track destination — deeplink in live mode, waitlist fallback in pre-launch. */
export const trackingHref = (): string =>
  isWaitlist()
    ? "/waitlist?intent=customer"
    : `${process.env.NEXT_PUBLIC_DEEPLINK_SCHEME ?? "alinmove"}://track`;

/** Should the sticky mobile download bar render? */
export const showStickyDownloadBar = () => isLive();

/**
 * @deprecated Use `downloadHref('customer')` and the
 * `<DownloadCustomerAppButton />` component instead. Retained so existing
 * pages keep compiling until they're rewritten in PRs 2–4.
 */
export const customerPrimaryCta = (): { label: string; href: string } =>
  isWaitlist()
    ? { label: "Join the waitlist", href: "/waitlist" }
    : { label: "Download Customer App", href: downloadHref("customer") };

/**
 * @deprecated Use `downloadHref('rider')` and the
 * `<DownloadRiderAppButton />` component instead.
 */
export const driverPrimaryCta = () => ({
  label: "Download Rider App",
  href: downloadHref("rider"),
});

/**
 * @deprecated The site is live by default; `<StoreBadges />` always renders
 * live badges. Retained because the design doc still references it.
 */
export const showStickyWaitlistBar = () => isWaitlist();

/**
 * @deprecated `<StoreBadges />` no longer branches on this. Retained for any
 * residual call sites that we'll clean up as pages are rewritten.
 */
export const storeBadgeMode = (): "coming-soon" | "live" => (isWaitlist() ? "coming-soon" : "live");

/** Optional: launch-target ISO date for "Apps go live in N days" hero copy. */
export const LAUNCH_TARGET_DATE = process.env.NEXT_PUBLIC_LAUNCH_TARGET_DATE;

export function daysUntilLaunch(): number | null {
  if (!LAUNCH_TARGET_DATE) return null;
  const target = new Date(LAUNCH_TARGET_DATE).getTime();
  const diff = target - Date.now();
  if (Number.isNaN(target) || diff <= 0) return null;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
