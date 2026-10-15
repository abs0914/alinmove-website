"use client";

import { MapPin } from "lucide-react";

export default function LastMileMap({
  latitude,
  longitude,
  updatedAt,
}: {
  latitude: number;
  longitude: number;
  updatedAt: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;
  const updatedLabel = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(updatedAt));

  if (!apiKey) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-xl border border-alin-border bg-alin-black p-6 text-center">
        <div>
          <MapPin className="mx-auto size-6 text-alin-gold" aria-hidden />
          <p className="mt-3 font-bold text-alin-white">Verified rider location received</p>
          <p className="mt-2 text-sm text-alin-muted">
            Last location update: {updatedLabel}. The map provider is not available on this site.
          </p>
        </div>
      </div>
    );
  }

  const mapUrl = new URL("https://www.google.com/maps/embed/v1/place");
  mapUrl.searchParams.set("key", apiKey);
  mapUrl.searchParams.set("q", `${latitude},${longitude}`);
  mapUrl.searchParams.set("zoom", "15");

  return (
    <div>
      <div className="aspect-[4/3] overflow-hidden rounded-xl border border-alin-border bg-alin-black sm:aspect-[16/9]">
        <iframe
          className="h-full w-full border-0"
          src={mapUrl.toString()}
          title="Latest verified rider location"
          loading="lazy"
          referrerPolicy="no-referrer"
          allowFullScreen={false}
        />
      </div>
      <p className="mt-3 text-sm text-alin-muted">Latest location update: {updatedLabel}</p>
    </div>
  );
}
