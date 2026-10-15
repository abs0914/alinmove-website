"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { registerScrollTrigger } from "@/lib/gsap-config";

/**
 * Pattern 2 — Scroll reveal (staggered cards).
 * Skill: gsap-patterns. Default selector `.reveal-item`.
 */
export function StaggerReveal({
  children,
  selector = ".reveal-item",
}: {
  children: React.ReactNode;
  selector?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        async (ctx) => {
          if (ctx.conditions?.reduce) {
            gsap.set(selector, { autoAlpha: 1, y: 0 });
            return;
          }

          const ST = await registerScrollTrigger();
          if (!ST) return;

          gsap.utils.toArray<HTMLElement>(selector).forEach((el, i) => {
            gsap.from(el, {
              y: 32,
              autoAlpha: 0,
              duration: 0.6,
              ease: "power2.out",
              delay: i * 0.04,
              scrollTrigger: { trigger: el, start: "top 82%", once: true },
            });
          });
        },
      );
    },
    { scope, dependencies: [selector] },
  );

  return <div ref={scope}>{children}</div>;
}
