import type { GlobalConfig } from "payload";
import { revalidateGlobalPaths } from "@/collections/hooks/revalidate";

/**
 * Site-wide config used by the marketing layout: nav links, footer columns,
 * social handles, sticky bar copy. Editing this revalidates ALL marketing
 * routes.
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site settings",
  access: { read: () => true },
  hooks: {
    afterChange: [
      revalidateGlobalPaths([
        "/",
        "/how-it-works",
        "/pricing",
        "/tracking",
        "/drive",
        "/about",
        "/business",
        "/careers",
        "/help",
        "/network",
        "/branches",
        "/coverage",
        "/blog",
      ]),
    ],
  },
  fields: [
    {
      name: "tagline",
      type: "text",
      defaultValue: "From your doorstep to anywhere in the Philippines.",
    },
    {
      name: "navLinks",
      type: "array",
      maxRows: 8,
      fields: [
        { name: "label", type: "text", required: true, maxLength: 32 },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "footerColumns",
      type: "array",
      maxRows: 6,
      fields: [
        { name: "label", type: "text", required: true, maxLength: 32 },
        {
          name: "links",
          type: "array",
          maxRows: 12,
          fields: [
            { name: "label", type: "text", required: true, maxLength: 48 },
            { name: "href", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "social",
      type: "array",
      maxRows: 6,
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: ["facebook", "tiktok", "youtube", "instagram", "x", "linkedin"],
        },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "stickyBar",
      type: "group",
      admin: { description: "Mobile sticky download bar copy." },
      fields: [
        { name: "headline", type: "text", maxLength: 60 },
        { name: "ctaLabel", type: "text", maxLength: 32 },
      ],
    },
  ],
};
