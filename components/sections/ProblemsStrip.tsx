import {
  Hand,
  EyeOff,
  MessageSquareWarning,
  Clock,
  GitBranch,
  Building2,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";

type Problem = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const PROBLEMS: Problem[] = [
  { icon: Hand, title: "User-Unfriendly", body: "Confusing flows that everyone struggles with." },
  { icon: EyeOff, title: "No Live Tracking", body: "You don't know where your package is." },
  { icon: MessageSquareWarning, title: "Manual Coordination", body: "Too many calls and follow-ups." },
  { icon: Clock, title: "Delayed Updates", body: "No real-time status or notifications." },
  { icon: GitBranch, title: "Confusing Options", body: "Too many choices, hard to decide." },
  { icon: Building2, title: "No Branch Integration", body: "Can't take to branch or track branches." },
];

/**
 * "Delivery should not feel complicated." Six pain-point cards in a row,
 * followed by an ALiN solution panel that resolves the tension. Server
 * component. Mobile: 2-up grid. Tablet: 3-up. Desktop: 6-up + solution panel
 * to the right (7-col) or below (mobile/tablet).
 */
export function ProblemsStrip() {
  return (
    <section className="section bg-alin-near-black">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-alin-white sm:text-4xl">
            Delivery should not feel complicated.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          {/* Problem cards */}
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PROBLEMS.map((p) => (
              <li
                key={p.title}
                className="rounded-xl border border-alin-border bg-alin-black p-4 transition-colors hover:border-alin-gold/40"
              >
                <span
                  aria-hidden
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-alin-gold/30 bg-alin-near-black text-alin-gold"
                >
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-alin-white">{p.title}</h3>
                <p className="mt-1 text-xs text-alin-muted">{p.body}</p>
              </li>
            ))}
          </ul>

          {/* ALiN solution panel */}
          <aside
            aria-label="ALiN Move solution"
            className="flex flex-col justify-between gap-5 rounded-2xl border border-alin-gold/50 bg-alin-near-black p-6 shadow-[inset_0_0_0_1px_rgba(255,192,0,0.15)]"
          >
            <a
              href="/img/photo/live_tracking.png"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open live tracking preview full size"
              className="block overflow-hidden rounded-lg border border-alin-border bg-alin-black transition-colors hover:border-alin-gold/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alin-gold"
            >
              <span className="relative block aspect-[16/7] w-full">
                <Image
                  src="/img/photo/live_tracking.png"
                  alt="ALiN Move live tracking app preview"
                  fill
                  sizes="(min-width: 1024px) 430px, 100vw"
                  className="object-cover"
                />
              </span>
            </a>
            <p className="text-sm text-alin-white">
              <span className="block font-semibold text-alin-gold">One app. Clear pricing.</span>
              Live tracking. Branch updates. One app, one network. Hassle-free.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
