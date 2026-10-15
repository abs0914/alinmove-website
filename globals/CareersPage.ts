import type { GlobalConfig } from "payload";
import { heroGroup, seoGroup } from "./_shared";
import { revalidateGlobalPaths } from "@/collections/hooks/revalidate";

export const CareersPage: GlobalConfig = {
  slug: "careers-page",
  label: "Careers Page",
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobalPaths(["/careers"])] },
  fields: [
    heroGroup,
    {
      name: "cultureBlocks",
      type: "array",
      labels: { singular: "Culture block", plural: "Culture blocks" },
      admin: {
        description:
          "3 blocks render below the hero as a feature grid. Icon names are Lucide identifiers (e.g. 'Truck', 'Users', 'MapPin').",
      },
      minRows: 0,
      maxRows: 6,
      fields: [
        { name: "icon", type: "text", admin: { description: "Lucide icon name." } },
        { name: "title", type: "text", required: true, maxLength: 80 },
        { name: "body", type: "textarea", required: true, maxLength: 280 },
      ],
    },
    {
      name: "body",
      type: "richText",
      admin: { description: "Long-form narrative below the culture blocks. Optional." },
    },
    {
      name: "noOpeningsMessage",
      type: "textarea",
      maxLength: 240,
      defaultValue:
        "No openings posted right now. Email us at careers@alinmove.com and we'll keep you in mind.",
      admin: { description: "Shown on /careers when there are no published jobs." },
    },
    seoGroup,
  ],
};
