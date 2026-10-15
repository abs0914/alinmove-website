import type {
  PublicTrackingErrorCode,
  PublicTrackingFailure,
  PublicTrackingSuccess,
} from "@/lib/tracking/types";

export class TrackingApiError extends Error {
  constructor(public readonly code: PublicTrackingErrorCode, message: string) {
    super(message);
    this.name = "TrackingApiError";
  }
}

export async function getPublicTracking(
  trackingNumber: string,
  signal?: AbortSignal,
): Promise<PublicTrackingSuccess> {
  let response: Response;
  try {
    response = await fetch(`/api/public/tracking/${encodeURIComponent(trackingNumber)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal,
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") throw cause;
    throw new TrackingApiError(
      "TRACKING_PROVIDER_UNAVAILABLE",
      "Tracking is temporarily unavailable. Please try again shortly.",
    );
  }

  const body = (await response.json().catch(() => null)) as
    | PublicTrackingSuccess
    | PublicTrackingFailure
    | null;
  if (!response.ok || !body || !body.success) {
    const fallback: PublicTrackingFailure["error"] = {
      code: "INTERNAL_ERROR",
      message: "We could not load this shipment right now.",
    };
    const error = body && !body.success ? body.error : fallback;
    throw new TrackingApiError(error.code, error.message);
  }
  return body;
}

