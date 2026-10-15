import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bike,
  BookOpenCheck,
  Boxes,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Eye,
  FileCheck2,
  HelpCircle,
  Home,
  MapPin,
  MonitorCheck,
  Package,
  PackageCheck,
  PackageOpen,
  QrCode,
  Route,
  ShieldCheck,
  Smartphone,
  Store,
  UserCheck,
  WalletCards,
} from "lucide-react";
import { DownloadCustomerAppButton } from "@/components/brand/DownloadCustomerAppButton";
import { DownloadRiderAppButton } from "@/components/brand/DownloadRiderAppButton";
import { PhoneFrame } from "@/components/brand/PhoneFrame";
import { StoreBadges } from "@/components/brand/StoreBadges";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { downloadHref } from "@/lib/launch-mode";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "How ALiN Move Works",
  description:
    "Learn how ALiN Move connects customers, riders, ALiN Cargo Express branches, and HQ in one real-time logistics network.",
  path: "/how-it-works",
});

const stats = [
  { value: "10K+", label: "Active riders", icon: UserCheck },
  { value: "500+", label: "ALiN branches", icon: Store },
  { value: "99.9%", label: "Successful deliveries", icon: CheckCircle2 },
  { value: "1M+", label: "Packages delivered", icon: Boxes },
];

const audienceCards = [
  {
    title: "I want to send a package",
    body: "Book a door-to-door delivery or have your package picked up and delivered to an ALiN branch.",
    cta: "See Customer Flow",
    href: "#customer-flow",
    icon: PackageOpen,
  },
  {
    title: "I want to earn as a rider",
    body: "Register, get approved, accept delivery jobs, and earn for every completed delivery.",
    cta: "See Rider Flow",
    href: "#rider-flow",
    icon: Bike,
  },
  {
    title: "I operate an ALiN branch",
    body: "Manage rider dispatch, package movements, delivery issues, and branch-level operations.",
    cta: "Branch Operations Overview",
    href: "#branch-network",
    icon: Building2,
  },
];

const customerSteps = [
  {
    title: "Choose a delivery service",
    body: "Open the ALiN Move Customer App and choose how you want your package to move.",
    detail: "Door-to-door delivery or pickup to an ALiN branch.",
    image: "/img/customer-app/home.png",
    icon: Smartphone,
  },
  {
    title: "Add pickup and delivery details",
    body: "Enter the pickup address, recipient details, destination address, and package type.",
    detail: "Saved addresses make repeat bookings faster.",
    image: "/img/customer-app/create-delivery.png",
    icon: MapPin,
  },
  {
    title: "Review the price before you book",
    body: "See the delivery fee before confirming your request.",
    detail: "No guessing. Review the cost before dispatch.",
    image: "/img/customer-app/create-delivery.png",
    icon: CircleDollarSign,
  },
  {
    title: "Get matched with a rider",
    body: "Your request is broadcast to available riders near your pickup location.",
    detail: "See rider details and progress inside the app.",
    image: "/img/customer-app/searching.jpg",
    icon: Bike,
  },
  {
    title: "Track your package in real time",
    body: "Follow your delivery from pickup to destination with clear status updates.",
    detail: "Customers, branches, and HQ stay aligned.",
    image: "/img/customer-app/tracking.png",
    icon: Route,
  },
  {
    title: "Delivery completed with proof",
    body: "View the delivery receipt, status timeline, and proof of delivery for your records.",
    detail: "Every delivery is verified before completion.",
    image: "/img/customer-app/delivered.png",
    icon: PackageCheck,
  },
];

const serviceTypes = [
  {
    title: "Door-to-Door Delivery",
    body: "Best for direct local deliveries. A rider picks up from your location and delivers straight to the recipient.",
    cta: "Book Door-to-Door",
    icon: Home,
  },
  {
    title: "Pickup to ALiN Branch",
    body: "Best for cargo processing and branch-based shipments. A rider brings your package to an ALiN Cargo Express branch for the next step.",
    cta: "Book Pickup to Branch",
    icon: Building2,
  },
];

const riderSteps = [
  {
    title: "Create your rider profile",
    body: "Sign up using your mobile number and complete your rider profile with personal and vehicle information.",
    image: "/img/rider-app/dashboard.png",
    icon: UserCheck,
  },
  {
    title: "Upload your documents",
    body: "Submit identification and vehicle documents for review so the platform stays safe and reliable.",
    image: "/img/rider-app/delivery-steps.png",
    icon: FileCheck2,
  },
  {
    title: "Wait for approval",
    body: "Your application will be reviewed. Once approved, you can be assigned to a branch and start receiving delivery jobs.",
    image: "/img/rider-app/dashboard.png",
    icon: ClipboardCheck,
  },
  {
    title: "Go online when ready",
    body: "Set your availability, view alerts, track performance, and see available delivery opportunities.",
    image: "/img/rider-app/dashboard.png",
    icon: CheckCircle2,
  },
  {
    title: "Choose delivery offers",
    body: "Review pickup, destination, parcel details, service type, and payout before accepting.",
    image: "/img/rider-app/offers.png",
    icon: CircleDollarSign,
  },
  {
    title: "Pick up and follow the route",
    body: "Confirm pickup using QR scan, barcode scan, or OTP, then follow in-app route guidance.",
    image: "/img/rider-app/navigation.png",
    icon: QrCode,
  },
  {
    title: "Submit proof of delivery",
    body: "Complete the job with recipient confirmation, photo evidence, or signature when required.",
    image: "/img/rider-app/pod.png",
    icon: PackageCheck,
  },
  {
    title: "Review history and earnings",
    body: "View completed jobs, delivery details, receipts, and earnings records directly inside the app.",
    image: "/img/rider-app/earnings.png",
    icon: WalletCards,
  },
];

const branchNetwork = [
  { title: "Customer App", body: "Book, track, and manage deliveries.", icon: Smartphone },
  { title: "Rider App", body: "Accept, deliver, and earn.", icon: Bike },
  { title: "ALiN Branch", body: "Process, sort, dispatch, and support.", icon: Building2 },
  {
    title: "HQ Monitoring",
    body: "Monitor in real time and support operations.",
    icon: MonitorCheck,
  },
];

const deliveryStatuses = [
  "Booking Created",
  "Rider Search",
  "Rider Assigned",
  "En Route to Pickup",
  "Picked Up",
  "In Transit",
  "At Drop-Off",
  "Delivered",
  "Proof of Delivery Submitted",
];

const riderStatuses = [
  "Offer Available",
  "Offer Accepted",
  "Arrived at Pickup",
  "Pickup Confirmed",
  "Navigation Started",
  "Arrived at Drop-Off",
  "Delivery Confirmed",
  "Job Completed",
];

const benefits = [
  {
    title: "Clear Booking Flow",
    body: "Customers know what to enter, what to pay, and what happens next.",
    icon: BookOpenCheck,
  },
  {
    title: "Guided Rider Workflow",
    body: "Riders follow step-by-step actions from acceptance to delivery completion.",
    icon: Route,
  },
  {
    title: "Real-Time Visibility",
    body: "Customers, branches, and HQ can monitor movement and status updates.",
    icon: Eye,
  },
  {
    title: "Branch Integration",
    body: "Pickup-to-branch and branch-to-customer jobs connect app delivery with ALiN Cargo Express operations.",
    icon: Building2,
  },
  {
    title: "Proof and Accountability",
    body: "Delivery timelines, receipts, and proof of delivery help reduce disputes.",
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    q: "Can I book a door-to-door delivery through ALiN Move?",
    a: "Yes. You can book a rider to pick up your package and deliver it directly to your recipient.",
  },
  {
    q: "Can ALiN Move pick up my package and bring it to an ALiN branch?",
    a: "Yes. Choose Pickup to ALiN Branch if you want a rider to collect your package and bring it to an ALiN Cargo Express branch for processing or onward shipment.",
  },
  {
    q: "How do riders receive jobs?",
    a: "Riders receive available delivery offers through the ALiN Move Rider App. They can review the job details before accepting.",
  },
  {
    q: "How do I know where my package is?",
    a: "The app shows delivery status updates and tracking information so you can monitor your package until it is delivered.",
  },
  {
    q: "What happens if delivery fails?",
    a: "The rider can log the issue in the app, and the branch or support team can help resolve the delivery exception.",
  },
  {
    q: "Can riders use motorcycles, cars, vans, or trucks?",
    a: "Yes. ALiN Move can support different vehicle types, and jobs may be matched based on vehicle capacity and delivery requirements.",
  },
];

function SectionHeader({
  eyebrow,
  title,
  body,
  centered = false,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  centered?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-alin-gold">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-black tracking-tight text-alin-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {body ? <p className="mt-4 text-base leading-7 text-alin-muted sm:text-lg">{body}</p> : null}
    </div>
  );
}

function GlassPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "border-alin-gold/20 bg-alin-near-black/80 rounded-[1.75rem] border p-5 shadow-[0_24px_80px_-40px_rgba(255,194,0,0.45)] ring-1 ring-white/5 backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}

function MiniPhoneCard({
  step,
  title,
  body,
  detail,
  image,
  icon: Icon,
}: {
  step: number;
  title: string;
  body: string;
  detail?: string;
  image: string;
  icon: React.ElementType;
}) {
  return (
    <article className="hover:border-alin-gold/70 group relative flex h-full flex-col overflow-hidden rounded-2xl border border-alin-border bg-black/45 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_60px_-30px_rgba(255,194,0,0.75)]">
      <div className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-alin-gold text-sm font-black text-alin-black">
        {step}
      </div>
      <div className="border-alin-gold/30 bg-alin-gold/10 flex size-11 items-center justify-center rounded-2xl border text-alin-gold">
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="border-alin-gold/20 mt-5 overflow-hidden rounded-2xl border bg-alin-black p-2">
        <div className="relative aspect-[9/13] overflow-hidden rounded-xl bg-alin-near-black">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 180px, 45vw"
            className="object-cover"
          />
        </div>
      </div>
      <h3 className="mt-5 text-lg font-bold text-alin-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-alin-muted">{body}</p>
      {detail ? <p className="mt-3 text-xs font-semibold text-alin-gold">{detail}</p> : null}
    </article>
  );
}

function TimelinePills({ items }: { items: string[] }) {
  return (
    <ol className="grid gap-3 md:grid-cols-3 lg:grid-cols-9">
      {items.map((item, index) => (
        <li key={item} className="relative">
          <div className="border-alin-gold/20 flex h-full items-center gap-3 rounded-2xl border bg-black/35 p-3 lg:flex-col lg:justify-center lg:text-center">
            <span className="bg-alin-gold/10 flex size-9 shrink-0 items-center justify-center rounded-full border border-alin-gold text-xs font-black text-alin-gold">
              {index + 1}
            </span>
            <span className="text-sm font-semibold leading-tight text-alin-white">{item}</span>
          </div>
          {index < items.length - 1 ? (
            <span className="border-alin-gold/50 absolute left-full top-1/2 hidden h-px w-3 -translate-y-1/2 border-t border-dashed lg:block" />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="overflow-hidden bg-alin-black">
      <section className="border-alin-gold/10 relative isolate min-h-[calc(100vh-4rem)] overflow-hidden border-b bg-[radial-gradient(circle_at_70%_20%,rgba(255,194,0,0.18),transparent_30%),linear-gradient(180deg,#050505_0%,#0b0b0b_58%,#050505_100%)] py-16 lg:py-24">
        <div className="absolute inset-0 -z-10 opacity-50 [background-image:linear-gradient(rgba(255,194,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,194,0,0.1)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
        <div className="border-alin-gold/25 absolute left-1/2 top-28 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full border opacity-70 [transform:translateX(-50%)_rotateX(62deg)]" />
        <div className="absolute bottom-0 left-0 right-0 -z-10 h-56 bg-[radial-gradient(ellipse_at_center,rgba(255,194,0,0.16),transparent_60%)]" />

        <div className="container-page grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <div className="border-alin-gold/40 bg-alin-gold/10 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold text-alin-white shadow-[0_0_28px_rgba(255,194,0,0.16)]">
              <span className="text-alin-gold">One Network.</span>
              Every Delivery. Anywhere in the Philippines.
              <span aria-hidden>PH</span>
            </div>
            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-alin-white sm:text-6xl lg:text-7xl">
              How <span className="text-alin-gold">ALiN</span> Move Works
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-alin-muted">
              From booking to pickup, tracking, and delivery completion, ALiN Move keeps customers,
              riders, and branches connected in one real-time logistics network.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-alin-muted">
              Book deliveries, accept jobs, track packages, and complete every delivery with guided
              app workflows.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <DownloadCustomerAppButton className="shadow-[0_16px_40px_-20px_rgba(255,194,0,0.85)]" />
              <DownloadRiderAppButton
                label="Become an ALiN Move Rider"
                variant="outline"
                className="border-alin-gold/50 hover:bg-alin-gold/10 bg-black/35 text-alin-white"
              />
            </div>
            <div className="mt-9 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-alin-gold/20 rounded-2xl border bg-black/40 p-4"
                >
                  <stat.icon className="size-5 text-alin-gold" aria-hidden />
                  <p className="mt-3 text-xl font-black text-alin-white">{stat.value}</p>
                  <p className="text-xs text-alin-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[560px]">
            <div className="border-alin-gold/40 absolute left-2 top-24 hidden rounded-full border bg-alin-gold p-3 text-alin-black shadow-[0_0_38px_rgba(255,194,0,0.55)] sm:block">
              <MapPin className="size-6" aria-hidden />
            </div>
            <div className="border-alin-gold/40 absolute right-0 top-12 hidden rounded-full border bg-alin-gold p-3 text-alin-black shadow-[0_0_38px_rgba(255,194,0,0.55)] sm:block">
              <Package className="size-6" aria-hidden />
            </div>
            <div className="absolute inset-x-4 top-1/2 h-1 -rotate-12 rounded-full bg-gradient-to-r from-transparent via-alin-gold to-transparent blur-[1px]" />
            <PhoneFrame
              src="/img/customer-app/create-delivery.png"
              alt="Customer app create delivery screen"
              priority
              className="absolute left-0 top-8 w-[43%] rotate-[-6deg] sm:left-10"
              sizes="(min-width: 1024px) 260px, 44vw"
            />
            <PhoneFrame
              src="/img/rider-app/offers.png"
              alt="Rider app available offer screen"
              priority
              className="absolute right-0 top-0 w-[47%] rotate-[7deg] sm:right-8"
              sizes="(min-width: 1024px) 280px, 48vw"
            />
            <GlassPanel className="absolute bottom-2 left-1/2 w-[88%] -translate-x-1/2 p-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs uppercase tracking-widest text-alin-gold">Customer</p>
                  <p className="mt-1 text-sm font-semibold text-alin-white">Create Delivery</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-alin-gold">Rider</p>
                  <p className="mt-1 text-sm font-semibold text-alin-white">Available Offers</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-alin-gold">Branch</p>
                  <p className="mt-1 text-sm font-semibold text-alin-white">Live Dispatch</p>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>

      <section className="section bg-alin-black" aria-labelledby="journey-heading">
        <div className="container-page">
          <SectionHeader
            eyebrow="Choose your journey"
            title="Choose your ALiN Move journey."
            body="Whether you are sending, delivering, or coordinating shipments, ALiN Move gives every role a clear next step."
            centered
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {audienceCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="hover:border-alin-gold/70 hover:bg-alin-gold/5 group rounded-[1.5rem] border border-alin-border bg-alin-near-black p-6 transition duration-300 hover:-translate-y-1"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-alin-gold text-alin-black">
                  <card.icon className="size-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-black text-alin-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-alin-muted">{card.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-alin-gold">
                  {card.cta}{" "}
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="customer-flow" className="section bg-alin-near-black">
        <div className="container-page">
          <SectionHeader
            eyebrow="For Customers"
            title="Book. Track. Delivered."
            body="ALiN Move lets you book a delivery from your phone, choose the right service, confirm the price, track your rider, and receive proof once the package is delivered."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {customerSteps.map((step, index) => (
              <MiniPhoneCard key={step.title} step={index + 1} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-alin-black">
        <div className="container-page">
          <SectionHeader title="Two ways to move your package." centered />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {serviceTypes.map((service) => (
              <GlassPanel key={service.title} className="relative overflow-hidden p-7">
                <div className="bg-alin-gold/10 absolute -right-10 -top-10 size-40 rounded-full blur-2xl" />
                <div className="flex items-start gap-5">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-alin-gold text-alin-black">
                    <service.icon className="size-7" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-alin-white">{service.title}</h3>
                    <p className="mt-3 leading-7 text-alin-muted">{service.body}</p>
                    <Button asChild className="mt-6">
                      <Link href={downloadHref("customer")}>
                        {service.cta} <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    </Button>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      <section id="rider-flow" className="section bg-alin-near-black">
        <div className="container-page">
          <SectionHeader
            eyebrow="For Riders"
            title="Register. Accept Jobs. Earn."
            body="ALiN Move gives riders a guided delivery workflow, from registration and approval to job offers, pickup confirmation, navigation, proof of delivery, and earnings tracking."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {riderSteps.map((step, index) => (
              <MiniPhoneCard key={step.title} step={index + 1} {...step} />
            ))}
          </div>
          <GlassPanel className="mt-8 p-6">
            <h3 className="text-lg font-black text-alin-white">Offer types riders may receive</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {["Door-to-Door", "Pickup to ALiN Branch", "ALiN Branch to Delivery Address"].map(
                (type) => (
                  <span
                    key={type}
                    className="border-alin-gold/30 bg-alin-gold/10 rounded-full border px-4 py-2 text-sm font-semibold text-alin-gold"
                  >
                    {type}
                  </span>
                ),
              )}
            </div>
          </GlassPanel>
        </div>
      </section>

      <section id="branch-network" className="section bg-alin-black">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionHeader
              eyebrow="Branch-supported logistics"
              title="Connected to the ALiN branch network."
              body="Unlike ordinary delivery apps, ALiN Move connects app-based bookings with ALiN Cargo Express branches. This allows local deliveries, pickup-to-branch movement, branch dispatching, cargo processing, and operational monitoring to work together in one platform."
            />
            <GlassPanel className="p-5">
              <div className="grid gap-4 sm:grid-cols-4">
                {branchNetwork.map((item, index) => (
                  <div
                    key={item.title}
                    className="border-alin-gold/20 relative rounded-2xl border bg-black/35 p-4 text-center"
                  >
                    <div className="bg-alin-gold/10 mx-auto flex size-12 items-center justify-center rounded-2xl text-alin-gold">
                      <item.icon className="size-6" aria-hidden />
                    </div>
                    <h3 className="mt-4 text-sm font-black text-alin-white">{item.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-alin-muted">{item.body}</p>
                    {index < branchNetwork.length - 1 ? (
                      <ArrowRight
                        className="absolute -right-5 top-10 hidden size-6 text-alin-gold sm:block"
                        aria-hidden
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>

      <section className="section bg-alin-near-black">
        <div className="container-page">
          <SectionHeader
            eyebrow="Delivery status timeline"
            title="Every delivery follows a clear status path."
            body="ALiN Move keeps every party updated with clear delivery statuses from booking to completion."
            centered
          />
          <GlassPanel className="mt-10">
            <TimelinePills items={deliveryStatuses} />
          </GlassPanel>
          <div className="mt-6 rounded-2xl border border-alin-border bg-black/35 p-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-alin-gold">
              Rider timeline
            </p>
            <p className="mt-3 text-sm leading-6 text-alin-muted">{riderStatuses.join(" -> ")}</p>
          </div>
        </div>
      </section>

      <section className="section bg-alin-black">
        <div className="container-page">
          <SectionHeader
            title="Designed for faster deliveries and fewer manual follow-ups."
            centered
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-alin-border bg-alin-near-black p-5"
              >
                <benefit.icon className="size-8 text-alin-gold" aria-hidden />
                <h3 className="mt-5 text-base font-black text-alin-white">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-alin-muted">{benefit.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-alin-near-black">
        <div className="container-page">
          <GlassPanel>
            <div className="flex items-center gap-3">
              <HelpCircle className="size-8 text-alin-gold" aria-hidden />
              <h2 className="text-3xl font-black text-alin-white">FAQ</h2>
            </div>
            <div className="mt-6 divide-y divide-alin-border overflow-hidden rounded-2xl border border-alin-border bg-black/35">
              {faqs.map((faq) => (
                <details key={faq.q} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-alin-white">
                    {faq.q}
                    <span className="text-xl text-alin-gold transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-4xl text-sm leading-6 text-alin-muted">{faq.a}</p>
                </details>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>

      <section className="border-alin-gold/10 relative overflow-hidden border-t bg-[radial-gradient(circle_at_20%_50%,rgba(255,194,0,0.24),transparent_24%),linear-gradient(90deg,#050505,#111,#050505)] py-16">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(110deg,transparent_0%,rgba(255,194,0,0.12)_40%,transparent_72%)]" />
        <div className="container-page relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative min-h-72">
            <Image
              src="/img/photo/rider-hero.png"
              alt="ALiN Move rider on delivery"
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-contain object-left-bottom drop-shadow-[0_30px_55px_rgba(255,194,0,0.2)]"
            />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tight text-alin-white sm:text-5xl">
              Ready to move with <span className="text-alin-gold">ALiN Move?</span>
            </h2>
            <p className="mt-4 text-lg text-alin-muted">
              Book your next delivery from your phone, or start accepting jobs and earning from
              deliveries.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <DownloadCustomerAppButton />
              <DownloadRiderAppButton
                variant="outline"
                className="border-alin-gold/50 bg-black/35"
              />
            </div>
            <StoreBadges audience="customer" size="lg" className="mt-6" />
            <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-alin-gold">
              ALiN Move - Move smarter. Deliver faster. Grow together.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
