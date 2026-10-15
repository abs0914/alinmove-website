import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Driver terms of service",
  description: "Terms of service for riders driving with ALiN Move.",
  path: "/legal/terms-driver",
});

export default function DriverTermsPage() {
  return (
    <>
      <h1>Driver Terms of Service</h1>
      <p>Last updated: 2026-05-03</p>
      <p>
        These Terms govern your participation as a rider on the ALiN Move platform. By submitting
        an application, you agree to these Terms and to the additional onboarding terms surfaced
        in the Rider App.
      </p>

      <h2>1. Independent contractor</h2>
      <p>
        You operate as an independent contractor. You decide when to be online, which jobs to
        accept, and which vehicles to drive. There is no career ladder or fixed shift.
      </p>

      <h2>2. Documents and KYC</h2>
      <p>
        You must provide a valid driver&apos;s license, OR/CR, NBI clearance, and a clear selfie.
        We may verify these against public records.
      </p>

      <h2>3. Payouts</h2>
      <p>
        Payouts are processed via Maya, same-day after the daily cutoff defined in the Rider App.
      </p>

      <h2>4. Termination</h2>
      <p>
        Either party may end the relationship at any time. Conduct that endangers customers,
        other riders, or the public will result in immediate deactivation.
      </p>

      <h2>5. Contact</h2>
      <p>
        Rider questions: <a href="mailto:riders@alinmove.com">riders@alinmove.com</a>.
      </p>
    </>
  );
}
