import Link from "next/link";
import { Building2, Home, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "door-to-door" | "pickup-to-branch";

const VARIANTS: Record<
  Variant,
  {
    title: string;
    icon: typeof Home;
    fromLabel: string;
    fromAmount: string;
    radius: string;
    bullets: string[];
  }
> = {
  "door-to-door": {
    title: "Door-to-Door Delivery",
    icon: Home,
    fromLabel: "FROM",
    fromAmount: "₱70",
    radius: "within 5 km",
    bullets: ["Pickup at your door", "Up to 20 kg", "Live tracking", "Secure payment"],
  },
  "pickup-to-branch": {
    title: "Pickup to ALiN Branch",
    icon: Building2,
    fromLabel: "FROM",
    fromAmount: "₱70",
    radius: "within 5 km",
    bullets: ["Drop off at any branch", "Pay at destination branch", "Live tracking", "Secure payment"],
  },
};

function PricingCard({ variant }: { variant: Variant }) {
  const v = VARIANTS[variant];
  const Icon = v.icon;
  return (
    <article className="relative flex flex-col gap-5 rounded-2xl border border-alin-gold/40 bg-alin-near-black p-6 sm:p-7">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-alin-white">{v.title}</h3>
          <p className="mt-3 text-xs uppercase tracking-wide text-alin-muted">{v.fromLabel}</p>
          <p className="mt-1 flex items-baseline gap-2 text-4xl font-bold text-alin-gold">
            {v.fromAmount}
            <span className="text-sm font-normal text-alin-muted">{v.radius}</span>
          </p>
        </div>
        <span
          aria-hidden
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-alin-gold/40 bg-alin-black text-alin-gold"
        >
          <Icon className="h-6 w-6" />
        </span>
      </header>
      <ul className="space-y-2 text-sm text-alin-white">
        {v.bullets.map((b) => (
          <li key={b} className="flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0 text-alin-gold" aria-hidden />
            {b}
          </li>
        ))}
      </ul>
    </article>
  );
}

/**
 * Two-card pricing teaser. Used on Home and at the top of /pricing.
 * Clicking the wrapper link takes the user to the full breakdown.
 */
export function SimplePricingCards({
  className,
  showLink = true,
}: {
  className?: string;
  showLink?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <PricingCard variant="door-to-door" />
        <PricingCard variant="pickup-to-branch" />
      </div>
      <p className="text-xs text-alin-muted">
        Final rates may vary by location, distance, and package size.
        {showLink ? (
          <>
            {" "}
            <Link
              href="/pricing"
              className="font-medium text-alin-gold underline-offset-4 hover:underline"
            >
              See the full breakdown →
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
