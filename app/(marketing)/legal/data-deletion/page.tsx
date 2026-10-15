import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Data deletion",
  description: "How to request deletion of your data from ALiN Move.",
  path: "/legal/data-deletion",
});

export default function DataDeletionPage() {
  return (
    <>
      <h1>Data Deletion</h1>
      <p>Last updated: 2026-05-03</p>
      <p>
        To request deletion of any personal data you&apos;ve submitted to ALiN Move (waitlist
        signup, driver application, support email), email{" "}
        <a href="mailto:privacy@alinmove.com">privacy@alinmove.com</a> from the address you
        signed up with.
      </p>

      <h2>What we&apos;ll delete</h2>
      <ul>
        <li>Your waitlist row (email, city, intent, consent flag, UTM data).</li>
        <li>Your driver application row, if any.</li>
        <li>Any support correspondence stored against your email.</li>
      </ul>

      <h2>What we may retain</h2>
      <p>
        We may retain anonymized analytics events that no longer identify you, and any records
        required to comply with Philippine law (e.g., tax records of completed deliveries once
        the apps go live).
      </p>

      <h2>Timeline</h2>
      <p>We complete deletion requests within 30 days and confirm by email when done.</p>
    </>
  );
}
