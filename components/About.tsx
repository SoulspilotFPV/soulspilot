"use client";

import PresenceCanvas from "./PresenceCanvas";
import Reveal from "./Reveal";
import Placeholder from "./Placeholder";
import TransitionLink from "./shell/TransitionLink";
import { site } from "@/lib/site";

// il cosa: arriva dopo il perché e il come
const roles: { title: string; text: string; link?: { href: string; label: string; intro: string } }[] = [
  {
    title: "Riprese aeree e FPV ininterrotte",
    text: "Territori, fortezze, hotel e dimore di pregio, raccontati dall'alto e da dentro con un unico volo fluido e liscio.",
  },
  {
    title: "Esperienze web su misura",
    text: "L'esperienza non finisce con il video: la prolunghiamo sul web con siti costruiti attorno alle immagini, perché chi arriva continui a vivere il luogo fino alla visita o alla prenotazione.",
  },
  {
    title: "Presenza e suono d'ambiente",
    text: "Il filo di tutto. Prima di volare ascoltiamo il luogo, registrando i suoi suoni naturali sul posto per restituire un'atmosfera acustica e visiva viva e autentica.",
    link: { href: "https://aeton.app", label: "aeton.app", intro: "Se sei curioso della mindfulness:" },
  },
];

const step = "mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-verde";

export default function About() {
  return (
    <section id="chi-sono" className="px-3 py-6 sm:px-6 md:py-12">
      <div className="mx-auto max-w-page rounded-[32px] border border-white/60 bg-sand/75 shadow-[0_30px_80px_-40px_rgba(30,33,35,.35)] backdrop-blur-xl md:backdrop-blur-2xl px-5 py-16 sm:px-8 md:rounded-huge md:px-12 md:py-[120px]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative h-[440px] overflow-hidden rounded-[28px] bg-dusk sm:h-[520px] lg:h-[600px] lg:rounded-[36px]">
              <PresenceCanvas />
              <div className="absolute left-1/2 top-1/2 h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_0_6px_rgba(201,214,195,.25),0_0_60px_10px_rgba(201,214,195,.28)] sm:h-[190px] sm:w-[190px]">
                <Placeholder
                  caption="ritratto"
                  a="#2a3033"
                  b="#323a3d"
                  round
                  className="h-full w-full overflow-hidden [&>span]:!m-0 [&>span]:mb-6 [&>span]:!bg-dusk/60 [&>span]:!text-[10px] [&>span]:!text-white/70"
                />
              </div>
              <p className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-2 font-mono text-[11px] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-verde" aria-hidden />
                presenza · tocca o muovi
              </p>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="eyebrow mb-6">Chi sono</span>
            </Reveal>

            {/* il perché */}
            <Reveal delay={0.05}>
              <h1 className="h2 mb-7">
                Volo per far sentire <span className="accent">l&apos;anima</span> di un luogo.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mb-14 text-[18px] leading-relaxed text-ink2">
                Sono {site.firstName}, insegnante di mindfulness, e ogni volo per me è un esercizio di presenza. Porto quella
                piena consapevolezza in un volo armonioso, perché chi guarda possa provare quello che provo io lassù: il
                contatto con l&apos;essenza del luogo, non solo la sua immagine. È per questo che faccio questo lavoro.
              </p>
            </Reveal>

            {/* il come */}
            <Reveal delay={0.05}>
              <p className={step}>Il come</p>
              <p className="mb-4 text-[24px] font-medium leading-[1.2] tracking-tight sm:text-[30px]">
                Con calma, e <span className="accent">ascoltando</span>.
              </p>
              <p className="mb-14 text-ink2">
                Prima di volare ascolto te e il luogo: chi lo vive, a chi vuoi arrivare, cosa deve restare a chi guarda. Poi
                voli lenti e morbidi, un montaggio che respira, un suono che fa sentire il posto.
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <p className={step}>Il cosa</p>
            </Reveal>

            <ol className="border-t border-ink/10">
              {roles.map((r, i) => (
                <Reveal as="li" key={r.title} delay={0.05 + i * 0.06} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-ink/10 py-6">
                  <span className="pt-1.5 font-mono text-[11px] tracking-[0.16em] text-ink3">0{i + 1}</span>
                  <div>
                    <h3 className="mb-1.5 text-[22px] font-semibold tracking-tight text-ink sm:text-[24px]">{r.title}</h3>
                    <p className="max-w-[52ch] text-[15.5px] leading-snug text-ink2">{r.text}</p>
                    {r.link && (
                      <p className="mt-3 text-[15px] text-ink2">
                        {r.link.intro}{" "}
                        <a
                          href={r.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-ink underline decoration-verde/50 underline-offset-4 transition-colors hover:text-verde"
                        >
                          {r.link.label}
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                            <path d="M7 17 17 7M9 7h8v8" />
                          </svg>
                        </a>
                      </p>
                    )}
                  </div>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={0.1} className="mt-12 flex flex-wrap items-center justify-between gap-8">
              <p className="inline-block -rotate-3 font-hand text-[42px] leading-none">{site.firstName}</p>
              <TransitionLink href="/contatti" label="Rotta: Contatti" className="btn btn-dark">
                Fai vivere un luogo <span className="dot" aria-hidden />
              </TransitionLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
