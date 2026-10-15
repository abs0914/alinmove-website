import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Application received",
  description: "Thanks — we'll send you a Rider App link next.",
  path: "/drive/apply/thank-you",
  noIndex: true,
});

export default function ApplyThankYou() {
  return (
    <section className="section">
      <div className="container-page max-w-md text-center">
        <h1 className="text-4xl font-bold">Got it.</h1>
        <p className="mt-3 text-alin-muted">
          We&apos;ll send a link to the Rider App so you can complete the rest. Check your email
          and SMS.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/drive">Back to driver overview</Link>
        </Button>
      </div>
    </section>
  );
}
