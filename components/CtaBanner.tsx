import Reveal from "./Reveal";
import Placeholder from "./Placeholder";

/** Citazione di un cliente, sotto ai contatti. */
export default function CtaBanner() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-page">
        <Reveal delay={0.1} className="relative z-10 mx-auto w-full max-w-[680px] rounded-card border border-white/70 bg-white/80 p-8 shadow-soft backdrop-blur-xl">
          <figure>
            <blockquote className="accent text-[24px] leading-snug">
              «[Citazione del cliente: due o tre righe su cosa ha provato vedendo il suo luogo dall&apos;alto.]»
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-4">
              <Placeholder caption="" className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full [&>span]:hidden" />
              <span className="text-[15px] leading-tight">
                <b className="font-semibold">[Nome del cliente]</b>
                <br />
                <span className="text-ink3">[Ruolo, struttura]</span>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
