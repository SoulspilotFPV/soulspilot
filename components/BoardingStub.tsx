"use client";

import type { CSSProperties } from "react";
import TransitionLink from "./shell/TransitionLink";
import { LotusMark } from "./Logo";
import { dms } from "@/lib/geo";
import type { WorkArea } from "@/lib/site";

const pad = (n: number) => String(n).padStart(2, "0");

// tacche sulla linea di strappo verticale
const notchRight: CSSProperties = {
  WebkitMask:
    "radial-gradient(circle at 100% 0, transparent 11px, #000 11.5px) top / 100% 51% no-repeat, radial-gradient(circle at 100% 100%, transparent 11px, #000 11.5px) bottom / 100% 51% no-repeat",
  mask: "radial-gradient(circle at 100% 0, transparent 11px, #000 11.5px) top / 100% 51% no-repeat, radial-gradient(circle at 100% 100%, transparent 11px, #000 11.5px) bottom / 100% 51% no-repeat",
};
const notchLeft: CSSProperties = {
  WebkitMask:
    "radial-gradient(circle at 0 0, transparent 11px, #000 11.5px) top / 100% 51% no-repeat, radial-gradient(circle at 0 100%, transparent 11px, #000 11.5px) bottom / 100% 51% no-repeat",
  mask: "radial-gradient(circle at 0 0, transparent 11px, #000 11.5px) top / 100% 51% no-repeat, radial-gradient(circle at 0 100%, transparent 11px, #000 11.5px) bottom / 100% 51% no-repeat",
};

/**
 * Matrice della carta d'imbarco, sopra la ripresa nella landing.
 * Cliccandola si allarga e porta alla pagina del progetto, dove c'è il biglietto intero.
 */
export default function BoardingStub({ w, index }: { w: WorkArea; index: number }) {
  const { paper, ink, accent } = w.ticket;
  const flight = `SP${pad(index + 1)}`;

  return (
    <TransitionLink
      href={`/progetti/${w.slug}`}
      label={`Rotta: ${w.title}`}
      expand={(el) => {
        const r = el.getBoundingClientRect();
        return { rect: { top: r.top, left: r.left, width: r.width, height: r.height }, image: w.stills ? `${w.stills}/1.avif` : undefined };
      }}
      style={{ color: ink }}
      className="group pointer-events-auto flex w-full max-w-[520px]"
      aria-label={`Imbarcati: volo ${flight} per ${w.place}`}
    >
      {/* corpo */}
      <span style={{ background: paper, ...notchRight }} className="block min-w-0 flex-1 rounded-l-[22px] px-5 py-4 sm:px-6 sm:py-5">
        <span className="flex items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em]">
          <LotusMark color={accent} size={14} stroke={3.4} />
          <span className="truncate" style={{ color: accent }}>
            {flight} · {w.category}
          </span>
        </span>
        <span className="mt-3 flex items-end gap-4">
          <span className="text-[40px] font-semibold leading-[0.9] tracking-[-0.05em] sm:text-[48px]" style={{ color: accent }}>
            {w.code}
          </span>
          <span className="min-w-0 pb-1">
            <span className="block truncate text-[16px] font-semibold leading-tight sm:text-[18px]">{w.title}</span>
            <span className="block truncate text-[12px] opacity-70">{w.place}</span>
          </span>
        </span>
      </span>

      {/* linea di strappo */}
      <span className="relative w-0" aria-hidden>
        <span className="absolute inset-y-4 -left-px border-l-2 border-dashed" style={{ borderColor: `${ink}30` }} />
      </span>

      {/* matrice: si stacca appena al passaggio */}
      <span
        style={{ background: paper, ...notchLeft }}
        className="flex w-[118px] shrink-0 origin-bottom-left flex-col items-center justify-center gap-2 rounded-r-[22px] px-3 py-4 transition-transform duration-700 [transition-timing-function:var(--ease)] group-hover:translate-x-1.5 group-hover:rotate-[2deg] sm:w-[140px]"
      >
        <span
          className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform duration-500 group-hover:-rotate-45"
          style={{ background: accent }}
          aria-hidden
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
        <span className="text-[14px] font-semibold">Imbarcati</span>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.12em] opacity-60 sm:block">
          {dms(w.coords[0], "N", "S", false)}
        </span>
      </span>
    </TransitionLink>
  );
}
