import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import Journey from "@/components/Journey";
import LandingEnd from "@/components/LandingEnd";
import FooterCurtain from "@/components/FooterCurtain";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: site.name,
      jobTitle: "Pilota di droni e videomaker aereo",
      url: site.url,
      email: site.email,
      sameAs: Object.values(site.social),
    },
    {
      "@type": "LocalBusiness",
      name: site.brand,
      description: site.description,
      url: site.url,
      email: site.email,
      areaServed: "IT",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main">
        <Hero />
        <ClientLogos />
        <Journey />
        <LandingEnd />
      </main>
      <FooterCurtain scene="quiete" />
    </>
  );
}
