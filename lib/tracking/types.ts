export type TrackingSource = "cargo" | "last_mile";

export type ShipmentType = "cargo" | "last_mile" | "combined" | "unknown";

export type MilestoneState = "completed" | "current";

export interface PublicTrackingStatus {
  code: string;
  label: string;
  description: string;
  timestamp: string | null;
  category:
    | "pending"
    | "moving"
    | "at_branch"
    | "out_for_delivery"
    | "delivered"
    | "exception"
    | "cancelled";
  semanticColor: "neutral" | "info" | "success" | "warning" | "danger";
  terminal: boolean;
}

export interface PublicShipmentMilestone {
  id: string;
  code: string;
  label: string;
  description: string;
  timestamp: string | null;
  state: MilestoneState;
  source: TrackingSource;
}

export interface PublicShipmentPlace {
  branchName: string | null;
  city: string | null;
}

export interface PublicLastMile {
  active: boolean;
  status: Pick<PublicTrackingStatus, "code" | "label"> | null;
  riderAssigned: boolean;
  vehicleType: string | null;
  locationAvailable: boolean;
  locationFreshness: "unavailable" | "fresh" | "recent" | "delayed";
  location: { latitude: number; longitude: number } | null;
  locationUpdatedAt: string | null;
  estimatedArrivalStart: string | null;
  estimatedArrivalEnd: string | null;
}

export interface PublicProofOfDelivery {
  deliveredAt: string;
  receivedBy: string | null;
  mediaUrl: string | null;
  mediaExpiresAt: string | null;
}

export interface PublicTrackingSuccess {
  success: true;
  trackingNumber: string;
  shipmentType: ShipmentType;
  serviceType: string | null;
  currentStatus: PublicTrackingStatus;
  origin: PublicShipmentPlace | null;
  destination: PublicShipmentPlace | null;
  milestones: PublicShipmentMilestone[];
  lastMile: PublicLastMile;
  proofOfDelivery: PublicProofOfDelivery | null;
  lastUpdatedAt: string;
  dataFreshness: {
    label: "Last verified update";
    isLive: boolean;
  };
}

export type PublicTrackingErrorCode =
  | "INVALID_TRACKING_NUMBER"
  | "TRACKING_NOT_FOUND"
  | "RATE_LIMITED"
  | "TRACKING_PROVIDER_UNAVAILABLE"
  | "TRACKING_TIMEOUT"
  | "TRACKING_RESPONSE_INVALID"
  | "INTERNAL_ERROR";

export interface PublicTrackingFailure {
  success: false;
  error: {
    code: PublicTrackingErrorCode;
    message: string;
  };
}

export type PublicTrackingResponse = PublicTrackingSuccess | PublicTrackingFailure;
