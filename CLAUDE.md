# ALiN Move Web — Project Memory

> Loaded automatically by Claude Code at the start of every session. Keep this tight; details live in `/docs/alinmove-design-build-plan.md` and `.claude/skills/`.

## What this repo is

The marketing & app-download site for **ALiN Move** — the digital delivery platform powered by **ALiN Cargo Express (ACE)**. Public domain: `alinmove.com`.

The site ships in **live mode** by default. Apps may not be in the stores yet at the moment a given PR lands — store-badge `href`s point to a placeholder `/download` route until the real store URLs flip in. The `/waitlist` page remains as a fallback for visitors on unsupported platforms but is no longer a primary nav item or sticky bar.

## North-star rules (non-negotiable)

1. **ACE backbone is our moat.** Every primary page surfaces "connected via ALiN Cargo Express" in some form. We are not a startup competing on app polish — we are an established nationwide cargo network putting a digital + last-mile layer on top. Apply the `ace-narrative` skill on any copy task.
2. **Primary CTA is "Download Customer App" / "Download Rider App"** with App Store + Google Play badges (rider is Android-only at launch). Build CTAs through the helpers in `lib/launch-mode.ts` (`downloadHref(...)`) so the destination can flip from `/download` placeholder → real store URL via env var without touching components. The `/waitlist` page persists as a fallback for visitors on unsupported platforms but is no longer a primary nav item or sticky bar. The legacy `customerPrimaryCta()` / `storeBadgeMode()` helpers are deprecated — do not introduce new call sites.
3. **Riders get flexibility, NOT a career path.** No "Junior → Senior → Operator" language anywhere. The story is *choice* — vehicle, hours, service types (door-to-door, pickup-to-branch, intra-city, cross-city via the ACE network).
4. **Motion is purposeful.** Two libraries are sanctioned, picked per use case:
   - **GSAP 3.13 + ScrollTrigger / SplitText / DrawSVG / MotionPath** — for timeline-driven sequences, scroll-triggered narratives, SVG path animations, the ACE map loop. Page-scoped imports only. Apply `gsap-patterns`.
   - **Framer Motion 11+** — for declarative component-level micro-interactions: button hover lifts, modal/sheet enter-exit, accordion content transitions, carousel slide transitions, layout animations, hover/tap states. Always wrap in `<LazyMotion features={domAnimation}>` (via `lib/motion.ts`) and use the `m.*` shorthand to keep bundle small.

   Rule of thumb: timeline / scroll / SVG drawing / looping → GSAP. Single-component state transition → Framer Motion. Don't use both on the same element.

   Allowlist for any motion (GSAP or Framer): Home, `/network`, `/how-it-works`, `/delivery`, `/drive`, `/drive/flexibility`, `/about`. Pricing, Waitlist, Apply, FAQ, Legal, Track stay motion-free apart from CSS hover states and shadcn/Radix built-in animations.
5. **Reduced-motion is mandatory** on every animation, plus a footer toggle. Apply `a11y-checklist`.
6. **Performance budgets are CI-enforced.** LCP ≤ 2.0s · INP ≤ 150ms · CLS ≤ 0.05 · Initial JS ≤ 120 KB compressed. Apply `performance-budget-guard`.
7. **All public pages are server components by default.** `"use client"` only when interaction or motion requires it. Apply `nextjs-app-router-conventions`.
8. **Marketing-page copy is CMS-managed via Payload.** Hardcoded copy in JSX is a code smell. Apply `payload-cms-conventions`.

## Brand essentials

| | |
|---|---|
| Gold | `#FFC000` — primary brand, headings, CTA fills only |
| Black | `#000000` — primary surfaces |
| Near-black | `#0F1117` — secondary surfaces / cards |
| White | `#FFFFFF` — body text on dark |
| Muted text on dark | `#B5B7BD` |
| Font | Inter (variable) via `next/font/google` |
| Lead tagline | *"From your doorstep to anywhere in the Philippines."* |
| Trust line | *"Connected via ALiN Cargo Express"* |
| Rider line | *"Drive flexibly. Move with the network."* |

⚠️ **Gold-on-black fails WCAG AA for body text** (≤ 12px or 14px regular). Use gold only for headings (≥ 18px bold) and CTA fills. Body text on dark backgrounds is white or `#B5B7BD`.

## Tech stack at a glance

Next.js 14+ App Router · TypeScript strict · Tailwind v3.4 · shadcn/ui · GSAP 3.13 + `@gsap/react` · **Framer Motion 11** (component micro-interactions) · **Payload v3** (CMS at `/admin`, Supabase Postgres) · Resend (waitlist email) · Vercel hosting.

## Skills loaded from `.claude/skills/`

| Skill | Trigger when… |
|---|---|
| `alinmove-brand` | Building any visual component, choosing colors/spacing |
| `ace-narrative` | Writing any user-facing copy or page brief |
| `gsap-patterns` | Adding any animation or scroll-triggered behavior |
| `nextjs-app-router-conventions` | Creating new routes, deciding server vs client, adding metadata |
| `payload-cms-conventions` | Adding/editing collections, content models, ISR webhooks |
| `shadcn-add-workflow` | Adding a new shadcn primitive |
| `waitlist-flow` | Touching the waitlist *fallback* form, `/api/waitlist`, or confirmation email |
| `launch-mode-flag` | (deprecated — site is live by default; see rule #2) |
| `performance-budget-guard` | Before opening a PR; adding hero images, large libs, or motion |
| `a11y-checklist` | Before opening a PR; reviewing colors, focus, keyboard, motion |
| `analytics-events` | Adding tracking; touching forms, CTAs, or scroll milestones |
| `seo-metadata` | New page; metadata; structured data; OG images |
| `openai-image-gen` | Generating an image via the OpenAI API (`gpt-image-2`); reads key from `.openai-key` |

## Pointers

- Full plan: `/docs/alinmove-design-build-plan.md`
- Design tokens (single source of truth): `/styles/tokens.css`
- Tailwind config maps to those vars: `/tailwind.config.ts`
- Event taxonomy types + helpers: `/lib/analytics.ts`
- Launch mode helper: `/lib/launch-mode.ts` (default mode is `live`; `downloadHref()` is the canonical CTA helper)
- Motion helper: `/lib/motion.ts` (Framer Motion `LazyMotion` wrapper + `useMotionAllowed()` hook)
- Coverage API client: `/lib/coverage-api.ts`
- Payload config: `/payload.config.ts`

## Scope guardrails

- **English only at launch** — no `next-intl` setup, no language switcher.
- **No `/track` lookup** — `/track` is a deeplink-launcher page, not a backend search.
- **Driver applications go to Supabase** (Rider App project) — Rider App handles all downstream rider comms. The website does NOT send driver emails/SMS.
- **Coverage is read from the Branch Portal API**, ISR-cached. Never hardcode city lists.

## What "done" looks like for any new page

A PR is reviewable when: server component by default · CMS-driven copy where applicable · `generateMetadata` set · JSON-LD schema added if eligible · analytics events wired · reduced-motion variant verified · WCAG AA color/focus passes · Lighthouse CI green against budgets · CTA `href` uses `downloadHref(...)` (no hardcoded store URLs).
