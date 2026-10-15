"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { ArrowRight, Headphones, Search, X } from "lucide-react";
import { DownloadCustomerAppButton } from "@/components/brand/DownloadCustomerAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";
import { hasValidTrackingNumberFormat } from "@/lib/tracking/format";
import { TrackingApiError, getPublicTracking } from "./tracking-api";
import { TrackingResultPanel, type TrackingViewState } from "./TrackingResultPanel";

const INVALID_MESSAGE =
  "That tracking number does not look complete. Check the number and try again.";

export function TrackExperience() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<TrackingViewState>({ kind: "idle" });
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusResultRef = useRef(false);
  const activeRequestRef = useRef<{ id: number; controller: AbortController } | null>(null);
  const requestSequenceRef = useRef(0);
  const initializedFromUrlRef = useRef(false);

  const search = useCallback(async (rawValue: string, options = { updateUrl: true, focus: true }) => {
    const trackingNumber = rawValue.trim();
    if (!hasValidTrackingNumberFormat(trackingNumber)) {
      const error = new TrackingApiError("INVALID_TRACKING_NUMBER", INVALID_MESSAGE);
      shouldFocusResultRef.current = options.focus;
      setState({ kind: "error", error });
      trackEvent("public_tracking_invalid", { source: options.updateUrl ? "form" : "deep_link" });
      return;
    }

    activeRequestRef.current?.controller.abort();
    const controller = new AbortController();
    const id = ++requestSequenceRef.current;
    activeRequestRef.current = { id, controller };
    shouldFocusResultRef.current = options.focus;
    setState({ kind: "loading" });
    trackEvent("public_tracking_submit", { source: options.updateUrl ? "form" : "deep_link" });

    if (options.updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("tracking", trackingNumber);
      window.history.replaceState({}, "", url);
    }

    try {
      const data = await getPublicTracking(trackingNumber, controller.signal);
      if (activeRequestRef.current?.id !== id) return;
      setState({ kind: "success", data });
      trackEvent("public_tracking_success", {
        shipment_type: data.shipmentType,
        has_last_mile: Boolean(data.lastMile.status),
        has_pod: Boolean(data.proofOfDelivery?.mediaUrl),
      });
    } catch (cause) {
      if (controller.signal.aborted || activeRequestRef.current?.id !== id) return;
      const error =
        cause instanceof TrackingApiError
          ? cause
          : new TrackingApiError("INTERNAL_ERROR", "We could not load this shipment right now.");
      setState({ kind: "error", error });
      if (error.code === "TRACKING_NOT_FOUND") {
        trackEvent("public_tracking_not_found");
      } else {
        trackEvent("public_tracking_provider_error", { error_category: error.code });
      }
    }
  }, []);

  useEffect(() => {
    if (
      shouldFocusResultRef.current &&
      (state.kind === "success" || state.kind === "error")
    ) {
      resultHeadingRef.current?.focus();
      shouldFocusResultRef.current = false;
    }
  }, [state]);

  useEffect(() => {
    if (initializedFromUrlRef.current) return;
    initializedFromUrlRef.current = true;
    const tracking = new URLSearchParams(window.location.search).get("tracking");
    if (tracking) {
      setQuery(tracking);
      void search(tracking, { updateUrl: false, focus: false });
    }
  }, [search]);

  useEffect(() => () => activeRequestRef.current?.controller.abort(), []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.kind === "loading") return;
    void search(query);
  }

  function clearQuery() {
    activeRequestRef.current?.controller.abort();
    setQuery("");
    setState({ kind: "idle" });
    const url = new URL(window.location.href);
    url.searchParams.delete("tracking");
    window.history.replaceState({}, "", url);
    document.getElementById("tracking-number")?.focus();
  }

  const inputInvalid = state.kind === "error" && state.error.code === "INVALID_TRACKING_NUMBER";
  const describedBy = inputInvalid ? "tracking-helper tracking-error" : "tracking-helper";
  const submitDisabled = state.kind === "loading" || query.trim().length === 0;

  return (
    <div className="relative isolate overflow-hidden bg-alin-black">
      <div
        className="pointer-events-none absolute left-[8%] top-12 -z-10 h-64 w-64 rounded-full bg-alin-gold/10 blur-3xl"
        aria-hidden
      />
      <section className="container-page py-12 sm:py-16 lg:py-20" aria-labelledby="track-page-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-alin-gold">
              Track a package
            </p>
            <h1
              id="track-page-heading"
              className="mt-4 max-w-xl text-[2.625rem] font-black leading-[1.03] tracking-[-0.035em] text-alin-white sm:text-5xl lg:text-5xl xl:text-6xl"
            >
              Where is your package?
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-alin-muted">
              See every verified branch movement, shipment update and final delivery milestone in
              one place.
            </p>

            <form onSubmit={onSubmit} className="mt-8" noValidate>
              <label htmlFor="tracking-number" className="text-sm font-bold text-alin-white">
                Tracking number
              </label>
              <div className="relative mt-2">
                <Input
                  id="tracking-number"
                  name="tracking-number"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    if (state.kind === "error") setState({ kind: "idle" });
                  }}
                  placeholder="Enter your ALiN tracking number"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  maxLength={64}
                  aria-describedby={describedBy}
                  aria-invalid={inputInvalid || undefined}
                  className="h-14 rounded-xl bg-alin-near-black pr-12 text-base"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={clearQuery}
                    className="absolute right-1.5 top-1.5 flex size-11 items-center justify-center rounded-lg text-alin-muted hover:bg-alin-white/10 hover:text-alin-white"
                    aria-label="Clear tracking number"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                ) : null}
              </div>
              <p id="tracking-helper" className="mt-3 text-sm leading-6 text-alin-muted">
                Find your tracking number on your receipt, parcel label or booking confirmation.
              </p>
              {inputInvalid ? (
                <p id="tracking-error" className="mt-2 text-sm font-semibold text-alin-danger">
                  {state.error.message}
                </p>
              ) : null}
              <Button
                type="submit"
                size="lg"
                disabled={submitDisabled}
                className="mt-5 h-14 w-full rounded-xl text-base sm:w-auto"
              >
                <Search aria-hidden />
                {state.kind === "loading" ? "Finding your package…" : "Track package"}
              </Button>
              <p className="sr-only" aria-live="polite" aria-atomic="true">
                {state.kind === "loading"
                  ? "Finding your package."
                  : state.kind === "success"
                    ? `Shipment found. Current status: ${state.data.currentStatus.label}.`
                    : state.kind === "error"
                      ? state.error.message
                      : ""}
              </p>
            </form>

            <div className="mt-7 flex flex-col items-start gap-4 text-sm">
              <Link
                href="/help"
                onClick={() => trackEvent("public_tracking_help_opened", { surface: "tracking_form" })}
                className="inline-flex min-h-11 items-center gap-2 font-bold text-alin-white underline decoration-alin-gold underline-offset-4"
              >
                <Headphones className="size-4" aria-hidden />
                Can&apos;t find your tracking number? Get help
              </Link>
              <DownloadCustomerAppButton
                variant="ghost"
                size="sm"
                label="Download the ALiN Move app"
                className="-ml-4 rounded-xl"
              />
            </div>

            <div className="mt-9 flex items-center gap-3 border-t border-alin-border pt-6 text-sm text-alin-muted">
              <span className="h-px w-8 bg-alin-gold" aria-hidden />
              Connected via ALiN Cargo Express
              <ArrowRight className="size-4 text-alin-gold" aria-hidden />
            </div>
          </div>

          <div className="lg:col-span-7" aria-busy={state.kind === "loading"}>
            <TrackingResultPanel
              state={state}
              headingRef={resultHeadingRef}
              onRetry={() => void search(query)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
