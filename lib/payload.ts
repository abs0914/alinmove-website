/**
 * Server-side helper for fetching Payload content from RSCs.
 * Reference: .claude/skills/payload-cms-conventions/SKILL.md
 *
 * All helpers are wrapped in a 5s timeout + null fallback so dev / preview
 * builds without a configured DATABASE_URI never hang. Callers MUST handle
 * the null/empty case (the layout uses hardcoded fallbacks; pages render an
 * empty state).
 */

import { getPayload } from "payload";
import config from "@payload-config";

export const getPayloadClient = async () => getPayload({ config });

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
    console.error(`[payload] ${label} failed`, err instanceof Error ? err.message : err);
    return fallback;
  }
}

export async function getGlobal<T = unknown>(slug: string, depth = 2): Promise<T | null> {
  return safe<T | null>(
    `getGlobal("${slug}")`,
    async () => {
      const payload = await getPayloadClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await payload.findGlobal({ slug: slug as any, depth });
      return data as T;
    },
    null,
  );
}

const EMPTY_PAGINATED = {
  docs: [],
  totalDocs: 0,
  totalPages: 0,
  page: 1,
  limit: 0,
  pagingCounter: 0,
  hasNextPage: false,
  hasPrevPage: false,
  nextPage: null,
  prevPage: null,
};

export async function getBlogPosts({ limit = 10, page = 1 } = {}) {
  return safe(
    "getBlogPosts",
    async () => {
      const payload = await getPayloadClient();
      return payload.find({
        collection: "blog-posts",
        where: { _status: { equals: "published" } },
        sort: "-publishedAt",
        limit,
        page,
        depth: 2,
      });
    },
    EMPTY_PAGINATED as never,
  );
}

export async function getBlogPostBySlug(slug: string) {
  return safe(
    `getBlogPostBySlug("${slug}")`,
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "blog-posts",
        where: { slug: { equals: slug }, _status: { equals: "published" } },
        limit: 1,
        depth: 2,
      });
      return result.docs[0] ?? null;
    },
    null,
  );
}

export async function getBlogPostSlugs(limit = 1000) {
  return safe<Array<{ slug: string; updatedAt: string }>>(
    "getBlogPostSlugs",
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "blog-posts",
        where: { _status: { equals: "published" } },
        sort: "-publishedAt",
        limit,
        depth: 0,
        select: { slug: true, updatedAt: true },
      });
      return result.docs as Array<{ slug: string; updatedAt: string }>;
    },
    [],
  );
}

export async function getRelatedBlogPosts({
  excludeSlug,
  categoryId,
  limit = 3,
}: {
  excludeSlug: string;
  categoryId?: string | number;
  limit?: number;
}) {
  return safe(
    "getRelatedBlogPosts",
    async () => {
      const payload = await getPayloadClient();
      const conditions: Array<Record<string, unknown>> = [
        { _status: { equals: "published" } },
        { slug: { not_equals: excludeSlug } },
      ];
      if (categoryId) conditions.push({ category: { equals: categoryId } });
      const result = await payload.find({
        collection: "blog-posts",
        where: { and: conditions } as never,
        sort: "-publishedAt",
        limit,
        depth: 2,
      });
      return result.docs;
    },
    [] as never[],
  );
}

export async function getFAQItems(audience: "customer" | "driver" | "both" = "both") {
  return safe(
    `getFAQItems("${audience}")`,
    async () => {
      const payload = await getPayloadClient();
      return payload.find({
        collection: "faq-items",
        where:
          audience === "both"
            ? {}
            : { or: [{ audience: { equals: audience } }, { audience: { equals: "both" } }] },
        sort: "order",
        limit: 100,
      });
    },
    EMPTY_PAGINATED as never,
  );
}
