import type { Metadata } from "next";
import { Suspense } from "react";
import { PoweredByACE } from "@/components/brand/ACEBadge";
import { WaitlistForm } from "@/components/sections/WaitlistForm";
import { getCoverage } from "@/lib/coverage-api";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Join the waitlist",
  description:
    "Be first to know when the ALiN Move app is live. Powered by the ALiN Cargo Express network.",
  path: "/waitlist",
});

export default async function WaitlistPage() {
  const coverage = await getCoverage();
  const cities = coverage.cities.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <section className="section">
      <div className="container-page max-w-md">
        <PoweredByACE />
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Join the waitlist.</h1>
        <p className="mt-3 text-alin-muted">
          We&apos;ll send one email at launch. No spam in between.
        </p>
        <div className="mt-8">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-alin-near-black" />}>
            <WaitlistForm cities={cities} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
