import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { MicroLift } from "@/components/motion/MicroLift";
import { driverPrimaryCta } from "@/lib/launch-mode";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Flexibility — pick your vehicle, hours, jobs",
  description:
    "The four flexibilities: vehicle, hours, service types, location. Choose what fits — no career ladders, no shift mandates.",
  path: "/drive/flexibility",
});

// IMPORTANT (per ace-narrative skill):
//   Riders get FLEXIBILITY, not a career path.
//   No "Junior / Senior / Operator", no "advance", no "promotion".
//   The story is choice — vehicle, hours, services, location.

const FLEX = [
  {
    title: "Vehicle",
    body: "Motorcycle, sedan, MPV, pickup, van. Drive what you have. Switch vehicles when your situation changes.",
  },
  {
    title: "Hours",
    body: "Online when you want, offline when you want. No shift mandates, no minimum quotas.",
  },
  {
    title: "Service types",
    body: "Door-to-door · pickup-to-branch · branch walk-in handoffs · cross-city handoffs through the ACE network. See what's nearby; accept what fits.",
  },
  {
    title: "Location",
    body: "Drive in your home city. If you travel, deliver wherever ALiN operates.",
  },
];

const SCENARIOS = [
  {
    title: "Morning food run",
    body: "Motorcycle. Quick door-to-door. Three jobs in two hours.",
  },
  {
    title: "Afternoon furniture delivery",
    body: "Pickup truck. Single big job across town. Higher fare, longer route.",
  },
  {
    title: "Evening branch handoff",
    body: "Drop at the branch — the ACE network takes it cross-country.",
  },
];

export default function FlexibilityPage() {
  const cta = driverPrimaryCta();
  return (
    <>
      <section className="section">
        <div className="container-page max-w-3xl">
          <p className="text-sm uppercase tracking-wider text-alin-gold">Flexibility</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Pick your vehicle. Pick your hours. Pick your jobs.
          </h1>
          <p className="mt-4 text-lg text-alin-muted">
            Most gig delivery locks you into one vehicle and one service type. The ACE network
            unlocks more variety — same app.
          </p>
        </div>
      </section>

      <section className="section bg-alin-near-black">
        <div className="container-page">
          <h2 className="text-2xl font-bold">The four flexibilities</h2>
          <StaggerReveal selector=".flex-card">
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {FLEX.map((f) => (
                <div
                  key={f.title}
                  className="flex-card rounded-xl border border-alin-border bg-alin-black p-6"
                >
                  <h3 className="text-lg font-semibold text-alin-white">{f.title}</h3>
                  <p className="mt-2 text-sm text-alin-muted">{f.body}</p>
                </div>
              ))}
            </div>
          </StaggerReveal>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <h2 className="text-2xl font-bold">A typical day</h2>
          <StaggerReveal selector=".scenario-card">
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {SCENARIOS.map((s) => (
                <div
                  key={s.title}
                  className="scenario-card rounded-xl border border-alin-border bg-alin-near-black p-6"
                >
                  <h3 className="text-base font-semibold text-alin-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-alin-muted">{s.body}</p>
                </div>
              ))}
            </div>
          </StaggerReveal>
        </div>
      </section>

      <section className="section">
        <div className="container-page text-center">
          <MicroLift>
            <Button asChild size="lg">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          </MicroLift>
        </div>
      </section>
    </>
  );
}
