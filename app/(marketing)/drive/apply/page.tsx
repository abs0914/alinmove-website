import type { Metadata } from "next";
import { DriverApplyForm } from "@/components/sections/DriverApplyForm";
import { getCoverage } from "@/lib/coverage-api";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Apply to drive",
  description: "Apply to drive with ALiN Move. We'll send you a link to the Rider App next.",
  path: "/drive/apply",
});

export default async function ApplyPage() {
  const coverage = await getCoverage();
  const cities = coverage.cities.map((c) => ({ slug: c.slug, name: c.name }));
  return (
    <section className="section">
      <div className="container-page max-w-xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Drive with us.</h1>
        <p className="mt-3 text-alin-muted">
          Submit the basics. We&apos;ll send you a link to the Rider App to complete the rest:
          documents, vehicle, branch preference.
        </p>
        <div className="mt-8">
          <DriverApplyForm cities={cities} />
        </div>
      </div>
    </section>
  );
}
