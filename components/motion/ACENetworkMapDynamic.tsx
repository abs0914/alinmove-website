"use client";

import dynamic from "next/dynamic";

/**
 * Client-side dynamic boundary for the heavy ACE map.
 * Next 15 disallows `ssr: false` in Server Components, so the dynamic() call
 * lives here in a "use client" wrapper. The fallback reserves layout to keep
 * CLS at 0 (per performance-budget-guard skill).
 */

const ACENetworkMap = dynamic(
  () => import("./ACENetworkMap").then((m) => m.ACENetworkMap),
  {
    ssr: false,
    loading: () => (
      <div className="relative mx-auto aspect-square w-full max-w-[560px] animate-pulse rounded-xl border border-alin-border bg-alin-near-black" />
    ),
  },
);

export function ACENetworkMapClient() {
  return <ACENetworkMap />;
}
