import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import "../styles/pages.css";
import "../styles/chrome.css";
import { CookieBanner } from "@/components/CookieBanner";
import { SEO } from "@/data/content";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "block",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  // Approved strings from the Website Copy Master, not a working placeholder.
  title: SEO.home.title,
  description: SEO.home.description,
  // Staging build. This must be lifted at launch — see LAUNCH_BLOCKERS.md.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodoni.variable} ${jost.variable}`}>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
