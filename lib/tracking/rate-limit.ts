type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function checkPublicTrackingRateLimit(key: string, now = Date.now()) {
  const limit = positiveInteger(process.env.PUBLIC_TRACKING_RATE_LIMIT_MAX, 20);
  const windowMs = positiveInteger(process.env.PUBLIC_TRACKING_RATE_LIMIT_WINDOW_MS, 60_000);
  const previous = buckets.get(key);
  const bucket = !previous || previous.resetAt <= now ? { count: 0, resetAt: now + windowMs } : previous;
  bucket.count += 1;
  buckets.set(key, bucket);

  if (buckets.size > 10_000) {
    for (const [bucketKey, value] of buckets) {
      if (value.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  return {
    allowed: bucket.count <= limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
  };
}

export function resetPublicTrackingRateLimitForTests() {
  buckets.clear();
}

