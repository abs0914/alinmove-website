import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getJobBySlug } from "@/lib/jobs.server";
import { buildMetadata } from "@/lib/seo";
import { ThankYouAnalytics } from "./ThankYouAnalytics";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildMetadata({
    title: "Application received",
    description: "Thanks — we'll review your application shortly.",
    path: `/careers/${slug}/apply/thank-you`,
    noIndex: true,
  });
}

export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ first?: string }>;
}) {
  const { slug } = await params;
  const { first } = await searchParams;
  const job = await getJobBySlug(slug);
  const firstName = (first ?? "").trim().slice(0, 80) || "there";

  return (
    <section className="section">
      <div className="container-page max-w-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-alin-gold/15 text-alin-gold">
          <CheckCircle2 aria-hidden className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-4xl font-black sm:text-5xl">Thanks, {firstName}.</h1>
        <p className="mt-4 text-base text-alin-muted sm:text-lg">
          We&apos;ve received your application{job ? ` for ${job.title}` : ""}. Our team will
          review it and get back to you within 5 business days.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/careers">Browse other openings</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">About ALiN Move</Link>
          </Button>
        </div>

        <p className="mt-10 text-xs text-alin-muted">
          Powered by ALiN Cargo Express — Philippines&apos; nationwide cargo network.
        </p>
      </div>
      <ThankYouAnalytics jobSlug={slug} />
    </section>
  );
}
