import { Logo } from "@/components/brand/Logo";
import { StoreBadges } from "@/components/brand/StoreBadges";
import { cn } from "@/lib/utils";

type Variant = "customer" | "rider";

const COPY: Record<Variant, { headline: string; subhead: string }> = {
  customer: {
    headline: "Move your package the smarter way.",
    subhead:
      "Download the ALiN Move customer app and experience faster, safer, and smarter deliveries.",
  },
  rider: {
    headline: "Ready to start your journey?",
    subhead: "Be part of the ALiN Move family today. Ride. Deliver. Earn more.",
  },
};

/**
 * Full-width CTA banner that sits above the global Footer on Home and /drive.
 * Server component — the StoreBadges island handles its own analytics.
 */
export function FooterCtaBanner({
  variant = "customer",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const copy = COPY[variant];
  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-alin-border bg-alin-near-black",
        className,
      )}
      aria-labelledby={`footer-cta-${variant}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-alin-gold/40 to-transparent"
      />
      <div className="container-page py-10 sm:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_auto_auto]">
          <div>
            <h2
              id={`footer-cta-${variant}`}
              className="text-2xl font-bold text-alin-white sm:text-3xl"
            >
              {copy.headline}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-alin-muted sm:text-base">{copy.subhead}</p>
          </div>
          <StoreBadges audience={variant} size="md" />
          <Logo height={36} className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
