import type { GlobalConfig } from "payload";
import { revalidateGlobalPaths } from "@/collections/hooks/revalidate";
import { heroGroup, seoGroup } from "./_shared";

export const PricingPage: GlobalConfig = {
  slug: "pricing-page",
  label: "Pricing Page",
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobalPaths(["/pricing"])] },
  fields: [
    heroGroup,
    {
      name: "pricingCards",
      type: "array",
      maxRows: 6,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "price", type: "text", required: true },
        { name: "subprice", type: "text" },
        { name: "description", type: "textarea", required: true, maxLength: 280 },
        {
          name: "includes",
          type: "array",
          maxRows: 8,
          fields: [{ name: "label", type: "text", required: true }],
        },
        { name: "ctaLabel", type: "text", required: true },
        { name: "ctaHref", type: "text", required: true },
        {
          name: "icon",
          type: "select",
          options: ["truck", "building", "briefcase"],
        },
        { name: "featured", type: "checkbox", defaultValue: false },
      ],
    },
    {
      name: "rateTable",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "headline", type: "text" },
        { name: "body", type: "textarea" },
        {
          name: "rows",
          type: "array",
          fields: [
            { name: "service", type: "text", required: true },
            { name: "rate", type: "text", required: true },
            { name: "baseDistance", type: "text", required: true },
            { name: "additional", type: "text", required: true },
          ],
        },
        { name: "footnote", type: "text" },
      ],
    },
    {
      name: "serviceTypes",
      type: "array",
      maxRows: 6,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true, maxLength: 320 },
        {
          name: "bestFor",
          type: "array",
          maxRows: 8,
          fields: [{ name: "label", type: "text", required: true }],
        },
        {
          name: "icon",
          type: "select",
          options: ["package-check", "store", "bike"],
        },
      ],
    },
    {
      name: "pricingFactors",
      type: "array",
      maxRows: 6,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true, maxLength: 200 },
        {
          name: "icon",
          type: "select",
          options: ["route", "package-open", "ruler", "map-pin", "boxes"],
        },
      ],
    },
    {
      name: "businessPlans",
      type: "array",
      maxRows: 4,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true, maxLength: 280 },
        { name: "ctaLabel", type: "text", required: true },
        { name: "ctaHref", type: "text", required: true },
      ],
    },
    {
      name: "revenueShare",
      type: "array",
      maxRows: 6,
      fields: [
        { name: "label", type: "text", required: true },
        { name: "value", type: "text", required: true },
      ],
    },
    {
      name: "comparison",
      type: "group",
      fields: [
        { name: "headline", type: "text" },
        { name: "ordinaryHeader", type: "text", defaultValue: "Ordinary delivery app" },
        { name: "alinHeader", type: "text", defaultValue: "ALiN Move" },
        {
          name: "rows",
          type: "array",
          fields: [
            { name: "ordinary", type: "text", required: true },
            { name: "alin", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "trustCards",
      type: "array",
      maxRows: 6,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true, maxLength: 200 },
        {
          name: "icon",
          type: "select",
          options: ["calculator", "eye", "file-check", "building", "briefcase"],
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
