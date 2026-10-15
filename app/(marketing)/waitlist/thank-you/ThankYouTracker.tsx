"use client";

import { useEffect } from "react";
import { trackOnce } from "@/lib/analytics-helpers";

export function ThankYouTracker() {
  useEffect(() => {
    trackOnce("waitlist-thankyou-view", "waitlist_thankyou_view");
  }, []);
  return null;
}
