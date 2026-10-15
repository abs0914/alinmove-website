import Image from "next/image";
import { Building2, Home as HomeIcon } from "lucide-react";
import { PoweredByACE } from "@/components/brand/ACEBadge";
import { DownloadCustomerAppButton } from "@/components/brand/DownloadCustomerAppButton";
import { TrackPackageButton } from "@/components/brand/TrackPackageButton";
import { PhoneFrame } from "@/components/brand/PhoneFrame";
import { HeroIntro } from "@/components/motion/HeroIntro";

/**
 * Customer Home hero. Server component (HeroIntro is the only client island).
 *
 * Background: full-bleed `customer-hero-background.png` — gold network grid
 * with light beams baked in. The image already provides the lighting motif,
 * so no <LightBeams /> is layered on top.
 *
 * Phone composition: three bezel-wrapped phone screenshots — the centered one
 * is the LCP candidate (`priority`).
 */
export function MultiPhoneHero() {
  return (
    <section className="relative overflow-hidden bg-alin-black">
      <Image
        src="/img/photo/customer-hero-background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover opacity-90"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-alin-black/85 via-alin-black/40 to-transparent"
      />

      <div className="container-page relative z-10 grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        {/* Left — copy + CTA */}
        <HeroIntro>
          <div className="space-y-6">
            <PoweredByACE />
            <h1 className="hero-title text-4xl font-bold tracking-tight text-alin-white sm:text-5xl lg:text-6xl">
              Send packages faster with{" "}
              <span className="text-alin-gold">ALiN Move.</span>
            </h1>
            <p className="hero-sub max-w-lg text-lg text-alin-muted">
              Book door-to-door delivery or pickup-to-branch shipping in seconds. Track your ride,
              pay securely, and stay updated until your package arrives.
            </p>

            <div className="hero-cta flex flex-wrap gap-3">
              <DownloadCustomerAppButton />
              <TrackPackageButton />
            </div>

            {/* Pricing pills */}
            <div className="hero-cta grid max-w-md grid-cols-2 gap-3 pt-2">
              <PricingPill
                icon={<Building2 aria-hidden className="h-5 w-5" />}
                amount="₱70"
                label="Pickup-to-Branch"
              />
              <PricingPill
                icon={<HomeIcon aria-hidden className="h-5 w-5" />}
                amount="₱70"
                label="Door-to-Door"
              />
            </div>
          </div>
        </HeroIntro>

        {/* Right — phone composition */}
        <div className="relative mx-auto h-[460px] w-full max-w-[480px] sm:h-[540px]">
          <PhoneFrame
            src="/img/customer-app/create-delivery.png"
            alt="Create a delivery in the ALiN Move customer app"
            className="absolute left-0 top-12 w-[42%] -rotate-[8deg] sm:top-16"
          />
          <PhoneFrame
            src="/img/customer-app/home.png"
            alt="ALiN Move customer app home screen"
            className="absolute left-1/2 top-0 w-[48%] -translate-x-1/2"
            priority
          />
          <PhoneFrame
            src="/img/customer-app/tracking.png"
            alt="Tracking a delivery in the ALiN Move customer app"
            className="absolute right-0 top-12 w-[42%] rotate-[8deg] sm:top-16"
          />
        </div>
      </div>
    </section>
  );
}

function PricingPill({
  icon,
  amount,
  label,
}: {
  icon: React.ReactNode;
  amount: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-alin-gold/40 bg-alin-near-black/80 px-4 py-3 backdrop-blur">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-alin-black text-alin-gold">
        {icon}
      </span>
      <div className="leading-tight">
        <p className="text-xs uppercase tracking-wide text-alin-muted">Starts at</p>
        <p className="flex items-baseline gap-1 text-base font-bold text-alin-white">
          {amount}
          <span className="text-xs font-normal text-alin-muted">{label}</span>
        </p>
      </div>
    </div>
  );
}
