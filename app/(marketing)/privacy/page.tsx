import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import PrivacyPage from "../legal/privacy/page";

export const metadata: Metadata = buildMetadata({
  title: "Privacy policy",
  description:
    "How ALiN Move and the ALiN Move Rider App collect, use, share, and protect personal data, including precise location data.",
  path: "/privacy",
});

export default PrivacyPage;
