import type { CollectionConfig } from "payload";

export const Departments: CollectionConfig = {
  slug: "departments",
  admin: {
    group: "Recruiting",
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "updatedAt"],
  },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 60 },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL slug. Lowercase, hyphenated." },
    },
  ],
};
