import type { GlobalConfig } from "payload";
import { revalidateGlobalPaths } from "@/collections/hooks/revalidate";
import { heroGroup, seoGroup } from "./_shared";

export const HowItWorksPage: GlobalConfig = {
  slug: "how-it-works-page",
  label: "How It Works Page",
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobalPaths(["/how-it-works"])] },
  fields: [
    heroGroup,
    {
      name: "stats",
      type: "array",
      maxRows: 6,
      fields: [
        { name: "value", type: "text", required: true },
        { name: "label", type: "text", required: true },
        {
          name: "icon",
          type: "select",
          options: ["user-check", "store", "check-circle", "boxes"],
        },
      ],
    },
    {
      name: "audienceCards",
      type: "array",
      maxRows: 4,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true, maxLength: 280 },
        { name: "ctaLabel", type: "text", required: true },
        { name: "ctaHref", type: "text", required: true },
        {
          name: "icon",
          type: "select",
          options: ["package-open", "bike", "building"],
        },
      ],
    },
    {
      name: "customerSteps",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "headline", type: "text" },
        { name: "body", type: "textarea" },
        {
          name: "steps",
          type: "array",
          maxRows: 8,
          fields: [
            { name: "title", type: "text", required: true },
            { name: "body", type: "textarea", required: true, maxLength: 280 },
            { name: "detail", type: "text" },
            { name: "image", type: "upload", relationTo: "media" },
          ],
        },
      ],
    },
    {
      name: "riderSteps",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "headline", type: "text" },
        { name: "body", type: "textarea" },
        {
          name: "steps",
          type: "array",
          maxRows: 10,
          fields: [
            { name: "title", type: "text", required: true },
            { name: "body", type: "textarea", required: true, maxLength: 280 },
            { name: "image", type: "upload", relationTo: "media" },
          ],
        },
      ],
    },
    {
      name: "branchOps",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "headline", type: "text" },
        { name: "body", type: "textarea" },
        {
          name: "items",
          type: "array",
          maxRows: 6,
          fields: [
            { name: "title", type: "text", required: true },
            { name: "body", type: "textarea", required: true, maxLength: 200 },
          ],
        },
      ],
    },
    {
      name: "faqs",
      type: "array",
      maxRows: 12,
      fields: [
        { name: "question", type: "text", required: true, maxLength: 160 },
        { name: "answer", type: "textarea", required: true, maxLength: 480 },
      ],
    },
    seoGroup,
  ],
};
