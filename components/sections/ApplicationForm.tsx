"use client";

import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  submitApplication,
  type ApplicationState,
} from "@/app/(marketing)/careers/[slug]/apply/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { trackEvent } from "@/lib/analytics";
import { trackOnce } from "@/lib/analytics-helpers";

const initialState: ApplicationState = {};
const MAX_BYTES = 5 * 1024 * 1024;

export function ApplicationForm({
  jobId,
  jobSlug,
  jobTitle,
}: {
  jobId: string | number;
  jobSlug: string;
  jobTitle: string;
}) {
  const [state, formAction, pending] = useActionState(submitApplication, initialState);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const params = useSearchParams();

  useEffect(() => {
    trackOnce(`careers-apply-form-view:${jobSlug}`, "careers_apply_form_view", {
      job_slug: jobSlug,
    });
  }, [jobSlug]);

  return (
    <form
      action={formAction}
      onSubmit={() =>
        trackEvent("careers_apply_submit_attempt", { job_slug: jobSlug })
      }
      className="space-y-6"
      noValidate
      encType="multipart/form-data"
    >
      <input type="hidden" name="jobId" value={String(jobId)} />
      <input type="hidden" name="jobSlug" value={jobSlug} />
      <input type="hidden" name="jobTitle" value={jobTitle} />
      <input type="hidden" name="utm_source" value={params.get("utm_source") ?? ""} />
      <input type="hidden" name="utm_medium" value={params.get("utm_medium") ?? ""} />
      <input type="hidden" name="utm_campaign" value={params.get("utm_campaign") ?? ""} />

      {/* Honeypot — visually hidden but available to bots. */}
      <div aria-hidden className="hidden">
        <label>
          Company website
          <input type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" name="firstName" required state={state} autoComplete="given-name" />
        <Field label="Last name" name="lastName" required state={state} autoComplete="family-name" />
      </div>

      <Field
        label="Email"
        name="email"
        type="email"
        required
        state={state}
        autoComplete="email"
      />

      <Field label="Phone" name="phone" type="tel" required state={state} autoComplete="tel" />

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="LinkedIn" name="linkedinUrl" type="url" state={state} placeholder="https://…" />
        <Field label="GitHub" name="githubUrl" type="url" state={state} placeholder="https://…" />
        <Field label="Portfolio" name="portfolioUrl" type="url" state={state} placeholder="https://…" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume">
          Resume <span className="text-alin-muted">(PDF or .docx, max 5 MB)</span>
        </Label>
        <Input
          id="resume"
          name="resume"
          type="file"
          required
          accept=".pdf,.docx,.doc,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => {
            const f = e.currentTarget.files?.[0] ?? null;
            setFileError(null);
            if (!f) {
              setFileMeta(null);
              return;
            }
            if (f.size > MAX_BYTES) {
              setFileError("That file is over 5 MB. Please upload a smaller resume.");
              setFileMeta(null);
              e.currentTarget.value = "";
              return;
            }
            setFileMeta({ name: f.name, size: f.size });
          }}
        />
        {fileMeta && (
          <p className="text-xs text-alin-muted">
            {fileMeta.name} · {(fileMeta.size / 1024).toFixed(0)} KB
          </p>
        )}
        {fileError && (
          <p role="alert" className="text-xs text-alin-danger">
            {fileError}
          </p>
        )}
        <FieldError field="resume" state={state} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverLetter">Cover letter (optional)</Label>
        <Textarea
          id="coverLetter"
          name="coverLetter"
          rows={6}
          placeholder="Anything else we should know? Why this role?"
        />
        <FieldError field="coverLetter" state={state} />
      </div>

      <label className="flex items-start gap-3 text-sm text-alin-muted">
        <Checkbox name="consentProcessing" required />
        <span>
          I consent to ALiN Move processing this application per the{" "}
          <a
            href="/legal/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-alin-gold underline-offset-4 hover:underline"
          >
            privacy policy
          </a>
          .
        </span>
      </label>
      <FieldError field="consentProcessing" state={state} />

      {state.error && !state.fieldErrors && (
        <p role="alert" className="text-sm text-alin-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending || Boolean(fileError)} className="w-full">
        {pending ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  state,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  state: ApplicationState;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {!required && <span className="ml-1 text-alin-muted">(optional)</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
      <FieldError field={name} state={state} />
    </div>
  );
}

function FieldError({ field, state }: { field: string; state: ApplicationState }) {
  const msg = state.fieldErrors?.[field]?.[0];
  if (!msg) return null;
  return (
    <p role="alert" className="text-xs text-alin-danger">
      {msg}
    </p>
  );
}
