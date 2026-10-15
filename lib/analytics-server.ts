/**
 * Server-side analytics entry point. Conversion-critical events MUST fire
 * here (not just client-side) so they survive ad blockers.
 *
 * For now this no-ops with a console.info; wire to GA4 Measurement Protocol
 * or PostHog server SDK once an analytics provider is chosen.
 */

import { LAUNCH_MODE } from "./launch-mode";
import type { EventName, EventProps } from "./analytics";

export async function trackEventServer(name: EventName, props: EventProps = {}) {
  const enriched = { ...props, launch_mode: LAUNCH_MODE, ts: new Date().toISOString() };
  // TODO: pipe to provider once chosen (GA4 MP / PostHog server SDK).
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.info("[analytics-server]", name, enriched);
  }
}
