"use client";

import { useState } from "react";
import { Arrow, KeyArt, Postmark, Stamp, colorsOf, stampOf } from "./Marks";
import type { WorkArea } from "@/lib/site";

const noBackface = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" } as const;

/**
 * L'oggetto del progetto, nella sua pagina.
 * Cartolina: fronte con francobollo e timbro, "Gira la cartolina" mostra il retro con i dettagli.
 * Chiave: una porta chiusa. "Apri la porta" gira prima la chiave, poi la porta ruota sul lato
 * e lascia entrare la luce sui dettagli, che compaiono uno dopo l'altro.
 */
export default function Keepsake({ w }: { w: WorkArea }) {
  const [open, setOpen] = useState(false);
  const { paper, ink, accent } = colorsOf(w);
  const isKey = w.kind === "chiave";
  const label = isKey ? (open ? "Richiudi la porta" : "Apri la porta") : open ? "Rigira la cartolina" : "Gira la cartolina";
  const still = w.stills ? `${w.stills}/2.avif` : undefined;
  const toggle = () => setOpen((v) => !v);

  const details = (stagger: boolean) => (
    <>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">Come lavoro</p>
      <ul className="mt-4 flex flex-col gap-3.5">
        {w.production.map((d, i) => (
          <li
            key={d.label}
            className="flex gap-3 transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease)] motion-reduce:transition-none"
            style={
              stagger
                ? { opacity: open ? 1 : 0, transform: open ? "none" : "translateY(10px)", transitionDelay: open ? `${650 + i * 130}ms` : "0ms" }
                : undefined
            }
          >
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} aria-hidden />
            <span>
              <span className="block text-[15px] font-semibold leading-tight">{d.label}</span>
              <span className="mt-0.5 block text-[13.5px] leading-snug opacity-75">{d.text}</span>
            </span>
          </li>
        ))}
      </ul>
      <div
        className="transition-opacity duration-700 motion-reduce:transition-none"
        style={stagger ? { opacity: open ? 1 : 0, transitionDelay: open ? "1100ms" : "0ms" } : undefined}
      >
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">Per chi</p>
        <p className="mt-1 text-[14px] font-medium leading-snug">{w.audience}</p>
      </div>
    </>
  );

  return (
    <div className="mx-auto w-full max-w-[460px]" style={{ color: ink }}>
      <div className="relative aspect-[4/5] min-h-[440px] w-full [perspective:1400px] sm:min-h-0">
        {isKey ? (
          <>
            {/* dietro la porta: una stanza chiara, la luce entra da sinistra */}
            <div
              className="absolute inset-0 overflow-hidden rounded-[14px] p-6 shadow-[0_30px_60px_-40px_rgba(20,24,26,.5)] sm:p-7"
              style={{ background: `radial-gradient(120% 90% at 0% 40%, #fffdf6 0%, ${paper} 55%, #ece8de 100%)` }}
              aria-hidden={!open}
            >
              {/* ombra della porta che si allontana */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/20 to-transparent transition-opacity [transition-duration:1400ms] motion-reduce:transition-none"
                style={{ opacity: open ? 0 : 1, transitionDelay: open ? "400ms" : "0ms" }}
              />
              <div className="relative">{details(true)}</div>
            </div>

            {/* la porta */}
            <button
              type="button"
              onClick={toggle}
              tabIndex={open ? -1 : 0}
              aria-label="Apri la porta"
              className="absolute inset-0 origin-left cursor-pointer rounded-[14px] text-left motion-reduce:transition-none"
              style={{
                transform: open ? "rotateY(-116deg)" : "none",
                transition: `transform ${open ? "1500ms 380ms" : "1100ms"} cubic-bezier(0.3, 0.9, 0.35, 1.04), filter 900ms ease`,
                filter: open ? "brightness(0.84)" : "none",
                background: `linear-gradient(120deg, #f8f6f1, #e9e5db)`,
                border: `1px solid ${ink}22`,
                boxShadow: open ? "14px 0 40px -18px rgba(0,0,0,.35)" : "0 30px 60px -40px rgba(20,24,26,.5)",
                pointerEvents: open ? "none" : "auto",
                ...noBackface,
              }}
            >
              {/* specchiature della porta */}
              <span className="absolute inset-x-7 top-7 h-[34%] rounded-[6px] border" style={{ borderColor: `${ink}18`, background: `${ink}05` }} />
              <span className="absolute inset-x-7 bottom-7 h-[44%] rounded-[6px] border" style={{ borderColor: `${ink}18`, background: `${ink}05` }} />
              {/* maniglia e serratura */}
              <span className="absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full" style={{ background: "radial-gradient(circle at 35% 30%, #fff, #cfc9bb 70%)", boxShadow: "0 2px 8px rgba(0,0,0,.22)" }}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: `${ink}55` }} />
              </span>
              {/* la chiave che gira */}
              <span
                className="absolute left-5 top-1/2 w-[58%] origin-[28%_38%] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.3,1.4,0.5,1)] motion-reduce:transition-none"
                style={{ transform: `translateY(-50%) rotate(${open ? -72 : 0}deg)` }}
              >
                <KeyArt color={accent} tag={w.slug === "ospitalita"} className="w-full" />
              </span>
              <span className="absolute inset-x-0 bottom-9 text-center font-mono text-[10px] uppercase tracking-[0.2em] opacity-55">
                {w.slug === "ospitalita" ? "La stanza ti aspetta" : "La casa ti aspetta"}
              </span>
            </button>
          </>
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-[900ms] [transform-style:preserve-3d] [transition-timing-function:var(--ease)] motion-reduce:transition-none"
            style={{ transform: open ? "rotateY(180deg)" : "none", WebkitTransformStyle: "preserve-3d" }}
          >
            {/* retro: su telefono occupa tutta la larghezza, dal tablet in su è diviso come una vera cartolina */}
            <div
              style={{ background: paper, transform: "rotateY(180deg)", ...noBackface }}
              className="absolute inset-0 overflow-y-auto rounded-[14px] p-6 shadow-[0_30px_60px_-40px_rgba(20,24,26,.5)] sm:p-7"
              aria-hidden={!open}
            >
              <div className="pointer-events-none absolute inset-y-8 left-1/2 hidden border-l sm:block" style={{ borderColor: `${ink}1f` }} />
              <div className="sm:w-[46%]">{details(false)}</div>
            </div>

            {/* fronte */}
            <div className="absolute inset-0 overflow-hidden rounded-[14px] shadow-[0_30px_60px_-40px_rgba(20,24,26,.5)]" style={{ background: paper, ...noBackface }} aria-hidden={open}>
              {still && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={still} alt={w.title} className="absolute inset-0 h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
              <Stamp color={accent} className="absolute right-5 top-5 h-[104px] w-[83px] rotate-[3deg] shadow-md">
                {stampOf(w)}
              </Stamp>
              <Postmark text={w.mark} color="rgba(255,255,255,.85)" className="absolute right-[88px] top-8 h-[84px] w-[126px] -rotate-6" />
              <p className="accent absolute bottom-5 left-6 text-[40px] leading-none text-white [text-shadow:0_2px_24px_rgba(0,0,0,.4)]">{w.title}</p>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={toggle}
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
