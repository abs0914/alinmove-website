import Link from "next/link";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LexicalContent } from "@/lib/lexical-renderer";
import {
  deptName,
  formatEmploymentType,
  formatSalary,
  formatWorkplaceType,
  locName,
  type JobDoc,
} from "@/lib/jobs";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export function JobDetail({ job }: { job: JobDoc }) {
  const responsibilities = job.responsibilities ?? [];
  const requirements = job.requirements ?? [];
  const benefits = job.benefits ?? [];
  const salary = formatSalary(job.salary);

  return (
    <article className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0">
        <nav aria-label="Breadcrumb" className="text-sm text-alin-muted">
          <Link href="/careers" className="hover:text-alin-gold">
            Careers
          </Link>
          {deptName(job) && (
            <>
              <span aria-hidden> / </span>
              <span>{deptName(job)}</span>
            </>
          )}
        </nav>

        <h1 className="mt-3 text-4xl font-black sm:text-5xl">{job.title}</h1>

        <div className="mt-4 flex flex-wrap gap-2 text-sm text-alin-muted">
          <Badge icon={<MapPin aria-hidden className="h-3.5 w-3.5" />}>
            {locName(job) || "—"}
          </Badge>
          <Badge icon={<Briefcase aria-hidden className="h-3.5 w-3.5" />}>
            {formatEmploymentType(job.employmentType)}
          </Badge>
          <Badge>{formatWorkplaceType(job.workplaceType)}</Badge>
          {job.applicationDeadline && (
            <Badge icon={<Calendar aria-hidden className="h-3.5 w-3.5" />}>
              Apply by{" "}
              {new Date(job.applicationDeadline).toLocaleDateString("en-PH", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Badge>
          )}
        </div>

        <p className="mt-6 text-lg leading-7 text-alin-muted">{job.shortDescription}</p>

        <div className="mt-6 lg:hidden">
          <Button asChild size="lg" className="w-full">
            <Link href={`/careers/${job.slug}/apply`}>Apply now</Link>
          </Button>
        </div>

        <div className="mt-10">
          <Tabs defaultValue="overview">
            <TabsList className="flex w-full max-w-md justify-between">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="responsibilities" disabled={responsibilities.length === 0}>
                Role
              </TabsTrigger>
              <TabsTrigger value="requirements" disabled={requirements.length === 0}>
                Requirements
              </TabsTrigger>
              <TabsTrigger value="benefits" disabled={benefits.length === 0}>
                Benefits
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="blog-prose">
                <LexicalContent data={job.description as SerializedEditorState} />
              </div>
            </TabsContent>

            <TabsContent value="responsibilities">
              <BulletList items={responsibilities} />
            </TabsContent>
            <TabsContent value="requirements">
              <BulletList items={requirements} />
            </TabsContent>
            <TabsContent value="benefits">
              <BulletList items={benefits} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-alin-gold/20 bg-alin-near-black/85 p-6 shadow-[0_24px_80px_-40px_rgba(255,194,0,0.45)] ring-1 ring-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alin-gold">
            About this role
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Department" value={deptName(job)} />
            <Row label="Location" value={locName(job)} />
            <Row label="Type" value={formatEmploymentType(job.employmentType)} />
            <Row label="Workplace" value={formatWorkplaceType(job.workplaceType)} />
            {salary && <Row label="Salary" value={salary} />}
          </dl>

          <Button asChild size="lg" className="mt-6 hidden w-full lg:inline-flex">
            <Link href={`/careers/${job.slug}/apply`}>Apply now</Link>
          </Button>

          <p className="mt-4 text-xs text-alin-muted">
            Powered by ALiN Cargo Express — Philippines&apos; nationwide cargo network.
          </p>
        </div>
      </aside>
    </article>
  );
}

function Badge({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-alin-border bg-alin-near-black/70 px-3 py-1">
      {icon}
      {children}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-alin-muted">{label}</dt>
      <dd className="text-right font-medium text-alin-white">{value}</dd>
    </div>
  );
}

function BulletList({ items }: { items: { item: string }[] }) {
  if (items.length === 0)
    return <p className="text-sm text-alin-muted">Nothing listed yet.</p>;
  return (
    <ul className="space-y-3 text-base leading-7 text-alin-white">
      {items.map((entry, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-alin-gold" />
          <span>{entry.item}</span>
        </li>
      ))}
    </ul>
  );
}
