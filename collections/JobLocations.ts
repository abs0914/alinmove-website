import type { CollectionConfig } from "payload";

export const JobLocations: CollectionConfig = {
  slug: "job-locations",
  admin: {
    group: "Recruiting",
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "isRemote", "country"],
  },
  access: { read: () => true },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      maxLength: 80,
      admin: { description: "Display name, e.g. 'Cebu City' or 'Remote — Philippines'." },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "city",
      type: "relationship",
      relationTo: "cities",
      admin: { description: "Optional link to a Cities entry if this maps to a coverage city." },
    },
    { name: "isRemote", type: "checkbox", defaultValue: false },
    { name: "country", type: "text", defaultValue: "PH" },
  ],
};
