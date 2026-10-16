import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cookies",
  description: "How alinmove.com uses cookies.",
  path: "/legal/cookies",
});

export default function CookiesPage() {
  return (
    <>
      <h1>Cookies</h1>
      <p>Last updated: 2026-10-16</p>
      <p>
        alinmove.com uses a small set of cookies for analytics, to measure our advertising, and to
        remember your reduced-motion preference.
      </p>

      <h2>What we set</h2>
      <ul>
        <li>
          <strong>Analytics</strong> — anonymous page-view tracking via Vercel Analytics.
        </li>
        <li>
          <strong>Advertising</strong> — the Meta Pixel (cookie: <code>_fbp</code>) records page
          views so we can measure and improve our ads on Facebook and Instagram. Meta processes this
          data under its own privacy policy.
        </li>
        <li>
          <strong>Local storage</strong> — your reduced-motion toggle setting (key:{" "}
          <code>alin-reduce-motion</code>).
        </li>
      </ul>

      <h2>Your choices</h2>
      <p>
        You can clear cookies and local storage in your browser settings. Doing so resets the
        reduced-motion preference to your system default. You can control how Meta uses this data
        for ads in your Facebook or Instagram ad preferences.
      </p>
    </>
  );
}
