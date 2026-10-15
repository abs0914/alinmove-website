"use client";

import { trackEvent, type EventName, type EventProps } from "./analytics";

const fired = new Set<string>();

export function trackOnce(key: string, name: EventName, props?: EventProps) {
  if (fired.has(key)) return;
  fired.add(key);
  trackEvent(name, props);
}
