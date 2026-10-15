import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThankYouTracker } from "./ThankYouTracker";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "You're on the waitlist",
  description: "Thanks — we'll let you know the moment the apps are live.",
  path: "/waitlist/thank-you",
  noIndex: true,
});

type Search = { intent?: "customer" | "driver" | "both" };

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { intent = "customer" } = await searchParams;
  return (
    <section className="section">
      <div className="container-page max-w-md text-center">
        <h1 className="text-4xl font-bold">You&apos;re in.</h1>
        <p className="mt-3 text-alin-muted">
          Check your email for confirmation. We&apos;ll let you know the moment the apps are live.
        </p>

        <ul className="mt-8 space-y-3 text-left text-sm text-alin-muted">
          <li>1. Confirmation email is on its way.</li>
          <li>2. We&apos;ll email you once when the apps drop.</li>
          <li>3. No marketing in between — promise.</li>
        </ul>

        <div className="mt-8 flex flex-col gap-3">
          {intent !== "customer" && (
            <Button asChild variant="outline">
              <Link href="/drive/flexibility">See how riders work with us</Link>
            </Button>
          )}
          {intent !== "driver" && (
            <Button asChild variant="outline">
              <Link href="/network">Tour the ACE network</Link>
            </Button>
          )}
        </div>

        <ThankYouTracker />
      </div>
    </section>
  );
}
