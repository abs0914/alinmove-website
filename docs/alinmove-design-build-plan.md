# ALiN Move — Design & Build Plan

> **Project:** Public marketing & waitlist website for ALiN Move — the digital delivery platform connected via ALiN Cargo Express.
> **Stack:** Next.js 14+ (App Router) · TypeScript · Tailwind CSS · GSAP · shadcn/ui · Payload v3 (CMS)
> **Owner:** Al Ryan / ALiN Tech
> **Status:** Decisions locked. Canonical plan referenced by `CLAUDE.md`.
> **Path in repo:** `/docs/alinmove-design-build-plan.md`

---

## 1. Strategic Foundation

### 1.1 Core thesis

1. **The ALiN Cargo Express backbone is our moat.** ACE already moves cargo nationwide. ALiN Move adds the digital layer + last-mile riders. The combined story — *"Doorstep to anywhere in the Philippines"* — is something no PH delivery competitor can match.
2. Build **one domain, two unmistakable funnels** — Customer (default on home) and Driver (one click away).
3. **Pre-launch waitlist is the primary conversion goal**, not store clicks. The website launches before the apps. For a defined ~2-month window, site KPI #1 = waitlist signups (customer email + city, driver intent → handoff to Rider App).
4. **Riders get flexibility, not a career path.** The story is *choice* — vehicle, hours, service types, location — never progression. No "Junior → Senior → Operator" language anywhere on the site.
5. **Motion is purposeful.** GSAP only where it teaches the product (Home, How It Works, Network). Waitlist forms, Pricing, FAQ, Driver Apply, Legal stay motion-light.
6. **Route + nationwide network is the brand's signature motion.** Pickup → branch network → dropoff across a stylized PH map is the visual differentiator.
7. **Strict execution order:** clarity → instrumentation → motion → experiments.

### 1.2 The differentiator: ALiN Cargo Express as backbone

| Layer | Last-mile gig competitors (Lalamove, Grab, foodpanda) | ALiN Move |
|---|---|---|
| Geographic reach | Intra-city only | **Doorstep to anywhere in PH** via ACE network |
| Branch infrastructure | None (rider-only network) | **Owned nationwide branches** for transfer, storage, exception handling |
| Cargo capability | Small parcels, last-mile only | **Small parcel + cross-city cargo** in one platform |
| Rider experience | Locked to one service type, narrow vehicle list | **Choice of vehicle, hours, service types** — same app |
| Customer story | "Send within the city" | **"Send anywhere — we'll get it there"** |
| Trust posture | Tech startup | **Established logistics company with a digital layer** |

This positioning shows up in three places on every page: (1) Hero — visual of nationwide network, (2) Trust strip — "Connected via ALiN Cargo Express · Nationwide network", (3) Footer — ACE company badge.

### 1.3 Brand identity

| Element | Value |
|---|---|
| Primary brand color | `#FFC000` (ALiN Gold) |
| Primary surface | `#000000` — hero, navbar, footer |
| Secondary surface | `#0F1117` — cards, sections |
| Text on dark | `#FFFFFF` |
| Text muted on dark | `#B5B7BD` |
| Text on light | `#0F1117` |
| Accent / success | `#10B981` (delivered) |
| Accent / warning | `#F59E0B` (in-transit) |
| Typeface | **Inter** (variable) |
| Tagline (lead) | *"From your doorstep to anywhere in the Philippines."* |
| Tagline (trust) | *"Connected via ALiN Cargo Express"* |
| Tagline (rider) | *"Drive flexibly. Move with the network."* |
| Voice | Confident, practical, Filipino-grounded. Verbs first. |

### 1.4 The two audiences

| Audience | Default landing | Primary CTA (waitlist mode) | Primary CTA (live mode) | Secondary CTA |
|---|---|---|---|---|
| **Customer** | Home above-the-fold | **"Join the waitlist"** | "Get the app" | "How it works" / "Check coverage" |
| **Rider** | Home (one click) or `/drive` | **"Drive with us"** (handoff to Rider App / Supabase) | "Drive with us" (same) | "See how it works" |
| **Business** (P1) | `/business` | "Talk to sales" | (same) | "See use cases" |

### 1.5 Confirmed decisions

| Question | Decision |
|---|---|
| Domain | `alinmove.com` already owned ✓ |
| Apps in stores | **Coming Soon + waitlist mode at launch** |
| Waitlist window | **~2 months from site launch to app launch** |
| Driver leads | Captured via Supabase (same project as Rider App) — Rider App handles all confirmations |
| CMS | **Required at launch** — frontend content + SEO blogs by non-engineers → **Payload v3** (recommended) |
| Coverage data | **Live from Branch Portal backend** (API integration) |
| Legal | Customer Terms + Driver Terms drafts exist ✓ — render as MDX in `/legal/*` |
| Photography | Rights-cleared photos of real ALiN riders & branches available ✓ |
| Languages | **English only at launch** (no i18n at P0) |
| `/track` | **Deeplink to Customer App** (no backend lookup screen) |
| Email/SMS | Driver: handled by Rider App. Customer waitlist: **Resend + Supabase** (see §2.1) |

### 1.6 Driver positioning rules

The rider story is **flexibility**, not progression. Anywhere a rider sees copy on this site, the message ladders to one of these four choices:

1. **Choice of vehicle** — motorcycle, sedan, MPV, pickup, van. Pick what you have.
2. **Choice of hours** — online when you want, offline when you want. No shift mandates.
3. **Choice of service types** — door-to-door · pickup-to-branch · branch walk-in handoffs · cross-city handoffs through the ACE network. See what's nearby; accept what fits.
4. **Choice of location** — drive in your home city; if you travel, deliver wherever ALiN operates.

The ACE network advantage **for riders** is **more variety of work**, never a ladder.

---

## 2. Tech Stack & Architecture

### 2.1 Core stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | RSC, fast LCP, route-level code splitting |
| Language | **TypeScript (strict)** | Shared types between site + CMS content models |
| Styling | **Tailwind v3.4+** + CSS variables | Brand tokens shared with motion system |
| UI primitives | **shadcn/ui** (selectively) | Accordion, Dialog, Tabs, NavigationMenu, Sheet, Form |
| **CMS** | **Payload v3** (Next.js-native, Postgres on Supabase, `/admin` in same app) | Same repo, same deploy, TS types auto-flow to frontend. *Alternative:* Sanity if content team wants hosted Studio. |
| Motion | **GSAP 3.13+** + `@gsap/react` (`useGSAP`) | Single motion stack |
| GSAP plugins (page-scoped) | ScrollTrigger, SplitText, MotionPath, DrawSVG, Flip, Observer | Only what each page needs |
| Forms | `react-hook-form` + `zod` | Customer waitlist, driver apply, contact, B2B inquiry |
| **Waitlist email** | **Resend** + Supabase row insert | Confirmation email at signup; batch announce at launch |
| Driver-apply persistence | **Supabase** (Rider App project) — Rider App handles all rider comms | Single source of truth for rider pipeline |
| **Coverage API** | Branch Portal backend (read-only endpoint, ISR-cached) | One source of truth for live branch network |
| Analytics | Vercel Analytics + GA4 (or PostHog) + custom event taxonomy | Waitlist conversion attribution |
| Hosting | **Vercel** | Edge runtime, CWV monitoring, preview deploys |
| Image | `next/image` AVIF/WebP | LCP optimization |
| SEO | `next/metadata` + JSON-LD (Organization, FAQPage, LocalBusiness, BlogPosting) | Organic discovery |
| ~~i18n~~ | **Not at launch** (English only) | Removed from P0 scope |

### 2.2 Repo structure

```
alinmove-web/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Home (P0)
│   │   ├── delivery/page.tsx           # Customer Delivery (P0)
│   │   ├── network/page.tsx            # Powered by ALiN Cargo Express (P0)
│   │   ├── pricing/page.tsx            # Pricing & Coverage (P0)
│   │   ├── how-it-works/page.tsx       # How It Works (P0)
│   │   ├── waitlist/                   # Customer waitlist
│   │   │   ├── page.tsx                # Waitlist signup form (P0)
│   │   │   └── thank-you/page.tsx      # Confirmation page (P0)
│   │   ├── drive/
│   │   │   ├── page.tsx                # Driver Recruitment (P0)
│   │   │   ├── earnings/page.tsx       # Earnings & Requirements (P0)
│   │   │   ├── flexibility/page.tsx    # Flexibility (vehicle/hours/services/location) (P0)
│   │   │   ├── apply/page.tsx          # Driver Apply form (P0)
│   │   │   └── faq/page.tsx            # Driver FAQ (P0)
│   │   ├── coverage/
│   │   │   ├── page.tsx                # Coverage hub (live data)
│   │   │   └── [city]/page.tsx         # City landing pages (P1, ISR)
│   │   ├── track/page.tsx              # Deeplink launcher (P0, simple)
│   │   ├── business/page.tsx           # B2B (P1)
│   │   ├── help/                       # Help Center (P0)
│   │   ├── about/page.tsx              # About + ACE story (P1)
│   │   ├── careers/page.tsx            # Careers (P1)
│   │   ├── blog/                       # CMS-driven (P1)
│   │   │   ├── page.tsx                # Blog hub
│   │   │   ├── [slug]/page.tsx         # Article
│   │   │   └── category/[slug]/page.tsx
│   │   └── legal/                      # MDX (P0)
│   │       ├── privacy/page.tsx
│   │       ├── terms-customer/page.tsx
│   │       ├── terms-driver/page.tsx
│   │       ├── cookies/page.tsx
│   │       └── data-deletion/page.tsx
│   ├── (payload)/                      # Payload v3 routes (auto-generated)
│   │   └── admin/[[...segments]]/      # Content team UI at /admin
│   ├── api/
│   │   ├── waitlist/route.ts           # Customer waitlist intake → Supabase + Resend
│   │   ├── apply/route.ts              # Driver apply → Supabase (Rider App project)
│   │   ├── contact/route.ts            # Contact form
│   │   ├── coverage/route.ts           # Proxy/cache to Branch Portal backend
│   │   └── revalidate/route.ts         # CMS publish webhook → ISR purge
│   ├── layout.tsx                      # Root: fonts, metadata
│   ├── globals.css                     # CSS vars + shadcn token mapping
│   ├── opengraph-image.tsx             # Programmatic OG (root)
│   ├── sitemap.ts
│   └── robots.ts
├── payload.config.ts                   # Payload v3 config
├── collections/                        # CMS content models
│   ├── BlogPosts.ts
│   ├── Authors.ts
│   ├── Categories.ts
│   ├── Pages.ts                        # Editable marketing-page overrides
│   ├── FAQItems.ts
│   ├── Testimonials.ts
│   ├── Cities.ts                       # /coverage/[city] overrides
│   └── Media.ts
├── components/
│   ├── motion/
│   │   ├── HeroIntro.tsx
│   │   ├── ACENetworkMap.tsx           # Animated PH map with branches
│   │   ├── RouteStory.tsx
│   │   ├── StaggerReveal.tsx
│   │   ├── AudienceToggle.tsx
│   │   ├── StepProgress.tsx
│   │   └── ReducedMotionProvider.tsx
│   ├── sections/
│   │   ├── HeroCustomer.tsx
│   │   ├── HeroDriver.tsx
│   │   ├── ACEBackboneStrip.tsx        # "Powered by ACE" trust strip
│   │   ├── HowItWorks.tsx
│   │   ├── FeatureGrid.tsx
│   │   ├── PricingTable.tsx
│   │   ├── CoverageGrid.tsx            # Live API-backed
│   │   ├── WaitlistForm.tsx
│   │   ├── ComingSoonStoreBadges.tsx
│   │   ├── TestimonialCarousel.tsx
│   │   ├── FAQAccordion.tsx
│   │   ├── DriverApplyForm.tsx
│   │   ├── FlexibilityGrid.tsx         # Vehicle/hours/services/location grid
│   │   └── StickyWaitlistBar.tsx       # Pre-launch only
│   ├── ui/                             # shadcn primitives
│   ├── nav/
│   ├── brand/
│   │   ├── Logo.tsx
│   │   ├── ACEBadge.tsx                # ALiN Cargo Express co-brand mark
│   │   ├── ComingSoonBadge.tsx
│   │   ├── AppStoreBadges.tsx
│   │   └── VehicleIcons.tsx
│   └── seo/
│       └── JsonLd.tsx
├── lib/
│   ├── tokens.ts
│   ├── analytics.ts
│   ├── analytics-server.ts
│   ├── analytics-helpers.ts
│   ├── gsap-config.ts
│   ├── seo.ts
│   ├── launch-mode.ts                  # The waitlist→live flag
│   ├── supabase.ts                     # Server client for waitlist + apply
│   ├── resend.ts                       # Email client
│   └── coverage-api.ts                 # Branch Portal client
├── content/                            # MDX for legal pages
├── public/
│   ├── brand/
│   ├── illustrations/
│   ├── network/                        # PH map SVG, branch markers
│   ├── photography/                    # Real ALiN rider/branch photos
│   └── screenshots/                    # App + portal screenshots
├── styles/tokens.css
├── tailwind.config.ts
├── tsconfig.json
└── lighthouserc.json
```

### 2.3 Performance budgets (CI-enforced)

| Metric | P0 budget | Hard ceiling |
|---|---|---|
| LCP | ≤ 2.0s | 2.5s |
| INP | ≤ 150ms | 200ms |
| CLS | ≤ 0.05 | 0.1 |
| Initial JS (compressed) | ≤ 120 KB | 180 KB |
| Total JS (compressed) | ≤ 220 KB | 300 KB |
| Hero image | ≤ 80 KB AVIF | 120 KB |

CMS payload note: Payload `/admin` route is excluded from public budgets (admin-only).

---

## 3. Site Architecture & Page Priorities

### 3.1 Sitemap

| Section | Page | Priority | Motion density |
|---|---|---|---|
| **Customer core** | Home | P0 | High |
| | Customer Delivery | P0 | Medium |
| | **Network** (ACE backbone story) | P0 | High |
| | Pricing & Coverage | P0 | Low |
| | How It Works | P0 | High |
| | **Waitlist** + Thank-you | P0 | Minimal |
| | Track (deeplink) | P0 | Minimal |
| | City landing template | P1 | Low |
| **Driver core** | Driver Recruitment | P0 | Medium |
| | Earnings & Requirements | P0 | Low |
| | **Flexibility** (vehicle/hours/services/location) | P0 | Medium |
| | Driver Apply | P0 | Minimal |
| | Driver FAQ | P0 | Minimal |
| | Vehicle Types | P1 | Low |
| **Trust & support** | Help Center | P0 | Minimal |
| | Contact | P0 | Minimal |
| | Safety & Insurance | P0 | Low |
| **Business** | Business Delivery | P1 | Low |
| **Resources** (CMS) | Blog Hub + article | P1 | Minimal |
| **Company** | About + ACE story | P1 | Medium |
| | Careers | P1 | Minimal |
| **Legal** | Privacy, Terms (Customer), Terms (Driver), Cookies, Data Deletion | P0 | None |

### 3.2 Conversion flows (waitlist mode)

```
Customer:  Home → How-It-Works/Network/Pricing → Waitlist signup → Confirmation email →
           [LAUNCH MOMENT] → "App is live" email → Store install → First Order

Driver:    Home → Drive → Flexibility/Earnings → Apply form → Submitted to Supabase →
           Rider App handles confirmation/onboarding → KYC → Activation
```

At the launch moment, swap CTAs sitewide via a single env flag (`NEXT_PUBLIC_LAUNCH_MODE = 'waitlist' | 'live'`). The plan in §9 covers this transition; the `launch-mode-flag` skill is the implementation reference.

---

## 4. Page-Level Designs (P0)

### 4.1 Home — `/`
**Goal:** Anchor the ACE backbone story, capture customer waitlist, route drivers to apply.

**Section stack:**
1. **Hero** — black background. H1 (SplitText reveal): *"From your doorstep to anywhere in the Philippines."* Subhead: *"Powered by ALiN Cargo Express's nationwide branch network."* CTAs: `[Join the waitlist]` (gold) + `[Drive with us]` (white outline). Hero visual: **animated stylized PH map** — gold dots = ACE branches, animated route from sender's pin → nearest branch → cross-country line → destination branch → recipient pin (DrawSVG + MotionPath, 6s loop, pauses on user interaction).
2. **ACE Backbone trust strip** — *"Powered by ALiN Cargo Express · Nationwide branch network · Real-time tracking · Real Filipino riders."* Co-branded ACE badge.
3. **"How it works" preview (3 steps)** — Book → Track → Receive. Numbered cards with route-progress connector animating on scroll.
4. **Service cards** — Door-to-Door · Pickup-to-Branch · Branch Walk-in · Cargo (Cross-city). Hover lift + route micro-animation.
5. **The network advantage** — split section: left = "Last-mile delivery apps stop at the city limit." right = "We don't." Animated mini-map showing intra-city circle vs. nationwide network.
6. **Customer app preview** — Phone mockup with screen swap (booking → tracking → delivered). **"Coming Soon"** badge overlay.
7. **Coverage teaser** — "We're in [City]. Joining a city near you?" Live pull from Branch Portal API. CTA: `[Join the waitlist]`.
8. **Driver teaser block** — Black-on-gold split: *"Drive flexibly. Move with the network."* + driver CTA.
9. **Proof stats** — Animated counters: ACE branches active, riders onboarded (post-launch), cities served, years of cargo experience.
10. **FAQ preview** + final waitlist CTA + footer.

**GSAP plugins:** core, SplitText (hero only), ScrollTrigger, DrawSVG (route + network map), MotionPath, Flip (audience toggle).
**Sticky mobile element:** `[Join the waitlist]` bar appears after 35% scroll.
**LCP asset:** the ACE network map SVG (or a poster image fallback if SVG too heavy).

### 4.2 Network — `/network`
**Goal:** Make the ACE backbone story crystal clear. This page exists *because* it's our differentiator.

**Sections:**
1. Hero: *"The largest delivery story in the Philippines isn't an app — it's a network."*
2. **Interactive PH map** with branch list (live from Branch Portal). Click a city → see local stats.
3. ACE company timeline / credibility (founded year, deliveries to date, coverage history).
4. The handoff explainer: "How a parcel travels through our network" — animated 5-stop journey.
5. Real branch photography (rights-cleared library).
6. CTA block: customer waitlist + "Drive with us" link to `/drive`.

### 4.3 Customer Delivery — `/delivery`
**Sections:** Service overview · Use cases (pasalubong cross-city, balikbayan parcels, e-commerce returns, urgent docs) · App screenshots (3 with swap) · Tracking module · Delivery options grid · ACE proof strip · Waitlist block · FAQ slice.

### 4.4 Pricing & Coverage — `/pricing`
**Sections:** Pricing bands (Pouch XS-L, Box 1KG-XL, intra-city / cross-city / cargo tiers) · "What affects price" · **Live coverage list** from Branch Portal API · Service-level comparison · FAQ.
**Motion:** number counters only.

### 4.5 How It Works — `/how-it-works`
**Sections:** Step hero · 5-step pinned stepper (desktop) / vertical (mobile) · DrawSVG route building as user scrolls · For cross-city deliveries: ACE branch handoff visualization · Edge cases · Final waitlist CTA.
**Motion density:** highest. Reuse the route-line pattern from §6.

### 4.6 Waitlist — `/waitlist`
**Goal:** Convert intent to email capture.
**Form fields:** Email · City (autocomplete from coverage API) · "I want to..." (Send packages / Drive / Both) · Consent.
**Submit flow:** Server action → Supabase row insert → Resend confirmation email → redirect to `/waitlist/thank-you`. Implementation reference: `waitlist-flow` skill.
**Thank-you page:** Confirmation, what to expect, share buttons (referral lever for later), driver-conversion link.
**Motion:** none. Form is the focus.

### 4.7 Track — `/track`
**Goal:** Pure deeplink launcher. Detect platform, deeplink to Customer App; if not installed, App Store / Play Store fallback (post-launch) or "Coming Soon + waitlist" (pre-launch).
**Single component, server-rendered, ~30 lines of code.**

### 4.8 Driver Recruitment — `/drive`
**Goal:** Open the rider funnel. Lead with the **flexibility** angle.

**Section stack:**
1. Hero: *"Drive flexibly. Move with the network."* Subhead: *"Pick your vehicle. Pick your hours. Pick your jobs."* CTAs: `[Drive with us]` (gold) + `[See how earnings work]` (outline).
2. Earnings counter strip ("Avg ₱X / day" — placeholder, live data post-launch).
3. **Why drive with ALiN — 5 benefits.** Order: (1) Choose your vehicle, (2) Choose your hours, (3) More variety of work via the ACE network, (4) Transparent pay before you accept, (5) SOS + insurance + Maya payouts.
4. Vehicle types grid (motorcycle, sedan, MPV, pickup, van).
5. Onboarding timeline: Apply → Documents → KYC review → Branch assignment → Activation.
6. Rider testimonials (real photography).
7. FAQ slice + Apply CTA.

### 4.9 Flexibility — `/drive/flexibility`
**Goal:** Make the rider flexibility story explicit. Most gig delivery platforms constrain riders to one vehicle, one service type, one schedule. ALiN's nationwide network unlocks variety — and this page tells that story.

**Sections:**
1. Hero: *"Pick your vehicle. Pick your hours. Pick your jobs."*
2. **The four flexibilities** — 4-card grid:
   - **Vehicle** — Motorcycle, sedan, MPV, pickup, van. Drive what you have.
   - **Hours** — Online when you want, offline when you want. No shift mandates.
   - **Service types** — Door-to-door · pickup-to-branch · branch walk-in handoffs · cross-city handoffs through the ACE network. See what's nearby; accept what fits.
   - **Location** — Drive in your home city. If you travel, deliver wherever ALiN operates.
3. **What this means in a typical day** — 3 short rider scenarios: morning food run on a motorcycle / afternoon furniture delivery in a pickup / evening branch-to-branch handoff. Each is illustrated with a service-icon card.
4. **Why this is unique** — short comparison block: most gig delivery has one vehicle + one service type; ALiN's ACE network unlocks more variety in the same app.
5. Apply CTA.

**Motion:** subtle reveal animations only. No pinned scroll scenes. The story is the value, not the choreography.

**Forbidden language on this page:**
- ❌ "Career path", "advance", "promote", "grow into a role"
- ❌ "Junior / Senior / Operator / Manager" labels
- ❌ Any visualization that resembles a step-up ladder

### 4.10 Earnings & Requirements — `/drive/earnings`
**Sections:** Earnings explainer · Requirements checklist (license, OR/CR, NBI, selfie) · "Get documents ready once" guide · Maya payout · SOS/insurance trust block.

### 4.11 Driver Apply — `/drive/apply`
**Form fields:** Full name · Mobile (PH +63) · Email · City/Branch preference · Vehicle type · Plate (optional) · Consent · Note: *"After you submit, we'll send you a link to download the Rider App."*
**Submit:** Server action → Supabase row insert into Rider App project → confirmation message → Rider App handles all downstream comms.
**Motion:** none.

### 4.12 Help Center / FAQ — `/help`
**Sections:** Search bar (instant filter) · Customer / Driver tabs · Top articles (CMS-managed) · Contact CTA.

### 4.13 Legal — `/legal/*`
Server-rendered MDX (drafts already exist). Strong typography, no motion.

---

## 5. Design System

### 5.1 Design tokens

Single source of truth: `/styles/tokens.css` (CSS variables) + `/tailwind.config.ts` (Tailwind aliases). Full reference lives in the `alinmove-brand` skill. Key variables:

```css
:root {
  --alin-gold: #FFC000;
  --alin-gold-hover: #FFCC33;
  --alin-gold-pressed: #E6AC00;
  --alin-black: #000000;
  --alin-near-black: #0F1117;
  --alin-graphite: #1A1D26;
  --alin-white: #FFFFFF;
  --alin-text-muted-dark: #B5B7BD;
  --alin-border-dark: #2A2D38;
  --alin-success: #10B981;
  --alin-warning: #F59E0B;
  --alin-danger: #EF4444;
  --alin-info: #3B82F6;
  --font-sans: var(--font-inter, system-ui);
}
```

⚠️ **Gold-on-black accessibility:** `#FFC000` on `#000000` passes WCAG AA only for large text (≥ 18px regular OR ≥ 14px bold). Use gold for headings, CTA fills, and KPI numbers. Body text on dark backgrounds is white or muted. See `a11y-checklist`.

### 5.2 Component inventory

| Category | Components |
|---|---|
| **Brand** | `Logo`, `ACEBadge` (co-brand mark), `ComingSoonBadge` (overlay), `AppStoreBadges`, `VehicleIcons`, `PackageIcons` |
| **Sections** | `HeroCustomer`, `HeroDriver`, `ACEBackboneStrip`, `HowItWorks`, `FeatureGrid`, `PricingTable`, `CoverageGrid`, `WaitlistForm`, `ComingSoonStoreBadges`, `TestimonialCarousel`, `FAQAccordion`, `DriverApplyForm`, `FlexibilityGrid`, `StickyWaitlistBar` |
| **Motion** | `HeroIntro`, `ACENetworkMap`, `RouteStory`, `StaggerReveal`, `AudienceToggle`, `StepProgress`, `ReducedMotionProvider` |
| **shadcn primitives** | `accordion`, `button` (customized), `dialog`, `sheet`, `tabs`, `form`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `label`, `toast` (sonner), `tooltip`, `navigation-menu`, `separator`, `skeleton` |
| **SEO** | `JsonLd` |

### 5.3 The signature visual: ACE Network Map

Single most important illustration on the entire site. Spec:

- Stylized PH map (SVG, ~1200×900 viewBox), simplified silhouette — Luzon, Visayas, Mindanao
- Branch markers: gold filled circles with slow pulse animation; class `.branch-marker` on every dot
- Route paths: dashed gold lines connecting branches; named IDs `#route-luzon-vis`, `#route-vis-min` (drawable via DrawSVG)
- Animated parcel dot (`#parcel-dot`) traveling sender → branch → cross-country → branch → recipient via MotionPath
- Reduced-motion variant: static map with all routes pre-drawn, no parcel dot animation
- Mobile variant: zoomed to active region with horizontal scroll

This asset should be designed deliberately — it carries the ACE story across Home, `/network`, `/how-it-works`, and `/about`. Animation contract is in the `gsap-patterns` skill (Pattern 3).

---

## 6. Motion Strategy

Full pattern reference and code lives in the `gsap-patterns` skill. Summary:

### 6.1 Plugin loading by page

| Page | Core | ScrollTrigger | SplitText | DrawSVG | MotionPath | Flip | Observer |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Home | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – |
| Network | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| How It Works | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| Customer Delivery | ✓ | ✓ | – | – | – | – | ✓ |
| Driver Recruitment | ✓ | ✓ | – | – | – | – | ✓ |
| Flexibility | ✓ | ✓ | – | – | – | – | – |
| About | ✓ | ✓ | – | ✓ | – | – | – |
| Pricing | ✓ (counters) | – | – | – | – | – | – |
| Waitlist / Track / Apply / FAQ / Legal | – | – | – | – | – | – | – |

### 6.2 Reduced-motion handling

Every animation must define a `reduce` branch via `gsap.matchMedia()` that sets the final visual state without animating. A footer toggle persists user preference in `localStorage` under `alin-reduce-motion`. The `<ReducedMotionProvider />` reads both the system signal and the manual toggle.

The ACE network map must have a fully-drawn static fallback when reduced motion is active.

---

## 7. Claude Code: Skills, Tools & Setup

### 7.1 Built-in capabilities used

File system, Bash, code editing, TodoWrite, Web search/fetch, Vision (for reviewing photography & logo).

### 7.2 MCP servers to connect

| MCP | Purpose | Priority |
|---|---|---|
| **GitHub MCP** | Repo, PRs, issues | P0 |
| **Vercel MCP** | Project linking, env vars, preview deploys, CWV monitoring | P0 |
| **Supabase MCP** | Schema management for waitlist table; Rider App schema for driver-apply | P0 |
| **Context7 / Anthropic docs MCP** | Always-current Next.js, Payload, GSAP, Tailwind docs | P0 |
| **Playwright MCP** | E2E smoke tests on hero animations and waitlist form | P1 |
| **Figma MCP** | If mockups happen in Figma — pull tokens/frames | P1 |

### 7.3 Custom Claude Code skills

Live in `.claude/skills/` — each is a `SKILL.md` that loads automatically when its trigger description matches. Full content of each is in the repo; this is the index.

| Skill | What it codifies |
|---|---|
| `alinmove-brand` | Color tokens, type scale, voice (incl. ACE co-brand rules), logo do/don't, button anatomy |
| `ace-narrative` | When/where to mention ALiN Cargo Express, the moat language, co-branding placement, **rider flexibility (not career path)** |
| `gsap-patterns` | Hero intro, scroll reveal, ACE network map, step progress, count-up, microinteraction. matchMedia + useGSAP |
| `nextjs-app-router-conventions` | Server vs Client decision tree, metadata patterns, route groups, error/loading boundaries, ISR |
| `payload-cms-conventions` | Collection schema patterns, Lexical rich text, ISR revalidation hooks, type generation flow |
| `shadcn-add-workflow` | `npx shadcn@latest add` flow + override tokens to ALiN brand |
| `waitlist-flow` | Customer waitlist form spec, Supabase insert pattern, Resend template, error states, dedup logic |
| `launch-mode-flag` | The `NEXT_PUBLIC_LAUNCH_MODE` env switch that swaps CTAs sitewide for the 2-month window |
| `performance-budget-guard` | LCP/INP/CLS budgets, hero image rules, dynamic imports, `next/image` defaults |
| `a11y-checklist` | WCAG AA color pairs, focus rings, reduced-motion, keyboard, alt text rules |
| `analytics-events` | Event taxonomy + helper signature, server-side conversion events, scroll/A-B test events |
| `seo-metadata` | `generateMetadata` patterns, JSON-LD for Org/FAQPage/LocalBusiness/BlogPosting, OG image generation |

### 7.4 `CLAUDE.md` (project memory)

Lives at the repo root. Loaded automatically by Claude Code at the start of every session. Contains north-star rules, brand essentials, the skill index, scope guardrails, and what "done" looks like for any new page. Keep it tight — details belong in this plan or in skills.

### 7.5 First Claude Code session — recommended brief

```
Bootstrap alinmove-web. Read CLAUDE.md and /docs/alinmove-design-build-plan.md first.

Today:
1. `pnpm create next-app alinmove-web --ts --app --tailwind`
2. Add Payload v3 (Postgres on Supabase) — admin at /admin
3. CSS variables in globals.css per plan §5.1; Tailwind config maps to vars
4. Inter variable font via next/font/google
5. Root layout + nav + footer skeletons
6. Empty stubs for / /delivery /network /pricing /how-it-works
   /waitlist /track /drive /drive/earnings /drive/flexibility /drive/apply /help
7. lib/launch-mode.ts with the helper module from launch-mode-flag skill
8. lighthouserc.json with budgets per plan §2.3
9. Push to new GitHub repo "alinmove-web"; connect Vercel; preview deploy

Use alinmove-brand, nextjs-app-router-conventions, payload-cms-conventions,
launch-mode-flag skills. Stop after Vercel preview is green; I'll review
before we add the waitlist API.
```

---

## 8. Design Elements & Artifacts to Produce

### 8.1 Brand assets

| Artifact | Variants | Status / where used |
|---|---|---|
| ALiN Move logo | Horizontal full-color (have ✓), Stacked, Mark only, White-on-black, Black-on-gold, Mono black, Mono white | Source PNG ✓ — need SVG conversions |
| **ACE co-brand mark** | Companion lockup: "Powered by ALiN Cargo Express" with ACE wordmark | Asset to create |
| Favicons | 16, 32, 48, 180 (apple-touch), 192, 512, maskable | Generate from logo mark |
| OG images | 1200×630 templates: Home, Network, Drive, Waitlist, generic | Per route via `app/opengraph-image.tsx` |
| Coming-soon badge | Overlay element for App Store / Play Store badges | Gold ribbon style |

### 8.2 Page mockups (Figma or hand-built)

- Home (desktop + mobile) — full scroll with ACE network map hero
- Network page — interactive map layout
- How It Works (pinned stepper)
- Pricing & Coverage
- Waitlist — form + thank-you
- Driver Recruitment
- **Flexibility** — 4-card grid + day-in-the-life scenarios
- Driver Apply (empty / filled / success / error states)
- Coverage city template

### 8.3 Illustrations (SVG, hand-coded for animation control)

| Illustration | Notes |
|---|---|
| **ACE Network Map (PH)** | Stylized country silhouette, gold branch markers, dashed routes, animated parcel dot. **HIGHEST PRIORITY.** |
| Hero route line (intra-city) | For service cards / How It Works zoom-in |
| Service-type icons | Door-to-Door, Pickup-to-Branch, Branch Walk-in, Cargo |
| Vehicle icons | Motorcycle, sedan, MPV, pickup, van |
| Package size icons | Pouch XS-L, Box 1KG-XL |
| Status chip glyphs | Pending → delivered (7 states) |
| **Flexibility grid icons** | Vehicle, Hours, Services, Location — 4-card visual for `/drive/flexibility` |
| App architecture diagram | Customer ↔ Rider ↔ Branch ↔ HQ (for About) |

### 8.4 Phone & dashboard mockups

Reuse from existing QA decks (v26+) — Customer App booking/tracking/delivered, Rider App job offer/active job/earnings, Branch Portal active riders map, HQ Portal delivery detail. Extract once → `public/screenshots/` → optimize as AVIF.

### 8.5 Photography (assets exist ✓)

Asset list to inventory & rights-confirm:

- Real ALiN riders on motorcycles (hero crops, mid-page proof, testimonial cards)
- Riders at ALiN branches (Network page)
- ALiN branch exteriors (Network page, About)
- Cargo loading / sorting (Cargo / cross-city sections)
- Riders with the Rider App (Drive page, Coming Soon mockups)
- Customer scenarios (handoff photos, urban Cebu/Manila locations)
- **Multi-vehicle scenes** for the Flexibility page — riders with motorcycle, with sedan, with pickup

### 8.6 Marketing copy artifacts

| Artifact | Length | Owner |
|---|---|---|
| Master message architecture (with ACE moat language) | 1 page | Plan owner + Claude |
| Page-by-page H1/subhead/CTA copy × 13 P0 pages | 2-3 lines each | Plan owner + Claude |
| **ACE backbone narrative** | 1-page anchor doc that all pages cite | Plan owner + Claude |
| FAQ content (customer + driver) | 15-20 each | From existing how-tos |
| **Waitlist confirmation email** | 1 short email + plain-text fallback | Plan owner + Claude |
| **Launch announcement email** (for waitlist batch) | 1 email | Plan owner + Claude |
| Driver requirements long-form | 1 page | From `HowTo_RiderApp.md` ✓ |
| Legal MDX | 5 docs | Drafts exist ✓ |
| Press kit + boilerplate | 1 page | Plan owner |

### 8.7 SEO artifacts

- Keyword cluster map
- City list with priority order (Cebu Metro phases first, then Manila, then ACE expansion cities)
- 8-12 launch blog post titles (CMS-published)
- JSON-LD schema templates per page type (in the `seo-metadata` skill)

### 8.8 CMS content models (Payload collections to build)

Full schemas in the `payload-cms-conventions` skill. Summary:

- **`Pages`** — editable marketing-page section overrides
- **`BlogPosts`** — articles with Lexical rich text
- **`Authors`** — bylines
- **`Categories`** — blog taxonomy
- **`FAQItems`** — Help Center entries with audience filter
- **`Testimonials`** — rider/customer quotes
- **`Cities`** — `/coverage/[city]` overrides
- **`Media`** — uploads with focal-point + AVIF derivatives
- **`Users`** — editor accounts

### 8.9 Analytics artifacts

Full event taxonomy is in the `analytics-events` skill (typed `EventName` union). Key events:

| Event | Trigger | Notes |
|---|---|---|
| `page_view_*` | Per route | Vercel Analytics auto-fires |
| `hero_cta_waitlist_click` | Customer hero CTA tap | Replaces `click_store_badge_*` for waitlist mode |
| `hero_cta_drive_click` | Driver hero CTA tap | |
| `waitlist_submit_success` | Server action 200 | **Primary KPI** during waitlist window |
| `waitlist_submit_error` | Validation or server error | |
| `apply_submit_success` | Driver apply 200 | Driver pipeline |
| `coverage_city_view` | City detail click | |
| `coverage_search` | Coverage search input | |
| `network_map_branch_click` | ACE map branch click | |
| `faq_expand` | Accordion open | |
| `scroll_50` / `scroll_75` | Page depth | |
| `mobile_sticky_waitlist_click` | Sticky bar tap | |

### 8.10 A/B test backlog (waitlist mode)

| Test | Variant A | Variant B | Primary KPI |
|---|---|---|---|
| Home hero angle | ACE-network-first hero | Customer-task-first hero | waitlist signup rate |
| Waitlist form length | Email + city + intent | Email only | submission rate |
| ACE backbone strip placement | Below hero | Top sticky bar | brand recall (proxy: scroll depth) |
| Driver hero proof | "Drive flexibly. Move with the network." | "Pick your vehicle. Pick your hours." | apply start rate |
| Flexibility page layout | 4-card grid first | Day-in-the-life scenarios first | scroll completion + apply CTA |

---

## 9. Phased Build Roadmap

### Month 1 — Foundation, content models, design lock

- [ ] Approve design system (tokens, components inventory)
- [ ] **Lock ACE narrative** — single anchor doc for all pages
- [ ] Lock IA, page copy outlines, event taxonomy
- [ ] Bootstrap repo: Next.js + Payload v3 + Tailwind + shadcn + GSAP
- [ ] Build `CLAUDE.md` + 12 skill files in `.claude/skills/`
- [ ] Set up: Supabase waitlist table, Resend account, Branch Portal API client
- [ ] Build component library (no Storybook — direct in app)
- [ ] Lo-fi mockups for all P0 pages
- [ ] **Inventory + AVIF-prep photography library** (parallel track)
- [ ] CI: Lighthouse budgets, type checks, Playwright smoke
- **Exit criteria:** Approved IA, design tokens shipped, CMS schemas defined, photography library ready, motion prototype validated, CI green on empty pages.

### Month 2 — P0 build & QA (waitlist mode)

- [ ] Implement P0 pages: Home, Network, Customer Delivery, Pricing, How It Works, Waitlist + Thank-you, Track, Drive, Earnings, Flexibility, Driver Apply, Help, Legal
- [ ] Build ACE Network Map illustration + animation (highest-priority custom asset)
- [ ] Wire GSAP motion (page-scoped + reduced-motion variants)
- [ ] Implement waitlist API: server action → Supabase + Resend confirmation
- [ ] Implement driver-apply API: server action → Supabase (Rider App project)
- [ ] Coverage API integration with Branch Portal (ISR-cached)
- [ ] CMS: seed initial blog posts, FAQ items, testimonials, page overrides
- [ ] Analytics taxonomy fully wired (waitlist as primary KPI)
- [ ] Field CWV baseline + a11y audit (axe + manual keyboard)
- **Exit criteria:** Staging green on lab CWV, zero P0 a11y issues, waitlist + apply submissions validated end-to-end, content team trained on Payload `/admin`, launch-day playbook drafted.

### Month 3 — Pre-launch website launch + 2-month waitlist window

- [ ] **Production launch in waitlist mode** (`NEXT_PUBLIC_LAUNCH_MODE=waitlist`)
- [ ] Start first A/B tests (hero angle, waitlist form length, ACE strip placement)
- [ ] Publish blog hub + first 3 articles via CMS
- [ ] Ship 3 city landing pages (Cebu, Mandaue, Lapu-Lapu)
- [ ] Begin P1: Features, About + ACE story, Vehicle Types, Business
- [ ] Set up launch-day playbook: when apps go live, flip env var to `live`, swap CTAs, send batch announcement email to waitlist
- **Exit criteria:** Live with monitoring, first experiment readouts, P1 backlog prioritized, launch-day playbook rehearsed.

### End of waitlist window (~Month 5) — Apps go live

Per the `launch-mode-flag` skill's launch-day playbook:

- [ ] Flip `NEXT_PUBLIC_LAUNCH_MODE` to `live`
- [ ] Set `NEXT_PUBLIC_APP_STORE_URL` and `NEXT_PUBLIC_PLAY_STORE_URL`
- [ ] Trigger production redeploy
- [ ] Send launch announcement email to waitlist (Resend batch)
- [ ] Swap "Coming Soon" badges → live App Store / Play Store badges
- [ ] Add real download attribution (App Store Connect + Google Play Console)
- [ ] Switch primary KPI dashboards from waitlist signups to store clicks + install attribution
- [ ] Monitor for 14 days: waitlist → install conversion as primary signal

---

## 10. Resolved decisions & remaining questions

### 10.1 Resolved

All architectural and product questions are answered — see §1.5 and §1.6.

### 10.2 Remaining questions (sprint-1 unblockers)

1. **Customer waitlist confirmation email** — confirmed Resend + Supabase row insert. Question: do we want a magic-link "verify your email" step (reduces fake signups) or just a thank-you confirmation (less friction, more signups)? **Recommendation: thank-you only at launch, add verify if we see fake-signup spam.**
2. **Branch Portal API** — what's the read-only endpoint shape? Auth (service role token)? Rate limits? Cache TTL acceptable for ISR?
3. **ACE company facts to publish** — founding year, total deliveries, branch count — what numbers can we use publicly? Need confirmed figures for proof stats and the Network page. Until confirmed, the `lib/ace-stats.ts` module ships `null` placeholders rendered as "Coming soon."
4. **Photography rights metadata** — do we have model releases for rider photos? Where the rider's face is clearly identifiable, releases are needed.
5. **Payload v3 hosting** — Vercel Postgres or Supabase Postgres for Payload's data? **Recommendation: Supabase Postgres** as a separate project from the Rider App's Supabase.
6. **Domain DNS** — where is `alinmove.com` currently parked? Need NS pointers to Vercel before launch.
7. **Cookie banner / consent** — PH doesn't currently mandate one, but if we ever serve EU traffic (overseas Filipinos visiting), we should plan for it. Defer to P1.
8. **App store listing names + bundle IDs** — pick now so OG images, store badges, waitlist copy, and post-launch deeplinks stay consistent.

---

## 11. Strategic positioning cheat sheet (for content team)

A pull-out reference. Pin this in the CMS docs.

### 11.1 ACE moat — customer-facing

| Don't say | Do say |
|---|---|
| "Another delivery app" | "The digital layer of ALiN Cargo Express's nationwide network" |
| "Available in [City]" | "Powered by [N] ALiN branches in [City] and growing" |
| "Track your order" | "Your package, on our network — visible at every stop" |
| "Coming soon" *(alone)* | "Coming soon — join the waitlist for early access" |
| "We deliver in your city" | "Doorstep to anywhere in the Philippines" |
| Generic gig-economy language | The ACE backbone language |

### 11.2 Rider flexibility — driver-facing

| Don't say | Do say |
|---|---|
| "Build your career with ALiN" | "Drive flexibly. Move with the network." |
| "Start as a rider, become an operator" | "Pick your vehicle. Pick your hours. Pick your jobs." |
| "Junior / Senior / Operator" | (no role tiers exist — remove the language) |
| "Grow with us" | "More variety of work, on the country's largest delivery network." |
| "Become a partner" | "Drive with us" |
| "Career path" | "Choices: vehicle, hours, services, location" |

### 11.3 Waitlist mode — every page

| Don't say | Do say |
|---|---|
| "Sign up to download" | "Join the waitlist" |
| "Get the app today" | "Be first to know when the app is live" |
| "Available on App Store and Google Play" | "Coming soon to App Store and Google Play" |

After the launch flip, the cheat sheet inverts — the `launch-mode-flag` skill defines the mechanical swap.

---

*End of plan. Lives at `/docs/alinmove-design-build-plan.md`. Referenced by `CLAUDE.md`. Treat as the canonical source — when in conflict with anything else (skills, mockups, slack threads), this document wins until it's explicitly amended here.*
