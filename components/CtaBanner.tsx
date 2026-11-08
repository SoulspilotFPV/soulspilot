import Reveal from "./Reveal";
import { site } from "@/lib/site";

/** Citazione di un cliente, sotto ai contatti. */
export default function CtaBanner() {
  const q = site.quote;
  // nascosta finché non c'è una citazione vera di un cliente
  if (!q) return null;
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-page">
        <Reveal delay={0.1} className="relative z-10 mx-auto w-full max-w-[680px] rounded-card border border-white/70 bg-white/80 p-8 shadow-soft backdrop-blur-xl">
          <figure>
            <blockquote className="accent text-[24px] leading-snug">«{q.text}»</blockquote>
            <figcaption className="mt-6 text-[15px] leading-tight">
              <b className="font-semibold">{q.name}</b>
              <br />
              <span className="text-ink3">{q.role}</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
