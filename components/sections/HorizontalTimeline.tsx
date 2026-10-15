"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { registerScrollTrigger, registerDrawSVG } from "@/lib/gsap-config";
import { cn } from "@/lib/utils";

export type TimelineStep = {
  /**
   * Pre-rendered icon element. Caller controls sizing (e.g. `className="h-7 w-7"`)
   * because function-component references can't cross the RSC boundary into
   * this client component.
   */
  icon: ReactNode;
  title: string;
  description: string;
};

/**
 * Generic horizontal 5-step timeline with a dashed gold connector and
 * numbered gold circles. Used by /how-it-works and /drive.
 *
 * Motion: connector drawn with GSAP DrawSVG on scroll-into-view, circles
 * stagger-reveal on the same trigger. Reduced-motion: connector pre-drawn,
 * circles visible immediately.
 *
 * Mobile (< sm): vertical stack with the connector hidden — each step renders
 * as a row with the numbered circle on the left.
 */
export function HorizontalTimeline({
  steps,
  className,
}: {
  steps: TimelineStep[];
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

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
            gsap.set(".timeline-step", { autoAlpha: 1, y: 0 });
            if (pathRef.current) gsap.set(pathRef.current, { opacity: 1 });
            return;
          }

          const ST = await registerScrollTrigger();
          if (!ST) return;
          // DrawSVG is optional — if it fails to load (paid plugin missing),
          // fall back to opacity reveal of the connector.
          const drawPromise = registerDrawSVG();
          const draw = drawPromise ? await drawPromise.catch(() => null) : null;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: scope.current,
              start: "top 75%",
              once: true,
            },
          });

          if (pathRef.current) {
            if (draw) {
              tl.from(
                pathRef.current,
                { drawSVG: "0%", duration: 1.2, ease: "power2.inOut" },
                0,
              );
            } else {
              tl.from(pathRef.current, { opacity: 0, duration: 0.8 }, 0);
            }
          }

          tl.from(
            ".timeline-step",
            { y: 24, autoAlpha: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
            0.2,
          );
        },
      );
    },
    { scope, dependencies: [steps.length] },
  );

  return (
    <div ref={scope} className={cn("relative", className)}>
      {/* Dashed connector — desktop only */}
      <svg
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-8 hidden h-2 w-full sm:block"
        viewBox="0 0 1000 8"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M 20 4 L 980 4"
          stroke="var(--alin-gold)"
          strokeWidth="2"
          strokeDasharray="6 6"
          fill="none"
          opacity="0.6"
        />
      </svg>

      <ol className="grid gap-8 sm:grid-cols-5 sm:gap-4">
        {steps.map((step, i) => (
          <li
            key={i}
            className="timeline-step relative flex flex-col items-center text-center"
          >
            <div className="relative">
              <span
                className="relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-full border border-alin-gold/50 bg-alin-near-black text-alin-gold"
                aria-hidden
              >
                {step.icon}
              </span>
              <span
                aria-hidden
                className="absolute -right-1 -top-1 z-20 inline-flex h-6 w-6 items-center justify-center rounded-full bg-alin-gold text-xs font-bold text-alin-black"
              >
                {i + 1}
              </span>
            </div>
            <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-alin-white">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-alin-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
