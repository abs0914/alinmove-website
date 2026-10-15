import type { CollectionConfig } from "payload";
import { revalidateJob } from "./hooks/revalidate";

export const JobListings: CollectionConfig = {
  slug: "job-listings",
  versions: { drafts: true },
  admin: {
    group: "Recruiting",
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "department",
      "location",
      "employmentType",
      "_status",
      "publishedAt",
    ],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return { _status: { equals: "published" } };
    },
  },
  hooks: { afterChange: [revalidateJob] },
  fields: [
    { name: "title", type: "text", required: true, maxLength: 120 },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL slug. Lowercase, hyphenated. No spaces." },
    },
    {
      name: "department",
      type: "relationship",
      relationTo: "departments",
      required: true,
    },
    {
      name: "location",
      type: "relationship",
      relationTo: "job-locations",
      required: true,
    },
    {
      name: "employmentType",
      type: "select",
      required: true,
      defaultValue: "full-time",
      options: [
        { label: "Full-time", value: "full-time" },
        { label: "Part-time", value: "part-time" },
        { label: "Contract", value: "contract" },
        { label: "Internship", value: "internship" },
      ],
    },
    {
      name: "workplaceType",
      type: "select",
      required: true,
      defaultValue: "onsite",
      options: [
        { label: "Onsite", value: "onsite" },
        { label: "Hybrid", value: "hybrid" },
        { label: "Remote", value: "remote" },
      ],
    },
    {
      name: "shortDescription",
      type: "textarea",
      required: true,
      maxLength: 240,
      admin: { description: "One- or two-line summary shown on listing cards." },
    },
    {
      name: "description",
      type: "richText",
      required: true,
      admin: { description: "Full role narrative. Lexical rich text." },
    },
    {
      name: "responsibilities",
      type: "array",
      labels: { singular: "Responsibility", plural: "Responsibilities" },
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "requirements",
      type: "array",
      labels: { singular: "Requirement", plural: "Requirements" },
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "benefits",
      type: "array",
      labels: { singular: "Benefit", plural: "Benefits" },
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "salary",
      type: "group",
      admin: { description: "Optional salary band. Only shown publicly if 'Show salary' is on." },
      fields: [
        { name: "showSalary", type: "checkbox", defaultValue: false },
        { name: "min", type: "number" },
        { name: "max", type: "number" },
        {
          name: "currency",
          type: "select",
          defaultValue: "PHP",
          options: [
            { label: "PHP", value: "PHP" },
            { label: "USD", value: "USD" },
          ],
        },
        {
          name: "period",
          type: "select",
          defaultValue: "month",
          options: [
            { label: "per hour", value: "hour" },
            { label: "per month", value: "month" },
            { label: "per year", value: "year" },
          ],
        },
      ],
    },
    {
      name: "applyEmailNotify",
      type: "email",
      admin: {
        description:
          "Hiring manager email. Receives a notification for each new application.",
      },
    },
    {
      name: "applicationDeadline",
      type: "date",
      admin: { date: { pickerAppearance: "dayOnly" } },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
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
