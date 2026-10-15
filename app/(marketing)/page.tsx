import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { MultiPhoneHero } from "@/components/sections/MultiPhoneHero";
import { ProblemsStrip } from "@/components/sections/ProblemsStrip";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { SimplePricingCards } from "@/components/sections/SimplePricingCards";
import { FooterCtaBanner } from "@/components/sections/FooterCtaBanner";
import { DownloadRiderAppButton } from "@/components/brand/DownloadRiderAppButton";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "ALiN Move — Doorstep to anywhere",
  description:
    "Send packages doorstep to anywhere in the Philippines. Door-to-door or pickup-to-branch shipping in seconds, powered by the ALiN Cargo Express network.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/* 1 — Hero */}
      <MultiPhoneHero />

      {/* 2 — Trust strip */}
      <section className="border-y border-alin-border bg-alin-near-black py-6">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-alin-muted">
          <span>Powered by ALiN Cargo Express</span>
          <span aria-hidden>·</span>
          <span>Nationwide branch network</span>
          <span aria-hidden>·</span>
          <span>Real-time tracking</span>
          <span aria-hidden>·</span>
          <span>Real Filipino riders</span>
        </div>
      </section>

      {/* 3 — Problems we solve */}
      <ProblemsStrip />

      {/* 4 — Service grid */}
      <ServiceGrid />

      {/* 5 — Network advantage (ACE moat split) */}
      <section className="bg-alin-near-black pb-4 pt-16 lg:pb-6 lg:pt-24">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wider text-alin-gold">
              The network advantage
            </p>
            <h2 className="mt-2 text-3xl font-bold text-alin-white sm:text-4xl">
              Last-mile apps stop at the city limit.{" "}
              <span className="text-alin-gold">We don&apos;t.</span>
            </h2>
            <p className="mt-4 text-lg text-alin-muted">
              Local-only delivery apps end where their riders end — your city. ALiN Move runs on
              the ALiN Cargo Express branch network, so a doorstep in Cebu can reach a doorstep in
              Manila in a single booking.
            </p>
            <div className="mt-6">
              <Link
                href="/network"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-alin-gold hover:underline"
              >
                Tour the network <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="mt-10 grid items-start gap-4 lg:grid-cols-[minmax(0,532fr)_minmax(0,1150fr)]">
            <Image
              src="/img/home/network-intracity.png"
              alt="Intra-city delivery limited to a city-bound rider network"
              width={532}
              height={941}
              quality={90}
              sizes="(min-width: 1280px) 379px, (min-width: 1024px) 31vw, (min-width: 532px) 532px, calc(100vw - 2rem)"
              className="h-auto w-full max-w-[532px] justify-self-center lg:max-w-none"
            />
            <Image
              src="/img/home/network-ace-backbone.png"
              alt="The ACE backbone connecting rider pickup, branch receipt, line-haul movement, destination branch, and final delivery"
              width={1150}
              height={941}
              quality={90}
              sizes="(min-width: 1280px) 821px, (min-width: 1024px) 67vw, calc(100vw - 2rem)"
              className="h-auto w-full justify-self-center"
            />
          </div>
        </div>
      </section>

      {/* 6 — Simple pricing teaser */}
      <section className="bg-alin-near-black pb-16 pt-4 lg:pb-24 lg:pt-6">
        <div className="container-page max-w-5xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-alin-white sm:text-4xl">
              Simple, <span className="text-alin-gold">transparent</span> pricing.
            </h2>
            <p className="mt-3 text-alin-muted">No hidden fees. No surprises.</p>
          </div>
          <div className="mt-8">
            <SimplePricingCards />
          </div>
        </div>
      </section>

      {/* 7 — Driver teaser */}
      <section className="bg-alin-gold py-16 lg:py-20">
        <div className="container-page grid items-center gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-alin-black/70">
              Drive with us
            </p>
            <h2 className="mt-2 text-3xl font-bold text-alin-black sm:text-4xl lg:text-5xl">
              Drive flexibly. Move with the network.
            </h2>
            <p className="mt-3 max-w-2xl text-alin-black/80">
              Pick your vehicle. Pick your hours. Pick your jobs. The ACE network unlocks more
              variety of work in the same app — door-to-door, branch handoffs, cross-city cargo.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <DownloadRiderAppButton
              className="bg-alin-black text-alin-white hover:bg-alin-graphite"
            />
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-alin-black text-alin-black hover:bg-alin-black hover:text-alin-white"
            >
              <Link href="/drive/flexibility">Why flexibility?</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 8 — Footer CTA banner */}
      <FooterCtaBanner variant="customer" />
    </>
  );
}
