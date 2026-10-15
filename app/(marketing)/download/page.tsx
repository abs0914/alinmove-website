import type { Metadata } from "next";
import { Suspense } from "react";
import { PoweredByACE } from "@/components/brand/ACEBadge";
import { WaitlistForm } from "@/components/sections/WaitlistForm";
import { getCoverage } from "@/lib/coverage-api";
import { CUSTOMER_PLAY_STORE_URL, RIDER_PLAY_STORE_URL } from "@/lib/launch-mode";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Download the ALiN Move app",
  description:
    "Install the ALiN Move Customer or Rider app from Google Play and start moving with the ALiN Cargo Express network.",
  path: "/download",
  noIndex: true,
});

type SearchParams = { intent?: string };

export default async function DownloadPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { intent } = await searchParams;
  const audience = intent === "rider" ? "rider" : "customer";

  const customerStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL;
  const customerPlayUrl = CUSTOMER_PLAY_STORE_URL;
  const riderPlayUrl = RIDER_PLAY_STORE_URL;

  const customerLive = Boolean(customerStoreUrl || customerPlayUrl);
  const riderLive = Boolean(riderPlayUrl);
  const live = audience === "rider" ? riderLive : customerLive;

  const coverage = await getCoverage();
  const cities = coverage.cities.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <section className="section">
      <div className="container-page max-w-md">
        <PoweredByACE />
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
          {audience === "rider" ? "Download the Rider App." : "Download the Customer App."}
        </h1>

        {live ? (
          <>
            <p className="mt-3 text-alin-muted">Pick your platform below to install.</p>
            <div className="mt-6 flex flex-col gap-3">
              {audience === "customer" && customerStoreUrl ? (
                <a
                  href={customerStoreUrl}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-alin-gold px-5 font-semibold text-alin-black hover:bg-alin-gold-hover"
                >
                  App Store →
                </a>
              ) : null}
              {(audience === "customer" ? customerPlayUrl : riderPlayUrl) ? (
                <a
                  href={(audience === "customer" ? customerPlayUrl : riderPlayUrl) as string}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-alin-gold px-5 font-semibold text-alin-black hover:bg-alin-gold-hover"
                >
                  Google Play →
                </a>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <p className="mt-3 text-alin-muted">
              {audience === "rider"
                ? "Our Rider app is launching on Google Play soon. Drop your email — we'll send the install link the moment it's live."
                : "Our Customer app is launching on the App Store and Google Play soon. Drop your email — we'll send the install link the moment it's live."}
            </p>
            <div className="mt-8">
              <Suspense
                fallback={<div className="h-96 animate-pulse rounded-lg bg-alin-near-black" />}
              >
                <WaitlistForm cities={cities} />
              </Suspense>
            </div>
            <p className="mt-6 text-xs text-alin-muted">
              Powered by the ALiN Cargo Express network — 47+ branches across the Philippines.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
