import type { GlobalConfig } from "payload";
import { revalidateGlobalPaths } from "@/collections/hooks/revalidate";
import { heroGroup, seoGroup } from "./_shared";

export const DrivePage: GlobalConfig = {
  slug: "drive-page",
  label: "Drive Page",
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobalPaths(["/drive"])] },
  fields: [
    heroGroup,
    {
      name: "benefits",
      type: "group",
      fields: [
        { name: "headline", type: "text" },
        {
          name: "items",
          type: "array",
          maxRows: 6,
          fields: [
            { name: "title", type: "text", required: true },
            { name: "body", type: "textarea", required: true, maxLength: 200 },
            {
              name: "icon",
              type: "select",
              options: [
                "briefcase",
                "coins",
                "wallet",
                "shield",
                "heart-handshake",
                "network",
              ],
            },
          ],
        },
      ],
    },
    {
      name: "steps",
      type: "group",
      fields: [
        { name: "headline", type: "text" },
        {
          name: "items",
          type: "array",
          maxRows: 8,
          fields: [
            { name: "title", type: "text", required: true },
            { name: "description", type: "textarea", required: true, maxLength: 200 },
            {
              name: "icon",
              type: "select",
              options: [
                "scroll-text",
                "power",
                "clipboard-check",
                "package",
                "hand-coins",
              ],
            },
          ],
        },
      ],
    },
    {
      name: "earningsPanel",
      type: "group",
      fields: [
        { name: "headline", type: "text" },
        { name: "body", type: "textarea" },
        {
          name: "tiers",
          type: "array",
          maxRows: 3,
          fields: [
            { name: "label", type: "text", required: true },
            { name: "value", type: "number", required: true },
            { name: "suffix", type: "text", defaultValue: "+" },
          ],
        },
      ],
    },
    {
      name: "phoneCarousel",
      type: "group",
      fields: [
        { name: "headline", type: "text" },
        { name: "subcopy", type: "textarea" },
        {
          name: "screens",
          type: "array",
          maxRows: 8,
          fields: [
            { name: "image", type: "upload", relationTo: "media", required: true },
            { name: "label", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "testimonialsHeader",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "headline", type: "text" },
      ],
    },
    {
      name: "applyCta",
      type: "group",
      fields: [
        { name: "headline", type: "text" },
        { name: "body", type: "textarea" },
      ],
    },
    seoGroup,
  ],
};
