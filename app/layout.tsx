import type { Metadata, Viewport } from "next";
import { Manrope, Instrument_Serif, Caveat, DM_Mono } from "next/font/google";
import { site } from "@/lib/site";
import SiteShell from "@/components/shell/SiteShell";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
  display: "swap",
});
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand", display: "swap" });
const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url.endsWith("/") ? site.url : site.url + "/"),
  title: site.title,
  description: site.description,
  openGraph: { siteName: site.brand, locale: "it_IT", type: "website" },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${manrope.variable} ${serif.variable} ${hand.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Vai al contenuto
        </a>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
