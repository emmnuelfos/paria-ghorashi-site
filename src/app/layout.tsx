import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luke Baffait, Creative Developer — Study Clone",
  description:
    "Local study clone of lukebaffait.fr rebuilt in Next.js for animation/technique research. Not for publication.",
  robots: { index: false, follow: false },
  icons: { icon: "/assets/favicon/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
