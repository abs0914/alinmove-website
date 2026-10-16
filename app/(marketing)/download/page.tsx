import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PoweredByACE } from "@/components/brand/ACEBadge";
import { PhoneFrame } from "@/components/brand/PhoneFrame";
import { StoreBadges } from "@/components/brand/StoreBadges";
import type { EventName } from "@/lib/analytics";
import { storeUrl, type DownloadAudience, type StorePlatform } from "@/lib/launch-mode";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Download the ALiN Move apps",
  description:
    "Get the ALiN Move Customer App to send and track packages, or the ALiN Move Driver App to deliver with the ALiN Cargo Express network. Available on the App Store and Google Play.",
  path: "/download",
  noIndex: true,
});

type SearchParams = { intent?: string };

type AppCard = {
  audience: DownloadAudience;
  label: string;
  title: string;
  body: string;
  screen: { src: string; alt: string };
  events: Record<StorePlatform, EventName>;
};

const APPS: AppCard[] = [
  {
    audience: "customer",
    label: "For senders",
    title: "Send packages with ALiN Move.",
    body: "Book deliveries, send parcels, and track your packages using the ALiN Move Customer App.",
    screen: {
      src: "/img/customer-app/home.png",
      alt: "ALiN Move Customer App home screen with package tracking and delivery booking",
    },
    events: {
      ios: "download_page_customer_ios_click",
      android: "download_page_customer_android_click",
    },
  },
  {
    audience: "rider",
    label: "For riders & drivers",
    title: "Drive and deliver with ALiN Move.",
    body: "Register as a delivery partner, receive delivery offers, and manage your jobs using the ALiN Move Driver App.",
    screen: {
      src: "/img/rider-app/dashboard.png",
      alt: "ALiN Move Driver App dashboard with online status and active job",
    },
    events: {
      ios: "download_page_driver_ios_click",
      android: "download_page_driver_android_click",
    },
  },
];

export default async function DownloadPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Generic "Download … App" buttons link here with an intent; send phones
  // straight to that app's listing. A bare /download always shows both apps.
  const { intent } = await searchParams;
  if (intent === "customer" || intent === "rider") {
    const ua = (await headers()).get("user-agent") ?? "";
    if (/iPhone|iPad|iPod/i.test(ua)) redirect(storeUrl(intent, "ios"));
    if (/Android/i.test(ua)) redirect(storeUrl(intent, "android"));
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-alin-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(255,192,0,0.16),transparent_65%)]"
        />
        <div className="container-page relative py-14 text-center sm:py-20">
          <PoweredByACE className="justify-center" />
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-black tracking-tight text-alin-white sm:text-5xl lg:text-6xl">
            One Platform. <span className="block text-alin-gold">Two Ways to Move.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-alin-muted">
            Sending a package or delivering one? Choose your ALiN Move app below.
          </p>
        </div>
      </section>

      <section className="section" aria-label="ALiN Move apps">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          {APPS.map((app, index) => (
            <article
              key={app.audience}
              aria-labelledby={`app-${app.audience}`}
              className="relative flex flex-col overflow-hidden rounded-[1.75rem] border border-alin-border bg-alin-near-black p-5 sm:p-8"
            >
              <div
                aria-hidden
                className="via-alin-gold/60 absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-alin-gold to-transparent"
              />
              <div className="grid flex-1 items-start gap-8 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="inline-flex rounded-full bg-alin-gold px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-alin-black">
                    {app.label}
                  </p>
                  <h2
                    id={`app-${app.audience}`}
                    className="mt-5 text-2xl font-black text-alin-white sm:text-3xl"
                  >
                    {app.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-alin-muted">{app.body}</p>
                  <StoreBadges
                    audience={app.audience}
                    size="md"
                    events={app.events}
                    className="mt-7"
                  />
                  {app.audience === "rider" ? (
                    <Link
                      href="/drive"
                      className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-alin-white underline decoration-alin-gold underline-offset-4 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alin-gold focus-visible:ring-offset-2 focus-visible:ring-offset-alin-near-black"
                    >
                      How to Become an ALiN Move Driver
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  ) : null}
                </div>
                <PhoneFrame
                  src={app.screen.src}
                  alt={app.screen.alt}
                  priority={index === 0}
                  sizes="(min-width: 640px) 200px, 60vw"
                  className="mx-auto w-[60%] max-w-[220px] sm:w-[200px]"
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
