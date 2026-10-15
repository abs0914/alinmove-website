import type { Metadata } from "next";
import { PoweredByACE } from "@/components/brand/ACEBadge";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About ALiN Move",
  description:
    "ALiN Move is the digital + last-mile layer on top of ALiN Cargo Express's nationwide network.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container-page max-w-3xl">
        <PoweredByACE />
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
          We&apos;re a logistics company with a digital layer — not a startup with a backbone bolted on.
        </h1>
        <div className="mt-6 space-y-4 text-lg text-alin-muted">
          <p>
            ALiN Cargo Express has been moving cargo nationwide for years. ALiN Move adds the
            digital experience and the last-mile rider network on top.
          </p>
          <p>
            That&apos;s why we can do something most delivery apps can&apos;t: doorstep to anywhere
            in the Philippines, in a single app.
          </p>
        </div>
      </div>
    </section>
  );
}
