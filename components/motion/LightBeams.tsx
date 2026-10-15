"use client";

import { useId, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

const BEAMS = [
  { x: 8, w: 2, delay: 0, dur: 4.0 },
  { x: 22, w: 3, delay: 0.6, dur: 4.6 },
  { x: 38, w: 2, delay: 1.2, dur: 3.8 },
  { x: 56, w: 4, delay: 0.3, dur: 5.0 },
  { x: 72, w: 2, delay: 0.9, dur: 4.2 },
  { x: 88, w: 3, delay: 1.5, dur: 4.4 },
];

/**
 * Decorative animated gold beams. Sits behind hero content; pointer-events
 * disabled. GSAP loops opacity + scaleY independently per beam. Reduced-motion
 * snaps to a static low-opacity end state.
 *
 * Mount inside a positioned parent (relative / absolute container).
 */
export function LightBeams({ className }: { className?: string }) {
  const id = useId();
  const gradientId = `lb-grad-${id.replace(/[:]/g, "")}`;
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          if (ctx.conditions?.reduce) {
            gsap.set(".lb-beam", { opacity: 0.4, transformOrigin: "50% 100%", scaleY: 1 });
            return;
          }
          gsap.set(".lb-beam", { opacity: 0.05, transformOrigin: "50% 100%", scaleY: 0.6 });
          gsap.utils.toArray<SVGLineElement>(".lb-beam").forEach((el, i) => {
            const beam = BEAMS[i];
            if (!beam) return;
            gsap.to(el, {
              opacity: 0.55,
              scaleY: 1,
              duration: beam.dur,
              delay: beam.delay,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          });
        },
      );
    },
    { scope: scope as unknown as React.RefObject<HTMLElement> },
  );

  return (
    <svg
      ref={scope}
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--alin-gold)" stopOpacity="0.85" />
          <stop offset="60%" stopColor="var(--alin-gold)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--alin-gold)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {BEAMS.map((b, i) => (
        <line
          key={i}
          className="lb-beam"
          x1={b.x}
          x2={b.x}
          y1={100}
          y2={0}
          stroke={`url(#${gradientId})`}
          strokeWidth={b.w}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
