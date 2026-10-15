import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "ALiN Move for business",
  description:
    "Use ALiN Move for e-commerce fulfillment, branch transfers, and cross-city cargo on the ACE network.",
  path: "/business",
});

export default function BusinessPage() {
  return (
    <section className="section">
      <div className="container-page max-w-3xl">
        <p className="text-sm uppercase tracking-wider text-alin-gold">For business</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
          Move parcels — across the city or across the country.
        </h1>
        <p className="mt-4 text-lg text-alin-muted">
          Bulk deliveries, scheduled pickups, branch handoffs, and cross-city cargo. One contract,
          one tracker, one network.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="mailto:business@alinmove.com">Talk to sales</Link>
        </Button>
      </div>
    </section>
  );
}
