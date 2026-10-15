// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCargoTracking } from "../cargo-adapter";
import { TrackingError } from "../errors";
import { hasValidTrackingNumberFormat } from "../format";
import {
  maskRecipientName,
  mergeMilestones,
  normalizeTrackingRecord,
  parseUpstreamTrackingRecord,
} from "../normalizer";
import { getStatusDefinition, toPublicStatus } from "../status";
import { validateTrackingNumber } from "../validation";

const now = new Date("2026-08-02T10:00:00.000Z");

function cargoRecord(overrides: Record<string, unknown> = {}) {
  return parseUpstreamTrackingRecord({
    trackingNumber: "ALN-CEB-260802-1842",
    shipmentType: "cargo",
    serviceType: "branch_to_door",
    status: "inTransit",
    statusTimestamp: "2026-08-02T09:50:00.000Z",
    origin: { branchName: "ALiN Cebu North Hub", city: "Cebu City" },
    destination: { branchName: "ALiN Tacloban Branch", city: "Tacloban City" },
    milestones: [
      { status: "processed", timestamp: "2026-08-01T09:00:00.000Z" },
      { status: "inTransit", timestamp: "2026-08-02T09:50:00.000Z" },
    ],
    lastUpdatedAt: "2026-08-02T09:50:10.000Z",
    ...overrides,
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("tracking-number validation", () => {
  it.each(["ALN-123456", "C63FA75F", "ace_2026.100"])('accepts "%s"', (value) => {
    expect(hasValidTrackingNumberFormat(value)).toBe(true);
    expect(validateTrackingNumber(` ${value} `).success).toBe(true);
  });

  it.each(["", "short", "ALN 123", "../secret", "ALN#123", "a".repeat(65)])(
    'rejects "%s"',
    (value) => expect(validateTrackingNumber(value).success).toBe(false),
  );
});

describe("status normalization", () => {
  it("distinguishes line-haul transit from last-mile transit", () => {
    expect(toPublicStatus("inTransit", "cargo", null).label).toBe("In transit");
    expect(toPublicStatus("in_transit", "last_mile", null).label).toBe("Out for delivery");
  });

  it.each([
    ["draft", "cargo", "Booking being prepared"],
    ["arrived", "cargo", "Arrived at destination branch"],
    ["accepted", "last_mile", "Rider assigned"],
    ["failed", "last_mile", "Delivery attempt unsuccessful"],
    ["cancelled", "cargo", "Shipment cancelled"],
    ["returned", "last_mile", "Returning to sender or branch"],
  ] as const)("maps %s", (raw, source, label) => {
    expect(getStatusDefinition(raw, source).label).toBe(label);
  });

  it("never exposes an unknown raw status code", () => {
    const result = toPublicStatus("private_ops_hold_42", "cargo", null);
    expect(result.label).toBe("Shipment update received");
    expect(JSON.stringify(result)).not.toContain("private_ops_hold_42");
  });
});

describe("privacy-safe normalization", () => {
  it("normalizes a local-only Cargo result", () => {
    const result = normalizeTrackingRecord(cargoRecord(), "ALN-CEB-260802-1842", now);
    expect(result.currentStatus.label).toBe("In transit");
    expect(result.origin).toEqual({ branchName: "ALiN Cebu North Hub", city: "Cebu City" });
    expect(result.lastMile.locationAvailable).toBe(false);
    expect(result.proofOfDelivery).toBeNull();
  });

  it("merges linked last-mile events after Cargo events", () => {
    const record = cargoRecord({
      shipmentType: "combined",
      status: "arrived",
      milestones: [
        { status: "processed", timestamp: "2026-08-01T09:00:00.000Z" },
        { status: "arrived", timestamp: "2026-08-02T09:00:00.000Z" },
      ],
      lastMile: {
        status: "in_transit",
        statusTimestamp: "2026-08-02T09:58:00.000Z",
        riderAssigned: true,
        milestones: [
          { status: "accepted", timestamp: "2026-08-02T09:30:00.000Z" },
          { status: "in_transit", timestamp: "2026-08-02T09:58:00.000Z" },
        ],
      },
    });
    const result = normalizeTrackingRecord(record, "ALN-CEB-260802-1842", now);
    expect(result.milestones.map((event) => event.label)).toEqual([
      "Shipment received",
      "Arrived at destination branch",
      "Rider assigned",
      "Out for delivery",
    ]);
    expect(result.currentStatus.label).toBe("Out for delivery");
  });

  it("removes duplicate semantic handoff events", () => {
    const merged = mergeMilestones(
      [{ id: "1", code: "ARRIVED_AT_DESTINATION_BRANCH", label: "Arrived", description: "", timestamp: "2026-08-02T09:00:00.000Z", state: "completed", source: "cargo" }],
      [{ id: "2", code: "DELIVERED_TO_BRANCH", label: "At branch", description: "", timestamp: "2026-08-02T09:00:30.000Z", state: "completed", source: "last_mile" }],
    );
    expect(merged).toHaveLength(1);
    expect(merged[0].state).toBe("current");
  });

  it("returns fresh eligible location and strips stale coordinates", () => {
    const baseLastMile = {
      status: "in_transit",
      statusTimestamp: "2026-08-02T09:59:00.000Z",
      riderAssigned: true,
      location: { latitude: 10.3157, longitude: 123.8854 },
      milestones: [],
    };
    const fresh = normalizeTrackingRecord(
      cargoRecord({ lastMile: { ...baseLastMile, locationUpdatedAt: "2026-08-02T09:59:00.000Z" } }),
      "ALN-CEB-260802-1842",
      now,
    );
    const stale = normalizeTrackingRecord(
      cargoRecord({ lastMile: { ...baseLastMile, locationUpdatedAt: "2026-08-02T09:40:00.000Z" } }),
      "ALN-CEB-260802-1842",
      now,
    );
    expect(fresh.lastMile.locationAvailable).toBe(true);
    expect(fresh.lastMile.locationFreshness).toBe("fresh");
    expect(fresh.lastMile.location).toEqual(baseLastMile.location);
    expect(stale.lastMile.locationAvailable).toBe(false);
    expect(stale.lastMile.locationFreshness).toBe("delayed");
    expect(stale.lastMile.location).toBeNull();
  });

  it("masks recipient identity and hides POD media by default", () => {
    vi.stubEnv("ALIN_CARGO_PUBLIC_RECIPIENT_ENABLED", "true");
    expect(maskRecipientName("Maria Reyes")).toBe("M•••• R••••");
    const result = normalizeTrackingRecord(
      cargoRecord({
        status: "delivered",
        statusTimestamp: "2026-08-02T09:55:00.000Z",
        milestones: [{ status: "delivered", timestamp: "2026-08-02T09:55:00.000Z" }],
        proofOfDelivery: {
          deliveredAt: "2026-08-02T09:55:00.000Z",
          receivedBy: "Maria Reyes",
          mediaUrl: "https://storage.example/pod.jpg?signature=secret",
          mediaExpiresAt: "2026-08-02T11:00:00.000Z",
        },
      }),
      "ALN-CEB-260802-1842",
      now,
    );
    expect(result.proofOfDelivery).toMatchObject({ receivedBy: "M•••• R••••", mediaUrl: null });
  });

  it("hides even masked recipient identity until policy enables it", () => {
    expect(maskRecipientName("Maria Reyes")).toBeNull();
  });

  it("allows only approved, unexpired HTTPS POD media", () => {
    vi.stubEnv("ALIN_CARGO_PUBLIC_POD_ENABLED", "true");
    const result = normalizeTrackingRecord(
      cargoRecord({
        status: "delivered",
        milestones: [{ status: "delivered", timestamp: "2026-08-02T09:55:00.000Z" }],
        proofOfDelivery: {
          deliveredAt: "2026-08-02T09:55:00.000Z",
          mediaUrl: "https://storage.example/pod.jpg?signed=yes",
          mediaExpiresAt: "2026-08-02T11:00:00.000Z",
        },
      }),
      "ALN-CEB-260802-1842",
      now,
    );
    expect(result.proofOfDelivery?.mediaUrl).toBe("https://storage.example/pod.jpg?signed=yes");
  });

  it("handles failed and cancelled terminal semantics", () => {
    expect(toPublicStatus("failed", "last_mile", null).terminal).toBe(false);
    expect(toPublicStatus("cancelled", "cargo", null).terminal).toBe(true);
  });
});

describe("Cargo adapter", () => {
  it("rejects an invalid upstream response", async () => {
    vi.stubEnv("ALIN_CARGO_API_BASE_URL", "https://cargo.example");
    vi.stubEnv("ALIN_CARGO_TRACKING_PATH", "/tracking/{trackingNumber}");
    const fetchImpl = vi.fn(async () => Response.json({ private: "payload" }));
    await expect(fetchCargoTracking("ALN-123456", { fetchImpl })).rejects.toMatchObject({
      code: "TRACKING_RESPONSE_INVALID",
    });
  });

  it("maps upstream timeout without exposing the cause", async () => {
    vi.stubEnv("ALIN_CARGO_API_BASE_URL", "https://cargo.example");
    vi.stubEnv("ALIN_CARGO_TRACKING_PATH", "/tracking/{trackingNumber}");
    const timeout = Object.assign(new Error("private timeout detail"), { name: "TimeoutError" });
    const fetchImpl = vi.fn(async () => Promise.reject(timeout)) as unknown as typeof fetch;
    await expect(fetchCargoTracking("ALN-123456", { fetchImpl })).rejects.toMatchObject({
      code: "TRACKING_TIMEOUT",
      message: "The tracking request took too long. Please try again.",
    });
  });

  it("requires an explicitly configured upstream contract", async () => {
    vi.stubEnv("ALIN_CARGO_API_BASE_URL", "");
    vi.stubEnv("ALIN_CARGO_TRACKING_PATH", "");
    await expect(fetchCargoTracking("ALN-123456")).rejects.toBeInstanceOf(TrackingError);
  });
});
