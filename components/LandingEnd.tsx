"use client";

import Reveal from "./Reveal";
import TransitionLink from "./shell/TransitionLink";

const exits = [
  { href: "/progetti", title: "Progetti", text: "Quattro luoghi, quattro modi di raccontare.", label: "Rotta: Progetti" },
  { href: "/chi-sono", title: "Chi sono", text: "Chi c'è dietro il drone.", label: "Rotta: Chi sono" },
  { href: "/benefici", title: "Benefici", text: "Cosa cambia per chi accoglie.", label: "Rotta: Benefici" },
  { href: "/contatti", title: "Prenota una chiamata", text: "Trenta minuti, quando vuoi tu.", label: "Rotta: Contatti" },
];

/** Fine del volo sulla landing: di nuovo sopra le nuvole, tre gate d'imbarco. */
export default function LandingEnd() {
  return (
    <section id="atterraggio" data-scene="quiete" aria-label="Atterraggio" className="flex min-h-[100svh] flex-col justify-center px-4 py-28 sm:px-8">
      <div className="mx-auto w-full max-w-page">
        <Reveal>
          <h2 className="mx-auto mb-14 max-w-[16ch] text-center text-[clamp(40px,6.4vw,84px)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink">
            Dove voliamo <span className="accent">adesso?</span>
          </h2>
        </Reveal>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {exits.map((e, i) => (
            <Reveal as="li" key={e.href} delay={i * 0.08} className="group rounded-[28px] border border-white/60 bg-white/45 shadow-[0_30px_80px_-40px_rgba(30,33,35,.35)] backdrop-blur-xl transition-colors duration-500 hover:bg-white/70">
              <TransitionLink href={e.href} label={e.label} className="flex h-full flex-col justify-between gap-14 p-7 sm:p-8">
                <span className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-ink3">Gate {String(i + 1).padStart(2, "0")}</span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-all duration-500 group-hover:-rotate-45 group-hover:bg-verde">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </span>
                <span>
                  <span className="accent block text-[clamp(30px,2.8vw,40px)] leading-[1.02] text-ink">{e.title}</span>
                  <span className="mt-3 block text-[15px] text-ink2">{e.text}</span>
                </span>
              </TransitionLink>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
