import type { CollectionAfterReadHook, CollectionBeforeChangeHook, CollectionConfig } from "payload";

const setNoteAuthor: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (!data) return data;
  const notes = (data as { notes?: Array<Record<string, unknown>> }).notes;
  if (!Array.isArray(notes) || !req.user) return data;
  const userId = (req.user as { id?: string | number }).id;
  const now = new Date().toISOString();
  for (const note of notes) {
    if (!note.author && userId !== undefined) note.author = userId;
    if (!note.createdAt) note.createdAt = now;
  }
  if (operation === "create") {
    (data as Record<string, unknown>).appliedAt =
      (data as { appliedAt?: string }).appliedAt ?? now;
  }
  return data;
};

const setCandidateName: CollectionBeforeChangeHook = async ({ data }) => {
  if (!data) return data;
  const d = data as { firstName?: string; lastName?: string };
  (data as Record<string, unknown>).candidateName = (`${d.firstName ?? ""} ${d.lastName ?? ""}`).trim() || "Applicant";

  return data;
};

export const Applications: CollectionConfig = {
  slug: "applications",
  admin: {
    group: "Recruiting",
    useAsTitle: "candidateName",
    defaultColumns: ["candidateName", "job", "status", "appliedAt"],
    listSearchableFields: ["firstName", "lastName", "email"],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeChange: [setNoteAuthor, setCandidateName],

  },
  fields: [
    {
      name: "candidateName",
      type: "text",
      admin: {
        readOnly: true,
        description: "Virtual: firstName + lastName. Populated by afterRead hook.",
      },
    },
    {
      name: "job",
      type: "relationship",
      relationTo: "job-listings",
      required: true,
      index: true,
    },
    { name: "firstName", type: "text", required: true, maxLength: 80 },
    { name: "lastName", type: "text", required: true, maxLength: 80 },
    { name: "email", type: "email", required: true, index: true },
    { name: "phone", type: "text", required: true, maxLength: 30 },
    {
      name: "resumeKey",
      type: "text",
      required: true,
      admin: {
        readOnly: true,
        description: "Supabase Storage object key (NOT a URL). Set by the apply server action.",
      },
    },
    {
      name: "resumeFilename",
      type: "text",
      required: true,
      admin: {
        readOnly: true,
        components: {
          Cell: "/components/admin/ResumeLinkField#ResumeLinkField",
        },
      },
    },
    { name: "resumeMime", type: "text", required: true, admin: { readOnly: true } },
    {
      name: "resumeSize",
      type: "number",
      required: true,
      admin: { readOnly: true, description: "Bytes." },
    },
    { name: "linkedinUrl", type: "text" },
    { name: "githubUrl", type: "text" },
    { name: "portfolioUrl", type: "text" },
    { name: "coverLetter", type: "textarea" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "applied",
      index: true,
      options: [
        { label: "Applied", value: "applied" },
        { label: "Screening", value: "screening" },
        { label: "Interviewing", value: "interviewing" },
        { label: "Offered", value: "offered" },
        { label: "Hired", value: "hired" },
        { label: "Rejected", value: "rejected" },
        { label: "Withdrawn", value: "withdrawn" },
      ],
      admin: {
        components: {
          Cell: "/components/admin/ApplicantStatusBadge#ApplicantStatusBadge",
        },
      },
    },
    { name: "source", type: "text", defaultValue: "website" },
    {
      name: "appliedAt",
      type: "date",
      required: true,
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
    {
      name: "notes",
      type: "array",
      labels: { singular: "Internal note", plural: "Internal notes" },
      admin: { description: "Internal-only comments from recruiters." },
      fields: [
        { name: "body", type: "textarea", required: true },
        {
          name: "author",
          type: "relationship",
          relationTo: "users",
          required: true,
          admin: { readOnly: true, description: "Auto-set to the current admin." },
        },
        {
          name: "createdAt",
          type: "date",
          admin: { readOnly: true, date: { pickerAppearance: "dayAndTime" } },
        },
      ],
    },
    {
      name: "utm",
      type: "group",
      fields: [
        { name: "source", type: "text" },
        { name: "medium", type: "text" },
        { name: "campaign", type: "text" },
      ],
    },
    { name: "ipHash", type: "text", admin: { hidden: true } },
    { name: "userAgent", type: "text", admin: { hidden: true } },
  ],
};
