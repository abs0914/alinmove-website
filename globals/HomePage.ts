import type { GlobalConfig } from "payload";
import { revalidateGlobalPaths } from "@/collections/hooks/revalidate";
import { heroGroup, seoGroup } from "./_shared";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home Page",
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobalPaths(["/"])] },
  fields: [
    heroGroup,
    {
      name: "trustStrip",
      type: "array",
      labels: { singular: "Trust pill", plural: "Trust pills" },
      maxRows: 6,
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      name: "problems",
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
                "hand",
                "eye-off",
                "alert",
                "clock",
                "git-branch",
                "building",
              ],
            },
          ],
        },
        { name: "solutionImage", type: "upload", relationTo: "media" },
        { name: "solutionHeadline", type: "text" },
        { name: "solutionBody", type: "textarea" },
      ],
    },
    {
      name: "services",
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
                "home",
                "building",
                "map-pin",
                "circle-dollar-sign",
                "clipboard",
                "headphones",
              ],
            },
          ],
        },
      ],
    },
    {
      name: "networkPanel",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "headline", type: "text" },
        { name: "body", type: "textarea" },
      ],
    },
    {
      name: "pricingTeaser",
      type: "group",
      fields: [
        { name: "headline", type: "text" },
        { name: "subcopy", type: "textarea" },
      ],
    },
    {
      name: "coverageTeaser",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "headline", type: "text" },
        { name: "body", type: "textarea" },
      ],
    },
    {
      name: "driverTeaser",
      type: "group",
      fields: [
        { name: "kicker", type: "text" },
        { name: "headline", type: "text" },
        { name: "body", type: "textarea" },
      ],
    },
    seoGroup,
  ],
};
