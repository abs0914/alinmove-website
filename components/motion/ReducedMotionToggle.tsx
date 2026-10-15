"use client";

import { useReducedMotion } from "./ReducedMotionProvider";
import { trackEvent } from "@/lib/analytics";

export function ReducedMotionToggle() {
  const { reduced, toggle } = useReducedMotion();
  return (
    <button
      type="button"
      onClick={() => {
        toggle();
        trackEvent("reduced_motion_toggle", { enabled: !reduced });
      }}
      className="text-xs text-alin-muted hover:text-alin-white transition-colors"
      aria-pressed={reduced}
    >
      {reduced ? "Motion reduced — restore" : "Reduce motion"}
    </button>
  );
}
