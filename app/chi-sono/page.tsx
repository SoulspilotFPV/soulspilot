import { pageMeta } from "@/lib/meta";
import About from "@/components/About";
import FooterCurtain from "@/components/FooterCurtain";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: `Chi sono · ${site.brand}`,
  description: "Presenza, ascolto, volo lento e suono registrato sul posto: chi c'è dietro soulspilot.",
  path: "/chi-sono",
  image: "chi-sono",
});

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
