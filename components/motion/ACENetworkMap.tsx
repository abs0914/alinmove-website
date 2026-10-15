"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { registerDrawSVG, registerMotionPath } from "@/lib/gsap-config";

/**
 * Pattern 3 — ACE Network Map.
 * Skill: gsap-patterns.
 *
 * Hybrid implementation:
 *  - PNG basemap (`/public/src/ace-map.png`) is the LCP image, drawn unanimated.
 *  - SVG overlay above the PNG holds the branch markers, two route paths,
 *    and a flying parcel dot. The SVG shares the basemap's 715×671 viewBox so
 *    you can position points in raw pixel coordinates of the PNG.
 *
 * TUNING: branch positions and route Bezier curves were placed by eye against
 * a typical PH map. Adjust the BRANCHES, LUZON_TO_VISAYAS, and VISAYAS_TO_MINDANAO
 * constants to match your asset's exact pin locations.
 */

const MAP_W = 715;
const MAP_H = 671;

// Pixel coords on the 715x671 basemap. Tune to taste.
const BRANCHES: { x: number; y: number; label: string }[] = [
  { x: 360, y: 215, label: "Manila" },
  { x: 372, y: 195, label: "Quezon City" },
  { x: 350, y: 175, label: "Clark" },
  { x: 380, y: 285, label: "Lipa" },
  { x: 415, y: 395, label: "Cebu City" },
  { x: 422, y: 388, label: "Mandaue" },
  { x: 433, y: 400, label: "Lapu-Lapu" },
  { x: 470, y: 470, label: "Cagayan de Oro" },
  { x: 510, y: 545, label: "Davao" },
];

const LUZON_TO_VISAYAS = "M 372 195 C 395 280, 405 340, 415 395";
const VISAYAS_TO_MINDANAO = "M 415 395 C 445 430, 480 490, 510 545";

export function ACENetworkMap() {
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
            // Reduced-motion: routes fully drawn, parcel hidden, branches visible.
            gsap.set(["#route-luzon-vis", "#route-vis-min"], {
              strokeDasharray: "none",
              strokeDashoffset: 0,
              autoAlpha: 1,
            });
            gsap.set(".branch-marker", { autoAlpha: 1, scale: 1 });
            gsap.set("#parcel-dot", { autoAlpha: 0 });
            return;
          }

          const [DrawSVG] = await Promise.all([registerDrawSVG(), registerMotionPath()]);
          if (!DrawSVG) return;

          const tl = gsap.timeline({ repeat: -1, repeatDelay: 2, defaults: { ease: "none" } });
          tl.from(".branch-marker", {
            scale: 0,
            autoAlpha: 0,
            stagger: 0.04,
            duration: 0.4,
            ease: "back.out(2)",
            transformOrigin: "50% 50%",
          })
            .from("#route-luzon-vis", { drawSVG: "0% 0%", duration: 1.4 }, ">-0.2")
            .to(
              "#parcel-dot",
              {
                motionPath: {
                  path: "#route-luzon-vis",
                  align: "#route-luzon-vis",
                  autoRotate: false,
                  alignOrigin: [0.5, 0.5],
                },
                duration: 2,
                autoAlpha: 1,
              },
              "<",
            )
            .from("#route-vis-min", { drawSVG: "0% 0%", duration: 1.0 }, ">-0.4")
            .to(
              "#parcel-dot",
              {
                motionPath: {
                  path: "#route-vis-min",
                  align: "#route-vis-min",
                  autoRotate: false,
                  alignOrigin: [0.5, 0.5],
                },
                duration: 1.4,
              },
              "<",
            )
            .to("#parcel-dot", { autoAlpha: 0, duration: 0.5 }, ">+0.5");
        },
      );
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative mx-auto aspect-square w-full max-w-[560px]">
      <Image
        src="/src/ace-map.png"
        alt="ALiN Cargo Express nationwide branch network across the Philippines"
        width={MAP_W}
        height={MAP_H}
        priority
        sizes="(min-width: 1024px) 560px, 100vw"
        className="h-full w-full object-contain"
      />
      <svg
        aria-hidden
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="branch-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Routes (drawn by DrawSVG) */}
        <path
          id="route-luzon-vis"
          d={LUZON_TO_VISAYAS}
          stroke="var(--alin-gold)"
          strokeWidth={2}
          strokeDasharray="4 6"
          fill="none"
          strokeLinecap="round"
          opacity={0.85}
        />
        <path
          id="route-vis-min"
          d={VISAYAS_TO_MINDANAO}
          stroke="var(--alin-gold)"
          strokeWidth={2}
          strokeDasharray="4 6"
          fill="none"
          strokeLinecap="round"
          opacity={0.85}
        />

        {/* Branch markers */}
        {BRANCHES.map((b) => (
          <g key={b.label} transform={`translate(${b.x} ${b.y})`} className="branch-marker">
            <circle r={6} fill="var(--alin-gold)" filter="url(#branch-glow)" />
            <circle r={2.5} fill="var(--alin-black)" />
          </g>
        ))}

        {/* The flying parcel — positioned by MotionPath at runtime */}
        <circle
          id="parcel-dot"
          r={5}
          fill="var(--alin-white)"
          stroke="var(--alin-gold)"
          strokeWidth={2}
          opacity={0}
        />
      </svg>
    </div>
  );
}
