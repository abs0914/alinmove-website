"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import {
  directionsHref,
  phoneHref,
  type BranchKind,
  type BranchSummary,
  type IslandGroup,
} from "@/lib/branches";
import { cn } from "@/lib/utils";

const LazyBranchMap = dynamic(() => import("./BranchMap"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[560px] items-center justify-center bg-alin-near-black text-sm text-alin-muted">
      Loading branch map…
    </div>
  ),
});

type RegionFilter = "All" | IslandGroup;

const REGION_FILTERS: readonly RegionFilter[] = ["All", "Luzon", "Visayas", "Mindanao"];
const KIND_LABELS: Record<BranchKind, string> = {
  branch: "Branch",
  warehouse: "Warehouse",
  receiving: "Receiving only",
  office: "Office only",
  headquarters: "Headquarters",
};

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function matchesSearch(branch: BranchSummary, query: string): boolean {
  if (!query) return true;
  const haystack = normalize(
    [
      branch.name,
      branch.city,
      branch.province,
      branch.address,
      branch.coverageArea,
      branch.email,
      ...branch.phones,
    ]
      .filter(Boolean)
      .join(" "),
  );
  return haystack.includes(normalize(query));
}

function BranchTypeIcon({ kind }: { kind: BranchKind }) {
  return (
    <span className="text-xs font-black" aria-hidden>
      {kind === "warehouse" ? "WH" : "BR"}
    </span>
  );
}

function BranchCard({
  branch,
  expanded,
  onToggle,
}: {
  branch: BranchSummary;
  expanded: boolean;
  onToggle: () => void;
}) {
  const detailsId = `branch-details-${branch.id}`;

  return (
    <article
      id={`branch-card-${branch.id}`}
      className={cn(
        "scroll-mt-24 overflow-hidden rounded-2xl border bg-alin-near-black transition-colors",
        expanded ? "border-alin-gold" : "hover:border-alin-gold/60 border-alin-border",
      )}
    >
      <button
        type="button"
        className="flex w-full items-start gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-alin-gold"
        aria-expanded={expanded}
        aria-controls={detailsId}
        onClick={onToggle}
      >
        <span className="bg-alin-gold/10 mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl text-alin-gold">
          <BranchTypeIcon kind={branch.kind} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-black text-alin-white">{branch.name}</span>
          <span className="mt-1 block text-sm text-alin-muted">
            {branch.city}, {branch.province}
          </span>
          <span className="border-alin-gold/25 bg-alin-gold/10 mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold text-alin-white">
            {KIND_LABELS[branch.kind]}
          </span>
        </span>
        <span
          className={cn(
            "mt-1 shrink-0 text-xl text-alin-gold transition",
            expanded && "rotate-180",
          )}
          aria-hidden
        >
          ⌄
        </span>
      </button>

      {expanded ? (
        <div id={detailsId} className="border-t border-alin-border px-4 pb-5 pt-4">
          {branch.address ? (
            <p className="text-sm leading-6 text-alin-white">{branch.address}</p>
          ) : (
            <p className="text-sm text-alin-muted">No public address is listed.</p>
          )}
          {branch.coverageArea ? (
            <p className="mt-3 text-sm leading-6 text-alin-muted">
              <span className="font-bold text-alin-white">Coverage:</span> {branch.coverageArea}
            </p>
          ) : null}
          {branch.serviceNotes ? (
            <p className="border-alin-gold/20 bg-alin-gold/5 mt-3 rounded-xl border p-3 text-sm leading-6 text-alin-muted">
              {branch.serviceNotes}
            </p>
          ) : null}

          {branch.phones.length > 0 || branch.email ? (
            <div className="mt-4 grid gap-2">
              {branch.phones.map((phone) => (
                <a
                  key={phone}
                  href={phoneHref(phone)}
                  className="flex items-center gap-2 text-sm font-semibold text-alin-white hover:text-alin-gold"
                  onClick={() =>
                    trackEvent("branch_phone_click", {
                      branch_id: branch.id,
                      region: branch.region,
                    })
                  }
                >
                  {phone}
                </a>
              ))}
              {branch.email ? (
                <a
                  href={`mailto:${branch.email}`}
                  className="flex min-w-0 items-center gap-2 break-all text-sm font-semibold text-alin-white hover:text-alin-gold"
                  onClick={() =>
                    trackEvent("branch_email_click", {
                      branch_id: branch.id,
                      region: branch.region,
                    })
                  }
                >
                  {branch.email}
                </a>
              ) : null}
            </div>
          ) : null}

          <Button asChild size="sm" className="mt-5 w-full sm:w-auto">
            <a
              href={directionsHref(branch)}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                trackEvent("branch_directions_click", {
                  branch_id: branch.id,
                  region: branch.region,
                })
              }
            >
              Get Directions
            </a>
          </Button>
        </div>
      ) : null}
    </article>
  );
}

export function BranchLocator({
  branches,
  initialQuery = "",
  initialRegion = "All",
}: {
  branches: readonly BranchSummary[];
  initialQuery?: string;
  initialRegion?: RegionFilter;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [region, setRegion] = useState<RegionFilter>(initialRegion);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileMapVisible, setMobileMapVisible] = useState(false);
  const [desktopMap, setDesktopMap] = useState(false);

  useEffect(() => {
    trackEvent("page_view_branches", { branch_count: branches.length });
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktopMap(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [branches.length]);

  const filteredBranches = useMemo(
    () =>
      branches
        .filter((branch) => region === "All" || branch.region === region)
        .filter((branch) => matchesSearch(branch, query.trim()))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [branches, query, region],
  );

  useEffect(() => {
    if (selectedId && !filteredBranches.some((branch) => branch.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filteredBranches, selectedId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const url = new URL(window.location.href);
      if (query.trim()) url.searchParams.set("q", query.trim());
      else url.searchParams.delete("q");
      if (region !== "All") url.searchParams.set("region", region.toLowerCase());
      else url.searchParams.delete("region");
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}`);
      if (query.trim()) {
        trackEvent("branch_search", { query: query.trim(), result_count: filteredBranches.length });
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [filteredBranches.length, query, region]);

  const selectBranch = useCallback((branchId: string, source: "map" | "card") => {
    setSelectedId((current) => (source === "card" && current === branchId ? null : branchId));
    trackEvent(source === "map" ? "branch_marker_click" : "branch_card_toggle", {
      branch_id: branchId,
    });
    if (source === "map") {
      window.setTimeout(() => {
        document.getElementById(`branch-card-${branchId}`)?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "center",
        });
      }, 50);
    }
  }, []);

  const shouldLoadMap = desktopMap || mobileMapVisible;

  return (
    <div>
      <div className="border-alin-gold/20 rounded-[1.75rem] border bg-alin-near-black p-4 sm:p-5">
        <div className="relative">
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-alin-muted"
            aria-hidden
          >
            ⌕
          </span>
          <label htmlFor="branch-search" className="sr-only">
            Search branches
          </label>
          <input
            id="branch-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, city, address, or coverage…"
            className="focus:ring-alin-gold/30 h-12 w-full rounded-xl border border-alin-border bg-black py-3 pl-12 pr-11 text-base text-alin-white outline-none transition placeholder:text-alin-muted focus:border-alin-gold focus:ring-2"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear branch search"
              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-alin-muted hover:bg-white/10 hover:text-alin-white"
              onClick={() => setQuery("")}
            >
              <span aria-hidden>×</span>
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" aria-label="Filter branches by island group">
            {REGION_FILTERS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={region === option}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alin-gold",
                  region === option
                    ? "border-alin-gold bg-alin-gold text-alin-black"
                    : "hover:border-alin-gold/60 border-alin-border bg-black/35 text-alin-white",
                )}
                onClick={() => {
                  setRegion(option);
                  trackEvent("branch_region_filter", { region: option });
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-alin-muted" aria-live="polite">
              <span className="font-black text-alin-white">{filteredBranches.length}</span>{" "}
              {filteredBranches.length === 1 ? "branch" : "branches"} found
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="lg:hidden"
              aria-expanded={mobileMapVisible}
              onClick={() => {
                setMobileMapVisible((visible) => !visible);
                trackEvent("branch_map_toggle", { visible: !mobileMapVisible });
              }}
            >
              {mobileMapVisible ? "Show List" : "Show Map"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(360px,0.82fr)_minmax(0,1.18fr)]">
        <div
          className={cn(
            "space-y-3 lg:max-h-[720px] lg:overflow-y-auto lg:pr-2",
            mobileMapVisible && "hidden lg:block",
          )}
          aria-label="Branch results"
        >
          {filteredBranches.length > 0 ? (
            filteredBranches.map((branch) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                expanded={selectedId === branch.id}
                onToggle={() => selectBranch(branch.id, "card")}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-alin-border bg-alin-near-black p-8 text-center">
              <span className="text-3xl text-alin-gold" aria-hidden>
                ●
              </span>
              <h2 className="mt-4 text-xl font-black text-alin-white">No branches found</h2>
              <p className="mt-2 text-sm text-alin-muted">
                Try a broader search or select a different island group.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-5"
                onClick={() => {
                  setQuery("");
                  setRegion("All");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        <div
          className={cn(
            "border-alin-gold/25 relative min-h-[560px] overflow-hidden rounded-[1.75rem] border bg-alin-near-black lg:sticky lg:top-24 lg:block lg:h-[720px]",
            mobileMapVisible ? "block" : "hidden",
          )}
        >
          {shouldLoadMap ? (
            <LazyBranchMap
              branches={filteredBranches}
              selectedId={selectedId}
              onSelect={(branchId) => selectBranch(branchId, "map")}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
