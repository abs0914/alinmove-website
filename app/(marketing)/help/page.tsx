import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Help center",
  description: "Answers for customers and drivers using ALiN Move.",
  path: "/help",
});

const CUSTOMER_FAQ = [
  { q: "When can I download the app?", a: "Soon. Join the waitlist and we'll email you the moment it's live." },
  { q: "Where do you deliver?", a: "Active in Cebu Metro at launch, expanding through the ACE network across the Philippines." },
  { q: "How do I track my parcel?", a: "Tracking lives in the Customer App with real-time updates and proof-of-delivery." },
];

const DRIVER_FAQ = [
  { q: "How do I apply?", a: "Fill the apply form. The Rider App handles the rest — documents, KYC, branch assignment." },
  { q: "Can I pick my hours?", a: "Yes. There are no shift mandates." },
  { q: "How do I get paid?", a: "Maya — same-day payouts after the daily cutoff." },
];

export default function HelpPage() {
  return (
    <section className="section">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold sm:text-5xl">Help center</h1>
        <p className="mt-4 text-alin-muted">
          Find answers below or <Link href="#" className="text-alin-gold hover:underline">contact us</Link>.
        </p>

        <Tabs defaultValue="customer" className="mt-8">
          <TabsList>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="driver">Driver</TabsTrigger>
          </TabsList>
          <TabsContent value="customer">
            <Accordion type="single" collapsible className="divide-y divide-alin-border">
              {CUSTOMER_FAQ.map((item, i) => (
                <AccordionItem key={item.q} value={`c-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          <TabsContent value="driver">
            <Accordion type="single" collapsible className="divide-y divide-alin-border">
              {DRIVER_FAQ.map((item, i) => (
                <AccordionItem key={item.q} value={`d-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
