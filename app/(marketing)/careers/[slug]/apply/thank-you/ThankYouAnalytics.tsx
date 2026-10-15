"use client";

import { useEffect } from "react";
import { trackOnce } from "@/lib/analytics-helpers";

export function ThankYouAnalytics({ jobSlug }: { jobSlug: string }) {
  useEffect(() => {
    trackOnce(`careers-apply-thankyou:${jobSlug}`, "careers_apply_thankyou_view", {
      job_slug: jobSlug,
    });
  }, [jobSlug]);
  return null;
}
