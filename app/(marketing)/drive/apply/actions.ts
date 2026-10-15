"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createRiderAppClient } from "@/lib/supabase";
import { trackEventServer } from "@/lib/analytics-server";

const Schema = z.object({
  fullName: z.string().min(2).max(120),
  mobile: z
    .string()
    .regex(/^(\+63|0)9\d{9}$/u, "Use a PH mobile number, e.g. +639XXXXXXXXX or 09XXXXXXXXX."),
  email: z.string().email().toLowerCase().trim(),
  city: z.string().min(1).max(80),
  vehicleType: z.enum(["motorcycle", "sedan", "mpv", "pickup", "van"]),
  plate: z.string().max(20).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm you agree to the Driver Terms." }),
  }),
});

export type ApplyState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const raw = {
    fullName: formData.get("fullName"),
    mobile: formData.get("mobile"),
    email: formData.get("email"),
    city: formData.get("city"),
    vehicleType: formData.get("vehicleType"),
    plate: formData.get("plate") || undefined,
    consent: formData.get("consent") === "on",
  };

  const parsed = Schema.safeParse(raw);
  if (!parsed.success) {
    await trackEventServer("apply_submit_error", { reason: "validation" });
    return {
      error: "Please check your inputs.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = createRiderAppClient();
    const { error } = await supabase.from("driver_applications").insert({
      full_name: parsed.data.fullName,
      mobile: parsed.data.mobile,
      email: parsed.data.email,
      city: parsed.data.city,
      vehicle_type: parsed.data.vehicleType,
      plate: parsed.data.plate ?? null,
      source: "website",
    });
    if (error) {
      console.error("apply insert error", error);
      await trackEventServer("apply_submit_error", { reason: "db" });
      return { error: "Something went wrong. Please try again." };
    }
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[apply] Rider App Supabase not configured — skipping insert.", err);
    } else {
      throw err;
    }
  }

  await trackEventServer("apply_submit_success", {
    vehicle_type: parsed.data.vehicleType,
    city: parsed.data.city,
  });

  redirect("/drive/apply/thank-you");
}
