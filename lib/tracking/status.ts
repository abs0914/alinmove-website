import type { PublicTrackingStatus, TrackingSource } from "./types";

type StatusDefinition = Omit<PublicTrackingStatus, "timestamp" | "description"> & {
  description: string;
  milestoneCategory: string;
  active: boolean;
  mapEligible: boolean;
  proofEligible: boolean;
};

const cargoStatuses: Record<string, StatusDefinition> = {
  draft: status("BOOKING_BEING_PREPARED", "Booking being prepared", "Your booking is being prepared.", "booking", "pending"),
  awaitingconfirmation: status("AWAITING_CONFIRMATION", "Awaiting shipment confirmation", "The shipment is waiting for confirmation.", "confirmation", "pending"),
  confirmed: status("SHIPMENT_CONFIRMED", "Shipment confirmed", "The shipment has been confirmed.", "confirmation", "pending"),
  processed: status("SHIPMENT_RECEIVED", "Shipment received", "The shipment was accepted by ALiN Cargo.", "received", "at_branch"),
  intransit: status("IN_TRANSIT", "In transit", "The shipment is moving through the ALiN network.", "linehaul", "moving", { active: true }),
  arrived: status("ARRIVED_AT_DESTINATION_BRANCH", "Arrived at destination branch", "The shipment arrived at its destination branch.", "destination-branch", "at_branch"),
  delivered: status("DELIVERED", "Delivered", "The shipment has been delivered.", "delivered", "delivered", { terminal: true, proofEligible: true }),
  cancelled: status("CANCELLED", "Shipment cancelled", "The shipment was cancelled.", "cancelled", "cancelled", { terminal: true }),
};

const lastMileStatuses: Record<string, StatusDefinition> = {
  pending: status("PREPARING_RIDER_ASSIGNMENT", "Preparing rider assignment", "The package is being prepared for final delivery.", "final-delivery", "pending"),
  accepted: status("RIDER_ASSIGNED", "Rider assigned", "A rider has been assigned to the delivery.", "rider-assigned", "out_for_delivery", { active: true }),
  en_route_pickup: status("EN_ROUTE_TO_PICKUP", "Rider heading to pickup", "The rider is heading to the pickup location.", "rider-pickup", "out_for_delivery", { active: true, mapEligible: true }),
  at_pickup: status("AT_PICKUP", "Rider arrived at pickup", "The rider has arrived at the pickup location.", "rider-pickup", "out_for_delivery", { active: true, mapEligible: true }),
  picked_up: status("PICKED_UP", "Package picked up", "The rider confirmed pickup of the package.", "picked-up", "out_for_delivery", { active: true, mapEligible: true }),
  in_transit: status("OUT_FOR_DELIVERY", "Out for delivery", "The package is moving to its final destination.", "out-for-delivery", "out_for_delivery", { active: true, mapEligible: true }),
  at_dropoff: status("AT_DROPOFF", "Rider has arrived", "The rider has arrived in the delivery area.", "dropoff", "out_for_delivery", { active: true, mapEligible: true }),
  delivered_to_branch: status("DELIVERED_TO_BRANCH", "Delivered to ALiN branch", "The package was delivered to an ALiN branch.", "destination-branch", "at_branch"),
  delivered: status("DELIVERED", "Delivered", "The package has been delivered.", "delivered", "delivered", { terminal: true, proofEligible: true }),
  failed: status("DELIVERY_ATTEMPT_UNSUCCESSFUL", "Delivery attempt unsuccessful", "The latest delivery attempt was unsuccessful.", "exception", "exception", { terminal: false }),
  cancelled: status("CANCELLED", "Shipment cancelled", "The shipment was cancelled.", "cancelled", "cancelled", { terminal: true }),
  returned: status("RETURNING", "Returning to sender or branch", "The package is being returned to the sender or an ALiN branch.", "returning", "exception", { active: true }),
};

function status(
  code: string,
  label: string,
  description: string,
  milestoneCategory: string,
  category: PublicTrackingStatus["category"],
  flags: Partial<Pick<StatusDefinition, "active" | "terminal" | "mapEligible" | "proofEligible">> = {},
): StatusDefinition {
  return {
    code,
    label,
    description,
    milestoneCategory,
    category,
    semanticColor:
      category === "delivered"
        ? "success"
        : category === "exception"
          ? "warning"
          : category === "cancelled"
            ? "danger"
            : category === "moving" || category === "out_for_delivery"
              ? "info"
              : "neutral",
    active: flags.active ?? false,
    terminal: flags.terminal ?? false,
    mapEligible: flags.mapEligible ?? false,
    proofEligible: flags.proofEligible ?? false,
  };
}

function statusKey(rawStatus: string) {
  return rawStatus.trim().replace(/[\s-]+/g, "_").toLowerCase();
}

export function getStatusDefinition(rawStatus: string, source: TrackingSource): StatusDefinition {
  const key = statusKey(rawStatus);
  const compactKey = key.replaceAll("_", "");
  const match = source === "cargo" ? cargoStatuses[key] ?? cargoStatuses[compactKey] : lastMileStatuses[key];
  return (
    match ??
    status(
      "UPDATE_RECEIVED",
      "Shipment update received",
      "A verified shipment update was received.",
      `unknown-${source}`,
      "pending",
    )
  );
}

export function toPublicStatus(
  rawStatus: string,
  source: TrackingSource,
  timestamp: string | null,
  description?: string | null,
): PublicTrackingStatus {
  const definition = getStatusDefinition(rawStatus, source);
  return {
    code: definition.code,
    label: definition.label,
    description: sanitizePublicText(description) || definition.description,
    timestamp,
    category: definition.category,
    semanticColor: definition.semanticColor,
    terminal: definition.terminal,
  };
}

export function sanitizePublicText(value: string | null | undefined, maxLength = 240) {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export type { StatusDefinition };

