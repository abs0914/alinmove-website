import type { CollectionConfig } from "payload";
import { revalidateCity } from "./hooks/revalidate";

export const Cities: CollectionConfig = {
  slug: "cities",
  admin: { useAsTitle: "name" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateCity] },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "heroImage", type: "upload", relationTo: "media" },
    { name: "intro", type: "richText" },
    { name: "serviceNotes", type: "richText" },
    { name: "isActive", type: "checkbox", defaultValue: true },
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
