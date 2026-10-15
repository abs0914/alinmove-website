import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";
import { getBlogPostSlugs } from "@/lib/payload";

export const revalidate = 3600;

const STATIC_PATHS = [
  "/",
  "/network",
  "/pricing",
  "/branches",
  "/how-it-works",
  "/waitlist",
  "/tracking",
  "/drive",
  "/drive/earnings",
  "/drive/flexibility",
  "/drive/apply",
  "/drive/faq",
  "/help",
  "/about",
  "/business",
  "/careers",
  "/blog",
  "/privacy",
  "/legal/privacy",
  "/legal/terms-customer",
  "/legal/terms-driver",
  "/legal/cookies",
  "/legal/data-deletion",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries = STATIC_PATHS.map((p) => ({
    url: new URL(p, SITE_URL).toString(),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1.0 : 0.7,
  }));

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const docs = await getBlogPostSlugs(1000);
    blogEntries = docs.map((doc) => ({
      url: new URL(`/blog/${doc.slug}`, SITE_URL).toString(),
      lastModified: doc.updatedAt ? new Date(doc.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // ignore — Payload may be unreachable at build time
  }

  return [...staticEntries, ...blogEntries];
}
