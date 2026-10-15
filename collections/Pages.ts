import type { CollectionConfig } from "payload";
import { revalidatePage } from "./hooks/revalidate";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["key", "label", "updatedAt"],
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidatePage] },
  fields: [
    {
      name: "key",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description:
          "Programmatic key, e.g. 'home', 'network', 'drive'. Do not change once set.",
      },
    },
    { name: "label", type: "text", required: true },
    {
      name: "sections",
      type: "array",
      fields: [
        {
          name: "blockType",
          type: "select",
          required: true,
          options: [
            { label: "Hero", value: "hero" },
            { label: "Trust strip", value: "trust" },
            { label: "Three steps", value: "three-steps" },
            { label: "Service cards", value: "services" },
            { label: "FAQ slice", value: "faq-slice" },
            { label: "CTA block", value: "cta" },
          ],
        },
        { name: "title", type: "text" },
        { name: "subtitle", type: "textarea" },
        { name: "body", type: "richText" },
        { name: "image", type: "upload", relationTo: "media" },
        { name: "ctaLabel", type: "text" },
        {
          name: "ctaHref",
          type: "text",
          admin: { description: "Internal: '/waitlist'. External: 'https://…'." },
        },
      ],
    },
  ],
};
