/**
 * Structured data helpers for SEO. Emit via <script type="application/ld+json">.
 */

import { SITE_URL } from "@/lib/utils";
import { deptName, locName, type JobDoc } from "@/lib/jobs";

const HIRING_ORG = {
  "@type": "Organization",
  name: "ALiN Move",
  sameAs: SITE_URL,
  logo: new URL("/og/home.png", SITE_URL).toString(),
};

const EMPLOYMENT_TYPE_MAP: Record<JobDoc["employmentType"], string> = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  contract: "CONTRACTOR",
  internship: "INTERN",
};

export function jobPostingJsonLd(job: JobDoc) {
  const url = new URL(`/careers/${job.slug}`, SITE_URL).toString();
  const datePosted = job.publishedAt ?? job.createdAt;

  const jobLocationType = job.workplaceType === "remote" ? "TELECOMMUTE" : undefined;

  const jobLocation =
    job.workplaceType === "remote"
      ? undefined
      : {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: locName(job),
            addressCountry:
              (typeof job.location === "object" && job.location && "country" in job.location
                ? (job.location.country as string | undefined)
                : undefined) ?? "PH",
          },
        };

  const baseSalary =
    job.salary?.showSalary && (job.salary.min != null || job.salary.max != null)
      ? {
          "@type": "MonetaryAmount",
          currency: job.salary.currency ?? "PHP",
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salary.min,
            maxValue: job.salary.max,
            unitText:
              job.salary.period === "hour"
                ? "HOUR"
                : job.salary.period === "year"
                  ? "YEAR"
                  : "MONTH",
          },
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.shortDescription,
    datePosted,
    validThrough: job.applicationDeadline,
    employmentType: EMPLOYMENT_TYPE_MAP[job.employmentType],
    hiringOrganization: HIRING_ORG,
    industry: deptName(job),
    jobLocation,
    jobLocationType,
    baseSalary,
    url,
    applicantLocationRequirements:
      job.workplaceType === "remote"
        ? { "@type": "Country", name: "Philippines" }
        : undefined,
    directApply: true,
  };
}

export function careersItemListJsonLd(jobs: JobDoc[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jobs.map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: new URL(`/careers/${job.slug}`, SITE_URL).toString(),
      name: job.title,
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
