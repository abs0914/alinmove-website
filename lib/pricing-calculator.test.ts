import { describe, expect, it } from "vitest";
import {
  BASE_DISTANCE_KM,
  CARGO_RATES,
  STARTING_FARE,
  VEHICLE_RATES,
  addFare,
  estimateVehicleFare,
  formatPeso,
  getCargoFare,
} from "./pricing-calculator";

describe("pricing calculator", () => {
  it("keeps the Saver and Priority base fares within the first five kilometers", () => {
    expect(BASE_DISTANCE_KM).toBe(5);
    expect(estimateVehicleFare("motorcycle", 3.2)).toEqual({ saver: 35, priority: 70 });
    expect(STARTING_FARE).toEqual({ saver: 35, priority: 70 });
  });

  it("adds the vehicle's per-km rate beyond five kilometers to both tiers", () => {
    expect(estimateVehicleFare("motorcycle", 7.5)).toEqual({ saver: 53, priority: 88 });
    expect(estimateVehicleFare("sedan", 10)).toEqual({ saver: 175, priority: 225 });
    expect(estimateVehicleFare("10w-wing-van", 10)).toEqual({ saver: 5575, priority: 6875 });
  });

  it("contains every published vehicle tier", () => {
    expect(VEHICLE_RATES.map((rate) => rate.label)).toEqual([
      "Motorcycle",
      "Sedan / Hatchback",
      "Small Crossover SUV",
      "7-Seater SUV / Minivan",
      "Pickup",
      "L300 / Cargo Van",
      "FB-Type Long Van",
      "Aluminum Van",
      "6W Aluminum Van",
      "6W Large Aluminum Van",
      "6W FWD Aluminum Van",
      "10W Wing Van",
    ]);
  });

  it("uses the supplied ALiN Cargo within- and cross-province rates", () => {
    expect(CARGO_RATES).toHaveLength(18);
    expect(getCargoFare("alin-box-xlarge", false)).toBe(3575);
    expect(getCargoFare("alin-box-xlarge", true)).toBe(3860);
    expect(getCargoFare("own-box-1kg", false)).toBe(107);
    expect(getCargoFare("own-box-1kg", true)).toBe(123);
    expect(getCargoFare("pouch-xsmall", false)).toBe(75);
    expect(getCargoFare("pouch-xsmall", true)).toBe(90);
  });

  it("adds cargo to a local pickup fare and formats pesos", () => {
    expect(addFare({ saver: 35, priority: 70 }, 140)).toEqual({ saver: 175, priority: 210 });
    expect(formatPeso(210)).toBe("₱210");
    expect(formatPeso(6875)).toBe("₱6,875");
  });
});
