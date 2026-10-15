import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";
import { createSignedResumeUrl } from "@/lib/applications";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const payload = await getPayloadClient();

  // Verify the caller is an authenticated Payload user
  let userId: string | number | undefined;
  try {
    const auth = await payload.auth({ headers: req.headers });
    userId = auth.user ? (auth.user as { id?: string | number }).id : undefined;
  } catch (err) {
    console.error("[admin/resume] auth failed", err);
  }
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const applicationId = /^\d+$/.test(id) ? Number(id) : id;

  let resumeKey: string | undefined;
  try {
    const app = await payload.findByID({
      collection: "applications",
      id: applicationId as never,
      depth: 0,
      overrideAccess: false,
    });
    resumeKey = (app as { resumeKey?: string }).resumeKey;
  } catch (err) {
    console.error("[admin/resume] findByID failed", err);
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  if (!resumeKey) {
    return NextResponse.json({ ok: false, error: "No resume" }, { status: 404 });
  }

  const signedUrl = await createSignedResumeUrl(resumeKey);
  if (!signedUrl) {
    return NextResponse.json({ ok: false, error: "Could not sign URL" }, { status: 500 });
  }

  return NextResponse.redirect(signedUrl, 302);
}
