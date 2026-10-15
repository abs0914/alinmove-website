import type { CollectionConfig } from "payload";
import { revalidateBlog } from "./hooks/revalidate";

export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
  versions: { drafts: true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "publishedAt", "_status"],
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateBlog] },
  fields: [
    { name: "title", type: "text", required: true, maxLength: 80 },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL slug. Lowercase, hyphenated. No spaces." },
    },
    { name: "excerpt", type: "textarea", required: true, maxLength: 200 },
    { name: "category", type: "relationship", relationTo: "categories", required: true },
    { name: "author", type: "relationship", relationTo: "authors", required: true },
    { name: "heroImage", type: "upload", relationTo: "media", required: true },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional. 1200×630. Falls back to heroImage." },
    },
    { name: "body", type: "richText", required: true },
    {
      name: "publishedAt",
      type: "date",
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "metaTitle", type: "text", maxLength: 60 },
        { name: "metaDescription", type: "textarea", maxLength: 160 },
      ],
    },
  ],
};
