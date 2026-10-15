"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import {
  generateResumeKey,
  hashIp,
  safeUrl,
  uploadResumeToSupabase,
  validateResumeFile,
} from "@/lib/applications";
import {
  sendApplicationConfirmation,
  sendHiringManagerNotification,
} from "@/lib/resend";
import { trackEventServer } from "@/lib/analytics-server";
import { SITE_URL } from "@/lib/utils";

export type ApplicationState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const FormSchema = z.object({
  jobId: z.string().min(1),
  jobSlug: z.string().min(1).max(120),
  jobTitle: z.string().min(1).max(200),
  firstName: z.string().min(1, "Required").max(80).trim(),
  lastName: z.string().min(1, "Required").max(80).trim(),
  email: z.string().email("Enter a valid email.").toLowerCase().trim(),
  phone: z.string().min(5, "Enter a valid phone number.").max(30).trim(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  coverLetter: z.string().max(5000).optional(),
  consentProcessing: z.literal(true, {
    errorMap: () => ({ message: "You must consent to continue." }),
  }),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
    })
    .optional(),
});

export async function submitApplication(
  _prev: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  // Honeypot — silently succeed
  const honeypot = formData.get("companyWebsite");
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    const slug = (formData.get("jobSlug") as string) || "";
    redirect(`/careers/${slug}/apply/thank-you`);
  }

  const raw = {
    jobId: formData.get("jobId"),
    jobSlug: formData.get("jobSlug"),
    jobTitle: formData.get("jobTitle"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    linkedinUrl: (formData.get("linkedinUrl") as string) || undefined,
    githubUrl: (formData.get("githubUrl") as string) || undefined,
    portfolioUrl: (formData.get("portfolioUrl") as string) || undefined,
    coverLetter: (formData.get("coverLetter") as string) || undefined,
    consentProcessing: formData.get("consentProcessing") === "on",
    utm: {
      source: (formData.get("utm_source") as string) || undefined,
      medium: (formData.get("utm_medium") as string) || undefined,
      campaign: (formData.get("utm_campaign") as string) || undefined,
    },
  };

  const parsed = FormSchema.safeParse(raw);
  if (!parsed.success) {
    await trackEventServer("careers_apply_submit_error", {
      reason: "validation",
      job_slug: (raw.jobSlug as string) || "",
    });
    return {
      error: "Please check your inputs.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Normalize optional URLs (reject non-http(s) silently → treated as empty)
  const linkedinUrl = safeUrl(parsed.data.linkedinUrl);
  const githubUrl = safeUrl(parsed.data.githubUrl);
  const portfolioUrl = safeUrl(parsed.data.portfolioUrl);

  // Validate resume
  const file = formData.get("resume");
  const resumeCheck = await validateResumeFile(file instanceof File ? file : null);
  if (!resumeCheck.ok) {
    await trackEventServer("careers_apply_submit_error", {
      reason: "file",
      job_slug: parsed.data.jobSlug,
    });
    return {
      error: resumeCheck.reason,
      fieldErrors: { resume: [resumeCheck.reason] },
    };
  }

  // Capture IP + UA
  const h = await headers();
  const rawIp = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip");
  const ipHash = hashIp(rawIp);
  const userAgent = (h.get("user-agent") ?? "").slice(0, 500);

  const payload = await getPayloadClient();

  // Rate-limit: 3 per IP per hour
  try {
    const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recent = await payload.count({
      collection: "applications",
      where: {
        and: [{ ipHash: { equals: ipHash } }, { appliedAt: { greater_than: cutoff } }],
      },
      overrideAccess: true,
    });
    if ((recent.totalDocs ?? 0) >= 3) {
      await trackEventServer("careers_apply_submit_error", {
        reason: "rate_limit",
        job_slug: parsed.data.jobSlug,
      });
      return {
        error: "Too many applications from this network. Please try again later.",
      };
    }
  } catch (err) {
    console.warn("[careers] rate-limit check failed", err);
  }

  // Dedupe: same email + job in last 24h
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const dupe = await payload.count({
      collection: "applications",
      where: {
        and: [
          { email: { equals: parsed.data.email } },
          { job: { equals: parsed.data.jobId } },
          { appliedAt: { greater_than: cutoff } },
        ],
      },
      overrideAccess: true,
    });
    if ((dupe.totalDocs ?? 0) > 0) {
      redirect(
        `/careers/${parsed.data.jobSlug}/apply/thank-you?first=${encodeURIComponent(
          parsed.data.firstName,
        )}`,
      );
    }
  } catch (err) {
    console.warn("[careers] dedupe check failed", err);
  }

  // Upload resume
  const resumeKey = generateResumeKey({
    jobSlug: parsed.data.jobSlug,
    filename: resumeCheck.filename,
  });
  const upload = await uploadResumeToSupabase({
    buffer: resumeCheck.buffer,
    key: resumeKey,
    mime: resumeCheck.mime,
  });
  if (!upload.ok) {
    console.error("[careers] resume upload failed", upload.reason);
    await trackEventServer("careers_apply_submit_error", {
      reason: "upload",
      job_slug: parsed.data.jobSlug,
    });
    return {
      error: "We couldn't upload your resume. Please try again in a moment.",
    };
  }

  // Persist
  let applicationId: string | number | undefined;
  try {
    const jobIdMaybeNumeric = /^\d+$/.test(parsed.data.jobId)
      ? Number(parsed.data.jobId)
      : parsed.data.jobId;
    const created = await payload.create({
      collection: "applications",
      overrideAccess: true,
      data: {
        job: jobIdMaybeNumeric,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        resumeKey,
        resumeFilename: resumeCheck.filename,
        resumeMime: resumeCheck.mime,
        resumeSize: resumeCheck.size,
        linkedinUrl: linkedinUrl ?? undefined,
        githubUrl: githubUrl ?? undefined,
        portfolioUrl: portfolioUrl ?? undefined,
        coverLetter: parsed.data.coverLetter,
        status: "applied",
        source: "website",
        appliedAt: new Date().toISOString(),
        utm: parsed.data.utm,
        ipHash,
        userAgent,
      } as never,
    });
    applicationId = (created as { id: string | number }).id;
  } catch (err) {
    console.error("[careers] application create failed", err);
    await trackEventServer("careers_apply_submit_error", {
      reason: "db",
      job_slug: parsed.data.jobSlug,
    });
    return {
      error: "Something went wrong saving your application. Please try again.",
    };
  }

  // Fire-and-forget emails
  sendApplicationConfirmation(parsed.data.email, {
    firstName: parsed.data.firstName,
    jobTitle: parsed.data.jobTitle,
  }).catch((e) => console.error("[careers] confirmation email failed", e));

  // Notify hiring manager
  try {
    const job = await payload.findByID({
      collection: "job-listings",
      id: /^\d+$/.test(parsed.data.jobId) ? Number(parsed.data.jobId) : parsed.data.jobId,
      depth: 0,
      overrideAccess: true,
    });
    const notifyTo =
      (job as { applyEmailNotify?: string }).applyEmailNotify ||
      process.env.APPLICATIONS_NOTIFY_FALLBACK_EMAIL;
    if (notifyTo && applicationId !== undefined) {
      const adminUrl = new URL(
        `/admin/collections/applications/${applicationId}`,
        SITE_URL,
      ).toString();
      sendHiringManagerNotification(notifyTo, {
        candidateName: `${parsed.data.firstName} ${parsed.data.lastName}`,
        candidateEmail: parsed.data.email,
        jobTitle: parsed.data.jobTitle,
        applicationAdminUrl: adminUrl,
      }).catch((e) => console.error("[careers] hiring-manager email failed", e));
    }
  } catch (err) {
    console.warn("[careers] hiring-manager notify lookup failed", err);
  }

  await trackEventServer("careers_apply_submit_success", {
    job_slug: parsed.data.jobSlug,
    has_cover_letter: Boolean(parsed.data.coverLetter && parsed.data.coverLetter.trim()),
    utm_source: parsed.data.utm?.source,
  });

  redirect(
    `/careers/${parsed.data.jobSlug}/apply/thank-you?first=${encodeURIComponent(
      parsed.data.firstName,
    )}`,
  );
}
