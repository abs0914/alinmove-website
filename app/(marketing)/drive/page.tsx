import type { Metadata } from "next";
import Link from "next/link";
import { ScrollText, Power, ClipboardCheck, Package, HandCoins, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DownloadRiderAppButton } from "@/components/brand/DownloadRiderAppButton";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { RiderHero } from "@/components/sections/RiderHero";
import { RiderBenefits } from "@/components/sections/RiderBenefits";
import { HorizontalTimeline } from "@/components/sections/HorizontalTimeline";
import { EarningsPanel } from "@/components/sections/EarningsPanel";
import { PhoneCarousel } from "@/components/sections/PhoneCarousel";
import { FooterCtaBanner } from "@/components/sections/FooterCtaBanner";
import { buildMetadata } from "@/lib/seo";

// IMPORTANT (per ace-narrative skill):
//   Riders get FLEXIBILITY, not a career path.
//   No "Junior / Senior / Operator", no "advance", no "promotion".
//   The story is choice — vehicle, hours, services, location.

export const metadata: Metadata = buildMetadata({
  title: "Drive flexibly. Move with the network.",
  description:
    "Pick your vehicle, hours, and jobs. Receive an 80% driver commission with ALiN Move, powered by the ALiN Cargo Express network.",
  path: "/drive",
});

const ICON_CLASS = "h-7 w-7";

const RIDER_STEPS = [
  {
    icon: <ScrollText className={ICON_CLASS} />,
    title: "Register",
    description: "Sign up, submit your documents, and get approved.",
  },
  {
    icon: <Power className={ICON_CLASS} />,
    title: "Go Online",
    description: "Set your availability and receive delivery offers.",
  },
  {
    icon: <ClipboardCheck className={ICON_CLASS} />,
    title: "Accept Jobs",
    description: "Choose the job that fits you.",
  },
  {
    icon: <Package className={ICON_CLASS} />,
    title: "Pick Up & Deliver",
    description: "Follow the steps and deliver safely.",
  },
  {
    icon: <HandCoins className={ICON_CLASS} />,
    title: "Get Paid",
    description: "Receive your 80% driver commission and cash out your earnings.",
  },
];

const RIDER_SCREENS = [
  { src: "/img/rider-app/dashboard.png", alt: "Rider app dashboard", label: "Dashboard" },
  { src: "/img/rider-app/offers.png", alt: "Rider job offers list", label: "Job Offers" },
  { src: "/img/rider-app/navigation.png", alt: "Turn-by-turn navigation", label: "Navigation" },
  {
    src: "/img/rider-app/delivery-steps.png",
    alt: "Step-by-step delivery flow",
    label: "Delivery Steps",
  },
  {
    src: "/img/rider-app/pod.png",
    alt: "Proof-of-delivery signature capture",
    label: "Proof of Delivery",
  },
  {
    src: "/img/rider-app/earnings.png",
    alt: "Rider earnings and cashout history",
    label: "Earnings",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I drive my motorcycle in the morning, switch to my brother's pickup in the afternoon for furniture jobs. Same app, more income.",
    name: "Mark D.",
    role: "Cebu City",
  },
  {
    quote:
      "I see the fare before I accept. No surprise low-pay rides. That alone is the reason I stayed.",
    name: "Joy R.",
    role: "Mandaue",
  },
  {
    quote:
      "The branch handoffs are the best part. I drop a parcel at our branch and the network takes it to Manila. I just keep moving.",
    name: "Allan P.",
    role: "Lapu-Lapu",
  },
];

const FAQ_SLICE = [
  {
    q: "Are there minimum hours or shifts?",
    a: "No. Go online when you want, offline when you want. No quotas.",
  },
  {
    q: "How do I get paid?",
    a: "Maya — same-day after the daily cutoff.",
  },
  {
    q: "Do I need a specific vehicle?",
    a: "No. Drive what you have — motorcycle, sedan, MPV, pickup, or van. You'll see jobs that fit your vehicle.",
  },
];

export default function DrivePage() {
  return (
    <>
      {/* 1 — Hero */}
      <RiderHero />

      {/* 2 — Why Ride with ALiN */}
      <RiderBenefits />

      {/* 3 — How It Works (5-step horizontal) */}
      <section className="section bg-alin-black">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold uppercase italic text-alin-white sm:text-4xl">
              How It Works
            </h2>
          </div>
          <div className="mt-12">
            <HorizontalTimeline steps={RIDER_STEPS} />
          </div>
        </div>
      </section>

      {/* 4 — Earnings + PAI panel */}
      <EarningsPanel />

      {/* 5 — Rider phone carousel */}
      <section className="section bg-alin-near-black">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-alin-white sm:text-4xl">
              Everything you need in <span className="text-alin-gold">one app.</span>
            </h2>
            <p className="mt-3 text-alin-muted">
              Dashboard to delivery — every step lives in your pocket.
            </p>
          </div>
          <div className="mt-10">
            <PhoneCarousel screens={RIDER_SCREENS} surface="rider" />
          </div>
        </div>
      </section>

      {/* 6 — Rider testimonials (preserved) */}
      <section className="section bg-alin-black">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wider text-alin-gold">
              Riders, in their words
            </p>
            <h2 className="mt-2 text-3xl font-bold text-alin-white sm:text-4xl">
              Real Filipino riders. Real choices.
            </h2>
          </div>
          <StaggerReveal selector=".testimonial-card">
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.name}
                  className="testimonial-card flex flex-col rounded-xl border border-alin-border bg-alin-near-black p-6"
                >
                  <blockquote className="text-base text-alin-white">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span
                      aria-hidden
                      className="bg-alin-gold/15 ring-alin-gold/30 flex size-10 items-center justify-center rounded-full text-sm font-semibold text-alin-gold ring-2"
                    >
                      {t.name.charAt(0)}
                    </span>
                    <span className="text-sm">
                      <span className="block font-semibold text-alin-white">{t.name}</span>
                      <span className="block text-xs text-alin-muted">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* 7 — FAQ slice + Apply CTA (preserved) */}
      <section className="section bg-alin-near-black">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-alin-gold">
              Common questions
            </p>
            <h2 className="mt-2 text-3xl font-bold text-alin-white sm:text-4xl">
              Quick answers before you apply.
            </h2>
            <Accordion type="single" collapsible className="mt-6">
              {FAQ_SLICE.map((item, i) => (
                <AccordionItem key={item.q} value={`drive-faq-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Link
              href="/drive/faq"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-alin-gold hover:underline"
            >
              See all driver FAQs <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          <div className="border-alin-gold/40 rounded-2xl border bg-alin-near-black p-8 lg:p-10">
            <h2 className="text-3xl font-bold text-alin-white sm:text-4xl">
              Ready to <span className="text-alin-gold">drive</span>?
            </h2>
            <p className="mt-3 text-alin-muted">
              Download the Rider App and receive an 80% driver commission on every completed
              delivery. The app handles KYC, branch assignment, activation, and payouts.
            </p>
            <div className="mt-6">
              <DownloadRiderAppButton />
            </div>
            <p className="mt-4 text-xs text-alin-muted">Available on Android.</p>
          </div>
        </div>
      </section>

      {/* 8 — Footer CTA banner (rider variant) */}
      <FooterCtaBanner variant="rider" />
    </>
  );
}
