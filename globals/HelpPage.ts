import { simplePageGlobal } from "./_shared";

/**
 * Help / FAQ index page. Body is the intro copy; the actual FAQ list is
 * driven by the FAQItems collection (audience filter applied at the page).
 */
export const HelpPage = simplePageGlobal({
  slug: "help-page",
  label: "Help Page",
  paths: ["/help"],
});
