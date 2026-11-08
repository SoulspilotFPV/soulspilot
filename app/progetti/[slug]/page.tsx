import { notFound } from "next/navigation";
import type { Metadata } from "next";
import FooterCurtain from "@/components/FooterCurtain";
import ProjectHero from "@/components/ProjectHero";
import ProjectGallery from "@/components/ProjectGallery";
import NextProject from "@/components/NextProject";
import Reveal from "@/components/Reveal";
import TransitionLink from "@/components/shell/TransitionLink";
import Keepsake from "@/components/Keepsake";
import { pageMeta } from "@/lib/meta";
import { navCta, readyWorks, site } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams() {
  return readyWorks.map((w) => ({ slug: w.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const w = readyWorks.find((x) => x.slug === params.slug);
  if (!w) return { title: site.brand };
  return pageMeta({ title: `${w.title} · ${site.brand}`, description: w.line, path: `/progetti/${w.slug}`, image: w.slug });
}

export default function WorkDetail({ params }: { params: Params }) {
  const i = readyWorks.findIndex((x) => x.slug === params.slug);
  if (i < 0) notFound();
  const w = readyWorks[i];
  const next = readyWorks[(i + 1) % readyWorks.length];

  return (
    <>
      <main id="main" data-scene="sopra">
        <ProjectHero w={w} />

        {/* il racconto sale sopra la ripresa mentre questa si ritira */}
        <section className="relative z-20 -mt-[38vh] px-3 pb-16 sm:px-6">
          <div className="mx-auto grid max-w-page grid-cols-1 gap-10 rounded-[32px] border border-white/60 bg-white/70 p-6 shadow-[0_40px_100px_-40px_rgba(20,24,26,.45)] backdrop-blur-2xl sm:p-10 md:rounded-huge md:p-14 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <div className="min-w-0">
              <TransitionLink href="/progetti" label="Rotta: Progetti" className="mb-8 inline-flex items-center gap-2 text-[14px] text-ink2 transition-colors hover:text-verde">
                <span aria-hidden>←</span> Tutti i progetti
              </TransitionLink>
              <Reveal>
                <span className="eyebrow mb-5">Il progetto</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="h2 mb-6">
                  {w.kind === "chiave" ? "La chiave: " : "La cartolina: "}<span className="accent">{w.title}</span>.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                {w.story.map((t) => (
                  <p key={t} className="mb-4 text-ink2 last:mb-0">
                    {t}
                  </p>
                ))}
              </Reveal>
            </div>
            <div className="flex min-w-0 flex-col gap-6 lg:self-start">
              <Reveal delay={0.1}>
                <Keepsake w={w} />
              </Reveal>
            </div>
          </div>
        </section>

        {w.stills && (
          <section className="px-3 pb-16 sm:px-6">
            <div className="mx-auto max-w-page">
              <Reveal>
                <h2 className="h2 mb-8 px-2 text-ink">
                  Fotogrammi <span className="accent">dal volo</span>
                </h2>
              </Reveal>
              <ProjectGallery dir={w.stills} picks={[1, 2, 3, 4, 5, 6]} title={w.title} />
            </div>
          </section>
        )}

        <section className="px-3 pb-24 sm:px-6">
          <div className="mx-auto grid max-w-page gap-4 lg:grid-cols-2">
            <Reveal className="flex flex-col justify-between gap-8 rounded-[32px] border border-white/50 bg-sage/70 p-8 backdrop-blur-xl md:p-12">
              <h2 className="text-[clamp(32px,4vw,48px)] font-semibold leading-[1.05] tracking-[-0.03em]">
                Hai un luogo <span className="accent">da raccontare?</span>
              </h2>
              <TransitionLink href="/contatti" label="Rotta: Contatti" className="btn btn-light self-start">
                {navCta.label} <span className="dot" aria-hidden />
              </TransitionLink>
            </Reveal>
            <NextProject w={next} />
          </div>
        </section>
      </main>
      <FooterCurtain scene="sopra" />
    </>
  );
}
