import Image from "next/image";
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText,
} from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

const internalDocToHref: NonNullable<
  Parameters<typeof LinkJSXConverter>[0]["internalDocToHref"]
> = ({ linkNode }) => {
  const doc = linkNode.fields.doc;
  if (!doc) return "#";
  const value = doc.value as string | { slug?: string } | undefined;
  const slug = value && typeof value === "object" ? value.slug : undefined;
  if (!slug) return "#";
  switch (doc.relationTo) {
    case "blog-posts":
      return `/blog/${slug}`;
    case "cities":
      return `/coverage/${slug}`;
    default:
      return "#";
  }
};

const buildConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  upload: ({ node }) => {
    const value = (node as { value?: unknown }).value;
    if (typeof value !== "object" || value === null) return null;
    const doc = value as {
      url?: string;
      alt?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filename?: string;
    };
    const fields = (node as { fields?: { alt?: string } }).fields;
    const alt = fields?.alt ?? doc.alt ?? "";
    if (!doc.url) return null;
    if (doc.mimeType && !doc.mimeType.startsWith("image")) {
      return (
        <a href={doc.url} rel="noopener noreferrer">
          {doc.filename ?? "Download"}
        </a>
      );
    }
    return (
      <Image
        src={doc.url}
        alt={alt}
        width={doc.width ?? 1600}
        height={doc.height ?? 900}
        sizes="(min-width: 768px) 720px, 100vw"
        className="my-8 h-auto w-full rounded-lg"
      />
    );
  },
});

export function LexicalContent({
  data,
  className,
}: {
  data: SerializedEditorState;
  className?: string;
}) {
  return <RichText data={data} converters={buildConverters} className={className} />;
}
