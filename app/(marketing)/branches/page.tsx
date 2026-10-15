import type { Metadata } from "next";
import { Building2, MapPinned, PackageCheck } from "lucide-react";
import { PoweredByACE } from "@/components/brand/ACEBadge";
import { BranchLocator } from "@/components/branches/BranchLocator";
import { BRANCHES, type IslandGroup } from "@/lib/branches";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Branch Locator",
  description:
    "Find ALiN Cargo Express branches, warehouses, receiving locations, contact details, coverage areas, and directions across the Philippines.",
  path: "/branches",
});

const REGION_VALUES: Record<string, IslandGroup> = {
  luzon: "Luzon",
  visayas: "Visayas",
  mindanao: "Mindanao",
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function BranchesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initialQuery = first(params.q).slice(0, 120);
  const initialRegion = REGION_VALUES[first(params.region).toLowerCase()] || "All";
  const operationalCount = BRANCHES.filter((branch) => branch.acceptsPickupToBranch).length;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ALiN Cargo Express branches in the Philippines",
    numberOfItems: BRANCHES.length,
    itemListElement: BRANCHES.map((branch, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Place",
        name: branch.name,
        address: branch.address || `${branch.city}, ${branch.province}, Philippines`,
        geo: {
          "@type": "GeoCoordinates",
          latitude: branch.latitude,
          longitude: branch.longitude,
        },
      },
    })),
  };

  return (
    <div className="bg-alin-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <section className="border-alin-gold/10 relative isolate overflow-hidden border-b bg-[radial-gradient(circle_at_75%_20%,rgba(255,194,0,0.18),transparent_28%),linear-gradient(180deg,#050505,#0f1117)] py-16 lg:py-24">
        <div className="absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(rgba(255,194,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,194,0,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="container-page">
          <PoweredByACE />
          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-alin-gold">
                Nationwide branch network
              </p>
              <h1 className="mt-3 max-w-4xl text-5xl font-black leading-[0.98] tracking-tight text-alin-white sm:text-6xl lg:text-7xl">
                Find your nearest <span className="text-alin-gold">ALiN branch.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-alin-muted">
                Search active ALiN Cargo Express branches, warehouses, and receiving locations
                across Luzon, Visayas, and Mindanao. View contact details, service coverage, and
                directions in one place.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:w-[430px]">
              {[
                { icon: Building2, value: BRANCHES.length, label: "Locations" },
                { icon: PackageCheck, value: operationalCount, label: "Cargo handoff" },
                { icon: MapPinned, value: 3, label: "Island groups" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border-alin-gold/20 rounded-2xl border bg-black/45 p-4 text-center"
                >
                  <stat.icon className="mx-auto size-5 text-alin-gold" aria-hidden />
                  <p className="mt-2 text-3xl font-black text-alin-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-alin-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <BranchLocator
            branches={BRANCHES}
            initialQuery={initialQuery}
            initialRegion={initialRegion}
          />
          <p className="mt-6 text-center text-xs leading-5 text-alin-muted">
            Branch information may change. Contact the branch before visiting for service
            availability and cutoff times. Map data © OpenStreetMap contributors.
          </p>
        </div>
      </section>
    </div>
  );
}
