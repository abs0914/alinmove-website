export const BASE_DISTANCE_KM = 5;

export const VEHICLE_RATES = [
  { id: "motorcycle", label: "Motorcycle", baseFare: [70, 70], perKm: [7, 7] },
  { id: "sedan", label: "Sedan / Car", baseFare: [115, 115], perKm: [16, 17] },
  { id: "mpv", label: "MPV / Small Van", baseFare: [245, 245], perKm: [18, 19] },
  {
    id: "light-truck",
    label: "Closed Van / L300 / Light Truck",
    baseFare: [345, 345],
    perKm: [21, 22],
  },
  {
    id: "medium-truck",
    label: "Medium 4-Wheel / 6-Wheel Truck",
    baseFare: [550, 750],
    perKm: [25, 30],
  },
  {
    id: "large-truck",
    label: "Large 10-Wheel / Long-Haul Truck",
    baseFare: [900, 1200],
    perKm: [30, 40],
  },
] as const;

export type VehicleTierId = (typeof VEHICLE_RATES)[number]["id"];

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

export interface FareRange {
  min: number;
  max: number;
}

export function estimateVehicleFare(vehicleId: VehicleTierId, distanceKm: number): FareRange {
  const rate = VEHICLE_RATES.find((item) => item.id === vehicleId);
  if (!rate) throw new Error("Unknown vehicle tier");

  const additionalKm = Math.max(0, distanceKm - BASE_DISTANCE_KM);
  return {
    min: Math.ceil(rate.baseFare[0] + additionalKm * rate.perKm[0]),
    max: Math.ceil(rate.baseFare[1] + additionalKm * rate.perKm[1]),
  };
}

export function getCargoFare(cargoRateId: CargoRateId, crossProvince: boolean): number {
  const rate = CARGO_RATES.find((item) => item.id === cargoRateId);
  if (!rate) throw new Error("Unknown cargo rate");
  return crossProvince ? rate.crossProvince : rate.withinProvince;
}

export function addFare(fare: FareRange, amount: number): FareRange {
  return { min: fare.min + amount, max: fare.max + amount };
}

export function formatPesoRange(fare: FareRange): string {
  const formatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  });
  if (fare.min === fare.max) return formatter.format(fare.min).replace("PHP", "₱");
  return `${formatter.format(fare.min).replace("PHP", "₱")}–${formatter
    .format(fare.max)
    .replace("PHP", "₱")}`;
}
