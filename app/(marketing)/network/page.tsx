import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PoweredByACE } from "@/components/brand/ACEBadge";
import { HeroIntro } from "@/components/motion/HeroIntro";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { MicroLift } from "@/components/motion/MicroLift";
import { ACENetworkMapClient } from "@/components/motion/ACENetworkMapDynamic";
import { customerPrimaryCta } from "@/lib/launch-mode";
import { getCoverage } from "@/lib/coverage-api";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "The ALiN Cargo Express network",
  description:
    "The largest delivery story in the Philippines isn't an app — it's a network. See where ALiN Cargo Express delivers.",
  path: "/network",
});

export default async function NetworkPage() {
  const coverage = await getCoverage();
  const cta = customerPrimaryCta();
  const active = coverage.cities.filter((c) => c.isActive);
  const upcoming = coverage.cities.filter((c) => !c.isActive);

  return (
    <>
      <section className="section">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <HeroIntro>
            <div>
              <PoweredByACE />
              <h1 className="hero-title mt-4 text-4xl font-bold sm:text-5xl">
                The largest delivery story in the Philippines isn&apos;t an app — it&apos;s a
                network.
              </h1>
              <p className="hero-sub mt-4 text-lg text-alin-muted">
                ALiN Cargo Express has been moving cargo nationwide for years. ALiN Move is the
                digital + last-mile layer on top.
              </p>
            </div>
          </HeroIntro>
          <ACENetworkMapClient />
        </div>
      </section>

      <section className="section bg-alin-near-black">
        <div className="container-page">
          <h2 className="text-2xl font-bold">Where we deliver</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-alin-gold">
                Active cities
              </h3>
              <StaggerReveal selector=".city-row">
                <ul className="mt-3 space-y-2">
                  {active.map((c) => (
                    <li key={c.slug} className="city-row flex items-center justify-between text-sm">
                      <Link href={`/coverage/${c.slug}`} className="hover:text-alin-gold">
                        {c.name}
                      </Link>
                      <span className="text-alin-muted">
                        {c.region} · {c.branchCount} branches
                      </span>
                    </li>
                  ))}
                </ul>
              </StaggerReveal>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-alin-muted">
                Coming next
              </h3>
              <StaggerReveal selector=".city-row-up">
                <ul className="mt-3 space-y-2">
                  {upcoming.map((c) => (
                    <li
                      key={c.slug}
                      className="city-row-up flex items-center justify-between text-sm"
                    >
                      <span>{c.name}</span>
                      <span className="text-alin-muted">{c.region}</span>
                    </li>
                  ))}
                </ul>
              </StaggerReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page text-center">
          <MicroLift>
            <Button asChild size="lg">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          </MicroLift>
        </div>
      </section>
    </>
  );
}
