/**
 * Launch-mode flag — single source of truth for CTA destinations and the
 * waitlist-vs-live swap.
 *
 * Reference: CLAUDE.md rule #2.
 *
 * The site ships in **`live`** mode by default. Both apps are live on the
 * App Store and Google Play — the canonical CTA helper is
 * `downloadHref(audience, platform?)`, backed by the store URLs below.
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

export type StorePlatform = "ios" | "android";

export const CUSTOMER_PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim() ||
  "https://play.google.com/store/apps/details?id=com.alinmove.customer";

export const RIDER_PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL_RIDER?.trim() ||
  "https://play.google.com/store/apps/details?id=com.alinmove.driver";

export const CUSTOMER_APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL?.trim() ||
  "https://apps.apple.com/ph/app/alin-move/id6797973403";

export const RIDER_APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL_RIDER?.trim() ||
  "https://apps.apple.com/ph/app/alin-move-driver/id6797973038";

/** Official store listing for an app (customer = ALiN Move, rider = ALiN Move Driver). */
export function storeUrl(audience: DownloadAudience, platform: StorePlatform): string {
  if (platform === "ios") return audience === "rider" ? RIDER_APP_STORE_URL : CUSTOMER_APP_STORE_URL;
  return audience === "rider" ? RIDER_PLAY_STORE_URL : CUSTOMER_PLAY_STORE_URL;
}

/**
 * Canonical CTA helper. Both apps ship on iOS and Android.
 *
 * With a platform (store badges) it returns that store's listing. Without one
 * (generic "Download" buttons) it returns `/download?intent=…`: phones are
 * redirected to that app's store listing by user-agent, everyone else sees
 * the download page. A bare `/download` always shows the page with both apps.
 */
export function downloadHref(audience: DownloadAudience, platform?: StorePlatform): string {
  if (platform) return storeUrl(audience, platform);
  return `/download?intent=${audience}`;
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
