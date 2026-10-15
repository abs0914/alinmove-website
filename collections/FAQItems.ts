import type { CollectionConfig } from "payload";
import { revalidateFAQ } from "./hooks/revalidate";

export const FAQItems: CollectionConfig = {
  slug: "faq-items",
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "audience", "category", "order"],
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateFAQ] },
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "richText", required: true },
    {
      name: "audience",
      type: "select",
      required: true,
      options: [
        { label: "Customer", value: "customer" },
        { label: "Driver", value: "driver" },
        { label: "Both", value: "both" },
      ],
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Sort order within audience. Lower = higher up." },
    },
    {
      name: "category",
      type: "select",
      options: [
        { label: "Booking", value: "booking" },
        { label: "Payment", value: "payment" },
        { label: "Tracking", value: "tracking" },
        { label: "Driver requirements", value: "requirements" },
        { label: "Earnings", value: "earnings" },
        { label: "Account", value: "account" },
        { label: "Other", value: "other" },
      ],
    },
  ],
};
