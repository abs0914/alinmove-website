import type { Metadata } from "next";
import { TrackExperience } from "../track/TrackExperience";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Track Package",
  description:
    "View verified ALiN Cargo branch movements, ALiN Move final-delivery progress, and proof of delivery when available.",
  path: "/tracking",
});

export default function TrackingPage() {
  return <TrackExperience />;
}
