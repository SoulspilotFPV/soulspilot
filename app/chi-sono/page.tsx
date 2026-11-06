import type { Metadata } from "next";
import About from "@/components/About";
import FooterCurtain from "@/components/FooterCurtain";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Chi sono · ${site.brand}`,
  description: "Riprese aeree e FPV, siti web su misura e mindfulness: chi c'è dietro soulspilot.",
};

export default function ChiSono() {
  return (
    <>
      <main id="main" data-scene="sopra" className="pt-24 md:pt-28">
        <About />
      </main>
      <FooterCurtain scene="sopra" />
    </>
  );
}
