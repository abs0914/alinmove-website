import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PoweredByACE } from "@/components/brand/ACEBadge";
import { StoreBadges } from "@/components/brand/StoreBadges";
import { storeUrl } from "@/lib/launch-mode";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Download the ALiN Move app",
  description:
    "Install the ALiN Move Customer or Driver app from the App Store or Google Play and start moving with the ALiN Cargo Express network.",
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

  // Phones go straight to their store; desktop visitors pick a badge.
  const ua = (await headers()).get("user-agent") ?? "";
  if (/iPhone|iPad|iPod/i.test(ua)) redirect(storeUrl(audience, "ios"));
  if (/Android/i.test(ua)) redirect(storeUrl(audience, "android"));

  return (
    <section className="section">
      <div className="container-page max-w-md">
        <PoweredByACE />
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
          {audience === "rider" ? "Download the Rider App." : "Download the Customer App."}
        </h1>
        <p className="mt-3 text-alin-muted">Pick your platform below to install.</p>
        <StoreBadges audience={audience} size="lg" className="mt-6" />
        <p className="mt-6 text-xs text-alin-muted">
          Powered by the ALiN Cargo Express network — 47+ branches across the Philippines.
        </p>
      </div>
    </section>
  );
}
