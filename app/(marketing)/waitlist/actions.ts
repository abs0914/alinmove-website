"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createWaitlistClient } from "@/lib/supabase";
import { sendWaitlistConfirmation } from "@/lib/resend";
import { trackEventServer } from "@/lib/analytics-server";

const Schema = z.object({
  email: z.string().email().toLowerCase().trim(),
  city: z.string().min(1).max(80),
  cityOther: z.string().max(80).optional(),
  intent: z.enum(["customer", "driver", "both"]),
  consentMarketing: z.literal(true, {
    errorMap: () => ({ message: "You must consent to receive updates." }),
  }),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
    })
    .optional(),
});

export type WaitlistState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function joinWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const cityRaw = formData.get("city");
  const cityOther = (formData.get("cityOther") || "") as string;
  const raw = {
    email: formData.get("email"),
    city: cityRaw === "other" ? cityOther : cityRaw,
    cityOther: cityOther || undefined,
    intent: formData.get("intent"),
    consentMarketing: formData.get("consentMarketing") === "on",
    utm: {
      source: (formData.get("utm_source") as string) || undefined,
      medium: (formData.get("utm_medium") as string) || undefined,
      campaign: (formData.get("utm_campaign") as string) || undefined,
    },
  };

  const parsed = Schema.safeParse(raw);
  if (!parsed.success) {
    await trackEventServer("waitlist_submit_error", { reason: "validation" });
    return {
      error: "Please check your inputs.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = createWaitlistClient();
    const { error } = await supabase.from("waitlist").insert({
      email: parsed.data.email,
      city: parsed.data.city,
      intent: parsed.data.intent,
      consent_marketing: parsed.data.consentMarketing,
      utm: parsed.data.utm,
      source: "website",
    });

    if (error && error.code !== "23505") {
      // Anything other than "duplicate key" is a real error.
      console.error("waitlist insert error", error);
      await trackEventServer("waitlist_submit_error", { reason: "db" });
      return { error: "Something went wrong. Please try again." };
    }

    if (!error) {
      // Fire-and-forget confirmation email. Skip on duplicate to avoid spam.
      sendWaitlistConfirmation(parsed.data.email, { intent: parsed.data.intent }).catch((e) =>
        console.error("waitlist email error", e),
      );
    }
  } catch (err) {
    // Supabase client not configured in this environment — degrade gracefully
    // so the form still appears to work in dev / preview builds.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[waitlist] Supabase not configured — skipping insert.", err);
    } else {
      throw err;
    }
  }

  await trackEventServer("waitlist_submit_success", {
    intent: parsed.data.intent,
    city: parsed.data.city,
    utm_source: parsed.data.utm?.source,
  });

  redirect(`/waitlist/thank-you?intent=${parsed.data.intent}`);
}
