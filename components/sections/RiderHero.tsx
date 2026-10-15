import Image from "next/image";
import { BadgePercent, ShieldCheck, Wallet, Network, ChevronsRight } from "lucide-react";
import { DownloadRiderAppButton } from "@/components/brand/DownloadRiderAppButton";
import { PhoneFrame } from "@/components/brand/PhoneFrame";
import { WatchVideoButton } from "@/components/sections/WatchVideoButton";
import { HeroIntro } from "@/components/motion/HeroIntro";

const QUICK_BENEFITS = [
  { icon: BadgePercent, top: "80% Commission", bottom: "Per Delivery" },
  { icon: ShieldCheck, top: "Your Safety", bottom: "Our Priority" },
  { icon: Wallet, top: "Fast Cashout", bottom: "Anytime" },
  { icon: Network, top: "Strong Network", bottom: "Nationwide" },
];

/**
 * /drive hero. Full-bleed photographic background (driver-hero.png — city
 * skyline + ALiN Move fleet and rider baked into the image). Text
 * content sits on top via a left-side gradient mask so the H1 stays legible.
 * Phone mockup floats over the right portion of the photo.
 *
 * `videoUrl` wires up the WatchVideoButton — when omitted, the button still
 * renders for visual completeness but the click is a no-op.
 *
 * The driver-hero.png already provides light beams, so no <LightBeams /> is
 * layered on top.
 */
export function RiderHero({ videoUrl }: { videoUrl?: string }) {
  return (
    <section className="relative overflow-hidden bg-alin-black">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/img/photo/driver-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-left lg:-translate-x-[35%]"
        />
      </div>
      {/* Left-edge dark fade — keeps headline / chips legible over the photo */}
      <div
        aria-hidden
        className="via-alin-black/70 pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-alin-black to-transparent"
      />
      {/* Right-side dark zone — where the phone overlay floats. Starts inside
          the image so the transition reads as a soft fade, not a hard line. */}
      <div
        aria-hidden
        className="via-alin-black/80 pointer-events-none absolute inset-y-0 right-0 hidden w-[45%] bg-gradient-to-r from-transparent to-alin-black lg:block"
      />
      {/* Bottom gradient — fades into next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-alin-black"
      />

      <div className="container-page relative z-10 grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-24">
        {/* Left — copy + CTA */}
        <HeroIntro>
          <div className="space-y-6">
            <span className="border-alin-gold/50 bg-alin-near-black/80 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-alin-gold backdrop-blur">
              Be an ALiN Move Rider
              <ChevronsRight className="h-4 w-4" aria-hidden />
            </span>

            <h1 className="hero-title text-4xl font-extrabold uppercase italic leading-[1.05] tracking-tight text-alin-white sm:text-5xl lg:text-6xl">
              Ride. Deliver. <br />
              <span className="text-alin-gold">Earn More.</span>
            </h1>

            <p className="hero-sub max-w-lg text-lg text-alin-muted">
              Drive flexibly and receive an 80% driver commission on every completed delivery.
            </p>

            <ul className="hero-cta grid grid-cols-2 gap-3 sm:grid-cols-4">
              {QUICK_BENEFITS.map((b) => (
                <li
                  key={b.top}
                  className="bg-alin-near-black/70 flex flex-col items-start gap-1 rounded-lg border border-alin-border p-3 backdrop-blur"
                >
                  <span
                    aria-hidden
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-alin-gold"
                  >
                    <b.icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold leading-tight text-alin-white">
                    {b.top}
                  </span>
                  <span className="text-[10px] uppercase leading-tight text-alin-muted">
                    {b.bottom}
                  </span>
                </li>
              ))}
            </ul>

            <div className="hero-cta flex flex-wrap items-center gap-5">
              <DownloadRiderAppButton />
              <WatchVideoButton videoUrl={videoUrl} surface="rider" />
            </div>
            <p className="hero-cta text-xs text-alin-muted">Available on iOS and Android</p>
          </div>
        </HeroIntro>

        {/* Right — phone overlay floats over the photo's right portion */}
        <div className="relative hidden lg:block">
          <PhoneFrame
            src="/img/rider-app/dashboard.png"
            alt="ALiN Move rider app dashboard showing today's earnings"
            className="ml-auto max-w-[300px]"
          />
        </div>
      </div>
    </section>
  );
}
