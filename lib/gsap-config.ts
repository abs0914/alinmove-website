"use client";

/**
 * Page-scoped GSAP plugin loaders. Reference: gsap-patterns skill.
 *
 * NEVER `gsap.registerPlugin(...)` at module scope — that defeats page-scoping
 * and ships unused plugins to /pricing. Each motion component awaits only the
 * plugins it needs.
 *
 * GSAP 3.13+ ships SplitText, DrawSVG, MotionPath, etc. as free public plugins.
 */

import gsap from "gsap";

let scrollTriggerPromise: Promise<typeof import("gsap/ScrollTrigger").ScrollTrigger> | null = null;
export function registerScrollTrigger() {
  if (typeof window === "undefined") return null;
  if (!scrollTriggerPromise) {
    scrollTriggerPromise = import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      return ScrollTrigger;
    });
  }
  return scrollTriggerPromise;
}

let splitTextPromise: Promise<typeof import("gsap/SplitText").SplitText> | null = null;
export function registerSplitText() {
  if (typeof window === "undefined") return null;
  if (!splitTextPromise) {
    splitTextPromise = import("gsap/SplitText").then(({ SplitText }) => {
      gsap.registerPlugin(SplitText);
      return SplitText;
    });
  }
  return splitTextPromise;
}

let drawSVGPromise: Promise<typeof import("gsap/DrawSVGPlugin").DrawSVGPlugin> | null = null;
export function registerDrawSVG() {
  if (typeof window === "undefined") return null;
  if (!drawSVGPromise) {
    drawSVGPromise = import("gsap/DrawSVGPlugin").then(({ DrawSVGPlugin }) => {
      gsap.registerPlugin(DrawSVGPlugin);
      return DrawSVGPlugin;
    });
  }
  return drawSVGPromise;
}

let motionPathPromise: Promise<typeof import("gsap/MotionPathPlugin").MotionPathPlugin> | null = null;
export function registerMotionPath() {
  if (typeof window === "undefined") return null;
  if (!motionPathPromise) {
    motionPathPromise = import("gsap/MotionPathPlugin").then(({ MotionPathPlugin }) => {
      gsap.registerPlugin(MotionPathPlugin);
      return MotionPathPlugin;
    });
  }
  return motionPathPromise;
}
