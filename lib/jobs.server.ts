/**
 * Server-side helpers for fetching Careers data from Payload.
 * Mirrors the patterns in lib/payload.ts (5s timeout + null/empty fallback).
 */

import { getPayloadClient } from "@/lib/payload";

const PAYLOAD_TIMEOUT_MS = 5_000;

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms),
    ),
  ]);
}

async function safe<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await withTimeout(fn(), PAYLOAD_TIMEOUT_MS, label);
  } catch (err) {
    console.error(`[jobs] ${label} failed`, err instanceof Error ? err.message : err);
    return fallback;
  }
}

export type JobDoc = {
  id: string | number;
  title: string;
  slug: string;
  department:
    | string
    | number
    | { id: string | number; name: string; slug: string };
  location:
    | string
    | number
    | {
        id: string | number;
        name: string;
        slug: string;
        isRemote?: boolean;
        country?: string;
      };
  employmentType: "full-time" | "part-time" | "contract" | "internship";
  workplaceType: "onsite" | "hybrid" | "remote";
  shortDescription: string;
  description: unknown;
  responsibilities?: { item: string }[];
  requirements?: { item: string }[];
  benefits?: { item: string }[];
  salary?: {
    showSalary?: boolean;
    min?: number;
    max?: number;
    currency?: "PHP" | "USD";
    period?: "hour" | "month" | "year";
  };
  applyEmailNotify?: string;
  applicationDeadline?: string;
  publishedAt?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
  updatedAt: string;
  createdAt: string;
};

export type DepartmentDoc = { id: string | number; name: string; slug: string };
export type JobLocationDoc = {
  id: string | number;
  name: string;
  slug: string;
  isRemote?: boolean;
  country?: string;
};

export async function getActiveJobs({ limit = 200 } = {}): Promise<JobDoc[]> {
  return safe<JobDoc[]>(
    "getActiveJobs",
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "job-listings",
        where: { _status: { equals: "published" } },
        sort: "-publishedAt",
        limit,
        depth: 2,
      });
      return result.docs as JobDoc[];
    },
    [],
  );
}

export async function getJobBySlug(slug: string): Promise<JobDoc | null> {
  return safe<JobDoc | null>(
    `getJobBySlug("${slug}")`,
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "job-listings",
        where: { slug: { equals: slug }, _status: { equals: "published" } },
        limit: 1,
        depth: 2,
      });
      return (result.docs[0] as JobDoc) ?? null;
    },
    null,
  );
}

export async function getJobSlugs(limit = 500): Promise<Array<{ slug: string; updatedAt: string }>> {
  return safe<Array<{ slug: string; updatedAt: string }>>(
    "getJobSlugs",
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "job-listings",
        where: { _status: { equals: "published" } },
        limit,
        depth: 0,
        select: { slug: true, updatedAt: true },
      });
      return result.docs as Array<{ slug: string; updatedAt: string }>;
    },
    [],
  );
}

export async function getDepartments(): Promise<DepartmentDoc[]> {
  return safe<DepartmentDoc[]>(
    "getDepartments",
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "departments",
        sort: "name",
        limit: 100,
        depth: 0,
      });
      return result.docs as DepartmentDoc[];
    },
    [],
  );
}

export async function getJobLocations(): Promise<JobLocationDoc[]> {
  return safe<JobLocationDoc[]>(
    "getJobLocations",
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "job-locations",
        sort: "name",
        limit: 100,
        depth: 0,
      });
      return result.docs as JobLocationDoc[];
    },
    [],
  );
}
