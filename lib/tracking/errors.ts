import type { PublicTrackingErrorCode } from "./types";

export const TRACKING_ERROR_MESSAGES: Record<PublicTrackingErrorCode, string> = {
  INVALID_TRACKING_NUMBER:
    "That tracking number does not look complete. Check the number and try again.",
  TRACKING_NOT_FOUND: "We could not find a shipment using that tracking number.",
  RATE_LIMITED: "Too many tracking attempts. Please wait before trying again.",
  TRACKING_PROVIDER_UNAVAILABLE:
    "Tracking is temporarily unavailable. Please try again shortly.",
  TRACKING_TIMEOUT: "The tracking request took too long. Please try again.",
  TRACKING_RESPONSE_INVALID: "We could not load this shipment right now.",
  INTERNAL_ERROR: "We could not load this shipment right now.",
};

export class TrackingError extends Error {
  constructor(
    public readonly code: PublicTrackingErrorCode,
    public readonly status: number,
    options?: { cause?: unknown },
  ) {
    super(TRACKING_ERROR_MESSAGES[code], options);
    this.name = "TrackingError";
  }
}

