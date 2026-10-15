import { TopNav, type NavLink } from "@/components/nav/TopNav";
import { Footer, type FooterColumn, type FooterSocial } from "@/components/nav/Footer";
import { StickyDownloadBar } from "@/components/sections/StickyDownloadBar";
import { ReducedMotionProvider } from "@/components/motion/ReducedMotionProvider";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { getGlobal } from "@/lib/payload";

type SiteSettings = {
  tagline?: string;
  navLinks?: NavLink[];
  footerColumns?: FooterColumn[];
  social?: FooterSocial[];
};

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const settings = (await getGlobal<SiteSettings>("site-settings")) ?? {};

  return (
    <ReducedMotionProvider>
      <MotionProvider>
        <div className="flex min-h-screen flex-col bg-alin-black">
          <TopNav links={settings.navLinks} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer
            columns={settings.footerColumns}
            social={settings.social}
            tagline={settings.tagline}
          />
          <StickyDownloadBar />
        </div>
      </MotionProvider>
    </ReducedMotionProvider>
  );
}
