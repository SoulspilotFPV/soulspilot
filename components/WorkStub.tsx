"use client";

import TransitionLink from "./shell/TransitionLink";
import { firstFrame } from "@/lib/video";
import { Arrow, KeyArt, Postmark, Stamp, colorsOf, stampOf } from "./Marks";
import type { WorkArea } from "@/lib/site";

/**
 * Il biglietto sopra la ripresa, nella landing: una cartolina o una chiave.
 * Cliccandolo si allarga e porta alla pagina del progetto, dove la cartolina si gira e la porta si apre.
 */
export default function WorkStub({ w }: { w: WorkArea }) {
  const { paper, ink, accent } = colorsOf(w);
  const soon = w.status === "in-arrivo";
  const isKey = w.kind === "chiave";
  const cta = soon ? "Cartolina in arrivo" : isKey ? "Apri la porta" : "Gira la cartolina";

  const body = (
    <>
      <span className="relative block min-w-0 flex-1">
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
          {isKey ? "Chiave" : "Cartolina"} · {w.sector}
        </span>
        <span className="accent mt-2 block text-[34px] leading-none sm:text-[40px]">{w.title}</span>
        {w.place && !soon && <span className="mt-1.5 block truncate text-[12px] opacity-70">{w.place}</span>}
        <span className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold" style={{ color: accent }}>
          {cta}
          {!soon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform duration-500 group-hover:-rotate-45" style={{ background: accent }}>
              <Arrow size={14} />
            </span>
          )}
        </span>
      </span>
      {isKey ? (
        <KeyArt color={accent} tag={w.slug === "ospitalita"} className="h-[72px] w-[108px] shrink-0 transition-transform duration-700 [transition-timing-function:var(--ease)] group-hover:-rotate-6 sm:h-[84px] sm:w-[126px]" />
      ) : (
        <span className="relative block h-[96px] w-[112px] shrink-0 sm:h-[108px] sm:w-[128px]">
          <Stamp color={accent} className="absolute right-0 top-0 h-[84px] w-[67px] rotate-[4deg] shadow-sm sm:h-[92px] sm:w-[74px]">
            {stampOf(w)}
          </Stamp>
          <Postmark text={w.mark} color={`${ink}99`} className="absolute -left-2 top-4 h-[64px] w-[96px] -rotate-6" />
        </span>
      )}
    </>
  );

  const cls = "flex w-full max-w-[520px] items-center gap-4 rounded-[14px] px-5 py-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,.55)] sm:px-6 sm:py-5";
  const style = { background: paper, color: ink };

  if (soon) {
    return (
      <div style={style} className={`${cls} pointer-events-auto`} aria-label={`${w.title}, cartolina in arrivo`}>
        {body}
      </div>
    );
  }
  return (
    <TransitionLink
      href={`/progetti/${w.slug}`}
      label={`Rotta: ${w.title}`}
      expand={(el) => {
        const r = el.getBoundingClientRect();
        return { rect: { top: r.top, left: r.left, width: r.width, height: r.height }, image: w.stills ? firstFrame(w.stills) : undefined };
      }}
      style={style}
      className={`group pointer-events-auto ${cls}`}
      aria-label={`${cta}: ${w.title}`}
    >
      {body}
    </TransitionLink>
  );
}
