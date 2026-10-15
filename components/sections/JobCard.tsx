import Link from "next/link";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";
import {
  deptName,
  formatEmploymentType,
  formatWorkplaceType,
  locName,
  type JobDoc,
} from "@/lib/jobs";

export function JobCard({ job }: { job: JobDoc }) {
  return (
    <Link
      href={`/careers/${job.slug}`}
      className="group block rounded-2xl border border-alin-gold/15 bg-alin-near-black/85 p-5 ring-1 ring-white/5 transition-colors hover:border-alin-gold/40 lg:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alin-gold">
            {deptName(job) || "Open role"}
          </p>
          <h3 className="mt-2 text-xl font-bold text-alin-white sm:text-2xl">
            {job.title}
          </h3>
        </div>
        <ArrowRight
          aria-hidden
          className="mt-1 h-5 w-5 shrink-0 text-alin-gold transition-transform group-hover:translate-x-1"
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-alin-muted sm:text-base">
        {job.shortDescription}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-alin-muted">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-alin-border bg-alin-black/60 px-2.5 py-1">
          <MapPin aria-hidden className="h-3 w-3" />
          {locName(job) || "—"}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-alin-border bg-alin-black/60 px-2.5 py-1">
          <Briefcase aria-hidden className="h-3 w-3" />
          {formatEmploymentType(job.employmentType)}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-alin-border bg-alin-black/60 px-2.5 py-1">
          {formatWorkplaceType(job.workplaceType)}
        </span>
      </div>
    </Link>
  );
}
