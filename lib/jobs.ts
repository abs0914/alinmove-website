/**
 * Pure formatting helpers and shared types for Careers.
 * Types are re-exported from jobs.server.ts for convenience.
 * This file intentionally avoids importing Payload to keep it safe for client components.
 */

export type {
  JobDoc,
  DepartmentDoc,
  JobLocationDoc,
} from "@/lib/jobs.server";

export function deptName(job: { department: unknown }): string {
  const d = job.department;
  if (d && typeof d === "object" && "name" in d) return (d as { name: string }).name;
  return "";
}

export function locName(job: { location: unknown }): string {
  const l = job.location;
  if (l && typeof l === "object" && "name" in l) return (l as { name: string }).name;
  return "";
}

export function deptSlug(job: { department: unknown }): string {
  const d = job.department;
  if (d && typeof d === "object" && "slug" in d) return (d as { slug: string }).slug;
  return "";
}

export function locSlug(job: { location: unknown }): string {
  const l = job.location;
  if (l && typeof l === "object" && "slug" in l) return (l as { slug: string }).slug;
  return "";
}

export function formatEmploymentType(t: string): string {
  return {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    internship: "Internship",
  }[t] ?? t;
}

export function formatWorkplaceType(t: string): string {
  return { onsite: "Onsite", hybrid: "Hybrid", remote: "Remote" }[t] ?? t;
}

export function formatSalary(salary?: {
  showSalary?: boolean;
  min?: number;
  max?: number;
  currency?: "PHP" | "USD";
  period?: "hour" | "month" | "year";
}): string | null {
  if (!salary?.showSalary) return null;
  const { min, max, currency = "PHP", period = "month" } = salary;
  if (min == null && max == null) return null;
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-PH", { maximumFractionDigits: 0 }).format(n);
  const periodLabel = { hour: "/hr", month: "/mo", year: "/yr" }[period] ?? "";
  if (min != null && max != null) return `${currency} ${fmt(min)}–${fmt(max)}${periodLabel}`;
  if (min != null) return `From ${currency} ${fmt(min)}${periodLabel}`;
  if (max != null) return `Up to ${currency} ${fmt(max)}${periodLabel}`;
  return null;
}
