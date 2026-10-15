import type { CollectionConfig } from "payload";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: { useAsTitle: "name" },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "text", required: true, admin: { description: "e.g., 'Rider, Cebu' or 'Customer, Mandaue'" } },
    { name: "quote", type: "textarea", required: true, maxLength: 240 },
    { name: "photo", type: "upload", relationTo: "media" },
    {
      name: "audience",
      type: "select",
      required: true,
      options: [
        { label: "Customer", value: "customer" },
        { label: "Driver", value: "driver" },
      ],
    },
    { name: "featured", type: "checkbox", defaultValue: false },
  ],
};
