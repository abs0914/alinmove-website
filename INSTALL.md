# ALiN Move — Claude Code Project Memory & Skills Bundle

Drop this folder's contents into the **root** of your `alinmove-web` repo. The directory structure is already correct:

```
alinmove-web/
├── CLAUDE.md                          ← drops at repo root
├── docs/
│   └── alinmove-design-build-plan.md  ← canonical plan, referenced by CLAUDE.md
└── .claude/
    └── skills/
        ├── a11y-checklist/SKILL.md
        ├── ace-narrative/SKILL.md
        ├── alinmove-brand/SKILL.md
        ├── analytics-events/SKILL.md
        ├── gsap-patterns/SKILL.md
        ├── launch-mode-flag/SKILL.md
        ├── nextjs-app-router-conventions/SKILL.md
        ├── payload-cms-conventions/SKILL.md
        ├── performance-budget-guard/SKILL.md
        ├── seo-metadata/SKILL.md
        ├── shadcn-add-workflow/SKILL.md
        └── waitlist-flow/SKILL.md
```

## Install

From the directory where you extracted this bundle:

```bash
cp -r CLAUDE.md .claude docs /path/to/alinmove-web/
cd /path/to/alinmove-web
git add CLAUDE.md .claude docs
git commit -m "chore: add Claude Code project memory, skills, and design plan"
```

## How this works

- **`CLAUDE.md`** is loaded automatically by Claude Code at the start of every session in this repo. It's the project memory: north-star rules, brand essentials, what skills exist, and what "done" looks like for any new page.
- **`.claude/skills/<name>/SKILL.md`** files load on-demand when their `description` (in the YAML frontmatter) matches what you're asking Claude Code to do. You don't have to invoke them by name — Claude Code reads the descriptions and picks the right ones.

## Suggested first session

Once committed, your first Claude Code session can be:

```
Read CLAUDE.md and /docs/alinmove-design-build-plan.md, then bootstrap the repo.

Today:
1. `pnpm create next-app alinmove-web --ts --app --tailwind`
2. Add Payload v3 with Postgres on Supabase; admin at /admin
3. CSS variables in globals.css per alinmove-brand skill
4. Inter variable font via next/font
5. Root layout + nav + footer skeletons
6. Empty stubs for all P0 routes
7. lighthouserc.json with budgets per performance-budget-guard skill
8. Push to GitHub, connect Vercel, preview deploy

Stop after the Vercel preview is green — I'll review before we wire the waitlist API.
```

## Three unblockers before sprint 1

These will surface inside the first session — answer them in advance and you'll save a round-trip:

1. **Branch Portal API** — what's the read-only endpoint URL, auth (likely service role token), and acceptable cache TTL?
2. **ACE company facts** — branch count, founding year, lifetime deliveries — what numbers can we publish on `/network` and the proof-stat counters?
3. **Payload database** — separate Supabase project from the Rider App? (Recommended: yes — isolation is cheap and avoids migration collisions.)
