import { z } from "zod";
import { TrackingError } from "./errors";
import { getStatusDefinition, sanitizePublicText, toPublicStatus } from "./status";
import type {
  PublicLastMile,
  PublicProofOfDelivery,
  PublicShipmentMilestone,
  PublicShipmentPlace,
  PublicTrackingSuccess,
  ShipmentType,
  TrackingSource,
} from "./types";

const nullableText = z.string().trim().max(500).nullish();

const milestoneSchema = z.object({
  status: z.string().trim().min(1).max(80),
  timestamp: nullableText,
  description: nullableText,
});

const placeSchema = z.object({
  branchName: nullableText,
  city: nullableText,
});

const upstreamTrackingSchema = z.object({
  trackingNumber: nullableText,
  shipmentType: z.enum(["cargo", "last_mile", "combined", "unknown"]).optional(),
  serviceType: nullableText,
  status: z.string().trim().min(1).max(80),
  statusTimestamp: nullableText,
  origin: placeSchema.nullish(),
  destination: placeSchema.nullish(),
  milestones: z.array(milestoneSchema).max(100).default([]),
  lastMile: z
    .object({
      status: z.string().trim().min(1).max(80),
      statusTimestamp: nullableText,
      riderAssigned: z.boolean().default(false),
      vehicleType: nullableText,
      location: z
        .object({
          latitude: z.number().finite().min(-90).max(90),
          longitude: z.number().finite().min(-180).max(180),
        })
        .nullish(),
      locationUpdatedAt: nullableText,
      estimatedArrivalStart: nullableText,
      estimatedArrivalEnd: nullableText,
      milestones: z.array(milestoneSchema).max(100).default([]),
    })
    .nullish(),
  proofOfDelivery: z
    .object({
      deliveredAt: z.string().trim().min(1).max(80),
      receivedBy: nullableText,
      mediaUrl: nullableText,
      mediaExpiresAt: nullableText,
    })
    .nullish(),
  lastUpdatedAt: z.string().trim().min(1).max(80),
});

export type UpstreamTrackingRecord = z.infer<typeof upstreamTrackingSchema>;

export function parseUpstreamTrackingRecord(value: unknown): UpstreamTrackingRecord {
  const unwrapped =
    value && typeof value === "object" && "data" in value
      ? (value as { data: unknown }).data
      : value;
  const parsed = upstreamTrackingSchema.safeParse(unwrapped);
  if (!parsed.success) {
    throw new TrackingError("TRACKING_RESPONSE_INVALID", 502, { cause: parsed.error });
  }
  return parsed.data;
}

function verifiedIso(value: string | null | undefined): string | null {
  if (!value) return null;
  const milliseconds = Date.parse(value);
  return Number.isFinite(milliseconds) ? new Date(milliseconds).toISOString() : null;
}

function normalizePlace(value: UpstreamTrackingRecord["origin"]): PublicShipmentPlace | null {
  if (!value) return null;
  const branchName = sanitizePublicText(value.branchName, 100) || null;
  const city = sanitizePublicText(value.city, 100) || null;
  return branchName || city ? { branchName, city } : null;
}

const serviceTypes: Record<string, string> = {
  branch_to_branch: "Branch to branch",
  branch_to_door: "Branch to door",
  door_to_branch: "Door to branch",
  door_to_door: "Door to door",
  cargo: "Cargo shipment",
};

function normalizeServiceType(value: string | null | undefined) {
  if (!value) return null;
  return serviceTypes[value.trim().toLowerCase().replace(/[\s-]+/g, "_")] ?? null;
}

function normalizeMilestone(
  event: z.infer<typeof milestoneSchema>,
  source: TrackingSource,
  index: number,
): PublicShipmentMilestone {
  const definition = getStatusDefinition(event.status, source);
  const timestamp = verifiedIso(event.timestamp);
  return {
    id: `${source}-${definition.milestoneCategory}-${timestamp ?? index}`,
    code: definition.code,
    label: definition.label,
    description: definition.description,
    timestamp,
    state: "completed",
    source,
  };
}

function eventTime(event: PublicShipmentMilestone) {
  return event.timestamp ? Date.parse(event.timestamp) : Number.MAX_SAFE_INTEGER;
}

export function mergeMilestones(
  cargo: PublicShipmentMilestone[],
  lastMile: PublicShipmentMilestone[],
): PublicShipmentMilestone[] {
  const ordered = [...cargo, ...lastMile].sort((a, b) => eventTime(a) - eventTime(b));
  const deduplicated: PublicShipmentMilestone[] = [];

  const semanticKey = (code: string) => {
    if (code === "ARRIVED_AT_DESTINATION_BRANCH" || code === "DELIVERED_TO_BRANCH") {
      return "DESTINATION_BRANCH_HANDOFF";
    }
    return code;
  };

  for (const event of ordered) {
    const previousIndex = deduplicated.findIndex((candidate) => {
      if (semanticKey(candidate.code) !== semanticKey(event.code)) return false;
      if (!candidate.timestamp || !event.timestamp) return candidate.timestamp === event.timestamp;
      return Math.abs(Date.parse(candidate.timestamp) - Date.parse(event.timestamp)) <= 60_000;
    });
    if (previousIndex === -1) {
      deduplicated.push(event);
    } else if (event.source === "last_mile") {
      // The last-mile projection is more specific when Cargo reports the
      // same physical handoff or completion event.
      deduplicated[previousIndex] = event;
    }
  }

  return deduplicated.map((event, index) => ({
    ...event,
    state: index === deduplicated.length - 1 ? "current" : "completed",
  }));
}

export function maskRecipientName(value: string | null | undefined): string | null {
  if (process.env.ALIN_CARGO_PUBLIC_RECIPIENT_ENABLED !== "true") return null;
  const safe = sanitizePublicText(value, 100);
  if (!safe) return null;
  return safe
    .split(" ")
    .filter(Boolean)
    .map((part) => `${part[0]}${"•".repeat(Math.min(Math.max(part.length - 1, 2), 6))}`)
    .join(" ");
}

function safeExpiringMediaUrl(
  value: string | null | undefined,
  expiresAt: string | null | undefined,
  now: Date,
) {
  if (process.env.ALIN_CARGO_PUBLIC_POD_ENABLED !== "true" || !value) return null;
  const expiry = verifiedIso(expiresAt);
  if (!expiry || Date.parse(expiry) <= now.getTime()) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? { url: url.toString(), expiry } : null;
  } catch {
    return null;
  }
}

function normalizeProof(
  value: UpstreamTrackingRecord["proofOfDelivery"],
  now: Date,
): PublicProofOfDelivery | null {
  if (!value) return null;
  const deliveredAt = verifiedIso(value.deliveredAt);
  if (!deliveredAt) return null;
  const media = safeExpiringMediaUrl(value.mediaUrl, value.mediaExpiresAt, now);
  return {
    deliveredAt,
    receivedBy: maskRecipientName(value.receivedBy),
    mediaUrl: media?.url ?? null,
    mediaExpiresAt: media?.expiry ?? null,
  };
}

function locationFreshnessSeconds() {
  const configured = Number(process.env.PUBLIC_TRACKING_LOCATION_FRESHNESS_SECONDS ?? 120);
  return Number.isFinite(configured) && configured > 0 ? configured : 120;
}

function recentLocationSeconds() {
  const configured = Number(process.env.PUBLIC_TRACKING_LOCATION_RECENT_SECONDS ?? 900);
  return Number.isFinite(configured) && configured > locationFreshnessSeconds()
    ? configured
    : 900;
}

function hasUsableCoordinates(value: NonNullable<UpstreamTrackingRecord["lastMile"]>["location"]) {
  return Boolean(value && !(value.latitude === 0 && value.longitude === 0));
}

function normalizeLastMile(
  value: UpstreamTrackingRecord["lastMile"],
  now: Date,
): PublicLastMile {
  if (!value) {
    return {
      active: false,
      status: null,
      riderAssigned: false,
      vehicleType: null,
      locationAvailable: false,
      locationFreshness: "unavailable",
      location: null,
      locationUpdatedAt: null,
      estimatedArrivalStart: null,
      estimatedArrivalEnd: null,
    };
  }

  const definition = getStatusDefinition(value.status, "last_mile");
  const locationUpdatedAt = verifiedIso(value.locationUpdatedAt);
  const locationAge = locationUpdatedAt ? now.getTime() - Date.parse(locationUpdatedAt) : Infinity;
  const locationEligible = definition.active && definition.mapEligible;
  const usableCoordinates = hasUsableCoordinates(value.location);
  const locationIsFresh =
    Boolean(usableCoordinates && locationUpdatedAt) &&
    locationAge >= 0 &&
    locationAge <= locationFreshnessSeconds() * 1000;
  const locationAvailable = Boolean(locationEligible && locationIsFresh);
  const locationFreshness: PublicLastMile["locationFreshness"] =
    !locationEligible || !usableCoordinates || !locationUpdatedAt || locationAge < 0
      ? "unavailable"
      : locationIsFresh
        ? "fresh"
        : locationAge <= recentLocationSeconds() * 1000
          ? "recent"
          : "delayed";

  return {
    active: definition.active,
    status: { code: definition.code, label: definition.label },
    riderAssigned: value.riderAssigned,
    vehicleType: sanitizePublicText(value.vehicleType, 60) || null,
    locationAvailable,
    locationFreshness,
    location: locationAvailable && value.location ? value.location : null,
    locationUpdatedAt,
    estimatedArrivalStart: verifiedIso(value.estimatedArrivalStart),
    estimatedArrivalEnd: verifiedIso(value.estimatedArrivalEnd),
  };
}

function inferShipmentType(record: UpstreamTrackingRecord): ShipmentType {
  if (record.shipmentType) return record.shipmentType;
  return record.lastMile ? "combined" : "cargo";
}

export function normalizeTrackingRecord(
  record: UpstreamTrackingRecord,
  requestedTrackingNumber: string,
  now = new Date(),
): PublicTrackingSuccess {
  const lastUpdatedAt = verifiedIso(record.lastUpdatedAt);
  if (!lastUpdatedAt) throw new TrackingError("TRACKING_RESPONSE_INVALID", 502);

  const cargoMilestones = record.milestones.map((event, index) =>
    normalizeMilestone(event, "cargo", index),
  );
  const lastMileMilestones = (record.lastMile?.milestones ?? []).map((event, index) =>
    normalizeMilestone(event, "last_mile", index),
  );

  if (cargoMilestones.length === 0) {
    cargoMilestones.push(
      normalizeMilestone(
        { status: record.status, timestamp: record.statusTimestamp ?? record.lastUpdatedAt },
        "cargo",
        0,
      ),
    );
  }
  if (record.lastMile && lastMileMilestones.length === 0) {
    lastMileMilestones.push(
      normalizeMilestone(
        {
          status: record.lastMile.status,
          timestamp: record.lastMile.statusTimestamp ?? record.lastUpdatedAt,
        },
        "last_mile",
        0,
      ),
    );
  }

  const milestones = mergeMilestones(cargoMilestones, lastMileMilestones);
  const currentEvent = milestones.at(-1);
  const currentSource = currentEvent?.source ?? "cargo";
  const rawCurrentStatus =
    currentSource === "last_mile" && record.lastMile ? record.lastMile.status : record.status;
  const currentStatus = toPublicStatus(
    rawCurrentStatus,
    currentSource,
    currentEvent?.timestamp ?? lastUpdatedAt,
  );
  const lastMile = normalizeLastMile(record.lastMile, now);

  return {
    success: true,
    trackingNumber: requestedTrackingNumber,
    shipmentType: inferShipmentType(record),
    serviceType: normalizeServiceType(record.serviceType),
    currentStatus,
    origin: normalizePlace(record.origin),
    destination: normalizePlace(record.destination),
    milestones,
    lastMile,
    proofOfDelivery: currentStatus.category === "delivered" ? normalizeProof(record.proofOfDelivery, now) : null,
    lastUpdatedAt,
    dataFreshness: {
      label: "Last verified update",
      isLive: lastMile.locationAvailable,
    },
  };
}
