"use client";

import { useActionState, useEffect } from "react";
import {
  submitApplication,
  type ApplyState,
} from "@/app/(marketing)/drive/apply/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trackEvent } from "@/lib/analytics";
import { trackOnce } from "@/lib/analytics-helpers";

const initialState: ApplyState = {};

const VEHICLES = [
  { value: "motorcycle", label: "Motorcycle" },
  { value: "sedan", label: "Sedan" },
  { value: "mpv", label: "MPV" },
  { value: "pickup", label: "Pickup" },
  { value: "van", label: "Van" },
];

export function DriverApplyForm({ cities }: { cities: { slug: string; name: string }[] }) {
  const [state, action, pending] = useActionState(submitApplication, initialState);

  useEffect(() => {
    trackOnce("apply-form-view", "apply_form_view");
  }, []);

  return (
    <form
      action={action}
      onSubmit={() => trackEvent("apply_submit_attempt")}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" required autoComplete="name" />
        <FieldError field="fullName" state={state} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile (PH)</Label>
          <Input
            id="mobile"
            name="mobile"
            type="tel"
            inputMode="tel"
            placeholder="+639XXXXXXXXX"
            required
            autoComplete="tel"
          />
          <FieldError field="mobile" state={state} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
          <FieldError field="email" state={state} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">City / branch preference</Label>
          <Select name="city" defaultValue={cities[0]?.slug ?? "other"}>
            <SelectTrigger id="city">
              <SelectValue placeholder="Pick a city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError field="city" state={state} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehicleType">Vehicle</Label>
          <Select name="vehicleType" defaultValue="motorcycle">
            <SelectTrigger id="vehicleType">
              <SelectValue placeholder="Pick a vehicle" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLES.map((v) => (
                <SelectItem key={v.value} value={v.value}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError field="vehicleType" state={state} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="plate">Plate number (optional)</Label>
        <Input id="plate" name="plate" autoComplete="off" />
      </div>

      <label className="flex items-start gap-3 text-sm text-alin-muted">
        <Checkbox name="consent" required />
        <span>
          I agree to the{" "}
          <a href="/legal/terms-driver" className="text-alin-gold hover:underline">
            Driver Terms
          </a>{" "}
          and consent to be contacted by ALiN about my application. After submit, we&apos;ll send a
          link to the Rider App to complete onboarding.
        </span>
      </label>
      <FieldError field="consent" state={state} />

      {state.error && !state.fieldErrors && (
        <p role="alert" className="text-sm text-alin-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}

function FieldError({ field, state }: { field: string; state: ApplyState }) {
  const msg = state.fieldErrors?.[field]?.[0];
  if (!msg) return null;
  return (
    <p role="alert" className="text-xs text-alin-danger">
      {msg}
    </p>
  );
}
