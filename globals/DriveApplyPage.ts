import { simplePageGlobal } from "./_shared";

/**
 * Drive apply page. Body is the framing copy around the application form;
 * the form itself stays in JSX since it submits to Supabase.
 */
export const DriveApplyPage = simplePageGlobal({
  slug: "drive-apply-page",
  label: "Drive — Apply",
  paths: ["/drive/apply"],
});
