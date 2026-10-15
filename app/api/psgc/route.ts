import { NextRequest, NextResponse } from "next/server";

type Resource = "regions" | "provinces" | "cities-municipalities" | "barangays";

const RESOURCE_PATHS: Record<Resource, (parentCode: string | null) => string | null> = {
  regions: () => "regions/",
  provinces: (parentCode) =>
    parentCode ? `regions/${encodeURIComponent(parentCode)}/provinces/` : null,
  "cities-municipalities": (parentCode) =>
    parentCode ? `regions/${encodeURIComponent(parentCode)}/cities-municipalities/` : null,
  barangays: (parentCode) =>
    parentCode ? `cities-municipalities/${encodeURIComponent(parentCode)}/barangays/` : null,
};

function isResource(value: string | null): value is Resource {
  return Boolean(value && value in RESOURCE_PATHS);
}

export async function GET(request: NextRequest) {
  const resource = request.nextUrl.searchParams.get("resource");
  const parentCode = request.nextUrl.searchParams.get("parentCode");

  if (!isResource(resource)) {
    return NextResponse.json({ error: "Unsupported PSGC resource." }, { status: 400 });
  }
  if (parentCode && !/^\d{9,10}$/.test(parentCode)) {
    return NextResponse.json({ error: "Invalid PSGC parent code." }, { status: 400 });
  }

  const path = RESOURCE_PATHS[resource](parentCode);
  if (!path) {
    return NextResponse.json({ error: "A parent PSGC code is required." }, { status: 400 });
  }

  const baseUrl = (process.env.PSGC_API_BASE_URL || "https://psgc.gitlab.io/api").replace(
    /\/$/,
    "",
  );

  try {
    const response = await fetch(`${baseUrl}/${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 60 * 24 * 7 },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`PSGC API ${response.status}`);

    const data = (await response.json()) as unknown;
    if (!Array.isArray(data)) throw new Error("Unexpected PSGC response");

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400" },
    });
  } catch (error) {
    console.error("PSGC lookup failed", error);
    return NextResponse.json(
      { error: "Philippine location data is temporarily unavailable." },
      { status: 503 },
    );
  }
}
