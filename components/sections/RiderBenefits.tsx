import {
  BadgePercent,
  Coins,
  Wallet,
  ShieldCheck,
  HeartHandshake,
  Network,
  type LucideIcon,
} from "lucide-react";

type Benefit = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const BENEFITS: Benefit[] = [
  {
    icon: BadgePercent,
    title: "80% Commission",
    body: "Receive an 80% driver commission on every completed delivery.",
  },
  {
    icon: Coins,
    title: "Real-Time Earnings",
    body: "Track your earnings daily, weekly, and monthly.",
  },
  {
    icon: Wallet,
    title: "Fast Cashout",
    body: "Request your payout anytime. Get paid for what you earn.",
  },
  {
    icon: ShieldCheck,
    title: "Safety First",
    body: "One-tap SOS alerts for your safety. We've got your back.",
  },
  {
    icon: HeartHandshake,
    title: "Insurance Coverage",
    body: "Personal Accident Insurance for every registered rider.",
  },
  {
    icon: Network,
    title: "Strong Network",
    body: "Backed by ALiN Cargo Express branches nationwide.",
  },
];

/**
 * "Why Ride with ALiN Move?" — six gold-icon cards in a row on desktop,
 * 3-up on tablet, 2-up on mobile. Server component.
 */
export function RiderBenefits() {
  return (
    <section className="section bg-alin-near-black">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-alin-white sm:text-4xl">
            Why Ride with <span className="text-alin-gold">ALiN Move?</span>
          </h2>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {BENEFITS.map((b) => (
            <li
              key={b.title}
              className="hover:border-alin-gold/40 flex flex-col items-center rounded-xl border border-alin-border bg-alin-black p-5 text-center transition-colors"
            >
              <span
                aria-hidden
                className="border-alin-gold/30 inline-flex h-12 w-12 items-center justify-center rounded-full border bg-alin-near-black text-alin-gold"
              >
                <b.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-3 text-sm font-bold uppercase tracking-wide text-alin-white">
                {b.title}
              </h3>
              <p className="mt-1 text-xs text-alin-muted">{b.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
