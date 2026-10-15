"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PhoneFrame } from "@/components/brand/PhoneFrame";
import { m, useMotionAllowed } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export type PhoneScreen = {
  src: string;
  alt: string;
  label: string;
};

const SWIPE_THRESHOLD = 40; // px

/**
 * Horizontal phone-screen carousel with arrow nav, dot indicators, and manual
 * touch swipe. Used by customer and rider app sections. Animation via Framer
 * Motion `m.div` translate.
 *
 * Reduced motion: cross-fade replaced with instant snap (no translate
 * animation).
 *
 * Surface label is appended to the analytics event so dashboards can split
 * customer vs rider interactions.
 */
export function PhoneCarousel({
  screens,
  surface,
  className,
}: {
  screens: PhoneScreen[];
  surface: "customer" | "rider";
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const allowed = useMotionAllowed();
  const touchStart = useRef<number | null>(null);
  const lastReported = useRef<number>(0);

  const goTo = useCallback(
    (next: number) => {
      const safe = ((next % screens.length) + screens.length) % screens.length;
      setIndex(safe);
    },
    [screens.length],
  );

  useEffect(() => {
    if (index === lastReported.current) return;
    lastReported.current = index;
    trackEvent("phone_carousel_change", {
      surface,
      to: screens[index]?.label ?? "",
      index,
    });
  }, [index, surface, screens]);

  return (
    <div className={cn("relative", className)}>
      <div
        className="relative mx-auto overflow-hidden"
        style={{ maxWidth: 360 }}
        onTouchStart={(e) => {
          touchStart.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchStart.current == null) return;
          const end = e.changedTouches[0]?.clientX ?? touchStart.current;
          const delta = end - touchStart.current;
          touchStart.current = null;
          if (Math.abs(delta) < SWIPE_THRESHOLD) return;
          goTo(delta < 0 ? index + 1 : index - 1);
        }}
        aria-roledescription="carousel"
        aria-label={`${surface === "rider" ? "Rider" : "Customer"} app screens`}
      >
        <m.div
          className="flex"
          animate={{ x: `-${index * 100}%` }}
          transition={
            allowed
              ? { type: "spring", stiffness: 220, damping: 32 }
              : { duration: 0 }
          }
        >
          {screens.map((s, i) => (
            <div
              key={s.src}
              className="w-full shrink-0 px-3"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${screens.length}: ${s.label}`}
              aria-hidden={i !== index}
            >
              <PhoneFrame
                src={s.src}
                alt={s.alt}
                sizes="320px"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </m.div>

        {/* Arrow nav — overlaid */}
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous screen"
          className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-alin-border bg-alin-black/70 text-alin-white backdrop-blur transition-colors hover:bg-alin-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alin-gold"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next screen"
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-alin-border bg-alin-black/70 text-alin-white backdrop-blur transition-colors hover:bg-alin-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alin-gold"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <p className="mt-4 text-center text-sm font-medium text-alin-white">
        {screens[index]?.label}
      </p>

      <div className="mt-3 flex justify-center gap-2" role="tablist">
        {screens.map((s, i) => (
          <button
            key={s.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to ${s.label}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-8 bg-alin-gold" : "w-2 bg-alin-border hover:bg-alin-muted",
            )}
          />
        ))}
      </div>
    </div>
  );
}
