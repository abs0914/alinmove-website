"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { BranchSummary } from "@/lib/branches";

const PHILIPPINES_CENTER: L.LatLngExpression = [12.4, 122.2];

function markerIcon(selected: boolean) {
  return L.divIcon({
    className: "alin-leaflet-marker",
    html: `<span class="alin-leaflet-marker__dot${selected ? " is-selected" : ""}"><span class="sr-only">Branch</span></span>`,
    iconSize: selected ? [30, 30] : [22, 22],
    iconAnchor: selected ? [15, 15] : [11, 11],
  });
}

export default function BranchMap({
  branches,
  selectedId,
  onSelect,
}: {
  branches: readonly BranchSummary[];
  selectedId: string | null;
  onSelect: (branchId: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef(new Map<string, L.Marker>());
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const markers = markersRef.current;
    const map = L.map(containerRef.current, {
      center: PHILIPPINES_CENTER,
      zoom: 5,
      minZoom: 4,
      maxZoom: 19,
      scrollWheelZoom: false,
      zoomControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      markers.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    markersRef.current.clear();

    const bounds = L.latLngBounds([]);
    for (const branch of branches) {
      const position: L.LatLngExpression = [branch.latitude, branch.longitude];
      const marker = L.marker(position, {
        icon: markerIcon(branch.id === selectedId),
        keyboard: true,
        title: branch.name,
        alt: `${branch.name} branch marker`,
      });
      marker.bindTooltip(branch.name, { direction: "top", offset: [0, -10] });
      marker.on("click", () => onSelectRef.current(branch.id));
      marker.addTo(layer);
      markersRef.current.set(branch.id, marker);
      bounds.extend(position);
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: branches.length === 1 ? 14 : 10 });
    }
    requestAnimationFrame(() => map.invalidateSize());
  }, [branches, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    const marker = selectedId ? markersRef.current.get(selectedId) : null;
    if (!map || !marker) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    map.setView(marker.getLatLng(), Math.max(map.getZoom(), 12), { animate: !reduceMotion });
    marker.openTooltip();
  }, [selectedId]);

  return (
    <div
      ref={containerRef}
      className="h-full min-h-[560px] w-full bg-alin-near-black"
      aria-label="Map of ALiN Cargo Express branches"
    />
  );
}
