"use client";

import { FormEvent, useEffect, useId, useMemo, useState } from "react";
import { Building2, Calculator, Loader2, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CARGO_RATES,
  FARE_TIERS,
  VEHICLE_RATES,
  formatPeso,
  type CargoRateId,
  type TieredFare,
  type VehicleTierId,
} from "@/lib/pricing-calculator";

interface PSGCOption {
  code: string;
  name: string;
  regionName?: string;
  provinceCode?: string | false;
}

interface PSGCLocation {
  regionCode: string;
  regionName: string;
  provinceCode: string | null;
  provinceName: string | null;
  cityCode: string;
  cityName: string;
  barangayCode: string;
  barangayName: string;
}

interface DoorEstimate {
  service: "door-to-door";
  distanceKm: number;
  distanceMethod: "road" | "estimated";
  fare: TieredFare;
}

interface BranchEstimate {
  service: "pickup-to-branch";
  nearestBranch: { id: string; name: string; city: string };
  distanceKm: number;
  distanceMethod: "road" | "estimated";
  pickupFare: TieredFare;
  cargoFare: number;
  totalFare: TieredFare;
  lane: "Within province" | "Cross province";
  branchToDoorFee: 0;
}

type Estimate = DoorEstimate | BranchEstimate;

const inputClassName =
  "h-11 w-full rounded-lg border border-alin-border bg-alin-near-black px-3 text-sm text-alin-white outline-none transition focus:border-alin-gold focus:ring-2 focus:ring-alin-gold/30 disabled:cursor-not-allowed disabled:opacity-50";

async function fetchOptions(resource: string, parentCode?: string): Promise<PSGCOption[]> {
  const params = new URLSearchParams({ resource });
  if (parentCode) params.set("parentCode", parentCode);
  const response = await fetch(`/api/psgc?${params}`);
  const data = (await response.json()) as PSGCOption[] | { error?: string };
  if (!response.ok || !Array.isArray(data)) {
    throw new Error(!Array.isArray(data) && data.error ? data.error : "Location lookup failed.");
  }
  return data;
}

function BarangayPicker({
  label,
  onChange,
}: {
  label: string;
  onChange: (location: PSGCLocation | null) => void;
}) {
  const id = useId();
  const [regions, setRegions] = useState<PSGCOption[]>([]);
  const [provinces, setProvinces] = useState<PSGCOption[]>([]);
  const [cities, setCities] = useState<PSGCOption[]>([]);
  const [barangays, setBarangays] = useState<PSGCOption[]>([]);
  const [regionCode, setRegionCode] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [barangayCode, setBarangayCode] = useState("");
  const [loading, setLoading] = useState<"regions" | "cities" | "barangays" | null>("regions");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchOptions("regions")
      .then((items) => active && setRegions(items))
      .catch((caught: Error) => active && setError(caught.message))
      .finally(() => active && setLoading(null));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setCities([]);
    setProvinces([]);
    setCityCode("");
    setBarangays([]);
    setBarangayCode("");
    setError(null);
    if (!regionCode) return;

    let active = true;
    setLoading("cities");
    Promise.all([
      fetchOptions("cities-municipalities", regionCode),
      fetchOptions("provinces", regionCode),
    ])
      .then(([cityItems, provinceItems]) => {
        if (!active) return;
        setCities(cityItems);
        setProvinces(provinceItems);
      })
      .catch((caught: Error) => active && setError(caught.message))
      .finally(() => active && setLoading(null));
    return () => {
      active = false;
    };
  }, [regionCode]);

  useEffect(() => {
    setBarangays([]);
    setBarangayCode("");
    setError(null);
    if (!cityCode) return;

    let active = true;
    setLoading("barangays");
    fetchOptions("barangays", cityCode)
      .then((items) => active && setBarangays(items))
      .catch((caught: Error) => active && setError(caught.message))
      .finally(() => active && setLoading(null));
    return () => {
      active = false;
    };
  }, [cityCode]);

  const location = useMemo<PSGCLocation | null>(() => {
    const region = regions.find((item) => item.code === regionCode);
    const city = cities.find((item) => item.code === cityCode);
    const barangay = barangays.find((item) => item.code === barangayCode);
    if (!region || !city || !barangay) return null;
    const provinceCode = typeof city.provinceCode === "string" ? city.provinceCode : null;
    const province = provinces.find((item) => item.code === provinceCode);
    return {
      regionCode: region.code,
      regionName: region.regionName || region.name,
      provinceCode,
      provinceName: province?.name || null,
      cityCode: city.code,
      cityName: city.name,
      barangayCode: barangay.code,
      barangayName: barangay.name,
    };
  }, [barangayCode, barangays, cities, cityCode, provinces, regionCode, regions]);

  useEffect(() => onChange(location), [location, onChange]);

  const provinceNames = useMemo(
    () => new Map(provinces.map((province) => [province.code, province.name])),
    [provinces],
  );

  return (
    <fieldset className="rounded-2xl border border-alin-border bg-black/30 p-4">
      <legend className="px-2 text-sm font-black text-alin-white">{label}</legend>
      <div className="mt-2 grid gap-3 sm:grid-cols-3">
        <label
          className="grid gap-1.5 text-xs font-semibold text-alin-muted"
          htmlFor={`${id}-region`}
        >
          Region
          <select
            id={`${id}-region`}
            className={inputClassName}
            value={regionCode}
            onChange={(event) => setRegionCode(event.target.value)}
          >
            <option value="">{loading === "regions" ? "Loading…" : "Select region"}</option>
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.regionName ? `${region.regionName} — ${region.name}` : region.name}
              </option>
            ))}
          </select>
        </label>
        <label
          className="grid gap-1.5 text-xs font-semibold text-alin-muted"
          htmlFor={`${id}-city`}
        >
          City / municipality
          <select
            id={`${id}-city`}
            className={inputClassName}
            value={cityCode}
            disabled={!regionCode || loading === "cities"}
            onChange={(event) => setCityCode(event.target.value)}
          >
            <option value="">{loading === "cities" ? "Loading…" : "Select city"}</option>
            {cities.map((city) => {
              const provinceName =
                typeof city.provinceCode === "string"
                  ? provinceNames.get(city.provinceCode)
                  : undefined;
              return (
                <option key={city.code} value={city.code}>
                  {provinceName ? `${city.name} — ${provinceName}` : city.name}
                </option>
              );
            })}
          </select>
        </label>
        <label
          className="grid gap-1.5 text-xs font-semibold text-alin-muted"
          htmlFor={`${id}-barangay`}
        >
          Barangay
          <select
            id={`${id}-barangay`}
            className={inputClassName}
            value={barangayCode}
            disabled={!cityCode || loading === "barangays"}
            onChange={(event) => setBarangayCode(event.target.value)}
          >
            <option value="">{loading === "barangays" ? "Loading…" : "Select barangay"}</option>
            {barangays.map((barangay) => (
              <option key={barangay.code} value={barangay.code}>
                {barangay.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error ? <p className="mt-2 text-sm text-alin-danger">{error}</p> : null}
    </fieldset>
  );
}

function VehicleSelect({
  value,
  onChange,
}: {
  value: VehicleTierId;
  onChange: (value: VehicleTierId) => void;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-alin-white">
      Vehicle tier
      <select
        className={inputClassName}
        value={value}
        onChange={(event) => onChange(event.target.value as VehicleTierId)}
      >
        {VEHICLE_RATES.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.label} — up to {vehicle.maxWeightKg.toLocaleString("en-PH")} kg
          </option>
        ))}
      </select>
    </label>
  );
}

function CargoSelect({
  value,
  onChange,
}: {
  value: CargoRateId;
  onChange: (value: CargoRateId) => void;
}) {
  const groups = [...new Set(CARGO_RATES.map((rate) => rate.group))];
  return (
    <label className="grid gap-1.5 text-sm font-bold text-alin-white">
      Package / packaging
      <select
        className={inputClassName}
        value={value}
        onChange={(event) => onChange(event.target.value as CargoRateId)}
      >
        {groups.map((group) => (
          <optgroup key={group} label={group}>
            {CARGO_RATES.filter((rate) => rate.group === group).map((rate) => (
              <option key={rate.id} value={rate.id}>
                {rate.label} — {rate.detail}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

function EstimateResult({ estimate }: { estimate: Estimate }) {
  const fare = estimate.service === "door-to-door" ? estimate.fare : estimate.totalFare;
  return (
    <div className="mt-5 rounded-2xl bg-alin-gold p-5 text-alin-black" aria-live="polite">
      <p className="text-xs font-black uppercase tracking-[0.18em]">Estimated customer total</p>
      <dl className="mt-3 grid grid-cols-2 gap-3">
        {FARE_TIERS.map((tier) => (
          <div key={tier.id} className="bg-alin-black/10 rounded-xl p-3">
            <dt className="text-xs font-black uppercase tracking-[0.14em]">{tier.label}</dt>
            <dd className="mt-1 text-3xl font-black sm:text-4xl">{formatPeso(fare[tier.id])}</dd>
            <dd className="mt-1 text-xs font-semibold">{tier.description}</dd>
          </div>
        ))}
      </dl>
      {estimate.service === "door-to-door" ? (
        <p className="mt-2 text-sm font-semibold">
          Approx. {estimate.distanceKm} km door-to-door
          {estimate.distanceMethod === "estimated"
            ? " (adjusted straight-line estimate)"
            : " by road"}
        </p>
      ) : (
        <div className="mt-3 grid gap-1 text-sm font-semibold">
          <p>Nearest branch: {estimate.nearestBranch.name}</p>
          <p>
            Pickup leg: {estimate.distanceKm} km · Saver {formatPeso(estimate.pickupFare.saver)} ·
            Priority {formatPeso(estimate.pickupFare.priority)}
          </p>
          <p>
            Cargo ({estimate.lane.toLowerCase()}): {formatPeso(estimate.cargoFare)}
          </p>
          <p>Branch-to-door: Included · ₱0 additional customer fee</p>
        </div>
      )}
    </div>
  );
}

async function requestEstimate(payload: object): Promise<Estimate> {
  const response = await fetch("/api/pricing/estimate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as Estimate | { error?: string };
  if (!response.ok || !("service" in data)) {
    throw new Error("error" in data && data.error ? data.error : "Estimate unavailable.");
  }
  return data;
}

export function PricingCalculators() {
  const [pickupOrigin, setPickupOrigin] = useState<PSGCLocation | null>(null);
  const [pickupDestination, setPickupDestination] = useState<PSGCLocation | null>(null);
  const [doorOrigin, setDoorOrigin] = useState<PSGCLocation | null>(null);
  const [doorDestination, setDoorDestination] = useState<PSGCLocation | null>(null);
  const [pickupVehicle, setPickupVehicle] = useState<VehicleTierId>("motorcycle");
  const [doorVehicle, setDoorVehicle] = useState<VehicleTierId>("motorcycle");
  const [cargoRate, setCargoRate] = useState<CargoRateId>("alin-box-1kg");
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>, payload: object) {
    event.preventDefault();
    setError(null);
    setEstimate(null);
    setLoading(true);
    try {
      setEstimate(await requestEstimate(payload));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Estimate unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-alin-gold/20 rounded-[1.75rem] border bg-alin-near-black p-4 shadow-[0_24px_80px_-40px_rgba(255,194,0,0.45)] sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-alin-gold text-alin-black">
          <Calculator className="size-5" aria-hidden />
        </div>
        <div>
          <h3 className="text-xl font-black text-alin-white">Choose a delivery calculator</h3>
          <p className="mt-1 text-sm leading-6 text-alin-muted">
            Select official PSGC barangays to get a route-based estimate before opening the app.
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="pickup"
        className="mt-6"
        onValueChange={() => {
          setEstimate(null);
          setError(null);
        }}
      >
        <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl border border-alin-border bg-black/40 p-1">
          <TabsTrigger value="pickup" className="gap-2 rounded-lg py-2.5">
            <Building2 className="size-4" aria-hidden />
            Pickup to Branch
          </TabsTrigger>
          <TabsTrigger value="door" className="gap-2 rounded-lg py-2.5">
            <Truck className="size-4" aria-hidden />
            Door to Door
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pickup" forceMount className="data-[state=inactive]:hidden">
          <form
            className="mt-5 grid gap-4"
            onSubmit={(event) =>
              submit(event, {
                service: "pickup-to-branch",
                origin: pickupOrigin,
                destination: pickupDestination,
                vehicleId: pickupVehicle,
                cargoRateId: cargoRate,
              })
            }
          >
            <div className="border-alin-gold/20 bg-alin-gold/5 flex gap-3 rounded-2xl border p-4 text-sm leading-6 text-alin-muted">
              <MapPin className="mt-0.5 size-5 shrink-0 text-alin-gold" aria-hidden />
              We find the nearest active ALiN branch, add the local pickup fare, then apply the
              selected ALiN Cargo within- or cross-province rate. Branch-to-door is included.
            </div>
            <BarangayPicker label="Customer pickup barangay" onChange={setPickupOrigin} />
            <BarangayPicker label="Recipient barangay" onChange={setPickupDestination} />
            <div className="grid gap-4 sm:grid-cols-2">
              <VehicleSelect value={pickupVehicle} onChange={setPickupVehicle} />
              <CargoSelect value={cargoRate} onChange={setCargoRate} />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={loading || !pickupOrigin || !pickupDestination}
            >
              {loading ? (
                <Loader2 className="animate-spin" aria-hidden />
              ) : (
                <Calculator aria-hidden />
              )}
              Estimate Pickup-to-Branch Total
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="door" forceMount className="data-[state=inactive]:hidden">
          <form
            className="mt-5 grid gap-4"
            onSubmit={(event) =>
              submit(event, {
                service: "door-to-door",
                origin: doorOrigin,
                destination: doorDestination,
                vehicleId: doorVehicle,
              })
            }
          >
            <div className="border-alin-gold/20 bg-alin-gold/5 flex gap-3 rounded-2xl border p-4 text-sm leading-6 text-alin-muted">
              <MapPin className="mt-0.5 size-5 shrink-0 text-alin-gold" aria-hidden />
              We estimate the road distance between the selected barangays and apply the chosen
              vehicle tier&apos;s base fare plus its rate beyond 5 km.
            </div>
            <BarangayPicker label="Customer pickup barangay" onChange={setDoorOrigin} />
            <BarangayPicker label="Recipient barangay" onChange={setDoorDestination} />
            <VehicleSelect value={doorVehicle} onChange={setDoorVehicle} />
            <Button type="submit" size="lg" disabled={loading || !doorOrigin || !doorDestination}>
              {loading ? (
                <Loader2 className="animate-spin" aria-hidden />
              ) : (
                <Calculator aria-hidden />
              )}
              Estimate Door-to-Door Fare
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      {error ? (
        <p
          className="border-alin-danger/40 bg-alin-danger/10 mt-5 rounded-2xl border p-4 text-sm text-alin-white"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {estimate ? <EstimateResult estimate={estimate} /> : null}

      <p className="mt-5 text-xs leading-5 text-alin-muted">
        Barangay names and codes follow the{" "}
        <a
          href="https://psa.gov.ph/classifications-api/psgc"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-alin-white underline decoration-alin-gold underline-offset-4"
        >
          Philippine Statistics Authority PSGC
        </a>
        . Route estimates use OpenStreetMap data and may differ from the final app quote due to
        exact addresses, road access, traffic, and service availability.
      </p>
    </div>
  );
}
