"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { RefObject } from "react";
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPin,
  PackageCheck,
  Route,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import type { PublicTrackingSuccess } from "@/lib/tracking/types";
import { cn } from "@/lib/utils";
import type { TrackingApiError } from "./tracking-api";

const LastMileMap = dynamic(() => import("./LastMileMap"), {
  ssr: false,
  loading: () => <div className="min-h-48 rounded-xl border border-alin-border bg-alin-black" aria-hidden />,
});

export type TrackingViewState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; error: TrackingApiError }
  | { kind: "success"; data: PublicTrackingSuccess };

const capabilities = [
  ["Current shipment status", PackageCheck],
  ["Branch and warehouse movement", Building2],
  ["Final delivery progress", Route],
  ["Latest verified update", Clock3],
  ["Proof of delivery when available", ShieldCheck],
] as const;

function formatDate(value: string | null) {
  if (!value) return "Time not supplied";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time not supplied";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function IdleState() {
  return (
    <div className="flex min-h-[34rem] flex-col justify-center p-6 sm:p-8 lg:p-10">
      <span className="flex size-11 items-center justify-center rounded-xl border border-alin-gold/30 bg-alin-gold/10 text-alin-gold">
        <Route className="size-5" aria-hidden />
      </span>
      <h2 className="mt-6 text-2xl font-black tracking-tight text-alin-white sm:text-3xl">
        Track every movement
      </h2>
      <p className="mt-3 max-w-lg leading-7 text-alin-muted">
        Enter a tracking number to view your shipment&apos;s latest verified activity.
      </p>
      <ol className="relative mt-8 space-y-0" aria-label="Tracking information available">
        {capabilities.map(([label, Icon], index) => (
          <li key={label} className="relative flex min-h-16 gap-4 pb-4 last:pb-0">
            {index < capabilities.length - 1 ? (
              <span className="absolute left-[0.6875rem] top-7 h-[calc(100%-0.25rem)] w-px bg-alin-border" aria-hidden />
            ) : null}
            <span className="relative z-10 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border border-alin-border bg-alin-near-black text-alin-muted">
              <Icon className="size-3" aria-hidden />
            </span>
            <span className="pt-1 text-sm font-semibold text-alin-muted">{label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-[34rem] p-6 sm:p-8 lg:p-10" aria-hidden="true">
      <div className="h-1 overflow-hidden rounded-full bg-alin-border">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-alin-gold" />
      </div>
      <div className="mt-10 h-4 w-32 rounded bg-alin-graphite" />
      <div className="mt-4 h-10 w-2/3 rounded bg-alin-graphite" />
      <div className="mt-4 h-5 w-full max-w-md rounded bg-alin-graphite" />
      <div className="mt-10 space-y-5">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="flex gap-4">
            <div className="size-7 shrink-0 rounded-full bg-alin-graphite" />
            <div className="flex-1">
              <div className="h-4 w-1/2 rounded bg-alin-graphite" />
              <div className="mt-3 h-3 w-4/5 rounded bg-alin-graphite" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState({
  error,
  headingRef,
  onRetry,
}: {
  error: TrackingApiError;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[34rem] flex-col justify-center p-6 sm:p-8 lg:p-10" role="alert">
      <span className="flex size-11 items-center justify-center rounded-xl bg-alin-danger/15 text-alin-danger">
        <AlertCircle className="size-5" aria-hidden />
      </span>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-alin-muted">
        Tracking update
      </p>
      <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-2xl font-black text-alin-white">
        We couldn&apos;t show this shipment
      </h2>
      <p className="mt-4 max-w-lg leading-7 text-alin-muted">{error.message}</p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={onRetry} className="rounded-xl">
          Try again
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/help">Get help</Link>
        </Button>
      </div>
    </div>
  );
}

function PlaceSummary({ data }: { data: PublicTrackingSuccess }) {
  if (!data.origin && !data.destination && !data.serviceType) return null;
  return (
    <dl className="mt-6 grid gap-3 sm:grid-cols-2">
      {data.origin ? (
        <div className="rounded-xl border border-alin-border bg-alin-black/40 p-4">
          <dt className="text-xs font-bold uppercase tracking-[0.14em] text-alin-muted">Origin</dt>
          <dd className="mt-2 font-bold text-alin-white">
            {data.origin.branchName || data.origin.city}
          </dd>
          {data.origin.branchName && data.origin.city ? (
            <dd className="mt-1 text-sm text-alin-muted">{data.origin.city}</dd>
          ) : null}
        </div>
      ) : null}
      {data.destination ? (
        <div className="rounded-xl border border-alin-border bg-alin-black/40 p-4">
          <dt className="text-xs font-bold uppercase tracking-[0.14em] text-alin-muted">Destination</dt>
          <dd className="mt-2 font-bold text-alin-white">
            {data.destination.branchName || data.destination.city}
          </dd>
          {data.destination.branchName && data.destination.city ? (
            <dd className="mt-1 text-sm text-alin-muted">{data.destination.city}</dd>
          ) : null}
        </div>
      ) : null}
      {data.serviceType ? (
        <div className="rounded-xl border border-alin-border bg-alin-black/40 p-4 sm:col-span-2">
          <dt className="text-xs font-bold uppercase tracking-[0.14em] text-alin-muted">Service</dt>
          <dd className="mt-2 font-bold text-alin-white">{data.serviceType}</dd>
        </div>
      ) : null}
    </dl>
  );
}

function ShipmentTimeline({ data }: { data: PublicTrackingSuccess }) {
  return (
    <section className="mt-8" aria-labelledby="shipment-timeline-heading">
      <h3 id="shipment-timeline-heading" className="text-sm font-black uppercase tracking-[0.16em] text-alin-white">
        Shipment journey
      </h3>
      <ol className="mt-5">
        {data.milestones.map((milestone, index) => (
          <li key={milestone.id} className="relative flex gap-4 pb-7 last:pb-0">
            {index < data.milestones.length - 1 ? (
              <span className="absolute left-[0.6875rem] top-6 h-[calc(100%-0.25rem)] w-0.5 bg-alin-gold" aria-hidden />
            ) : null}
            <span
              className={cn(
                "relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border",
                milestone.state === "current"
                  ? "border-alin-gold bg-alin-gold text-alin-black"
                  : "border-alin-gold bg-alin-near-black text-alin-gold",
              )}
              aria-label={milestone.state === "current" ? "Current milestone" : "Completed milestone"}
            >
              {milestone.state === "completed" ? <Check className="size-3.5" aria-hidden /> : <span className="size-2 rounded-full bg-alin-black" aria-hidden />}
            </span>
            <div className="min-w-0">
              {milestone.state === "completed" ? (
                <span className="sr-only">Completed milestone. </span>
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-bold text-alin-white">{milestone.label}</h4>
                {milestone.state === "current" ? (
                  <span className="rounded-full bg-alin-gold/15 px-2 py-0.5 text-xs font-bold text-alin-white">
                    Current
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm leading-6 text-alin-muted">{milestone.description}</p>
              <time className="mt-1 block text-xs text-alin-muted" dateTime={milestone.timestamp ?? undefined}>
                {formatDate(milestone.timestamp)}
              </time>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function LastMileDetails({ data }: { data: PublicTrackingSuccess }) {
  if (!data.lastMile.status) return null;
  const hasWindow = data.lastMile.estimatedArrivalStart || data.lastMile.estimatedArrivalEnd;
  return (
    <section className="mt-6 rounded-xl border border-alin-border bg-alin-black/40 p-4" aria-labelledby="last-mile-heading">
      <h3 id="last-mile-heading" className="text-xs font-black uppercase tracking-[0.14em] text-alin-muted">
        Final delivery
      </h3>
      <p className="mt-2 font-bold text-alin-white">{data.lastMile.status.label}</p>
      {data.lastMile.riderAssigned && data.lastMile.vehicleType ? (
        <p className="mt-2 text-sm text-alin-muted">Vehicle: {data.lastMile.vehicleType}</p>
      ) : null}
      {hasWindow ? (
        <p className="mt-2 text-sm text-alin-muted">
          Estimated window: {formatDate(data.lastMile.estimatedArrivalStart)}
          {data.lastMile.estimatedArrivalEnd
            ? ` – ${formatDate(data.lastMile.estimatedArrivalEnd)}`
            : ""}
        </p>
      ) : null}
    </section>
  );
}

function ProofOfDelivery({ data }: { data: PublicTrackingSuccess }) {
  if (!data.proofOfDelivery) return null;
  return (
    <section className="mt-8 rounded-xl border border-alin-success/35 bg-alin-success/10 p-5" aria-labelledby="proof-heading">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-alin-success" aria-hidden />
        <div>
          <h3 id="proof-heading" className="font-black text-alin-white">Delivery completed</h3>
          <p className="mt-2 text-sm text-alin-muted">
            Delivered {formatDate(data.proofOfDelivery.deliveredAt)}
            {data.proofOfDelivery.receivedBy ? ` · Received by ${data.proofOfDelivery.receivedBy}` : ""}
          </p>
          {data.proofOfDelivery.mediaUrl ? (
            <a
              href={data.proofOfDelivery.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              onClick={() => trackEvent("public_tracking_pod_opened")}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-alin-white/30 px-4 py-2 text-sm font-bold text-alin-white hover:bg-alin-white/10"
            >
              View proof of delivery <ExternalLink className="size-4" aria-hidden />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function SuccessState({
  data,
  headingRef,
}: {
  data: PublicTrackingSuccess;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const location = data.lastMile.location;
  return (
    <div className="min-h-[34rem] p-6 sm:p-8 lg:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-alin-gold">Verified shipment</p>
          <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-2xl font-black tracking-tight text-alin-white sm:text-3xl">
            {data.currentStatus.label}
          </h2>
          <p className="mt-3 max-w-xl leading-7 text-alin-muted">{data.currentStatus.description}</p>
        </div>
        <span
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-black",
            data.currentStatus.semanticColor === "success"
              ? "border-alin-success/40 bg-alin-success/15 text-alin-white"
              : data.currentStatus.semanticColor === "danger"
                ? "border-alin-danger/40 bg-alin-danger/15 text-alin-white"
                : data.currentStatus.semanticColor === "warning"
                  ? "border-alin-warning/40 bg-alin-warning/15 text-alin-white"
                  : "border-alin-gold/40 bg-alin-gold/15 text-alin-white",
          )}
        >
          {data.currentStatus.label}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-alin-border py-4 text-sm text-alin-muted">
        <span className="font-mono font-bold text-alin-white">{data.trackingNumber}</span>
        <span>{data.dataFreshness.label}: {formatDate(data.lastUpdatedAt)}</span>
        {data.dataFreshness.isLive ? <span className="font-bold text-alin-white">Location is current</span> : null}
      </div>

      <PlaceSummary data={data} />
      <LastMileDetails data={data} />

      {data.currentStatus.code === "ARRIVED_AT_DESTINATION_BRANCH" &&
      !data.lastMile.status ? (
        <p className="mt-6 rounded-xl border border-alin-border bg-alin-black/40 p-4 text-sm leading-6 text-alin-muted">
          The next verified movement will appear here when it is reported.
        </p>
      ) : null}

      {data.lastMile.locationAvailable && location && data.lastMile.locationUpdatedAt ? (
        <section className="mt-8" aria-labelledby="rider-location-heading">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="size-5 text-alin-gold" aria-hidden />
            <h3 id="rider-location-heading" className="font-black text-alin-white">Latest rider location</h3>
          </div>
          <LastMileMap
            latitude={location.latitude}
            longitude={location.longitude}
            updatedAt={data.lastMile.locationUpdatedAt}
          />
        </section>
      ) : data.lastMile.locationFreshness === "recent" ? (
        <p className="mt-6 rounded-xl border border-alin-border bg-alin-black/40 p-4 text-sm text-alin-muted">
          The rider location was updated recently, but is not current enough to show on the map.
          The current delivery stage remains available below.
        </p>
      ) : data.lastMile.locationFreshness === "delayed" ? (
        <p className="mt-6 rounded-xl border border-alin-border bg-alin-black/40 p-4 text-sm text-alin-muted">
          Rider location update is delayed. The current delivery stage remains available below.
        </p>
      ) : null}

      <ShipmentTimeline data={data} />
      <ProofOfDelivery data={data} />

      {(data.currentStatus.category === "delivered" || data.currentStatus.category === "exception") ? (
        <Link
          href="/help"
          onClick={() => trackEvent("public_tracking_help_opened", { surface: "tracking_result" })}
          className="mt-7 inline-flex min-h-11 items-center text-sm font-bold text-alin-white underline decoration-alin-gold underline-offset-4"
        >
          {data.currentStatus.category === "delivered" ? "Report a delivery issue" : "Get help with this delivery"}
        </Link>
      ) : null}
    </div>
  );
}

export function TrackingResultPanel({
  state,
  headingRef,
  onRetry,
}: {
  state: TrackingViewState;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onRetry: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-alin-border bg-alin-near-black shadow-[0_30px_90px_-70px_rgba(255,192,0,0.75)]">
      {state.kind === "idle" ? <IdleState /> : null}
      {state.kind === "loading" ? <LoadingState /> : null}
      {state.kind === "error" ? (
        <ErrorState error={state.error} headingRef={headingRef} onRetry={onRetry} />
      ) : null}
      {state.kind === "success" ? <SuccessState data={state.data} headingRef={headingRef} /> : null}
    </div>
  );
}
