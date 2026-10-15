"use client";

import { useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { joinWaitlist, type WaitlistState } from "@/app/(marketing)/waitlist/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trackEvent } from "@/lib/analytics";
import { trackOnce } from "@/lib/analytics-helpers";

const initialState: WaitlistState = {};

export function WaitlistForm({ cities }: { cities: { slug: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);
  const params = useSearchParams();

  useEffect(() => {
    trackOnce("waitlist-form-view", "waitlist_form_view");
  }, []);

  return (
    <form
      action={formAction}
      onSubmit={() => trackEvent("waitlist_submit_attempt")}
      className="space-y-5"
      noValidate
    >
      <input type="hidden" name="utm_source" value={params.get("utm_source") ?? ""} />
      <input type="hidden" name="utm_medium" value={params.get("utm_medium") ?? ""} />
      <input type="hidden" name="utm_campaign" value={params.get("utm_campaign") ?? ""} />

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
        <FieldError field="email" state={state} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Select name="city" defaultValue={cities[0]?.slug ?? "other"}>
          <SelectTrigger id="city">
            <SelectValue placeholder="Pick your city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
            <SelectItem value="other">Other (specify)</SelectItem>
          </SelectContent>
        </Select>
        <Input
          id="cityOther"
          name="cityOther"
          placeholder="If 'Other' — type your city"
          className="mt-2"
        />
        <FieldError field="city" state={state} />
      </div>

      <div className="space-y-2">
        <Label>I want to…</Label>
        <RadioGroup name="intent" defaultValue="customer">
          <RadioRow value="customer" label="Send packages" />
          <RadioRow value="driver" label="Drive" />
          <RadioRow value="both" label="Both" />
        </RadioGroup>
        <FieldError field="intent" state={state} />
      </div>

      <label className="flex items-start gap-3 text-sm text-alin-muted">
        <Checkbox name="consentMarketing" required />
        <span>I agree to receive launch updates from ALiN Move.</span>
      </label>
      <FieldError field="consentMarketing" state={state} />

      {state.error && !state.fieldErrors && (
        <p role="alert" className="text-sm text-alin-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Adding you…" : "Join the waitlist"}
      </Button>
    </form>
  );
}

function RadioRow({ value, label }: { value: string; label: string }) {
  return (
    <label className="flex items-center gap-3 text-sm text-alin-white">
      <RadioGroupItem value={value} id={`intent-${value}`} />
      <span>{label}</span>
    </label>
  );
}

function FieldError({ field, state }: { field: string; state: WaitlistState }) {
  const msg = state.fieldErrors?.[field]?.[0];
  if (!msg) return null;
  return (
    <p role="alert" className="text-xs text-alin-danger">
      {msg}
    </p>
  );
}
