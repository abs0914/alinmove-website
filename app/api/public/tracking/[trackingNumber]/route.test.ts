// @vitest-environment node

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetPublicTrackingRateLimitForTests } from "@/lib/tracking/rate-limit";
import { GET } from "./route";

const upstreamBody = {
  trackingNumber: "ALN-123456",
  shipmentType: "cargo",
  serviceType: "branch_to_branch",
  status: "inTransit",
  statusTimestamp: "2026-08-02T09:50:00.000Z",
  origin: { branchName: "ALiN Cebu", city: "Cebu City", exactAddress: "private" },
  destination: { branchName: "ALiN Tacloban", city: "Tacloban City" },
  milestones: [{ status: "inTransit", timestamp: "2026-08-02T09:50:00.000Z" }],
  recipientName: "Private Person",
  apiKey: "must-not-leak",
  lastUpdatedAt: "2026-08-02T09:50:01.000Z",
};

function request(trackingNumber: string, ip = "203.0.113.10") {
  return new NextRequest(`https://alinmove.test/api/public/tracking/${trackingNumber}`, {
    headers: { "x-forwarded-for": ip },
  });
}

beforeEach(() => {
  resetPublicTrackingRateLimitForTests();
  vi.stubEnv("ALIN_CARGO_API_BASE_URL", "https://cargo.example");
  vi.stubEnv("ALIN_CARGO_TRACKING_PATH", "/tracking/{trackingNumber}");
  vi.stubEnv("PUBLIC_TRACKING_RATE_LIMIT_MAX", "20");
  vi.stubGlobal("fetch", vi.fn(async () => Response.json(upstreamBody)));
});

describe.sequential("GET /api/public/tracking/:trackingNumber", () => {
  it("returns the normalized privacy-safe contract", async () => {
    const response = await GET(request("ALN-123456"), {
      params: Promise.resolve({ trackingNumber: "ALN-123456" }),
    });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(body).toMatchObject({
      success: true,
      trackingNumber: "ALN-123456",
      currentStatus: { label: "In transit" },
    });
    expect(JSON.stringify(body)).not.toContain("Private Person");
    expect(JSON.stringify(body)).not.toContain("must-not-leak");
    expect(JSON.stringify(body)).not.toContain("exactAddress");
  });

  it("rejects malformed input before calling upstream", async () => {
    const response = await GET(request("bad!"), {
      params: Promise.resolve({ trackingNumber: "bad!" }),
    });
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      success: false,
      error: { code: "INVALID_TRACKING_NUMBER" },
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns a stable not-found error", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 404 })));
    const response = await GET(request("ALN-999999"), {
      params: Promise.resolve({ trackingNumber: "ALN-999999" }),
    });
    expect(response.status).toBe(404);
    expect(await response.json()).toMatchObject({
      error: { code: "TRACKING_NOT_FOUND" },
    });
  });

  it("rate limits repeated public attempts", async () => {
    vi.stubEnv("PUBLIC_TRACKING_RATE_LIMIT_MAX", "1");
    const context = { params: Promise.resolve({ trackingNumber: "ALN-123456" }) };
    expect((await GET(request("ALN-123456"), context)).status).toBe(200);
    const blocked = await GET(request("ALN-123456"), context);
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("retry-after")).toBeTruthy();
  });

  it("maps upstream timeouts to a safe service error", async () => {
    const timeout = Object.assign(new Error("token and private host"), { name: "TimeoutError" });
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(timeout)));
    const response = await GET(request("ALN-123456"), {
      params: Promise.resolve({ trackingNumber: "ALN-123456" }),
    });
    const body = await response.json();
    expect(response.status).toBe(503);
    expect(body).toEqual({
      success: false,
      error: {
        code: "TRACKING_TIMEOUT",
        message: "The tracking request took too long. Please try again.",
      },
    });
    expect(JSON.stringify(body)).not.toContain("private host");
  });
});

