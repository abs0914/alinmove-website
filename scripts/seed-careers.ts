/**
 * Seed the Careers + ATS data:
 *   - Departments (Engineering, Operations, Marketing, People)
 *   - JobLocations (Cebu City, Manila, Remote — Philippines)
 *   - CareersPage global (culture blocks + hero copy)
 *   - One sample published JobListing
 *
 * Idempotent — uses upsert-style lookups by slug. Re-running is safe.
 *
 * Run: pnpm tsx scripts/seed-careers.ts
 */
import { getPayload } from "payload";
import config from "@payload-config";

type IdShape = { id: string | number };

async function upsertBySlug(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: "departments" | "job-locations",
  data: Record<string, unknown>,
): Promise<IdShape> {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: data.slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  if (existing.docs[0]) {
    return existing.docs[0] as IdShape;
  }
  const created = await payload.create({
    collection,
    data: data as never,
    overrideAccess: true,
  });
  return created as IdShape;
}

async function seed() {
  const payload = await getPayload({ config });

  console.log("→ seeding departments…");
  const [engineering, operations, marketing, people] = await Promise.all([
    upsertBySlug(payload, "departments", { name: "Engineering", slug: "engineering" }),
    upsertBySlug(payload, "departments", { name: "Operations", slug: "operations" }),
    upsertBySlug(payload, "departments", { name: "Marketing", slug: "marketing" }),
    upsertBySlug(payload, "departments", { name: "People", slug: "people" }),
  ]);

  console.log("→ seeding locations…");
  const [cebu, manila, remote] = await Promise.all([
    upsertBySlug(payload, "job-locations", {
      name: "Cebu City",
      slug: "cebu-city",
      country: "PH",
      isRemote: false,
    }),
    upsertBySlug(payload, "job-locations", {
      name: "Manila",
      slug: "manila",
      country: "PH",
      isRemote: false,
    }),
    upsertBySlug(payload, "job-locations", {
      name: "Remote — Philippines",
      slug: "remote-ph",
      country: "PH",
      isRemote: true,
    }),
  ]);

  console.log("→ seeding careers-page global…");
  await payload.updateGlobal({
    slug: "careers-page",
    data: {
      hero: {
        eyebrow: "Careers at ALiN Move",
        headline: "Build the digital layer of a nationwide cargo network.",
        subcopy:
          "We're hiring people who want to ship product, move quickly, and matter. Joining ALiN Move means joining ALiN Cargo Express — Philippines' established nationwide cargo backbone — at the point where it meets the customer and the rider.",
      },
      cultureBlocks: [
        {
          icon: "Truck",
          title: "Build on a real network",
          body:
            "We're not a startup competing on app polish. ALiN Cargo Express has nationwide branches, cargo capacity, and a real customer base. You'll ship the digital layer on top of it.",
        },
        {
          icon: "MapPin",
          title: "Cebu-anchored, PH-wide",
          body:
            "Our HQ is in Cebu. Hybrid + remote roles open across the Philippines. The cargo network already reaches every major city — we'd like the team to look like that too.",
        },
        {
          icon: "Zap",
          title: "Move fast, ship weekly",
          body:
            "Small team. Short feedback loops. We measure ourselves on what reaches customers and riders, not on how clean the JIRA board looks.",
        },
      ],
      noOpeningsMessage:
        "No openings posted right now. Email us at careers@alinmove.com and we'll keep you in mind.",
    } as never,
  });

  console.log("→ seeding sample job listing…");
  const existingJob = await payload.find({
    collection: "job-listings",
    where: { slug: { equals: "software-engineer-fullstack" } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  if (!existingJob.docs[0]) {
    await payload.create({
      collection: "job-listings",
      overrideAccess: true,
      data: {
        title: "Software Engineer (Full-stack)",
        slug: "software-engineer-fullstack",
        department: engineering.id,
        location: cebu.id,
        employmentType: "full-time",
        workplaceType: "hybrid",
        shortDescription:
          "Help build the customer + rider apps on top of the ALiN Cargo Express network. Next.js + React Native + Postgres.",
        description: {
          root: {
            type: "root",
            format: "",
            indent: 0,
            version: 1,
            direction: "ltr",
            children: [
              {
                type: "paragraph",
                version: 1,
                direction: "ltr",
                format: "",
                indent: 0,
                children: [
                  {
                    type: "text",
                    version: 1,
                    text: "We're hiring a full-stack engineer to build the digital layer of ALiN Cargo Express. Web (Next.js 14), iOS + Android (React Native), Postgres-backed services.",
                    detail: 0,
                    format: 0,
                    mode: "normal",
                    style: "",
                  },
                ],
              },
            ],
          },
        } as never,
        responsibilities: [
          { item: "Ship customer + rider features end-to-end" },
          { item: "Own a slice of the codebase across web + mobile" },
          { item: "Collaborate with Operations on branch-level workflows" },
        ],
        requirements: [
          { item: "3+ years building production web apps" },
          { item: "Comfortable with TypeScript, React, and SQL" },
          { item: "Bonus: React Native, Payload CMS, or logistics experience" },
        ],
        benefits: [
          { item: "HMO from day one" },
          { item: "Hybrid setup, Cebu-anchored" },
          { item: "Equipment provided" },
        ],
        salary: {
          showSalary: false,
          currency: "PHP",
          period: "month",
        },
        applyEmailNotify: "careers@alinmove.com",
        publishedAt: new Date().toISOString(),
        _status: "published",
      } as never,
    });
    console.log("  ✓ created sample job");
  } else {
    console.log("  ✓ sample job already exists");
  }

  // Silence unused warnings for the locations we created but didn't reference.
  void operations;
  void marketing;
  void people;
  void manila;
  void remote;

  console.log("✓ careers seed complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error("seed failed", err);
  process.exit(1);
});
