export const BASE_DISTANCE_KM = 5;

/** Saver = scheduled (lower fare); Priority = rider dispatched immediately. */
export const FARE_TIERS = [
  { id: "saver", label: "Saver", description: "Scheduled pickup at a lower fare." },
  { id: "priority", label: "Priority", description: "A rider is dispatched right away." },
] as const;

export type FareTierId = (typeof FARE_TIERS)[number]["id"];

/**
 * Base fare covers the first {@link BASE_DISTANCE_KM} km; `perKm` applies to
 * every km beyond that and is the same for Saver and Priority.
 */
export const VEHICLE_RATES = [
  {
    id: "motorcycle",
    label: "Motorcycle",
    maxWeightKg: 25,
    size: "0.5 × 0.4 × 0.5 m",
    baseFare: { saver: 35, priority: 70 },
    perKm: 7,
  },
  {
    id: "sedan",
    label: "Sedan / Hatchback",
    maxWeightKg: 200,
    size: "1.0 × 0.6 × 0.7 m",
    baseFare: { saver: 110, priority: 160 },
    perKm: 13,
  },
  {
    id: "crossover-suv",
    label: "Small Crossover SUV",
    maxWeightKg: 300,
    size: "1.2 × 1.0 × 0.9 m",
    baseFare: { saver: 130, priority: 185 },
    perKm: 14,
  },
  {
    id: "suv-minivan",
    label: "7-Seater SUV / Minivan",
    maxWeightKg: 600,
    size: "2.1 × 1.2 × 1.1 m",
    baseFare: { saver: 155, priority: 220 },
    perKm: 14,
  },
  {
    id: "pickup",
    label: "Pickup",
    maxWeightKg: 800,
    size: "2.7 × 1.5 × 0.5 m",
    baseFare: { saver: 210, priority: 300 },
    perKm: 17,
  },
  {
    id: "cargo-van",
    label: "L300 / Cargo Van",
    maxWeightKg: 1000,
    size: "2.1 × 1.2 × 1.2 m",
    baseFare: { saver: 240, priority: 340 },
    perKm: 19,
  },
  {
    id: "fb-long-van",
    label: "FB-Type Long Van",
    maxWeightKg: 2000,
    size: "3.0 × 1.7 × 1.7 m",
    baseFare: { saver: 700, priority: 900 },
    perKm: 21,
  },
  {
    id: "aluminum-van",
    label: "Aluminum Van",
    maxWeightKg: 2000,
    size: "3.0 × 1.7 × 1.7 m",
    baseFare: { saver: 750, priority: 950 },
    perKm: 22,
  },
  {
    id: "6w-aluminum-van",
    label: "6W Aluminum Van",
    maxWeightKg: 3000,
    size: "4.3 × 1.8 × 2.1 m",
    baseFare: { saver: 1200, priority: 1500 },
    perKm: 34,
  },
  {
    id: "6w-large-aluminum-van",
    label: "6W Large Aluminum Van",
    maxWeightKg: 5000,
    size: "4.8 × 2.0 × 2.1 m",
    baseFare: { saver: 2000, priority: 2500 },
    perKm: 32,
  },
  {
    id: "6w-fwd-aluminum-van",
    label: "6W FWD Aluminum Van",
    maxWeightKg: 7000,
    size: "5.5 × 1.8 × 2.5 m",
    baseFare: { saver: 3200, priority: 3900 },
    perKm: 48,
  },
  {
    id: "10w-wing-van",
    label: "10W Wing Van",
    maxWeightKg: 12000,
    size: "10.0 × 2.4 × 2.3 m",
    baseFare: { saver: 5200, priority: 6500 },
    perKm: 75,
  },
] as const;

export type VehicleTierId = (typeof VEHICLE_RATES)[number]["id"];

/** Lowest base fares, used for "from ₱…" headlines. */
export const STARTING_FARE = VEHICLE_RATES[0].baseFare;

export const CARGO_RATES = [
  {
    id: "alin-box-xlarge",
    group: "ALiN Box",
    label: "X-Large Box",
    detail: "24 × 24 × 30 in · up to 40 kg",
    withinProvince: 3575,
    crossProvince: 3860,
  },
  {
    id: "alin-box-large",
    group: "ALiN Box",
    label: "Large Box",
    detail: "20 × 20 × 35 in · up to 30 kg",
    withinProvince: 2750,
    crossProvince: 2970,
  },
  {
    id: "alin-box-medium",
    group: "ALiN Box",
    label: "Medium Box",
    detail: "24 × 18 × 20 in · up to 20 kg",
    withinProvince: 1690,
    crossProvince: 1850,
  },
  {
    id: "alin-box-small",
    group: "ALiN Box",
    label: "Small Box",
    detail: "24 × 14 × 14 in · up to 10 kg",
    withinProvince: 900,
    crossProvince: 980,
  },
  {
    id: "alin-box-5kg",
    group: "ALiN Box",
    label: "5 kg Box",
    detail: "10.5 × 14 × 7 in · up to 5 kg",
    withinProvince: 285,
    crossProvince: 320,
  },
  {
    id: "alin-box-3kg",
    group: "ALiN Box",
    label: "3 kg Box",
    detail: "16 × 10 × 3 in · up to 3 kg",
    withinProvince: 180,
    crossProvince: 205,
  },
  {
    id: "alin-box-1kg",
    group: "ALiN Box",
    label: "1 kg Box",
    detail: "9 × 5 × 3 in · up to 1 kg",
    withinProvince: 120,
    crossProvince: 140,
  },
  {
    id: "own-box-xlarge",
    group: "Your Own Box",
    label: "X-Large Box",
    detail: "24 × 24 × 30 in · up to 40 kg",
    withinProvince: 3145,
    crossProvince: 3400,
  },
  {
    id: "own-box-large",
    group: "Your Own Box",
    label: "Large Box",
    detail: "20 × 20 × 35 in · up to 30 kg",
    withinProvince: 2420,
    crossProvince: 2615,
  },
  {
    id: "own-box-medium",
    group: "Your Own Box",
    label: "Medium Box",
    detail: "24 × 18 × 20 in · up to 20 kg",
    withinProvince: 1488,
    crossProvince: 1630,
  },
  {
    id: "own-box-small",
    group: "Your Own Box",
    label: "Small Box",
    detail: "24 × 14 × 14 in · up to 10 kg",
    withinProvince: 790,
    crossProvince: 865,
  },
  {
    id: "own-box-5kg",
    group: "Your Own Box",
    label: "5 kg Box",
    detail: "10.5 × 14 × 7 in · up to 5 kg",
    withinProvince: 150,
    crossProvince: 280,
  },
  {
    id: "own-box-3kg",
    group: "Your Own Box",
    label: "3 kg Box",
    detail: "16 × 10 × 3 in · up to 3 kg",
    withinProvince: 158,
    crossProvince: 180,
  },
  {
    id: "own-box-1kg",
    group: "Your Own Box",
    label: "1 kg Box",
    detail: "9 × 5 × 3 in · up to 1 kg",
    withinProvince: 107,
    crossProvince: 123,
  },
  {
    id: "pouch-large",
    group: "ALiN Pouch",
    label: "Large Pouch",
    detail: "12.60 × 17.72 in · up to 5 kg",
    withinProvince: 160,
    crossProvince: 190,
  },
  {
    id: "pouch-medium",
    group: "ALiN Pouch",
    label: "Medium Pouch",
    detail: "11.02 × 16.54 in · up to 3 kg",
    withinProvince: 145,
    crossProvince: 175,
  },
  {
    id: "pouch-small",
    group: "ALiN Pouch",
    label: "Small Pouch",
    detail: "9.84 × 13.78 in · up to 2 kg",
    withinProvince: 115,
    crossProvince: 135,
  },
  {
    id: "pouch-xsmall",
    group: "ALiN Pouch",
    label: "X-Small Pouch",
    detail: "6.69 × 11.81 in · up to 1 kg",
    withinProvince: 75,
    crossProvince: 90,
  },
] as const;

export type CargoRateId = (typeof CARGO_RATES)[number]["id"];

/** A fare quoted at both service levels. */
export type TieredFare = Record<FareTierId, number>;

export function estimateVehicleFare(vehicleId: VehicleTierId, distanceKm: number): TieredFare {
  const rate = VEHICLE_RATES.find((item) => item.id === vehicleId);
  if (!rate) throw new Error("Unknown vehicle tier");

  const extra = Math.max(0, distanceKm - BASE_DISTANCE_KM) * rate.perKm;
  return {
    saver: Math.ceil(rate.baseFare.saver + extra),
    priority: Math.ceil(rate.baseFare.priority + extra),
  };
}

export function getCargoFare(cargoRateId: CargoRateId, crossProvince: boolean): number {
  const rate = CARGO_RATES.find((item) => item.id === cargoRateId);
  if (!rate) throw new Error("Unknown cargo rate");
  return crossProvince ? rate.crossProvince : rate.withinProvince;
}

export function addFare(fare: TieredFare, amount: number): TieredFare {
  return { saver: fare.saver + amount, priority: fare.priority + amount };
}

/** ₱1,234 — whole pesos, Philippine grouping. */
export function formatPeso(amount: number): string {
  return `₱${amount.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
}
