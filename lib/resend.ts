/**
 * Resend client + email senders.
 * Reference: .claude/skills/waitlist-flow/SKILL.md
 */

import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL ?? "ALiN Move <hello@mail.alinmove.com>";
const UNSUBSCRIBE_URL = "https://alinmove.com/unsubscribe";

let client: Resend | null = null;
function getClient(): Resend {
  if (client) return client;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set.");
  client = new Resend(apiKey);
  return client;
}

export type WaitlistIntent = "customer" | "driver" | "both";

// ─── Careers application emails ────────────────────────────────────────────

export async function sendApplicationConfirmation(
  email: string,
  ctx: { firstName: string; jobTitle: string },
) {
  return getClient().emails.send({
    from: FROM,
    to: email,
    subject: `We received your application — ${ctx.jobTitle}`,
    html: applicationConfirmationHtml(ctx),
    text: applicationConfirmationText(ctx),
    headers: { "List-Unsubscribe": `<${UNSUBSCRIBE_URL}>` },
  });
}

export async function sendHiringManagerNotification(
  to: string,
  ctx: {
    candidateName: string;
    candidateEmail: string;
    jobTitle: string;
    applicationAdminUrl: string;
  },
) {
  return getClient().emails.send({
    from: FROM,
    to,
    subject: `New application — ${ctx.jobTitle}`,
    text: [
      `New application received for ${ctx.jobTitle}.`,
      "",
      `Candidate: ${ctx.candidateName}`,
      `Email: ${ctx.candidateEmail}`,
      "",
      `Review in admin: ${ctx.applicationAdminUrl}`,
    ].join("\n"),
    html: `<!doctype html><html><body style="margin:0;padding:0;background:#f4f4f5;font-family:Inter,Arial,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr><td align="center" style="padding:32px 16px;">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr><td style="background:#000;padding:24px 32px;">
              <span style="color:#FFC000;font-weight:700;font-size:18px;">ALiN Move — Recruiting</span>
            </td></tr>
            <tr><td style="padding:32px;color:#0f1117;line-height:1.6;">
              <p style="margin:0 0 16px;">A new application has landed.</p>
              <p style="margin:0 0 8px;"><strong>Role:</strong> ${escapeHtml(ctx.jobTitle)}</p>
              <p style="margin:0 0 8px;"><strong>Candidate:</strong> ${escapeHtml(ctx.candidateName)}</p>
              <p style="margin:0 0 24px;"><strong>Email:</strong> ${escapeHtml(ctx.candidateEmail)}</p>
              <p style="margin:0;"><a href="${ctx.applicationAdminUrl}" style="display:inline-block;background:#FFC000;color:#000;text-decoration:none;padding:12px 24px;border-radius:9999px;font-weight:600;">Review application</a></p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body></html>`,
  });
}

function applicationConfirmationText({ firstName, jobTitle }: { firstName: string; jobTitle: string }) {
  return [
    `Hi ${firstName} —`,
    "",
    `Thanks for applying to ${jobTitle} at ALiN Move. We've received your resume and the team will review it within 5 business days.`,
    "",
    "ALiN Move is the digital layer of ALiN Cargo Express's nationwide network. We're hiring people who are excited to build the customer + driver experience on top of an established Philippine logistics backbone.",
    "",
    "— Team ALiN Move",
    "",
    `Unsubscribe: ${UNSUBSCRIBE_URL}`,
  ].join("\n");
}

function applicationConfirmationHtml({ firstName, jobTitle }: { firstName: string; jobTitle: string }) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4f4f5;font-family:Inter,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#000;padding:24px 32px;">
          <span style="color:#FFC000;font-weight:700;font-size:18px;">ALiN Move</span>
        </td></tr>
        <tr><td style="padding:32px;color:#0f1117;line-height:1.6;">
          <p style="margin:0 0 16px;">Hi ${escapeHtml(firstName)} —</p>
          <p style="margin:0 0 16px;">Thanks for applying to <strong>${escapeHtml(jobTitle)}</strong> at ALiN Move. We've received your resume and the team will review it within 5 business days.</p>
          <p style="margin:0 0 16px;">ALiN Move is the digital layer of ALiN Cargo Express's nationwide network — we're hiring people who are excited to build the customer + driver experience on top of an established Philippine logistics backbone.</p>
          <p style="margin:24px 0 0;">— Team ALiN Move</p>
        </td></tr>
        <tr><td style="padding:16px 32px;background:#f4f4f5;color:#71717a;font-size:12px;">
          You're receiving this because you applied at alinmove.com.
          <a href="${UNSUBSCRIBE_URL}" style="color:#71717a;">Unsubscribe</a>.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendWaitlistConfirmation(
  email: string,
  ctx: { intent: WaitlistIntent },
) {
  return getClient().emails.send({
    from: FROM,
    to: email,
    subject: subjectFor(ctx.intent),
    html: confirmationHtml(ctx),
    text: confirmationText(ctx),
    headers: { "List-Unsubscribe": `<${UNSUBSCRIBE_URL}>` },
  });
}

function subjectFor(intent: WaitlistIntent) {
  if (intent === "driver") return "You're on the rider waitlist — ALiN Move";
  return "You're on the waitlist — ALiN Move";
}

function driverFollowupBlock(intent: WaitlistIntent) {
  if (intent === "customer") return "";
  return "When the Rider App goes live, we'll send a follow-up with the application link. You'll complete the rest there: documents, vehicle, branch preference.\n\n";
}

function confirmationText({ intent }: { intent: WaitlistIntent }) {
  return [
    "Hi there —",
    "",
    "You're on the ALiN Move waitlist. We'll let you know the moment the apps are live.",
    "",
    "ALiN Move is the digital layer of ALiN Cargo Express's nationwide network — meaning we can move parcels not just across your city, but across the country. Doorstep to anywhere in the Philippines.",
    "",
    `Your intent: ${intent}`,
    "",
    driverFollowupBlock(intent),
    "— Team ALiN Move",
    "",
    `Unsubscribe: ${UNSUBSCRIBE_URL}`,
  ].join("\n");
}

function confirmationHtml({ intent }: { intent: WaitlistIntent }) {
  const driver =
    intent === "customer"
      ? ""
      : `<p style="margin:0 0 16px;color:#0f1117;line-height:1.6;">When the Rider App goes live, we'll send a follow-up with the application link. You'll complete the rest there: documents, vehicle, branch preference.</p>`;
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4f4f5;font-family:Inter,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#000;padding:24px 32px;">
          <span style="color:#FFC000;font-weight:700;font-size:18px;">ALiN Move</span>
        </td></tr>
        <tr><td style="padding:32px;color:#0f1117;line-height:1.6;">
          <p style="margin:0 0 16px;">Hi there —</p>
          <p style="margin:0 0 16px;">You're on the ALiN Move waitlist. We'll let you know the moment the apps are live.</p>
          <p style="margin:0 0 16px;">ALiN Move is the digital layer of ALiN Cargo Express's nationwide network — meaning we can move parcels not just across your city, but across the country. <strong>Doorstep to anywhere in the Philippines.</strong></p>
          <p style="margin:0 0 16px;color:#71717a;font-size:14px;">Your intent: <strong>${intent}</strong></p>
          ${driver}
          <p style="margin:24px 0 0;">— Team ALiN Move</p>
        </td></tr>
        <tr><td style="padding:16px 32px;background:#f4f4f5;color:#71717a;font-size:12px;">
          You're receiving this because you signed up at alinmove.com.
          <a href="${UNSUBSCRIBE_URL}" style="color:#71717a;">Unsubscribe</a>.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
