import {
  Home,
  Building2,
  MapPin,
  CircleDollarSign,
  ClipboardList,
  Headphones,
  type LucideIcon,
} from "lucide-react";

type Service = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const SERVICES: Service[] = [
  {
    icon: Home,
    title: "Door-to-Door Delivery",
    body: "We pick up and deliver straight to your door.",
  },
  {
    icon: Building2,
    title: "Pickup to ALiN Branch",
    body: "Drop off at a branch anywhere nationwide.",
  },
  {
    icon: MapPin,
    title: "Real-Time Tracking",
    body: "Track your rider live from pickup to drop-off.",
  },
  {
    icon: CircleDollarSign,
    title: "Price Before You Book",
    body: "See the total price before you confirm.",
  },
  {
    icon: ClipboardList,
    title: "Delivery History",
    body: "View past deliveries and receipts.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    body: "We're here to help when you need us.",
  },
];

/**
 * "One app for local delivery and cargo movement." Six service cards in a
 * single row on desktop, two-up on mobile. Server component.
 */
export function ServiceGrid() {
  return (
    <section className="section bg-alin-black">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-alin-white sm:text-4xl">
            One app for{" "}
            <span className="text-alin-gold">local delivery</span> and{" "}
            <span className="text-alin-gold">cargo movement.</span>
          </h2>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SERVICES.map((s) => (
            <li
              key={s.title}
              className="flex flex-col items-center rounded-xl border border-alin-border bg-alin-near-black p-5 text-center transition-colors hover:border-alin-gold/40"
            >
              <span
                aria-hidden
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-alin-gold/30 bg-alin-black text-alin-gold"
              >
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-3 text-sm font-bold text-alin-white">{s.title}</h3>
              <p className="mt-1 text-xs text-alin-muted">{s.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
