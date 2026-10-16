import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { MetaPixelPageViews } from "@/components/analytics/MetaPixel";
import { META_PIXEL_ID, MetaPixelHead } from "@/components/analytics/MetaPixelHead";
import { buildMetadata } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = buildMetadata({
  title: "ALiN Move — Doorstep to anywhere",
  description:
    "The digital layer of ALiN Cargo Express's nationwide network. Send packages doorstep to anywhere in the Philippines.",
  path: "/",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <MetaPixelHead />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
        {META_PIXEL_ID ? <MetaPixelPageViews /> : null}
        <Script
          src="https://chat.alinmove.com/widget/widget.js"
          data-tenant="alin"
          data-api="https://chat.alinmove.com"
          data-theme="dark"
          data-accent="#ffc000"
          data-title="AlinChat Support"
          data-greeting="Hi! Ask me about pricing, coverage, or tracking. 📦"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
