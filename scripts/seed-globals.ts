/**
 * Seed Payload Globals with the current hardcoded marketing copy.
 *
 * Idempotent: writes default values to each Global. Existing edits made in
 * /admin are NOT overwritten — Payload's updateGlobal merges on top of the
 * existing document. Re-running is safe.
 *
 * Run: pnpm seed
 */
import { getPayload } from "payload";
import config from "@payload-config";

async function seed() {
  const payload = await getPayload({ config });

  console.log("→ seeding site-settings…");
  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      tagline: "From your doorstep to anywhere in the Philippines.",
      navLinks: [
        { label: "Home", href: "/" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Pricing", href: "/pricing" },
        { label: "Branches", href: "/branches" },
        { label: "Track Package", href: "/tracking" },
        { label: "Become a Rider", href: "/drive" },
      ],
      footerColumns: [
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
      ],
      social: [
        { platform: "facebook", url: "https://facebook.com/alinmove" },
        { platform: "tiktok", url: "https://tiktok.com/@alinmove" },
        { platform: "youtube", url: "https://youtube.com/@alinmove" },
      ],
      stickyBar: {
        headline: "Send a package today",
        ctaLabel: "Download App",
      },
    },
  });

  console.log("→ seeding home-page hero…");
  await payload.updateGlobal({
    slug: "home-page",
    data: {
      hero: {
        headline: "Send packages faster with ALiN Move.",
        subcopy:
          "Book door-to-door delivery or pickup-to-branch shipping in seconds. Track your ride, pay securely, and stay updated until your package arrives.",
        primaryCtaLabel: "Download Customer App",
        secondaryCtaLabel: "Track a parcel",
        secondaryCtaHref: "/tracking",
      },
    },
  });

  console.log("✓ seed complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error("seed failed", err);
  process.exit(1);
});
