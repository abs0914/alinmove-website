/**
 * Motion helpers — single source of truth for Framer Motion usage.
 *
 * Reference: CLAUDE.md rule #4 (motion library policy).
 *
 * House rules:
 *   - Always import `m` from here, never `motion` from framer-motion directly.
 *     `m` is the LazyMotion-aware shorthand and keeps the bundle small.
 *   - The marketing layout already mounts <MotionProvider> (see
 *     components/motion/MotionProvider.tsx) — you usually don't have to think
 *     about it.
 *   - Always gate animations behind `useMotionAllowed()` so the project's
 *     reduced-motion override (system preference + footer toggle) wins over
 *     framer-motion's built-in hook.
 *
 * For timeline / scroll / SVG drawing / looping animations, use GSAP instead.
 */

export { m, type MotionProps, type Variants } from "framer-motion";

import { useReducedMotion as useProjectReducedMotion } from "@/components/motion/ReducedMotionProvider";

/**
 * Returns `true` when motion is allowed (system preference OK and no manual
 * override). Combine with `m.*` initial/animate to get a no-op when reduced.
 *
 * Example:
 *   const allowed = useMotionAllowed();
 *   <m.div initial={allowed ? { opacity: 0 } : false} animate={{ opacity: 1 }} />
 */
export function useMotionAllowed(): boolean {
  const { reduced } = useProjectReducedMotion();
  return !reduced;
}
