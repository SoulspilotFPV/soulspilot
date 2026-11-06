import type { Metadata } from "next";
import Contact from "@/components/Contact";
import CtaBanner from "@/components/CtaBanner";
import FooterCurtain from "@/components/FooterCurtain";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Contatti · ${site.brand}`,
  description: "Fai vivere un luogo: riprese aeree, voli FPV e siti web. Prenota una chiamata.",
};

export default function Contatti() {
  return (
    <>
      <main id="main" data-scene="sopra" className="pt-20 md:pt-24">
        <Contact />
        <CtaBanner />
      </main>
      <FooterCurtain scene="sopra" />
    </>
  );
}
