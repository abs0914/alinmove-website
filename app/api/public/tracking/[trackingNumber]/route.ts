import crypto from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { fetchCargoTracking } from "@/lib/tracking/cargo-adapter";
import { TrackingError, TRACKING_ERROR_MESSAGES } from "@/lib/tracking/errors";
import { checkPublicTrackingRateLimit } from "@/lib/tracking/rate-limit";
import type { PublicTrackingFailure } from "@/lib/tracking/types";
import { validateTrackingNumber } from "@/lib/tracking/validation";

export const dynamic = "force-dynamic";

function requestIp(request: NextRequest) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function rateLimitKey(request: NextRequest) {
  return crypto.createHash("sha256").update(requestIp(request)).digest("hex");
}

function correlationId(request: NextRequest) {
  const supplied = request.headers.get("x-request-id");
  return supplied && /^[A-Za-z0-9._-]{8,80}$/.test(supplied) ? supplied : crypto.randomUUID();
}

function responseHeaders(requestId: string, rateLimit?: ReturnType<typeof checkPublicTrackingRateLimit>) {
  return {
    "Cache-Control": "private, no-store, max-age=0",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Request-ID": requestId,
    ...(rateLimit
      ? {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
        }
      : {}),
  };
}

function errorResponse(
  error: TrackingError,
  requestId: string,
  rateLimit?: ReturnType<typeof checkPublicTrackingRateLimit>,
) {
  const body: PublicTrackingFailure = {
    success: false,
    error: { code: error.code, message: TRACKING_ERROR_MESSAGES[error.code] },
  };
  return NextResponse.json(body, {
    status: error.status,
    headers: {
      ...responseHeaders(requestId, rateLimit),
      ...(error.code === "RATE_LIMITED" && rateLimit
        ? { "Retry-After": String(Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000))) }
        : {}),
    },
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ trackingNumber: string }> },
) {
  const startedAt = performance.now();
  const requestId = correlationId(request);
  const rateLimit = checkPublicTrackingRateLimit(rateLimitKey(request));

  if (!rateLimit.allowed) {
    return errorResponse(new TrackingError("RATE_LIMITED", 429), requestId, rateLimit);
  }

  const { trackingNumber: rawTrackingNumber } = await context.params;
  const parsed = validateTrackingNumber(rawTrackingNumber);
  if (!parsed.success) {
    return errorResponse(new TrackingError("INVALID_TRACKING_NUMBER", 400), requestId, rateLimit);
  }

  try {
    const result = await fetchCargoTracking(parsed.data);
    // Operational metadata only: never log the tracking number or upstream payload.
    // eslint-disable-next-line no-console
    console.info("[public-tracking] request complete", {
      requestId,
      result: "success",
      source: "upstream",
      durationMs: Math.round(performance.now() - startedAt),
      timeout: false,
      mappingFailure: false,
    });
    return NextResponse.json(result, {
      status: 200,
      headers: responseHeaders(requestId, rateLimit),
    });
  } catch (cause) {
    const error =
      cause instanceof TrackingError ? cause : new TrackingError("INTERNAL_ERROR", 500, { cause });
    // eslint-disable-next-line no-console
    console.warn("[public-tracking] request failed", {
      requestId,
      result: error.code,
      source: "upstream",
      durationMs: Math.round(performance.now() - startedAt),
      timeout: error.code === "TRACKING_TIMEOUT",
      mappingFailure: error.code === "TRACKING_RESPONSE_INVALID",
    });
    return errorResponse(error, requestId, rateLimit);
  }
}
