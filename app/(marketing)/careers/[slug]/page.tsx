import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobDetail } from "@/components/sections/JobDetail";
import { getJobBySlug, getJobSlugs } from "@/lib/jobs.server";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, jobPostingJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/utils";
import { deptName } from "@/lib/jobs";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getJobSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) {
    return buildMetadata({
      title: "Role not found",
      description: "This role is no longer available.",
      path: `/careers/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: job.seo?.metaTitle ?? `${job.title} — Careers`,
    description: job.seo?.metaDescription ?? job.shortDescription,
    path: `/careers/${job.slug}`,
  });
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Careers", url: new URL("/careers", SITE_URL).toString() },
    {
      name: deptName(job) || job.title,
      url: new URL(`/careers/${job.slug}`, SITE_URL).toString(),
    },
  ]);

  return (
    <section className="section">
      <div className="container-page">
        <JobDetail job={job} />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd(job)) }}
      />
    </section>
  );
}
