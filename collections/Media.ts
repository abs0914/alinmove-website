import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: "media",
    imageSizes: [
      { name: "thumb", width: 480, height: 320, position: "centre" },
      { name: "card", width: 800, height: 600, position: "centre" },
      { name: "hero", width: 1920, height: 1080, position: "centre" },
    ],
    formatOptions: { format: "webp", options: { quality: 80 } },
    mimeTypes: ["image/*"],
  },
  fields: [
    { name: "alt", type: "text", required: true },
    { name: "caption", type: "text" },
    { name: "credit", type: "text" },
    { name: "focalX", type: "number", min: 0, max: 100, defaultValue: 50 },
    { name: "focalY", type: "number", min: 0, max: 100, defaultValue: 50 },
  ],
};
