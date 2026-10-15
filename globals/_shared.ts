import type { Field, GlobalConfig } from "payload";
import { revalidateGlobalPaths } from "@/collections/hooks/revalidate";

export const seoGroup: Field = {
  name: "seo",
  type: "group",
  admin: { description: "SEO overrides. Falls back to page hero copy if blank." },
  fields: [
    { name: "metaTitle", type: "text", maxLength: 60 },
    { name: "metaDescription", type: "textarea", maxLength: 160 },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "1200×630. Falls back to a brand default." },
    },
  ],
};

export const heroGroup: Field = {
  name: "hero",
  type: "group",
  fields: [
    { name: "eyebrow", type: "text", maxLength: 60 },
    { name: "headline", type: "text", required: true, maxLength: 140 },
    { name: "subcopy", type: "textarea", maxLength: 320 },
    { name: "primaryCtaLabel", type: "text" },
    { name: "primaryCtaHref", type: "text" },
    { name: "secondaryCtaLabel", type: "text" },
    { name: "secondaryCtaHref", type: "text" },
  ],
};

/**
 * Factory for a "simple page" Global — used for routes that are mostly text
 * (about, careers, business, network, drive sub-pages, track, help intro).
 * Editors get: SEO, hero block, optional Lexical body, optional CTA. The
 * page renders this with a generic SimplePageShell server component.
 */
export function simplePageGlobal({
  slug,
  label,
  paths,
}: {
  slug: string;
  label: string;
  paths: string[];
}): GlobalConfig {
  return {
    slug,
    label,
    access: { read: () => true },
    hooks: { afterChange: [revalidateGlobalPaths(paths)] },
    fields: [
      heroGroup,
      {
        name: "body",
        type: "richText",
        admin: { description: "Long-form body. Optional." },
      },
      seoGroup,
    ],
  };
}
