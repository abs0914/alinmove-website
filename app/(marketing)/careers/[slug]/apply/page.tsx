import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApplicationForm } from "@/components/sections/ApplicationForm";
import { getJobBySlug } from "@/lib/jobs.server";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  return buildMetadata({
    title: job ? `Apply — ${job.title}` : "Apply",
    description: job?.shortDescription ?? "Apply to join ALiN Move.",
    path: `/careers/${slug}/apply`,
    noIndex: true,
  });
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  return (
    <section className="section">
      <div className="container-page max-w-2xl">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link href={`/careers/${job.slug}`}>← Back to role</Link>
        </Button>

        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-alin-gold">
          Apply
        </p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">{job.title}</h1>
        <p className="mt-3 text-base text-alin-muted">
          Tell us a little about you. We&apos;ll review and respond within 5 business days.
        </p>

        <div className="mt-10">
          <ApplicationForm jobId={job.id} jobSlug={job.slug} jobTitle={job.title} />
        </div>
      </div>
    </section>
  );
}
