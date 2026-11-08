"use client";

import { useState } from "react";
import { Arrow, KeyArt, Postmark, Stamp, colorsOf, stampOf } from "./Marks";
import type { WorkArea } from "@/lib/site";

/**
 * L'oggetto del progetto, nella sua pagina.
 * Cartolina: fronte con francobollo e timbro, "Gira la cartolina" mostra il retro con i dettagli.
 * Chiave: una porta chiusa; "Apri la porta" la fa ruotare e mostra cosa c'è dietro.
 */
export default function Keepsake({ w }: { w: WorkArea }) {
  const [open, setOpen] = useState(false);
  const { paper, ink, accent } = colorsOf(w);
  const isKey = w.kind === "chiave";
  const label = isKey ? (open ? "Richiudi la porta" : "Apri la porta") : open ? "Rigira la cartolina" : "Gira la cartolina";
  const still = w.stills ? `${w.stills}/2.avif` : undefined;

  const details = (
    <>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">Come lavoro</p>
      <ul className="mt-4 flex flex-col gap-3.5">
        {w.production.map((d) => (
          <li key={d.label} className="flex gap-3">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} aria-hidden />
            <span>
              <span className="block text-[15px] font-semibold leading-tight">{d.label}</span>
              <span className="mt-0.5 block text-[13.5px] leading-snug opacity-75">{d.text}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">Per chi</p>
      <p className="mt-1 text-[14px] font-medium leading-snug">{w.audience}</p>
    </>
  );

  return (
    <div className="mx-auto w-full max-w-[460px]" style={{ color: ink }}>
      <div className="relative aspect-[4/5] [perspective:1400px]">
        <div
          className="absolute inset-0 transition-transform duration-[900ms] [transform-style:preserve-3d] [transition-timing-function:var(--ease)]"
          style={{ transform: open && !isKey ? "rotateY(180deg)" : "none" }}
        >
          {/* retro (cartolina) o interno (chiave) */}
          <div
            style={{ background: paper, transform: isKey ? "none" : "rotateY(180deg)" }}
            className="absolute inset-0 overflow-hidden rounded-[14px] p-7 shadow-[0_30px_60px_-40px_rgba(20,24,26,.5)] [backface-visibility:hidden]"
            aria-hidden={!open}
          >
            {!isKey && (
              <div className="pointer-events-none absolute inset-y-8 left-1/2 border-l" style={{ borderColor: `${ink}1f` }} />
            )}
            <div className={isKey ? "" : "w-[46%]"}>{details}</div>
          </div>

          {/* fronte (cartolina) */}
          {!isKey && (
            <div className="absolute inset-0 overflow-hidden rounded-[14px] shadow-[0_30px_60px_-40px_rgba(20,24,26,.5)] [backface-visibility:hidden]" style={{ background: paper }} aria-hidden={open}>
              {still && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={still} alt={`${w.title}`} className="absolute inset-0 h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
              <Stamp color={accent} className="absolute right-5 top-5 h-[104px] w-[83px] rotate-[3deg] shadow-md">
                {stampOf(w)}
              </Stamp>
              <Postmark text={w.mark} color="rgba(255,255,255,.85)" className="absolute right-[88px] top-8 h-[84px] w-[126px] -rotate-6" />
              <p className="absolute bottom-5 left-6 accent text-[40px] leading-none text-white [text-shadow:0_2px_24px_rgba(0,0,0,.4)]">{w.title}</p>
            </div>
          )}
        </div>

        {/* porta (chiave): ruota sul lato sinistro e scopre l'interno */}
        {isKey && (
          <div
            className="absolute inset-0 origin-left rounded-[14px] transition-transform duration-[1100ms] [transition-timing-function:var(--ease)]"
            style={{
              transform: open ? "rotateY(-112deg)" : "none",
              background: `linear-gradient(135deg, ${paper}, #ebe7de)`,
              border: `1px solid ${ink}1f`,
              pointerEvents: open ? "none" : "auto",
              backfaceVisibility: "hidden",
            }}
            aria-hidden={open}
          >
            <div className="absolute inset-6 rounded-[8px] border" style={{ borderColor: `${ink}14` }} />
            <KeyArt color={accent} tag={w.slug === "ospitalita"} className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2" />
            <p className="absolute inset-x-0 bottom-8 text-center font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
              {w.slug === "ospitalita" ? "La stanza ti aspetta" : "La casa ti aspetta"}
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-pressed={open}
        className="mt-5 inline-flex items-center gap-3 rounded-full px-5 py-3 text-[15px] font-semibold text-white transition-colors"
        style={{ background: accent }}
      >
        {label}
        <Arrow size={15} />
      </button>
    </div>
  );
}
