import { describe, expect, it } from "vitest";
import {
  BASE_DISTANCE_KM,
  CARGO_RATES,
  VEHICLE_RATES,
  addFare,
  estimateVehicleFare,
  formatPesoRange,
  getCargoFare,
} from "./pricing-calculator";

describe("pricing calculator", () => {
  it("keeps the base fare within the first five kilometers", () => {
    expect(BASE_DISTANCE_KM).toBe(5);
    expect(estimateVehicleFare("motorcycle", 3.2)).toEqual({ min: 70, max: 70 });
  });

  it("adds the selected vehicle rate beyond five kilometers", () => {
    expect(estimateVehicleFare("motorcycle", 7.5)).toEqual({ min: 88, max: 88 });
    expect(estimateVehicleFare("sedan", 10)).toEqual({ min: 195, max: 200 });
    expect(estimateVehicleFare("medium-truck", 10)).toEqual({ min: 675, max: 900 });
  });

  it("contains every published vehicle tier", () => {
    expect(VEHICLE_RATES.map((rate) => rate.label)).toEqual([
      "Motorcycle",
      "Sedan / Car",
      "MPV / Small Van",
      "Closed Van / L300 / Light Truck",
      "Medium 4-Wheel / 6-Wheel Truck",
      "Large 10-Wheel / Long-Haul Truck",
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

  it("adds cargo to a local pickup fare and formats exact and ranged totals", () => {
    expect(addFare({ min: 70, max: 70 }, 140)).toEqual({ min: 210, max: 210 });
    expect(formatPesoRange({ min: 210, max: 210 })).toBe("₱210");
    expect(formatPesoRange({ min: 675, max: 900 })).toBe("₱675–₱900");
  });
});
