import { pageMeta } from "@/lib/meta";
import FooterCurtain from "@/components/FooterCurtain";
import Reveal from "@/components/Reveal";
import ProjectGrid from "@/components/ProjectGrid";
import TransitionLink from "@/components/shell/TransitionLink";
import { site, works } from "@/lib/site";

export const metadata = pageMeta({
  title: `Progetti · ${site.brand}`,
  description: "Cartoline e chiavi: luoghi raccontati dall'alto e da dentro, per far venire voglia di visitarli prima ancora di arrivare.",
  path: "/progetti",
  image: "progetti",
});

export default function Progetti() {
  return (
    <>
      <main id="main" data-scene="sopra" className="px-5 pb-28 pt-32 sm:px-10 md:pt-40">
        <div className="mx-auto max-w-page">
          <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <h1 className="text-[clamp(56px,9vw,128px)] font-semibold leading-[0.92] tracking-[-0.05em] text-ink">
                Progetti<span className="accent">.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="max-w-[400px]">
              <p className="text-ink/75">
                Due famiglie di racconti: le cartoline, per i luoghi da scoprire, e le chiavi, per gli spazi da abitare. Passa sopra
                un progetto per vederlo prendere vita.
              </p>
            </Reveal>
          </div>
          {/* pannello luminoso: la griglia si legge bene sopra le nuvole */}
          <div className="rounded-[32px] border border-white/60 bg-white/55 p-5 shadow-[0_40px_100px_-50px_rgba(20,24,26,.4)] backdrop-blur-2xl sm:p-8 md:rounded-[44px] md:p-12">
            <ProjectGrid works={works} />
          </div>
          {/* chiusura: il prossimo progetto */}
          <Reveal className="mt-16 flex flex-col items-start justify-between gap-8 px-1 md:mt-24 md:flex-row md:items-end">
            <h2 className="max-w-[16ch] text-[clamp(36px,5vw,68px)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
              Facciamo vivere il <span className="accent">prossimo luogo.</span>
            </h2>
            <TransitionLink href="/contatti" label="Rotta: Contatti" className="btn btn-dark">
              Prenota 30 minuti <span className="dot" aria-hidden />
            </TransitionLink>
          </Reveal>
        </div>
      </main>
      <FooterCurtain scene="sopra" />
    </>
  );
}
