import Image from "next/image";
import { BadgePercent, ShieldCheck, Siren, Headphones } from "lucide-react";
import { CountUp } from "@/components/motion/CountUp";
import { PaiInsuranceCard } from "@/components/sections/PaiInsuranceCard";

const EARNINGS = [
  { label: "Daily", value: 1200, suffix: "+" },
  { label: "Weekly", value: 8000, suffix: "+" },
  { label: "Monthly", value: 35000, suffix: "+" },
];

const TRUST = [
  { icon: ShieldCheck, label: "PAI Insurance Coverage" },
  { icon: Siren, label: "SOS Emergency Support" },
  { icon: Headphones, label: "24/7 Rider Support" },
];

/**
 * "Earn More. Ride With Confidence." panel. Mockup arranges four content
 * blocks across the section width:
 *   1. Lifestyle photo of a rider with phone
 *   2. Potential-earnings card (Daily / Weekly / Monthly with CountUp)
 *   3. Headline + body + 3 small trust icons
 *   4. PAI insurance card (designed image asset)
 *
 * Desktop: 12-col grid. Photo and PAI card flank the center content. Mobile:
 * stacks in a single column in the same reading order.
 *
 * Asset paths:
 *   - /img/photo/rider_with_phone.png
 *   - /img/pai-card.png  (handled by <PaiInsuranceCard>)
 */
export function EarningsPanel() {
  return (
    <section className="section bg-alin-black">
      <div className="container-page">
        <div className="grid items-center gap-6 lg:grid-cols-12">
          {/* Left photo */}
          <div className="lg:col-span-3">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-alin-border bg-alin-near-black">
              <Image
                src="/img/photo/rider_with_phone.png"
                alt="ALiN Move rider in branded jacket checking the rider app"
                fill
                sizes="(min-width: 1024px) 280px, 80vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Center: earnings card + headline + trust icons */}
          <div className="space-y-6 lg:col-span-6">
            <div className="border-alin-gold/40 rounded-2xl border bg-alin-near-black p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex shrink-0 items-center gap-4">
                  <span
                    aria-hidden
                    className="inline-flex size-12 items-center justify-center rounded-xl bg-alin-gold text-alin-black"
                  >
                    <BadgePercent className="size-7" />
                  </span>
                  <div>
                    <p className="text-5xl font-black leading-none text-alin-gold">80%</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-alin-white">
                      Driver Commission
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-alin-muted">
                  Receive an 80% driver commission on every completed delivery.
                </p>
              </div>

              <p className="mt-6 border-t border-alin-border pt-5 text-xs font-semibold uppercase tracking-wider text-alin-gold">
                Potential Earnings*
              </p>
              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                {EARNINGS.map((e) => (
                  <div key={e.label}>
                    <dt className="text-xs uppercase tracking-wide text-alin-muted">{e.label}</dt>
                    <dd className="mt-1 text-2xl font-bold text-alin-white sm:text-3xl">
                      ₱<CountUp to={e.value} suffix={e.suffix} />
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[11px] text-alin-muted">
                *Earnings may vary based on location, time, and performance.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold uppercase italic text-alin-white sm:text-4xl">
                Earn More. <span className="text-alin-gold">Ride With Confidence.</span>
              </h2>
              <p className="mt-3 text-alin-muted">
                We provide the tools, protection, and support you need to succeed on the road.
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-3">
              {TRUST.map((t) => (
                <li
                  key={t.label}
                  className="flex items-center gap-3 rounded-lg border border-alin-border bg-alin-near-black p-3"
                >
                  <span
                    aria-hidden
                    className="border-alin-gold/30 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-alin-black text-alin-gold"
                  >
                    <t.icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-medium text-alin-white">{t.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: PAI insurance card visual */}
          <div className="lg:col-span-3">
            <PaiInsuranceCard className="ml-auto" />
            <p className="mt-3 text-center text-xs text-alin-muted lg:text-right">
              You&rsquo;re protected. We care for our riders.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
