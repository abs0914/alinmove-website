import type { Metadata } from "next";
import { SITE_URL } from "./utils";

const DEFAULT_TITLE = "ALiN Move — Doorstep to anywhere";
const DEFAULT_DESCRIPTION =
  "The digital layer of ALiN Cargo Express's nationwide network. Send packages doorstep to anywhere in the Philippines.";
const DEFAULT_OG = "/og/home.png";

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const fullTitle = title === DEFAULT_TITLE ? title : `${title} — ALiN Move`;
  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description,
      siteName: "ALiN Move",
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      locale: "en_PH",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
