import type { Metadata } from "next";
import { BookOpen, Bike, CheckCircle2, Wallet, Users } from "lucide-react";
import { LightBeams } from "@/components/motion/LightBeams";
import { HorizontalTimeline } from "@/components/sections/HorizontalTimeline";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { PhoneCarousel } from "@/components/sections/PhoneCarousel";
import { SimplePricingCards } from "@/components/sections/SimplePricingCards";
import { FooterCtaBanner } from "@/components/sections/FooterCtaBanner";
import { PaiInsuranceCard } from "@/components/sections/PaiInsuranceCard";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Section primitives preview",
  description: "Internal scratch route for PR 2 — not linked from anywhere.",
  path: "/preview",
  noIndex: true,
});

/**
 * Generates an inline SVG data URI shaped roughly like a phone screen so the
 * carousel preview is self-contained until the real exports arrive.
 */
function placeholderPhone(label: string, hue: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 693'>
    <rect width='320' height='693' rx='40' fill='#0F1117'/>
    <rect x='12' y='12' width='296' height='669' rx='32' fill='#1a1d26'/>
    <circle cx='160' cy='200' r='80' fill='${hue}' opacity='0.2'/>
    <text x='160' y='350' text-anchor='middle' fill='#FFC000' font-family='Inter, sans-serif' font-size='20' font-weight='600'>${label}</text>
    <text x='160' y='380' text-anchor='middle' fill='#B5B7BD' font-family='Inter, sans-serif' font-size='12'>placeholder</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const ICON_CLASS = "h-7 w-7";
const CUSTOMER_STEPS = [
  { icon: <BookOpen className={ICON_CLASS} />, title: "Choose a Service", description: "Door-to-door or branch delivery." },
  { icon: <Bike className={ICON_CLASS} />, title: "Enter Pickup", description: "Add locations and package details." },
  { icon: <Wallet className={ICON_CLASS} />, title: "Confirm & Pay", description: "Review price and pay securely." },
  { icon: <Users className={ICON_CLASS} />, title: "Rider Assigned", description: "We find the best rider near you." },
  { icon: <CheckCircle2 className={ICON_CLASS} />, title: "Track Until Delivered", description: "Real-time updates end to end." },
];

const SCREENS = [
  { src: placeholderPhone("Login", "#FFC000"), alt: "Login screen", label: "Login" },
  { src: placeholderPhone("Home", "#10b981"), alt: "Home screen", label: "Home" },
  { src: placeholderPhone("Create", "#3b82f6"), alt: "Create delivery", label: "Create Delivery" },
  { src: placeholderPhone("Searching", "#f59e0b"), alt: "Searching for rider", label: "Searching" },
  { src: placeholderPhone("Delivered", "#10b981"), alt: "Delivered receipt", label: "Delivered" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-mono uppercase tracking-wider text-alin-muted">
      ── {children} ──
    </p>
  );
}

export default function PreviewPage() {
  return (
    <div className="space-y-20 pb-0">
      <header className="container-page pt-12">
        <h1 className="text-3xl font-bold text-alin-white">PR 2 — section primitives</h1>
        <p className="mt-2 text-sm text-alin-muted">
          Scratch route for internal review. Not linked from nav. Set
          <code className="mx-1 rounded bg-alin-near-black px-1.5 py-0.5 text-xs">noIndex</code>
          via SEO metadata.
        </p>
      </header>

      <section className="container-page">
        <SectionLabel>LightBeams (GSAP loop)</SectionLabel>
        <div className="relative h-72 overflow-hidden rounded-2xl border border-alin-border bg-alin-black">
          <LightBeams />
          <div className="relative z-10 flex h-full items-center justify-center">
            <p className="text-alin-muted">Hero content sits on top — beams behind.</p>
          </div>
        </div>
      </section>

      <section className="container-page">
        <SectionLabel>HorizontalTimeline</SectionLabel>
        <HorizontalTimeline steps={CUSTOMER_STEPS} />
      </section>

      <section className="container-page">
        <SectionLabel>ComparisonTable</SectionLabel>
        <ComparisonTable />
      </section>

      <section className="container-page">
        <SectionLabel>PhoneCarousel (placeholder screens)</SectionLabel>
        <PhoneCarousel screens={SCREENS} surface="customer" />
      </section>

      <section className="container-page">
        <SectionLabel>SimplePricingCards</SectionLabel>
        <SimplePricingCards />
      </section>

      <section className="container-page">
        <SectionLabel>PaiInsuranceCard</SectionLabel>
        <p className="mb-4 text-xs text-alin-muted">
          Renders <code>/img/pai-card.png</code> — broken image until the user drops the asset.
        </p>
        <div className="rounded-2xl border border-alin-border bg-alin-near-black p-6">
          <PaiInsuranceCard />
        </div>
      </section>

      <section>
        <div className="container-page">
          <SectionLabel>FooterCtaBanner — customer variant</SectionLabel>
        </div>
        <FooterCtaBanner variant="customer" />
      </section>

      <section>
        <div className="container-page">
          <SectionLabel>FooterCtaBanner — rider variant</SectionLabel>
        </div>
        <FooterCtaBanner variant="rider" />
      </section>

      <div aria-hidden className="h-12" />
    </div>
  );
}
