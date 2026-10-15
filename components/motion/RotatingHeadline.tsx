"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Pattern (custom) — Rotating-word headline.
 * Adapted from a framer-motion snippet to GSAP so it stays inside the
 * project's single motion stack (CLAUDE.md rule #4).
 *
 * Props are content-agnostic so any page can supply on-brand copy.
 *
 * Example (on /about or /business):
 *   <RotatingHeadline
 *     eyebrow={{ label: "Read the launch story", href: "/blog/launch" }}
 *     prefix="From your doorstep to"
 *     words={["any city", "any island", "any branch", "anywhere"]}
 *     suffix="in the Philippines."
 *     body="One booking moves a parcel from sender to recipient — across town or across the country — on the ALiN Cargo Express network."
 *     primaryCta={{ label: "Join the waitlist", href: "/waitlist" }}
 *     secondaryCta={{ label: "Tour the network", href: "/network" }}
 *   />
 */

export interface RotatingHeadlineProps {
  eyebrow?: { label: string; href: string };
  prefix: string;
  words: string[];
  suffix?: string;
  body?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  intervalMs?: number;
  className?: string;
}

export function RotatingHeadline({
  eyebrow,
  prefix,
  words,
  suffix,
  body,
  primaryCta,
  secondaryCta,
  intervalMs = 2000,
  className,
}: RotatingHeadlineProps) {
  const scope = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reduced || words.length <= 1) return;
    const id = setTimeout(
      () => setActive((n) => (n + 1) % words.length),
      intervalMs,
    );
    return () => clearTimeout(id);
  }, [active, reduced, words.length, intervalMs]);

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>(".rotating-word", scope.current);
      if (!els.length) return;

      if (reduced) {
        els.forEach((el, i) =>
          gsap.set(el, { y: 0, autoAlpha: i === active ? 1 : 0 }),
        );
        return;
      }

      els.forEach((el, i) => {
        if (i === active) {
          gsap.to(el, { y: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" });
        } else {
          gsap.to(el, {
            y: i < active ? -150 : 150,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power2.out",
          });
        }
      });
    },
    { scope, dependencies: [active, reduced] },
  );

  return (
    <section
      ref={scope}
      className={cn("section bg-alin-black", className)}
    >
      <div className="container-page">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          {eyebrow && (
            <Button asChild variant="secondary" size="sm" className="gap-3">
              <Link href={eyebrow.href}>
                {eyebrow.label}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          )}

          <div className="flex flex-col gap-4">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-alin-white sm:text-5xl md:text-6xl">
              <span>{prefix}</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {words.map((word, i) => (
                  <span
                    key={word}
                    className="rotating-word absolute font-bold text-alin-gold opacity-0"
                    aria-hidden={i !== active}
                  >
                    {word}
                  </span>
                ))}
                <span className="sr-only" aria-live="polite" aria-atomic>
                  {words[active]}
                </span>
              </span>
              {suffix && <span>{suffix}</span>}
            </h1>

            {body && (
              <p className="mx-auto max-w-2xl text-lg leading-relaxed tracking-tight text-alin-muted md:text-xl">
                {body}
              </p>
            )}
          </div>

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-row flex-wrap justify-center gap-3">
              {secondaryCta && (
                <Button asChild size="lg" variant="outline" className="gap-3">
                  <Link href={secondaryCta.href}>
                    {secondaryCta.label}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              )}
              {primaryCta && (
                <Button asChild size="lg" className="gap-3">
                  <Link href={primaryCta.href}>
                    {primaryCta.label}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
