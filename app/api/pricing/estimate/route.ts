import { NextResponse } from "next/server";
import { z } from "zod";
import { getCoverage } from "@/lib/coverage-api";
import { findNearestPickupBranch, haversineKm, type Coordinates } from "@/lib/branches";
import {
  CARGO_RATES,
  VEHICLE_RATES,
  addFare,
  estimateVehicleFare,
  getCargoFare,
  type CargoRateId,
  type VehicleTierId,
} from "@/lib/pricing-calculator";

const psgcLocationSchema = z.object({
  regionCode: z.string().regex(/^\d{9,10}$/),
  regionName: z.string().trim().min(1).max(100),
  provinceCode: z
    .string()
    .regex(/^\d{9,10}$/)
    .nullable(),
  provinceName: z.string().trim().min(1).max(100).nullable(),
  cityCode: z.string().regex(/^\d{9,10}$/),
  cityName: z.string().trim().min(1).max(100),
  barangayCode: z.string().regex(/^\d{9,10}$/),
  barangayName: z.string().trim().min(1).max(120),
});

const requestSchema = z.discriminatedUnion("service", [
  z.object({
    service: z.literal("pickup-to-branch"),
    origin: psgcLocationSchema,
    destination: psgcLocationSchema,
    vehicleId: z.enum(VEHICLE_RATES.map((rate) => rate.id) as [VehicleTierId, ...VehicleTierId[]]),
    cargoRateId: z.enum(CARGO_RATES.map((rate) => rate.id) as [CargoRateId, ...CargoRateId[]]),
  }),
  z.object({
    service: z.literal("door-to-door"),
    origin: psgcLocationSchema,
    destination: psgcLocationSchema,
    vehicleId: z.enum(VEHICLE_RATES.map((rate) => rate.id) as [VehicleTierId, ...VehicleTierId[]]),
  }),
]);

interface RouteDistance {
  distanceKm: number;
  method: "road" | "estimated";
}

type PSGCLocation = z.infer<typeof psgcLocationSchema>;

function locationQuery(location: PSGCLocation): string {
  return [
    `Barangay ${location.barangayName}`,
    location.cityName,
    location.provinceName,
    location.regionName,
    "Philippines",
  ]
    .filter(Boolean)
    .join(", ");
}

async function geocode(location: PSGCLocation): Promise<Coordinates> {
  const baseUrl = (process.env.GEOCODING_API_URL || "https://nominatim.openstreetmap.org").replace(
    /\/$/,
    "",
  );
  const url = new URL(`${baseUrl}/search`);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("countrycodes", "ph");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", locationQuery(location));

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        process.env.GEOCODING_USER_AGENT || "ALiN Move pricing calculator (https://alinmove.com)",
    },
    next: { revalidate: 60 * 60 * 24 * 30 },
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`Geocoder ${response.status}`);

  const results = (await response.json()) as Array<{ lat?: string; lon?: string }>;
  const latitude = Number(results[0]?.lat);
  const longitude = Number(results[0]?.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Barangay could not be geocoded");
  }
  return { latitude, longitude };
}

async function routeDistance(
  origin: Coordinates,
  destination: Coordinates,
): Promise<RouteDistance> {
  const baseUrl = (process.env.ROUTING_API_URL || "https://router.project-osrm.org").replace(
    /\/$/,
    "",
  );
  const coordinates = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
  const url = `${baseUrl}/route/v1/driving/${coordinates}?overview=false`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 60 * 24 * 7 },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`Router ${response.status}`);

    const data = (await response.json()) as { routes?: Array<{ distance?: number }> };
    const meters = data.routes?.[0]?.distance;
    if (typeof meters !== "number" || !Number.isFinite(meters) || meters <= 0) {
      throw new Error("No road route found");
    }
    return { distanceKm: meters / 1000, method: "road" };
  } catch (error) {
    console.warn("Road routing failed; using adjusted straight-line estimate", error);
    return { distanceKm: haversineKm(origin, destination) * 1.25, method: "estimated" };
  }
}

function provinceKey(location: PSGCLocation): string {
  return location.provinceCode || location.regionCode;
}

export async function POST(request: Request) {
  let input: z.infer<typeof requestSchema>;
  try {
    input = requestSchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Complete all required calculator fields." },
      { status: 400 },
    );
  }

  try {
    const originCoordinates = await geocode(input.origin);

    if (input.service === "door-to-door") {
      const destinationCoordinates = await geocode(input.destination);
      const route = await routeDistance(originCoordinates, destinationCoordinates);
      const fare = estimateVehicleFare(input.vehicleId, route.distanceKm);

      return NextResponse.json({
        service: input.service,
        distanceKm: Number(route.distanceKm.toFixed(1)),
        distanceMethod: route.method,
        fare,
      });
    }

    const coverage = await getCoverage();
    const nearest = findNearestPickupBranch(originCoordinates, coverage.branches);
    if (!nearest) {
      return NextResponse.json(
        {
          error: "No active pickup-to-branch location is available for this estimate.",
          code: "BRANCH_DATA_UNAVAILABLE",
        },
        { status: 503 },
      );
    }

    const pickupRoute = await routeDistance(originCoordinates, {
      latitude: nearest.branch.latitude,
      longitude: nearest.branch.longitude,
    });
    const pickupFare = estimateVehicleFare(input.vehicleId, pickupRoute.distanceKm);
    const originProvince = nearest.branch.provinceCode || provinceKey(input.origin);
    const crossProvince = originProvince !== provinceKey(input.destination);
    const cargoFare = getCargoFare(input.cargoRateId, crossProvince);

    return NextResponse.json({
      service: input.service,
      nearestBranch: {
        id: nearest.branch.id,
        name: nearest.branch.name,
        city: nearest.branch.city,
      },
      distanceKm: Number(pickupRoute.distanceKm.toFixed(1)),
      distanceMethod: pickupRoute.method,
      pickupFare,
      cargoFare,
      totalFare: addFare(pickupFare, cargoFare),
      lane: crossProvince ? "Cross province" : "Within province",
      branchToDoorFee: 0,
    });
  } catch (error) {
    console.error("Pricing estimate failed", error);
    return NextResponse.json(
      { error: "We could not estimate this route right now. Please try again." },
      { status: 503 },
    );
  }
}
