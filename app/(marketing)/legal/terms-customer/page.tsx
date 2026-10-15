import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Customer terms of service",
  description: "Terms of service for customers using ALiN Move.",
  path: "/legal/terms-customer",
});

export default function CustomerTermsPage() {
  return (
    <>
      <h1>Customer Terms of Service</h1>
      <p>Last updated: 2026-05-03</p>
      <p>
        These Terms govern your use of ALiN Move&apos;s customer-facing website and services. By
        using the service, you agree to these Terms.
      </p>

      <h2>1. The service</h2>
      <p>
        ALiN Move provides a digital booking, tracking, and delivery platform powered by the ALiN
        Cargo Express nationwide network.
      </p>

      <h2>2. Eligibility</h2>
      <p>You must be 18 or older to use the service.</p>

      <h2>3. Prohibited items</h2>
      <p>
        You agree not to ship illegal items, hazardous materials, or anything otherwise restricted
        by Philippine law.
      </p>

      <h2>4. Liability</h2>
      <p>
        Coverage and limits are described in the Customer App at the time of booking and apply per
        delivery.
      </p>

      <h2>5. Contact</h2>
      <p>
        Questions: <a href="mailto:support@alinmove.com">support@alinmove.com</a>.
      </p>
    </>
  );
}
