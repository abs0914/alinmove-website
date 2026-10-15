import { BRANCHES, type BranchSummary } from "./branches";

export type { BranchSummary } from "./branches";

export interface CityCoverage {
  slug: string;
  name: string;
  region: BranchSummary["region"];
  branchCount: number;
  isActive: boolean;
}

export interface CoverageSnapshot {
  cities: CityCoverage[];
  branches: BranchSummary[];
  fetchedAt: string;
  source: "static";
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function deriveCities(branches: readonly BranchSummary[]): CityCoverage[] {
  const cities = new Map<string, CityCoverage>();
  for (const branch of branches) {
    const slug = slugify(branch.city);
    const existing = cities.get(slug);
    if (existing) {
      existing.branchCount += 1;
      existing.isActive ||= branch.isActive;
      continue;
    }
    cities.set(slug, {
      slug,
      name: branch.city,
      region: branch.region,
      branchCount: 1,
      isActive: branch.isActive,
    });
  }
  return [...cities.values()].sort((a, b) => a.name.localeCompare(b.name));
}

const CITIES = deriveCities(BRANCHES);

export async function getCoverage(): Promise<CoverageSnapshot> {
  return {
    cities: CITIES.map((city) => ({ ...city })),
    branches: BRANCHES.map((branch) => ({ ...branch, phones: [...branch.phones] })),
    fetchedAt: new Date().toISOString(),
    source: "static",
  };
}

export async function getCityCoverage(slug: string): Promise<CityCoverage | null> {
  return CITIES.find((city) => city.slug === slug) ?? null;
}
