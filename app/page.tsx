import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import Journey from "@/components/Journey";
import LandingEnd from "@/components/LandingEnd";
import FooterCurtain from "@/components/FooterCurtain";
import { pageMeta } from "@/lib/meta";
import { site } from "@/lib/site";

export const metadata = pageMeta({ title: site.title, description: site.description, path: "/", image: "home" });

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: site.name,
      jobTitle: "Pilota di droni e videomaker aereo",
      url: site.url,
      ...(site.email ? { email: site.email } : {}),
      ...(Object.keys(site.social).length ? { sameAs: Object.values(site.social) } : {}),
    },
    {
      "@type": "ProfessionalService",
      name: site.brand,
      description: site.description,
      url: site.url,
      ...(site.email ? { email: site.email } : {}),
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
