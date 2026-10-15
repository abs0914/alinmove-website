"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { registerScrollTrigger } from "@/lib/gsap-config";

/**
 * Pattern 5 — Animated counter (KPI / proof stats).
 * Skill: gsap-patterns. Fires once when the element scrolls into view.
 */
export function CountUp({
  to,
  duration = 1.2,
  format = (n: number) => Math.round(n).toLocaleString(),
  className,
  prefix = "",
  suffix = "",
}: {
  to: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      async (ctx) => {
        const el = ref.current;
        if (!el) return;
        if (ctx.conditions?.reduce) {
          el.textContent = `${prefix}${format(to)}${suffix}`;
          return;
        }

        const ST = await registerScrollTrigger();
        if (!ST) return;

        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            if (ref.current) ref.current.textContent = `${prefix}${format(obj.v)}${suffix}`;
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      },
    );
  }, []);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
