"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobCard } from "@/components/sections/JobCard";
import {
  deptSlug,
  locSlug,
  type DepartmentDoc,
  type JobDoc,
  type JobLocationDoc,
} from "@/lib/jobs";
import { trackEvent } from "@/lib/analytics";
import { trackOnce } from "@/lib/analytics-helpers";

const ANY = "__any__";

export function JobListingsBoard({
  jobs,
  departments,
  locations,
  emptyMessage,
}: {
  jobs: JobDoc[];
  departments: DepartmentDoc[];
  locations: JobLocationDoc[];
  emptyMessage: string;
}) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState(ANY);
  const [employmentType, setEmploymentType] = useState(ANY);
  const [location, setLocation] = useState(ANY);

  useEffect(() => {
    trackOnce("careers-page-view", "careers_page_view", { jobs_count: jobs.length });
  }, [jobs.length]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (q && !job.title.toLowerCase().includes(q)) return false;
      if (department !== ANY && deptSlug(job) !== department) return false;
      if (employmentType !== ANY && job.employmentType !== employmentType) return false;
      if (location !== ANY && locSlug(job) !== location) return false;
      return true;
    });
  }, [jobs, query, department, employmentType, location]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-2">
          <Label htmlFor="job-search">Search</Label>
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-alin-muted"
            />
            <Input
              id="job-search"
              type="search"
              placeholder="Search by title…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value)
                  trackEvent("careers_filter_change", { filter_type: "search", value: e.target.value });
              }}
              className="pl-10"
            />
          </div>
        </div>
        <FilterSelect
          label="Department"
          value={department}
          onChange={(v) => {
            setDepartment(v);
            trackEvent("careers_filter_change", { filter_type: "department", value: v });
          }}
          options={departments.map((d) => ({ value: d.slug, label: d.name }))}
        />
        <FilterSelect
          label="Type"
          value={employmentType}
          onChange={(v) => {
            setEmploymentType(v);
            trackEvent("careers_filter_change", { filter_type: "employment_type", value: v });
          }}
          options={[
            { value: "full-time", label: "Full-time" },
            { value: "part-time", label: "Part-time" },
            { value: "contract", label: "Contract" },
            { value: "internship", label: "Internship" },
          ]}
        />
        <FilterSelect
          label="Location"
          value={location}
          onChange={(v) => {
            setLocation(v);
            trackEvent("careers_filter_change", { filter_type: "location", value: v });
          }}
          options={locations.map((l) => ({ value: l.slug, label: l.name }))}
        />
      </div>

      <p className="text-sm text-alin-muted" aria-live="polite">
        Showing {filtered.length} of {jobs.length} role{jobs.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-alin-gold/15 bg-alin-near-black/60 p-8 text-center text-alin-muted">
          {jobs.length === 0
            ? emptyMessage
            : "No roles match those filters. Try clearing one."}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = `filter-${label.toLowerCase()}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={`All ${label.toLowerCase()}s`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>All {label.toLowerCase()}s</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
