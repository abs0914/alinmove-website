import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { driverPrimaryCta } from "@/lib/launch-mode";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Earnings & requirements",
  description:
    "How driver earnings work and what you need to start: license, OR/CR, NBI, selfie. Maya payouts.",
  path: "/drive/earnings",
});

const REQS = [
  "Valid driver's license (matching your vehicle class)",
  "OR/CR for your vehicle",
  "NBI clearance (we'll guide you through if you don't have one)",
  "A clear selfie for your rider profile",
];

export default function EarningsPage() {
  const cta = driverPrimaryCta();
  return (
    <>
      <section className="section">
        <div className="container-page max-w-3xl">
          <h1 className="text-4xl font-bold sm:text-5xl">Earnings &amp; requirements</h1>
          <p className="mt-4 text-lg text-alin-muted">
            See the fare before you accept. Get paid via Maya — same-day payouts after the cutoff.
          </p>
        </div>
      </section>

      <section className="section bg-alin-near-black">
        <div className="container-page max-w-2xl">
          <h2 className="text-2xl font-bold">What you need</h2>
          <ul className="mt-4 space-y-3">
            {REQS.map((r) => (
              <li key={r} className="flex gap-3 text-sm text-alin-muted">
                <span aria-hidden className="mt-1 size-1.5 shrink-0 rounded-full bg-alin-gold" />
                {r}
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-8">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
