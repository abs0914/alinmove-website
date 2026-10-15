import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { driverPrimaryCta } from "@/lib/launch-mode";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Driver FAQ",
  description: "Common questions about driving with ALiN Move.",
  path: "/drive/faq",
});

const FAQ = [
  {
    q: "Do I need to drive a specific vehicle?",
    a: "No. Drive what you have — motorcycle, sedan, MPV, pickup, or van. You'll see jobs that fit your vehicle.",
  },
  {
    q: "Are there minimum hours or shifts?",
    a: "No. Go online when you want, offline when you want. No quotas.",
  },
  {
    q: "How do I get paid?",
    a: "Maya — same-day after the daily cutoff.",
  },
  {
    q: "What documents do I need?",
    a: "Valid license, OR/CR, NBI clearance, and a clear selfie for your rider profile.",
  },
  {
    q: "Can I drive across cities?",
    a: "Yes. Drive in your home city, and if you travel you can deliver wherever ALiN operates.",
  },
];

export default function DriverFAQPage() {
  const cta = driverPrimaryCta();
  return (
    <>
      <section className="section">
        <div className="container-page max-w-3xl">
          <h1 className="text-4xl font-bold sm:text-5xl">Driver FAQ</h1>
        </div>
      </section>

      <section className="section bg-alin-near-black">
        <div className="container-page max-w-3xl">
          <Accordion type="single" collapsible className="divide-y divide-alin-border">
            {FAQ.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button asChild size="lg" className="mt-8">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
