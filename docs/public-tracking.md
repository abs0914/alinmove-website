# Public package tracking

The canonical customer page is `/tracking`; the former `/track` route permanently redirects to it.
Supported deep links use `/tracking?tracking=<tracking-number>`.

The website exposes one read-only endpoint:

`GET /api/public/tracking/:trackingNumber`

The browser calls this ALiN Move route. Only the server calls ALiN Cargo. Responses use
`Cache-Control: private, no-store`, validate the tracking-number format, rate-limit by a hashed IP
bucket, and never forward raw upstream data or upstream errors.

## Deployment configuration

- `ALIN_CARGO_API_BASE_URL`: HTTPS origin for the Cargo API.
- `ALIN_CARGO_TRACKING_PATH`: path containing exactly one `{trackingNumber}` placeholder.
- `ALIN_CARGO_API_KEY`: server-only upstream credential, when required.
- `ALIN_CARGO_AUTH_HEADER`: credential header; defaults to `Authorization`.
- `ALIN_CARGO_AUTH_SCHEME`: credential prefix; defaults to `Bearer`. Set an empty value when the
  upstream expects the key without a prefix.
- `ALIN_CARGO_API_TIMEOUT_MS`: strict upstream timeout; defaults to 6000 ms.
- `PUBLIC_TRACKING_RATE_LIMIT_MAX`: attempts per process/window; defaults to 20.
- `PUBLIC_TRACKING_RATE_LIMIT_WINDOW_MS`: rate-limit window; defaults to 60000 ms.
- `PUBLIC_TRACKING_LOCATION_FRESHNESS_SECONDS`: maximum rider-location age for map eligibility;
  defaults to 120 seconds.
- `PUBLIC_TRACKING_LOCATION_RECENT_SECONDS`: separates a recent-but-not-live location from a
  delayed location; defaults to 900 seconds.
- `ALIN_CARGO_PUBLIC_POD_ENABLED`: defaults to `false`. Enable only after privacy approval.
- `ALIN_CARGO_PUBLIC_RECIPIENT_ENABLED`: defaults to `false`. When approved, recipient names are
  reduced to initials plus masking characters before being returned.
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY`: optional browser-restricted Maps Embed key. When absent,
  fresh verified location is described textually and the map provider is not loaded.

The in-memory limiter matches the repository's single-process deployment convention. A horizontally
scaled deployment must replace it with a shared rate-limit store before traffic is distributed.

## Adapter contract

No ALiN Cargo tracking API contract exists in this checkout. The adapter therefore validates a
minimal boundary and fails closed with `TRACKING_RESPONSE_INVALID` when the response differs. Before
enabling production traffic, confirm the actual endpoint, authentication method, status semantics,
and payload mapping with the Cargo service owner.

The accepted upstream JSON is either the object below or `{ "data": <object> }`:

```json
{
  "trackingNumber": "optional canonical display value",
  "shipmentType": "cargo | last_mile | combined | unknown",
  "serviceType": "branch_to_branch | branch_to_door | door_to_branch | door_to_door | cargo",
  "status": "required Cargo status",
  "statusTimestamp": "ISO-8601 timestamp",
  "origin": { "branchName": "optional", "city": "optional" },
  "destination": { "branchName": "optional", "city": "optional" },
  "milestones": [
    { "status": "required Cargo status", "timestamp": "ISO-8601 timestamp" }
  ],
  "lastMile": {
    "status": "required last-mile status",
    "statusTimestamp": "ISO-8601 timestamp",
    "riderAssigned": true,
    "vehicleType": "optional",
    "location": { "latitude": 0, "longitude": 0 },
    "locationUpdatedAt": "ISO-8601 timestamp",
    "estimatedArrivalStart": "optional ISO-8601 timestamp",
    "estimatedArrivalEnd": "optional ISO-8601 timestamp",
    "milestones": [
      { "status": "required last-mile status", "timestamp": "ISO-8601 timestamp" }
    ]
  },
  "proofOfDelivery": {
    "deliveredAt": "ISO-8601 timestamp",
    "receivedBy": "optional name; masked by the serializer",
    "mediaUrl": "optional expiring HTTPS URL",
    "mediaExpiresAt": "required future ISO-8601 timestamp when mediaUrl is supplied"
  },
  "lastUpdatedAt": "required ISO-8601 timestamp"
}
```

Unknown fields are stripped. Upstream free-text event descriptions are not exposed. Unknown statuses
become the safe customer-facing label “Shipment update received” and never expose internal codes.
The endpoint returns only branch/city-level places, never sender/recipient phones, residential
addresses, rider identity/contact information, internal IDs, notes, financial data, or raw payloads.

## Source precedence

This repository contains no `cargo_bookings` or `delivery_jobs` store. The current source is live
upstream Cargo data, including an optional linked `lastMile` projection supplied by that server. If a
local synchronized store is added later, its conflict and freshness rules must be defined before it
is merged into this adapter.

## Production checklist

1. Confirm the real path and auth mechanism; set server-only environment values.
2. Adapt `lib/tracking/normalizer.ts` to the confirmed upstream schema and add a captured redacted
   contract fixture.
3. Confirm Cargo/last-mile status business semantics with operations.
4. Decide whether distributed rate limiting is required for the deployment topology.
5. Approve rider-location visibility and restrict the Google key by domain and API.
6. Approve a POD verification policy before setting `ALIN_CARGO_PUBLIC_POD_ENABLED=true`.
7. Run unit/component tests, typecheck, lint, and a production build.
