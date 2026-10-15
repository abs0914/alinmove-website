"use client";

import { LazyMotion, domAnimation } from "framer-motion";

/**
 * Wraps a subtree so `m.*` components from `@/lib/motion` resolve their feature
 * pack lazily. Mounted once in the marketing layout.
 *
 * Reference: CLAUDE.md rule #4. Uses `domAnimation` (not `domMax`) — covers
 * transforms, opacity, layout. Add gestures/drag features only if a future
 * component actually needs them; they roughly double the bundle cost.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
