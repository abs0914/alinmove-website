import type { ElementType, ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Bike,
  Boxes,
  BriefcaseBusiness,
  Building2,
  Calculator,
  Check,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Eye,
  FileCheck2,
  HelpCircle,
  MapPin,
  PackageCheck,
  PackageOpen,
  Route,
  Ruler,
  Store,
  Truck,
} from "lucide-react";
import { DownloadCustomerAppButton } from "@/components/brand/DownloadCustomerAppButton";
import { DownloadRiderAppButton } from "@/components/brand/DownloadRiderAppButton";
import { PhoneFrame } from "@/components/brand/PhoneFrame";
import { StoreBadges } from "@/components/brand/StoreBadges";
import { PricingCalculators } from "@/components/sections/PricingCalculators";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { downloadHref } from "@/lib/launch-mode";
import {
  BASE_DISTANCE_KM,
  FARE_TIERS,
  STARTING_FARE,
  VEHICLE_RATES,
  formatPeso,
} from "@/lib/pricing-calculator";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description:
    "Simple, transparent ALiN Move pricing for door-to-door delivery, pickup-to-branch service, and business delivery support.",
  path: "/pricing",
});

const pricingCards = [
  {
    title: "Door-to-Door Delivery",
    price: null,
    subprice: "within 5 km · motorcycle",
    description:
      "Best for direct local delivery from your pickup location to your recipient's address.",
    includes: [
      "Rider pickup",
      "Direct delivery",
      "Live tracking",
      "Delivery updates",
      "Proof of delivery",
    ],
    cta: "Book Door-to-Door",
    href: downloadHref("customer"),
    icon: Truck,
    featured: true,
  },
  {
    title: "Pickup to ALiN Branch",
    price: null,
    subprice: "within 5 km · motorcycle",
    description:
      "Best when you want your package picked up and brought to an ALiN Cargo Express branch for processing or onward shipment.",
    includes: [
      "Rider pickup",
      "Branch drop-off",
      "Status updates",
      "Cargo handoff support",
      "Tracking visibility",
    ],
    cta: "Book Pickup to Branch",
    href: downloadHref("customer"),
    icon: Building2,
  },
  {
    title: "Business Delivery",
    price: "Custom pricing" as string | null,
    subprice: "for repeat or bulk needs",
    description:
      "For online sellers, SMEs, stores, distributors, and branch-based businesses that need recurring delivery support.",
    includes: [
      "Repeat delivery workflows",
      "Pickup coordination",
      "Delivery history",
      "Proof of delivery",
      "Business support",
    ],
    cta: "Talk to Sales",
    href: "/business",
    icon: BriefcaseBusiness,
  },
];

const rateRows = VEHICLE_RATES.map((rate) => [
  rate.label,
  `${rate.maxWeightKg.toLocaleString("en-PH")} kg`,
  rate.size,
  formatPeso(rate.baseFare.saver),
  formatPeso(rate.baseFare.priority),
  `${formatPeso(rate.perKm)}/km`,
]);

const serviceTypes = [
  {
    title: "Door-to-Door Delivery",
    body: "Use this when you want a rider to pick up your package and deliver it straight to your recipient.",
    bestFor: [
      "Documents",
      "Small parcels",
      "Online seller orders",
      "Personal deliveries",
      "Same-city deliveries",
    ],
    icon: PackageCheck,
  },
  {
    title: "Pickup to ALiN Branch",
    body: "Use this when you want a rider to bring your package to an ALiN Cargo Express branch for processing, cargo handling, or onward shipment.",
    bestFor: [
      "Cargo senders",
      "Provincial shipments",
      "Branch drop-off convenience",
      "Customers who cannot visit the branch",
      "Businesses sending multiple packages",
    ],
    icon: Store,
  },
  {
    title: "Branch-to-Door Delivery",
    body: "Use this when an ALiN branch dispatches a rider to deliver a package to the final recipient, with no additional delivery fee charged to the customer.",
    bestFor: [
      "No additional customer fee",
      "Last-mile delivery",
      "Branch fulfillment",
      "Customer delivery from branch",
    ],
    icon: Bike,
  },
];

const pricingFactors = [
  {
    title: "Distance",
    body: "The distance between pickup, branch, and delivery destination affects the final price.",
    icon: Route,
  },
  {
    title: "Service Type",
    body: "Vehicle-tier rates apply to door-to-door and pickup-to-branch bookings. Branch-to-door delivery has no additional customer fee.",
    icon: PackageOpen,
  },
  {
    title: "Package Size",
    body: "Pouch, box, and larger items may require different handling or vehicle capacity.",
    icon: Ruler,
  },
  {
    title: "Location Coverage",
    body: "Pricing may vary depending on service area, route availability, and branch coverage.",
    icon: MapPin,
  },
  {
    title: "Business Volume",
    body: "Businesses with repeat deliveries may qualify for custom delivery arrangements.",
    icon: Boxes,
  },
];

const comparisonRows = [
  ["Usually point-to-point only", "Door-to-door, pickup-to-branch, and branch delivery"],
  ["Limited cargo integration", "Connected to ALiN Cargo Express branches"],
  ["Basic delivery status", "Real-time tracking and delivery footprint"],
  ["Separate customer support", "App, branch, and support ecosystem"],
  ["One-time delivery focus", "Built for customers, businesses, riders, and branches"],
];

const trustCards = [
  { title: "Price Preview", body: "See your estimated fee before booking.", icon: Calculator },
  { title: "Live Tracking", body: "Track your rider and package movement.", icon: Eye },
  { title: "Delivery Proof", body: "Get delivery records after completion.", icon: FileCheck2 },
  { title: "Branch Support", body: "Use pickup-to-branch for cargo movement.", icon: Building2 },
  {
    title: "Business Options",
    body: "Get custom support for recurring delivery needs.",
    icon: BriefcaseBusiness,
  },
];

const faqs = [
  {
    q: "How much is ALiN Move delivery?",
    a: "Door-to-door delivery and pickup to an ALiN Branch start at ₱35 with Saver (scheduled) or ₱70 with Priority (immediate dispatch) for a motorcycle within 5 km. Rates depend on the vehicle tier and additional distance. Final pricing is shown in the app before booking.",
  },
  {
    q: "Does the app show the price before booking?",
    a: "Yes. The app displays the delivery fee before you confirm your booking.",
  },
  {
    q: "What is Pickup to ALiN Branch?",
    a: "It is a service where a rider picks up your package and brings it to an ALiN Cargo Express branch for processing or onward shipment.",
  },
  {
    q: "Is business pricing different?",
    a: "Business pricing may be customized based on delivery volume, pickup frequency, routes, and logistics requirements.",
  },
  {
    q: "Are there additional charges beyond 5 km?",
    a: "For door-to-door and pickup-to-branch bookings, additional-distance rates depend on the vehicle tier and start at ₱7/km for motorcycles, the same for Saver and Priority. Branch-to-door delivery has no additional fee for the customer.",
  },
  {
    q: "Can I pay through the app?",
    a: "ALiN Move is designed to support multiple payment options, including cash, over-the-counter, digital wallet, and other payment workflows depending on availability.",
  },
];

function SectionHeader({
  eyebrow,
  title,
  body,
  centered = false,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  centered?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-alin-gold">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-black tracking-tight text-alin-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {body ? <p className="mt-4 text-base leading-7 text-alin-muted sm:text-lg">{body}</p> : null}
    </div>
  );
}

function GlassPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "border-alin-gold/20 bg-alin-near-black/85 rounded-[1.75rem] border p-5 shadow-[0_24px_80px_-40px_rgba(255,194,0,0.45)] ring-1 ring-white/5 backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}

function IconCard({ icon: Icon, title, body }: { icon: ElementType; title: string; body: string }) {
  return (
    <article className="hover:border-alin-gold/60 rounded-2xl border border-alin-border bg-black/35 p-5 transition duration-300 hover:-translate-y-1">
      <div className="bg-alin-gold/10 flex size-11 items-center justify-center rounded-2xl text-alin-gold">
        <Icon className="size-5" aria-hidden />
      </div>
      <h3 className="mt-5 text-base font-black text-alin-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-alin-muted">{body}</p>
    </article>
  );
}

export default function PricingPage() {
  return (
    <main className="overflow-hidden bg-alin-black">
      <section className="border-alin-gold/10 relative isolate overflow-hidden border-b bg-[radial-gradient(circle_at_70%_20%,rgba(255,194,0,0.18),transparent_30%),linear-gradient(180deg,#050505_0%,#0b0b0b_62%,#050505_100%)] py-16 lg:py-24">
        <div className="absolute inset-0 -z-10 opacity-50 [background-image:linear-gradient(rgba(255,194,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,194,0,0.1)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
        <div className="absolute bottom-0 left-0 right-0 -z-10 h-56 bg-[radial-gradient(ellipse_at_center,rgba(255,194,0,0.16),transparent_60%)]" />

        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <div className="border-alin-gold/40 bg-alin-gold/10 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold text-alin-white">
              <CircleDollarSign className="size-4 text-alin-gold" aria-hidden />
              Clear rates. Real-time tracking. Branch-supported logistics.
            </div>
            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.98] tracking-tight text-alin-white sm:text-6xl lg:text-7xl">
              Simple, transparent <span className="text-alin-gold">delivery pricing.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-alin-muted">
              Know your delivery cost before you book. Choose door-to-door delivery,
              pickup-to-branch service, or business delivery support through ALiN Move.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <DownloadCustomerAppButton className="shadow-[0_16px_40px_-20px_rgba(255,194,0,0.85)]" />
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-alin-gold/50 hover:bg-alin-gold/10 bg-black/35 text-alin-white"
              >
                <Link href="/business">Get Business Pricing</Link>
              </Button>
            </div>
          </div>

          <div className="relative min-h-[560px]">
            <div className="absolute inset-x-8 top-1/2 h-1 -rotate-12 rounded-full bg-gradient-to-r from-transparent via-alin-gold to-transparent blur-[1px]" />
            <PhoneFrame
              src="/img/customer-app/create-delivery.png"
              alt="Customer app estimated price screen"
              priority
              className="absolute left-0 top-12 w-[43%] rotate-[-7deg] sm:left-12"
              sizes="(min-width: 1024px) 260px, 44vw"
            />
            <PhoneFrame
              src="/img/customer-app/tracking.png"
              alt="ALiN Move live tracking screen"
              priority
              className="absolute right-0 top-2 w-[46%] rotate-[7deg] sm:right-8"
              sizes="(min-width: 1024px) 280px, 48vw"
            />
            <GlassPanel className="ring-alin-gold/30 absolute bottom-4 left-1/2 z-20 w-[92%] -translate-x-1/2 border-white/30 bg-black/90 p-5 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.95)] ring-1 backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-4">
                <div className="border-l-4 border-alin-gold pl-4">
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-alin-white">
                    Estimated Delivery Fee
                  </p>
                  <p className="mt-1 text-4xl font-black leading-none text-alin-white">
                    {formatPeso(STARTING_FARE.saver)}
                  </p>
                  <p className="mt-2 text-sm font-medium text-alin-muted">
                    Saver · Priority {formatPeso(STARTING_FARE.priority)} · Door-to-Door within 5 km
                  </p>
                </div>
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-alin-gold text-alin-black shadow-[0_10px_30px_-12px_rgba(255,194,0,0.8)]">
                  <Calculator className="size-7" aria-hidden />
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>

      <section className="section bg-alin-black">
        <div className="container-page">
          <SectionHeader
            eyebrow="Pricing snapshot"
            title="Start with the delivery flow that fits your package."
            body="ALiN Move pricing is designed to be simple for customers, flexible for businesses, and fair for the logistics network that powers every delivery."
            centered
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pricingCards.map((card) => (
              <article
                key={card.title}
                className={cn(
                  "relative flex h-full flex-col rounded-[1.75rem] border bg-alin-near-black p-6 transition duration-300 hover:-translate-y-1",
                  card.featured
                    ? "border-alin-gold shadow-[0_24px_80px_-45px_rgba(255,194,0,0.9)]"
                    : "hover:border-alin-gold/60 border-alin-border",
                )}
              >
                {card.featured ? (
                  <span className="absolute right-5 top-5 rounded-full bg-alin-gold px-3 py-1 text-xs font-black text-alin-black">
                    Popular
                  </span>
                ) : null}
                <div className="flex size-12 items-center justify-center rounded-2xl bg-alin-gold text-alin-black">
                  <card.icon className="size-6" aria-hidden />
                </div>
                <h3 className="mt-6 text-2xl font-black text-alin-white">{card.title}</h3>
                {card.price ? (
                  <p className="mt-5 text-4xl font-black text-alin-gold">{card.price}</p>
                ) : (
                  <dl className="mt-5 grid grid-cols-2 gap-3">
                    {FARE_TIERS.map((tier) => (
                      <div key={tier.id}>
                        <dt className="text-xs font-bold uppercase tracking-[0.14em] text-alin-muted">
                          {tier.label} from
                        </dt>
                        <dd className="text-4xl font-black text-alin-gold">
                          {formatPeso(STARTING_FARE[tier.id])}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
                <p className="mt-1 text-sm font-semibold text-alin-white">{card.subprice}</p>
                <p className="mt-5 text-sm leading-6 text-alin-muted">{card.description}</p>
                <ul className="mt-6 space-y-3">
                  {card.includes.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-alin-white">
                      <Check className="size-4 text-alin-gold" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-8 w-full">
                  <Link href={card.href}>{card.cta}</Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-alin-near-black">
        <div className="container-page">
          <SectionHeader
            eyebrow="Distance-based pricing"
            title="Rates for every vehicle tier."
            body={`These base fares cover the first ${BASE_DISTANCE_KM} km and apply to both door-to-door delivery and pickup to an ALiN Branch. The additional-distance rate is the same for Saver and Priority.`}
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {FARE_TIERS.map((tier) => (
              <div
                key={tier.id}
                className="rounded-2xl border border-alin-border bg-alin-black px-5 py-4"
              >
                <p className="text-sm font-black uppercase tracking-[0.14em] text-alin-gold">
                  {tier.label}
                </p>
                <p className="mt-1 text-sm text-alin-white">{tier.description}</p>
              </div>
            ))}
          </div>
          <GlassPanel className="mt-10 overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-sm">
                <thead className="bg-alin-gold text-left text-alin-black">
                  <tr>
                    <th className="p-4 font-black">Vehicle Tier</th>
                    <th className="p-4 font-black">Weight Limit</th>
                    <th className="p-4 font-black">Size (L × W × H)</th>
                    <th className="p-4 font-black">Saver · First {BASE_DISTANCE_KM} km</th>
                    <th className="p-4 font-black">Priority · First {BASE_DISTANCE_KM} km</th>
                    <th className="p-4 font-black">Beyond {BASE_DISTANCE_KM} km</th>
                  </tr>
                </thead>
                <tbody>
                  {rateRows.map((row) => (
                    <tr key={row[0]} className="border-t border-alin-border">
                      {row.map((cell, index) => (
                        <td
                          key={index}
                          className={cn(
                            "p-4",
                            index === 0 ? "font-bold text-alin-white" : "text-alin-muted",
                          )}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
          <div className="border-alin-gold/30 bg-alin-gold/10 mt-4 rounded-2xl border px-5 py-4 text-sm font-semibold text-alin-white">
            <p>Final rates are confirmed in the app before booking.</p>
            <p className="mt-1">Branch-to-door delivery has no additional fee for the customer.</p>
          </div>
        </div>
      </section>

      <section className="section bg-alin-black">
        <div className="container-page">
          <SectionHeader
            eyebrow="Service options"
            title="Choose the right delivery option."
            centered
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {serviceTypes.map((service) => (
              <GlassPanel key={service.title} className="p-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-alin-gold text-alin-black">
                  <service.icon className="size-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-black text-alin-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-alin-muted">{service.body}</p>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-alin-gold">
                  Best for
                </p>
                <ul className="mt-3 space-y-2">
                  {service.bestFor.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-alin-white">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-alin-gold" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-alin-near-black">
        <div className="container-page">
          <SectionHeader
            eyebrow="Price factors"
            title="How your delivery price is calculated."
            centered
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {pricingFactors.map((factor) => (
              <IconCard key={factor.title} {...factor} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-alin-black">
        <div className="container-page">
          <SectionHeader
            eyebrow="Delivery calculators"
            title="Estimate from barangay to barangay."
            body="Choose pickup-to-branch for an estimate that combines the nearest-branch pickup leg with ALiN Cargo rates, or choose door-to-door for direct vehicle-based delivery pricing."
            centered
          />
          <div className="mx-auto mt-10 max-w-5xl">
            <PricingCalculators />
          </div>
        </div>
      </section>

      <section className="section bg-alin-near-black">
        <div className="container-page">
          <SectionHeader
            eyebrow="Comparison"
            title="More value than ordinary delivery pricing."
            centered
          />
          <GlassPanel className="mt-10 overflow-hidden p-0">
            <div className="grid bg-alin-gold text-sm font-black text-alin-black sm:grid-cols-2">
              <div className="p-4">Ordinary Delivery App</div>
              <div className="p-4">ALiN Move</div>
            </div>
            <div className="divide-y divide-alin-border">
              {comparisonRows.map(([ordinary, alin]) => (
                <div key={ordinary} className="grid gap-0 sm:grid-cols-2">
                  <div className="border-b border-alin-border p-4 text-sm text-alin-muted sm:border-b-0 sm:border-r">
                    {ordinary}
                  </div>
                  <div className="p-4 text-sm font-semibold text-alin-white">{alin}</div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>

      <section className="section bg-alin-black">
        <div className="container-page">
          <SectionHeader eyebrow="Trust" title="No guessing before you confirm." centered />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {trustCards.map((card) => (
              <IconCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-alin-near-black">
        <div className="container-page">
          <GlassPanel>
            <div className="flex items-center gap-3">
              <HelpCircle className="size-8 text-alin-gold" aria-hidden />
              <h2 className="text-3xl font-black text-alin-white">FAQ</h2>
            </div>
            <div className="mt-6 divide-y divide-alin-border overflow-hidden rounded-2xl border border-alin-border bg-black/35">
              {faqs.map((faq) => (
                <details key={faq.q} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-alin-white">
                    {faq.q}
                    <span className="text-xl text-alin-gold transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-4xl text-sm leading-6 text-alin-muted">{faq.a}</p>
                </details>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>

      <section className="border-alin-gold/10 relative overflow-hidden border-t bg-[radial-gradient(circle_at_20%_50%,rgba(255,194,0,0.24),transparent_24%),linear-gradient(90deg,#050505,#111,#050505)] py-16">
        <div className="container-page relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative min-h-72">
            <Image
              src="/img/photo/live_tracking.png"
              alt="ALiN Move delivery tracking"
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-contain object-left-bottom drop-shadow-[0_30px_55px_rgba(255,194,0,0.2)]"
            />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tight text-alin-white sm:text-5xl">
              Ready to move your package?
            </h2>
            <p className="mt-4 text-lg text-alin-muted">
              Download ALiN Move, get your price, and book your delivery in minutes.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <DownloadCustomerAppButton />
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-alin-gold/50 hover:bg-alin-gold/10 bg-black/35 text-alin-white"
              >
                <Link href="/business">
                  <CreditCard className="size-4" aria-hidden />
                  Create Business Account
                </Link>
              </Button>
              <DownloadRiderAppButton
                label="Become a Rider"
                variant="outline"
                className="border-alin-gold/50 bg-black/35"
              />
            </div>
            <StoreBadges audience="customer" size="lg" className="mt-6" />
            <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-alin-gold">
              ALiN Move - Move smarter. Deliver faster. Grow together.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
