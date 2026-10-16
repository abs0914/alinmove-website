/**
 * Client-side analytics entry point.
 * Reference: .claude/skills/analytics-events/SKILL.md
 *
 * Single typed `EventName` union. Provider wiring (GA4 or PostHog) is added in
 * `app/(marketing)/layout.tsx` and exposes `window.alinAnalytics.track(...)`.
 */

import { LAUNCH_MODE } from "./launch-mode";

export type EventProps = Record<string, string | number | boolean | null | undefined>;

export type EventName =
  // Page lifecycle
  | "page_view_home"
  | "page_view_network"
  | "page_view_pricing"
  | "page_view_branches"
  | "page_view_how_it_works"
  | "page_view_drive"
  | "page_view_waitlist"
  | "page_view_thankyou"
  // CTA clicks
  | "hero_cta_waitlist_click"
  | "hero_cta_drive_click"
  | "footer_cta_waitlist_click"
  | "sticky_waitlist_bar_click"
  | "sticky_download_bar_click"
  | "store_badge_ios_click"
  | "store_badge_android_click"
  | "store_badge_coming_soon_click"
  | "download_click_customer"
  | "download_click_rider"
  // /download page store links — one event per app × platform
  | "download_page_customer_ios_click"
  | "download_page_customer_android_click"
  | "download_page_driver_ios_click"
  | "download_page_driver_android_click"
  | "track_package_click"
  | "public_tracking_submit"
  | "public_tracking_success"
  | "public_tracking_not_found"
  | "public_tracking_invalid"
  | "public_tracking_provider_error"
  | "public_tracking_help_opened"
  | "public_tracking_pod_opened"
  | "watch_video_open"
  | "comparison_view"
  | "phone_carousel_change"
  | "pricing_card_click"
  | "pai_card_view"
  // Waitlist (PRIMARY KPI during pre-launch)
  | "waitlist_form_view"
  | "waitlist_submit_attempt"
  | "waitlist_submit_success"
  | "waitlist_submit_error"
  | "waitlist_thankyou_view"
  | "waitlist_thankyou_share_click"
  // Driver pipeline
  | "apply_form_view"
  | "apply_submit_attempt"
  | "apply_submit_success"
  | "apply_submit_error"
  // Careers / ATS
  | "careers_page_view"
  | "careers_filter_change"
  | "careers_job_view"
  | "careers_apply_form_view"
  | "careers_apply_submit_attempt"
  | "careers_apply_submit_success"
  | "careers_apply_submit_error"
  | "careers_apply_thankyou_view"
  // Engagement
  | "coverage_search"
  | "coverage_city_view"
  | "branch_search"
  | "branch_region_filter"
  | "branch_map_toggle"
  | "branch_marker_click"
  | "branch_card_toggle"
  | "branch_directions_click"
  | "branch_phone_click"
  | "branch_email_click"
  | "network_map_branch_click"
  | "service_card_click"
  | "vehicle_tab_change"
  | "faq_expand"
  | "scroll_50"
  | "scroll_75"
  | "reduced_motion_toggle"
  // Performance
  | "long_animation_frame";

declare global {
  interface Window {
    alinAnalytics?: {
      track: (name: string, props?: EventProps) => void;
    };
  }
}

export function trackEvent(name: EventName, props: EventProps = {}) {
  const enriched = { ...props, launch_mode: LAUNCH_MODE };
  if (typeof window !== "undefined") {
    window.alinAnalytics?.track(name, enriched);
  }
}
