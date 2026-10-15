import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "role", "updatedAt"],
  },
  access: {
    create: ({ req: { user } }) => Boolean(user && (user as { role?: string }).role === "admin"),
    update: ({ req: { user } }) => Boolean(user && (user as { role?: string }).role === "admin"),
    delete: ({ req: { user } }) => Boolean(user && (user as { role?: string }).role === "admin"),
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
    },
  ],
};
