import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Row = { left: string; right: string };

const DEFAULT_ROWS: Row[] = [
  { left: "Either door-to-door or branch only", right: "Door-to-door and pickup-to-branch" },
  { left: "Limited or no branch network", right: "Extensive ALiN Branch network" },
  { left: "Basic or no live tracking", right: "Live tracking with real-time updates" },
  { left: "Manual updates", right: "Auto updates and notifications" },
  { left: "Limited options and bulky item handling", right: "Built for cargo and large packages" },
  { left: "Standard support", right: "Responsive local support" },
];

const DEFAULT_LEFT = "Ordinary Delivery App";
const DEFAULT_RIGHT = "ALiN Move";

/**
 * Side-by-side comparison table. Server component. CSS-only reveal — /pricing
 * stays motion-free per CLAUDE.md rule #4. The "VS" pill sits in the center
 * gutter on desktop and stacks above the right column on mobile.
 */
export function ComparisonTable({
  leftHeader = DEFAULT_LEFT,
  rightHeader = DEFAULT_RIGHT,
  rows = DEFAULT_ROWS,
  className,
}: {
  leftHeader?: string;
  rightHeader?: string;
  rows?: Row[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500",
        className,
      )}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
        {/* Left — Ordinary */}
        <section
          aria-labelledby="cmp-left"
          className="rounded-2xl border border-alin-border bg-alin-near-black p-6 lg:rounded-r-none lg:border-r-0"
        >
          <h3 id="cmp-left" className="text-base font-semibold text-alin-white">
            {leftHeader}
          </h3>
          <ul className="mt-5 space-y-4">
            {rows.map((r, i) => (
              <li key={`l-${i}`} className="flex items-start gap-3 text-sm text-alin-muted">
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-alin-border bg-alin-black text-alin-muted"
                >
                  <X className="h-3 w-3" strokeWidth={2.5} />
                </span>
                {r.left}
              </li>
            ))}
          </ul>
        </section>

        {/* Center VS pill */}
        <div className="relative flex items-center justify-center lg:px-1">
          <span
            aria-hidden
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-alin-gold/60 bg-alin-black text-sm font-bold tracking-wide text-alin-gold shadow-[0_0_24px_rgba(255,192,0,0.25)]"
          >
            VS
          </span>
          <div
            aria-hidden
            className="absolute left-0 right-0 top-1/2 -z-10 hidden h-px bg-gradient-to-r from-transparent via-alin-gold/30 to-transparent lg:block"
          />
        </div>

        {/* Right — ALiN Move */}
        <section
          aria-labelledby="cmp-right"
          className="rounded-2xl border border-alin-gold/50 bg-alin-near-black p-6 lg:rounded-l-none lg:border-l-0 lg:shadow-[inset_0_0_0_1px_rgba(255,192,0,0.18)]"
        >
          <h3 id="cmp-right" className="text-base font-semibold text-alin-gold">
            {rightHeader}
          </h3>
          <ul className="mt-5 space-y-4">
            {rows.map((r, i) => (
              <li key={`r-${i}`} className="flex items-start gap-3 text-sm text-alin-white">
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-alin-gold text-alin-black"
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {r.right}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
