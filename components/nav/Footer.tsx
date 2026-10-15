import Link from "next/link";
import { Facebook, Youtube, Music2, Instagram, Twitter, Linkedin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { PoweredByACE } from "@/components/brand/ACEBadge";
import { ReducedMotionToggle } from "@/components/motion/ReducedMotionToggle";
import { StoreBadges } from "@/components/brand/StoreBadges";

export type FooterColumn = {
  label: string;
  links: Array<{ href: string; label: string }>;
};

export type FooterSocial = {
  platform: "facebook" | "tiktok" | "youtube" | "instagram" | "x" | "linkedin";
  url: string;
};

const FALLBACK_COLUMNS: FooterColumn[] = [
  {
    label: "Send",
    links: [
      { href: "/pricing", label: "Pricing & coverage" },
      { href: "/branches", label: "Find a branch" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/tracking", label: "Track a parcel" },
    ],
  },
  {
    label: "Drive",
    links: [
      { href: "/drive", label: "Why drive with us" },
      { href: "/drive/flexibility", label: "Flexibility" },
      { href: "/drive/earnings", label: "Earnings & requirements" },
      { href: "/drive/apply", label: "Apply" },
      { href: "/drive/faq", label: "Driver FAQ" },
    ],
  },
  {
    label: "Company",
    links: [
      { href: "/network", label: "Our network" },
      { href: "/about", label: "About ALiN Move" },
      { href: "/business", label: "For business" },
      { href: "/careers", label: "Careers" },
      { href: "/help", label: "Help center" },
    ],
  },
  {
    label: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/terms-customer", label: "Customer terms" },
      { href: "/legal/terms-driver", label: "Driver terms" },
      { href: "/legal/cookies", label: "Cookies" },
      { href: "/legal/data-deletion", label: "Data deletion" },
    ],
  },
];

const FALLBACK_SOCIAL: FooterSocial[] = [
  { platform: "facebook", url: "https://facebook.com/alinmove" },
  { platform: "tiktok", url: "https://tiktok.com/@alinmove" },
  { platform: "youtube", url: "https://youtube.com/@alinmove" },
];

const SOCIAL_ICONS: Record<FooterSocial["platform"], LucideIcon> = {
  facebook: Facebook,
  // Lucide ships no TikTok glyph — Music2 is the closest neutral stand-in.
  tiktok: Music2,
  youtube: Youtube,
  instagram: Instagram,
  x: Twitter,
  linkedin: Linkedin,
};

const SOCIAL_LABELS: Record<FooterSocial["platform"], string> = {
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  instagram: "Instagram",
  x: "X",
  linkedin: "LinkedIn",
};

export function Footer({
  columns,
  social,
  tagline,
}: {
  columns?: FooterColumn[];
  social?: FooterSocial[];
  tagline?: string;
} = {}) {
  const cols = columns && columns.length > 0 ? columns : FALLBACK_COLUMNS;
  const socials = social && social.length > 0 ? social : FALLBACK_SOCIAL;
  const tag = tagline ?? "From your doorstep to anywhere in the Philippines.";
  return (
    <footer className="border-t border-alin-border bg-alin-near-black">
      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-alin-muted">{tag}</p>
            <PoweredByACE />
            <div className="pt-2">
              <StoreBadges audience="customer" size="sm" />
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.label}>
              <h2 className="text-sm font-medium text-alin-white">{col.label}</h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="text-sm text-alin-muted transition-colors hover:text-alin-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-alin-border pt-6 text-xs text-alin-muted sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} ALiN Tech. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <ul className="flex items-center gap-3">
              {socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform];
                return (
                  <li key={s.platform + s.url}>
                    <a
                      href={s.url}
                      aria-label={SOCIAL_LABELS[s.platform]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-alin-border bg-alin-black text-alin-muted transition-colors hover:border-alin-gold hover:text-alin-gold"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
            <ReducedMotionToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
