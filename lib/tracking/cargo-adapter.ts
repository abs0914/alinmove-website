import { TrackingError } from "./errors";
import { normalizeTrackingRecord, parseUpstreamTrackingRecord } from "./normalizer";
import type { PublicTrackingSuccess } from "./types";

function positiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function trackingEndpoint(trackingNumber: string) {
  const baseUrl = process.env.ALIN_CARGO_API_BASE_URL;
  const pathTemplate = process.env.ALIN_CARGO_TRACKING_PATH;
  if (
    !baseUrl ||
    !pathTemplate ||
    pathTemplate.split("{trackingNumber}").length !== 2
  ) {
    throw new TrackingError("TRACKING_PROVIDER_UNAVAILABLE", 503);
  }
  try {
    const base = new URL(baseUrl);
    if (base.protocol !== "https:" && process.env.NODE_ENV === "production") {
      throw new Error("Cargo tracking requires HTTPS in production");
    }
    const path = pathTemplate.replace("{trackingNumber}", encodeURIComponent(trackingNumber));
    const endpoint = new URL(path, base);
    if (endpoint.origin !== base.origin) {
      throw new Error("Cargo tracking path must remain on the configured origin");
    }
    return endpoint.toString();
  } catch (cause) {
    throw new TrackingError("TRACKING_PROVIDER_UNAVAILABLE", 503, { cause });
  }
}

function upstreamHeaders() {
  const headers = new Headers({ Accept: "application/json" });
  const apiKey = process.env.ALIN_CARGO_API_KEY;
  if (apiKey) {
    const headerName = process.env.ALIN_CARGO_AUTH_HEADER || "Authorization";
    const scheme = process.env.ALIN_CARGO_AUTH_SCHEME ?? "Bearer";
    headers.set(headerName, scheme ? `${scheme} ${apiKey}` : apiKey);
  }
  return headers;
}

export async function fetchCargoTracking(
  trackingNumber: string,
  options: { fetchImpl?: typeof fetch; now?: Date } = {},
): Promise<PublicTrackingSuccess> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = positiveNumber(process.env.ALIN_CARGO_API_TIMEOUT_MS, 6_000);
  let response: Response;

  try {
    response = await fetchImpl(trackingEndpoint(trackingNumber), {
      method: "GET",
      headers: upstreamHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (cause) {
    if (cause instanceof TrackingError) throw cause;
    if (cause instanceof Error && (cause.name === "TimeoutError" || cause.name === "AbortError")) {
      throw new TrackingError("TRACKING_TIMEOUT", 503, { cause });
    }
    throw new TrackingError("TRACKING_PROVIDER_UNAVAILABLE", 503, { cause });
  }

  if (response.status === 404) throw new TrackingError("TRACKING_NOT_FOUND", 404);
  if (response.status === 408 || response.status === 504) {
    throw new TrackingError("TRACKING_TIMEOUT", 503);
  }
  if (!response.ok) throw new TrackingError("TRACKING_PROVIDER_UNAVAILABLE", 503);

  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 256_000) {
    throw new TrackingError("TRACKING_RESPONSE_INVALID", 502);
  }

  let body: unknown;
  try {
    const rawBody = await response.text();
    if (rawBody.length > 256_000) {
      throw new TrackingError("TRACKING_RESPONSE_INVALID", 502);
    }
    body = JSON.parse(rawBody) as unknown;
  } catch (cause) {
    if (cause instanceof TrackingError) throw cause;
    throw new TrackingError("TRACKING_RESPONSE_INVALID", 502, { cause });
  }

  return normalizeTrackingRecord(parseUpstreamTrackingRecord(body), trackingNumber, options.now);
}
