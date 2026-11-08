import { pageMeta } from "@/lib/meta";
import Contact from "@/components/Contact";
import CtaBanner from "@/components/CtaBanner";
import FooterCurtain from "@/components/FooterCurtain";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: `Parliamone in 30 minuti · ${site.brand}`,
  description: "Prenota una chiamata di 30 minuti per raccontarmi il tuo luogo. Ti rispondo entro 24 ore.",
  path: "/contatti",
  image: "contatti",
});

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
