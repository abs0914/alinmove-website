"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * Pattern 6 — CTA microinteraction.
 * Skill: gsap-patterns. Hover/focus lift on primary CTAs only. Never autoplay.
 */
export function MicroLift({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const enter = () => gsap.to(el, { scale: 1.02, y: -2, duration: 0.18, ease: "power2.out" });
    const leave = () => gsap.to(el, { scale: 1, y: 0, duration: 0.18, ease: "power2.out" });
    el.addEventListener("mouseenter", enter);
    el.addEventListener("focusin", enter);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("focusout", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("focusin", enter);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("focusout", leave);
    };
  }, []);

  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}
