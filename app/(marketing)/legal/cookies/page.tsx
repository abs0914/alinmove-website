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
      <p>Last updated: 2026-05-03</p>
      <p>
        alinmove.com uses a minimal set of cookies for analytics and to remember your reduced-motion
        preference. We do not use third-party advertising cookies.
      </p>

      <h2>What we set</h2>
      <ul>
        <li>
          <strong>Analytics</strong> — anonymous page-view tracking via Vercel Analytics.
        </li>
        <li>
          <strong>Local storage</strong> — your reduced-motion toggle setting (key:{" "}
          <code>alin-reduce-motion</code>).
        </li>
      </ul>

      <h2>Your choices</h2>
      <p>
        You can clear cookies and local storage in your browser settings. Doing so resets the
        reduced-motion preference to your system default.
      </p>
    </>
  );
}
