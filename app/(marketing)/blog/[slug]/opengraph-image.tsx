import { ImageResponse } from "next/og";

import { getBlogPostBySlug } from "@/lib/payload";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "ALiN Move blog post";

type Author = { name?: string };

export default async function OpengraphImage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  const title = (post as { title?: string } | null)?.title ?? "ALiN Move";
  const authorObj = (post as { author?: Author | string | number } | null)?.author;
  const author =
    authorObj && typeof authorObj === "object" ? authorObj.name ?? "ALiN Move" : "ALiN Move";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#000000",
          color: "#FFFFFF",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#FFC000",
            fontSize: "24px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              borderRadius: "999px",
              background: "#FFC000",
            }}
          />
          ALiN Move — Blog
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "72px",
            fontWeight: 800,
            lineHeight: 1.05,
            color: "#FFFFFF",
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#B5B7BD",
            fontSize: "26px",
          }}
        >
          <div style={{ display: "flex" }}>{author}</div>
          <div style={{ display: "flex", color: "#FFC000" }}>alinmove.com</div>
        </div>
      </div>
    ),
    size,
  );
}
