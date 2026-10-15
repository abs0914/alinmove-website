import Link from "next/link";
import type { Metadata } from "next";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobListingsBoard } from "@/components/sections/JobListingsBoard";
import { LexicalContent } from "@/lib/lexical-renderer";
import { getGlobal } from "@/lib/payload";
import { getActiveJobs, getDepartments, getJobLocations } from "@/lib/jobs.server";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, careersItemListJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/utils";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

type CareersGlobal = {
  hero?: {
    eyebrow?: string;
    headline?: string;
    subcopy?: string;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
  };
  cultureBlocks?: { icon?: string; title: string; body: string }[];
  body?: SerializedEditorState;
  noOpeningsMessage?: string;
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: unknown };
};

const HERO_FALLBACK = {
  eyebrow: "Careers at ALiN Move",
  headline: "Help build the digital layer of a nationwide cargo network.",
  subcopy:
    "ALiN Move is the customer + driver experience on top of ALiN Cargo Express — Philippines' established cargo backbone. We're hiring people who want to ship product, move quickly, and matter.",
};

const NO_OPENINGS_FALLBACK =
  "No openings posted right now. Email us at careers@alinmove.com and we'll keep you in mind.";

export async function generateMetadata(): Promise<Metadata> {
  const data = (await getGlobal<CareersGlobal>("careers-page")) ?? {};
  const title = data.seo?.metaTitle ?? data.hero?.headline ?? "Careers";
  const description =
    data.seo?.metaDescription ??
    data.hero?.subcopy ??
    "Open roles at ALiN Move — the digital layer of ALiN Cargo Express.";
  return buildMetadata({ title, description, path: "/careers" });
}

export const revalidate = 3600;

export default async function CareersPage() {
  const [data, jobs, departments, locations] = await Promise.all([
    getGlobal<CareersGlobal>("careers-page"),
    getActiveJobs(),
    getDepartments(),
    getJobLocations(),
  ]);

  const hero = { ...HERO_FALLBACK, ...(data?.hero ?? {}) };
  const cultureBlocks = data?.cultureBlocks ?? [];
  const body = data?.body;
  const noOpeningsMessage = data?.noOpeningsMessage || NO_OPENINGS_FALLBACK;

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Careers", url: new URL("/careers", SITE_URL).toString() },
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-alin-gold/10 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,194,0,0.18),transparent_60%),linear-gradient(180deg,#000_0%,#0f1117_100%)] py-16 lg:py-24">
        <div className="container-page">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-alin-gold">
            {hero.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
            {hero.headline}
          </h1>
          {hero.subcopy && (
            <p className="mt-6 max-w-2xl text-lg leading-7 text-alin-muted sm:text-xl">
              {hero.subcopy}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="#openings">
                View openings
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">About ALiN Move</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Culture blocks */}
      {cultureBlocks.length > 0 && (
        <section className="section">
          <div className="container-page">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cultureBlocks.map((block, i) => (
                <CultureBlock key={i} {...block} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Long-form body */}
      {body && (
        <section className="pb-8">
          <div className="container-page max-w-3xl">
            <div className="blog-prose">
              <LexicalContent data={body} />
            </div>
          </div>
        </section>
      )}

      {/* Openings */}
      <section id="openings" className="section border-t border-alin-border">
        <div className="container-page">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-alin-gold">
              Open roles
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl lg:text-5xl">
              Find your fit at ALiN Move
            </h2>
          </div>

          <JobListingsBoard
            jobs={jobs}
            departments={departments}
            locations={locations}
            emptyMessage={noOpeningsMessage}
          />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {jobs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(careersItemListJsonLd(jobs)) }}
        />
      )}
    </>
  );
}

function CultureBlock({ icon, title, body }: { icon?: string; title: string; body: string }) {
  const Icon =
    icon && (Icons as unknown as Record<string, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>>)[icon];
  return (
    <div className="rounded-2xl border border-alin-gold/15 bg-alin-near-black/85 p-6 ring-1 ring-white/5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-alin-gold/10 text-alin-gold">
        {Icon ? (
          <Icon aria-hidden className="h-5 w-5" />
        ) : (
          <span aria-hidden className="h-2 w-2 rounded-full bg-alin-gold" />
        )}
      </div>
      <h3 className="mt-4 text-lg font-bold sm:text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-alin-muted">{body}</p>
    </div>
  );
}
