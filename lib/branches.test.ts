import { describe, expect, it } from "vitest";
import { BRANCHES, directionsHref, findNearestPickupBranch, phoneHref } from "./branches";

describe("ALiN Cargo Express branches", () => {
  it("contains the complete normalized Philippine network", () => {
    expect(BRANCHES).toHaveLength(47);
    expect(new Set(BRANCHES.map((branch) => branch.id)).size).toBe(47);
    expect(
      BRANCHES.reduce<Record<string, number>>((counts, branch) => {
        counts[branch.region] = (counts[branch.region] || 0) + 1;
        return counts;
      }, {}),
    ).toEqual({ Luzon: 18, Visayas: 20, Mindanao: 9 });
    expect(BRANCHES.every((branch) => branch.countryCode === "PH")).toBe(true);
  });

  it("provides valid coordinates for every active location", () => {
    for (const branch of BRANCHES.filter((item) => item.isActive)) {
      expect(branch.latitude).toBeGreaterThanOrEqual(-90);
      expect(branch.latitude).toBeLessThanOrEqual(90);
      expect(branch.longitude).toBeGreaterThanOrEqual(-180);
      expect(branch.longitude).toBeLessThanOrEqual(180);
    }
  });

  it("keeps offices visible but excludes them from pickup pricing", () => {
    const excluded = BRANCHES.filter((branch) => !branch.acceptsPickupToBranch);
    expect(excluded.map((branch) => branch.id).sort()).toEqual([
      "corporate-office-mandaue",
      "paranaque-office",
    ]);
    expect(
      BRANCHES.filter((branch) => branch.kind === "receiving").every(
        (branch) => branch.acceptsPickupToBranch,
      ),
    ).toBe(true);
  });

  it("builds safe telephone and directions links", () => {
    expect(phoneHref("0917-169-8822")).toBe("tel:+639171698822");
    expect(phoneHref("(032) 346-3965")).toBe("tel:+63323463965");
    const location = BRANCHES[0];
    expect(directionsHref(location)).toBe(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${location.latitude},${location.longitude}`)}`,
    );
  });

  it("finds operational pickup branches and excludes nearby offices", () => {
    expect(
      findNearestPickupBranch({ latitude: 14.4958114, longitude: 120.9927583 })?.branch.id,
    ).toBe("paranaque-warehouse");
    expect(
      findNearestPickupBranch({ latitude: 10.3382851, longitude: 123.9268817 })?.branch.id,
    ).toBe("cebu-warehouse");
    expect(findNearestPickupBranch({ latitude: 7.0944, longitude: 125.6125 })?.branch.id).toBe(
      "davao-city",
    );
  });
});
