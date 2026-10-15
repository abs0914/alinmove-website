import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { BlogPosts } from "./collections/BlogPosts";
import { Authors } from "./collections/Authors";
import { Categories } from "./collections/Categories";
import { FAQItems } from "./collections/FAQItems";
import { Testimonials } from "./collections/Testimonials";
import { Cities } from "./collections/Cities";
import { Pages } from "./collections/Pages";
import { Departments } from "./collections/Departments";
import { JobLocations } from "./collections/JobLocations";
import { JobListings } from "./collections/JobListings";
import { Applications } from "./collections/Applications";
import {
  HomePage,
  DrivePage,
  PricingPage,
  HowItWorksPage,
  SiteSettings,
  AboutPage,
  BusinessPage,
  CareersPage,
  NetworkPage,
  TrackPage,
  HelpPage,
  DriveFlexibilityPage,
  DriveEarningsPage,
  DriveFaqPage,
  DriveApplyPage,
} from "./globals";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
    theme: "dark",
    meta: {
      titleSuffix: " — ALiN Move",
      icons: [{ rel: "icon", url: "/favicon.ico" }],
      openGraph: {
        title: "ALiN Move CMS",
        description: "Edit the ALiN Move website. Connected via Payload.",
      },
    },
    components: {
      graphics: {
        Logo: "/components/admin/AdminLogo#AdminLogo",
        Icon: "/components/admin/AdminIcon#AdminIcon",
      },
      beforeDashboard: ["/components/admin/RecruitingOverview#RecruitingOverview"],
    },
  },
  editor: lexicalEditor({}),
  collections: [
    Users,
    Media,
    Pages,
    BlogPosts,
    Authors,
    Categories,
    FAQItems,
    Testimonials,
    Cities,
    Departments,
    JobLocations,
    JobListings,
    Applications,
  ],
  globals: [
    SiteSettings,
    HomePage,
    DrivePage,
    DriveFlexibilityPage,
    DriveEarningsPage,
    DriveFaqPage,
    DriveApplyPage,
    PricingPage,
    HowItWorksPage,
    NetworkPage,
    AboutPage,
    BusinessPage,
    CareersPage,
    HelpPage,
    TrackPage,
  ],
  secret: process.env.PAYLOAD_SECRET ?? "dev-only-change-me",
  db: sqliteAdapter({
    client: {
        url:
        process.env.DATABASE_URI ?? "file:./alinmove_payload.db",
    },
    push: true,
  }),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
