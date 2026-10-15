"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { registerSplitText } from "@/lib/gsap-config";

/**
 * Pattern 1 — Hero intro (SplitText line reveal).
 * Skill: gsap-patterns. Used on Home, /network, /how-it-works, and /drive.
 *
 * Children must render an H1 with class `hero-title`, optional `.hero-sub`,
 * and optional `.hero-cta` elements.
 *
 * Resilience: the subhead and CTAs animate via a plain timeline that runs
 * regardless of whether SplitText loads. The H1 line-mask reveal is the only
 * thing that depends on SplitText — if that fails, the H1 still renders
 * naturally (no mask, no jump) instead of leaving subhead/CTAs invisible.
 *
 * Reduced motion: everything snaps to its final state with no animation.
 */
export function HeroIntro({ children }: { children: React.ReactNode }) {
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
            gsap.set([".hero-title", ".hero-sub", ".hero-cta"], {
              autoAlpha: 1,
              clearProps: "transform",
            });
            return;
          }

          // Always animate subhead + CTAs (no SplitText dependency).
          const baseTl = gsap.timeline({
            defaults: { duration: 0.7, ease: "power2.out" },
          });
          baseTl
            .from(".hero-sub", { y: 20, autoAlpha: 0 }, 0.25)
            .from(".hero-cta", { y: 14, autoAlpha: 0, stagger: 0.08 }, 0.4);

          // SplitText line reveal — best-effort. If the plugin import or
          // create() throws, the H1 just renders normally.
          let split: ReturnType<NonNullable<Awaited<ReturnType<typeof registerSplitText>>>["create"]> | null = null;
          try {
            const SplitText = await registerSplitText();
            if (SplitText) {
              split = SplitText.create(".hero-title", { type: "lines,words", mask: "lines" });
              gsap.from(split.lines, {
                yPercent: 110,
                stagger: 0.08,
                duration: 0.7,
                ease: "power2.out",
              });
            }
          } catch {
            // Swallow — the base timeline above keeps the rest of the hero alive.
          }

          return () => {
            split?.revert();
          };
        },
      );
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
