"use client";

import Reveal from "./Reveal";
import TransitionLink from "./shell/TransitionLink";
import type { WorkArea } from "@/lib/site";

/** "Prossimo progetto": il riquadro si allarga a tutto schermo e diventa l'apertura del progetto successivo. */
export default function NextProject({ w }: { w: WorkArea }) {
  const image = w.stills ? `${w.stills}/1.avif` : undefined;
  return (
    <Reveal delay={0.08}>
      <TransitionLink
        href={`/progetti/${w.slug}`}
        label={`Rotta: ${w.title}`}
        expand={(el) => {
          const r = el.getBoundingClientRect();
          return { rect: { top: r.top, left: r.left, width: r.width, height: r.height }, image };
        }}
        className="group relative block h-full min-h-[280px] overflow-hidden rounded-[32px] shadow-soft"
      >
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] [transition-timing-function:var(--ease)] group-hover:scale-[1.05]"
          />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/65 to-black/5" />
        <span className="absolute inset-x-8 bottom-8 flex items-end justify-between text-white">
          <span>
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-white/75">Prossimo progetto · {w.category}</span>
            <span className="accent block text-[clamp(40px,5vw,64px)] leading-none">{w.title}</span>
          </span>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-[-45deg]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </span>
      </TransitionLink>
    </Reveal>
  );
}
