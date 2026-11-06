"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { CSSProperties } from "react";
import { LotusMark } from "./Logo";
import { dms } from "@/lib/geo";
import type { TicketIcon, WorkArea } from "@/lib/site";

const pad = (n: number) => String(n).padStart(2, "0");

/** Disegno al tratto del luogo, in filigrana sul biglietto. */
export function Illustration({ icon, color }: { icon: TicketIcon; color: string }) {
  const p = { fill: "none", stroke: color, strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden>
      {icon === "castello" && (
        <g {...p}>
          <path d="M4 70c18-10 34-14 56-14s38 4 56 14" />
          <path d="M38 58V30h8v-6h5v6h6v-6h5v6h8v28" />
          <path d="M70 58V22h4v-5h4v5h4v-5h4v5h4v36" />
          <path d="M51 58v-9a4 4 0 0 1 8 0v9M78 34v6M44 38v5" />
          <path d="M10 74c6-3 12-3 18 0M90 74c6-3 12-3 18 0" />
        </g>
      )}
      {icon === "casa" && (
        <g {...p}>
          <path d="M20 70V36l40-22 40 22v34" />
          <path d="M12 40 60 13l48 27" />
          <path d="M50 70V50h20v20M30 44h12v10H30zM78 44h12v10H78z" />
          <path d="M8 70h104" />
        </g>
      )}
      {icon === "mare" && (
        <g {...p}>
          <circle cx="86" cy="24" r="9" />
          <path d="M6 48c8-4 14-4 22 0s14 4 22 0 14-4 22 0 14 4 22 0 14-4 22 0" />
          <path d="M6 60c8-4 14-4 22 0s14 4 22 0 14-4 22 0 14 4 22 0 14-4 22 0" />
          <path d="M18 72c8-4 14-4 22 0s14 4 22 0 14-4 22 0 14 4 22 0" />
          <path d="M8 40c10-12 22-18 34-18" />
        </g>
      )}
      {icon === "montagna" && (
        <g {...p}>
          <path d="M4 70 38 22l14 18 16-26 48 56" />
          <path d="m30 33 8 6 6-6M60 26l8 5 6-4" />
          <path d="M70 70c-4-8 2-12 0-20M82 70c-2-6 2-10 0-16" />
          <path d="M4 74h112" />
        </g>
      )}
    </svg>
  );
}

/** Codice a barre ricavato dal codice del volo: sempre lo stesso per lo stesso progetto. */
export function Barcode({ seed, color }: { seed: string; color: string }) {
  const bars: number[] = [];
  for (let i = 0; i < 46; i++) bars.push(1 + ((seed.charCodeAt(i % seed.length) * (i + 7)) % 4));
  let x = 0;
  return (
    <svg viewBox="0 0 150 40" preserveAspectRatio="none" className="h-10 w-full" aria-hidden>
      {bars.map((w, i) => {
        const r = i % 2 === 0 ? <rect key={i} x={x} y="0" width={w * 0.8} height="40" fill={color} /> : null;
        x += w * 0.8 + 0.9;
        return r;
      })}
    </svg>
  );
}

// tacche semicircolari sulla linea di strappo
export const notchBottom: CSSProperties = {
  WebkitMask:
    "radial-gradient(circle at 0 100%, transparent 13px, #000 13.5px) left / 51% 100% no-repeat, radial-gradient(circle at 100% 100%, transparent 13px, #000 13.5px) right / 51% 100% no-repeat",
  mask: "radial-gradient(circle at 0 100%, transparent 13px, #000 13.5px) left / 51% 100% no-repeat, radial-gradient(circle at 100% 100%, transparent 13px, #000 13.5px) right / 51% 100% no-repeat",
};
export const notchTop: CSSProperties = {
  WebkitMask:
    "radial-gradient(circle at 0 0, transparent 13px, #000 13.5px) left / 51% 100% no-repeat, radial-gradient(circle at 100% 0, transparent 13px, #000 13.5px) right / 51% 100% no-repeat",
  mask: "radial-gradient(circle at 0 0, transparent 13px, #000 13.5px) left / 51% 100% no-repeat, radial-gradient(circle at 100% 0, transparent 13px, #000 13.5px) right / 51% 100% no-repeat",
};

/**
 * Carta d'imbarco del progetto: la destinazione e, a bordo, i dettagli della produzione.
 * Si inclina seguendo il mouse, con un riflesso olografico; passandoci sopra la matrice si stacca appena.
 */
export default function Ticket({ w, index }: { w: WorkArea; index: number }) {
  const { paper, ink, accent, icon } = w.ticket;
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 140, damping: 18 });
  const sy = useSpring(my, { stiffness: 140, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], reduce ? [0, 0] : [-7, 7]);
  const rotateX = useTransform(sy, [0, 1], reduce ? [0, 0] : [6, -6]);
  const sheen = useTransform([sx, sy], ([x, y]: number[]) => `${x * 100}% ${y * 100}%`);
  const flight = `SP${pad(index + 1)}`;
  const [lat, lng] = w.coords;

  return (
    <div className="[perspective:1200px]">
      <motion.div
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX, rotateY, color: ink }}
        className="group relative mx-auto w-full max-w-[440px] [transform-style:preserve-3d]"
        role="group"
        aria-label={`Carta d'imbarco: volo ${flight} per ${w.place}`}
      >
        {/* corpo del biglietto */}
        <div style={{ background: paper, ...notchBottom }} className="relative overflow-hidden rounded-t-[26px] px-6 pb-6 pt-5 shadow-[0_30px_60px_-40px_rgba(20,24,26,.5)] sm:px-7">
          {/* filigrana del luogo */}
          <div className="pointer-events-none absolute -bottom-2 -right-4 h-32 w-48 opacity-[0.14]">
            <Illustration icon={icon} color={accent} />
          </div>
          {/* riflesso olografico */}
          <motion.div
            style={{ backgroundPosition: sheen }}
            className="pointer-events-none absolute inset-0 bg-[length:220%_220%] opacity-0 mix-blend-soft-light transition-opacity duration-500 [background-image:linear-gradient(115deg,transparent_20%,rgba(255,255,255,.9)_40%,rgba(180,220,255,.7)_48%,rgba(255,210,240,.6)_55%,transparent_75%)] group-hover:opacity-100"
          />

          <div className="relative flex items-center justify-between">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: accent }}>
              <LotusMark color={accent} size={18} stroke={3} />
              Carta d&apos;imbarco
            </span>
            <span className="font-mono text-[11px] tracking-[0.16em] opacity-70">{flight}</span>
          </div>

          {/* destinazione */}
          <div className="relative mt-7">
            <p className="text-[64px] font-semibold leading-none tracking-[-0.05em] sm:text-[76px]" style={{ color: accent }}>
              {w.code}
            </p>
            <p className="mt-2 text-[17px] font-semibold leading-tight">{w.place}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">{w.category}</p>
          </div>

          {/* a bordo: i dettagli della produzione */}
          <ul className="relative mt-7 flex flex-col gap-3.5 border-t pt-5" style={{ borderColor: `${ink}1f` }}>
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

          <p className="relative mt-6 font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">Per chi</p>
          <p className="relative mt-1 text-[14px] font-medium leading-snug">{w.audience}</p>
        </div>

        {/* linea di strappo */}
        <div className="relative z-10 h-0">
          <span className="absolute inset-x-6 top-0 border-t-2 border-dashed" style={{ borderColor: `${ink}30` }} />
        </div>

        {/* matrice */}
        <div
          style={{ background: paper, ...notchTop }}
          className="relative origin-top-left rounded-b-[26px] px-6 pb-5 pt-5 transition-transform duration-700 [transition-timing-function:var(--ease)] group-hover:translate-y-1.5 group-hover:rotate-[1.2deg] sm:px-7"
        >
          <div className="flex items-end justify-between gap-6">
            <div className="w-[52%]">
              <Barcode seed={`${flight}${w.code}`} color={ink} />
            </div>
            <div className="whitespace-nowrap text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] opacity-75">
              <p>Imbarco: ora</p>
              <p className="tabular-nums">
                {dms(lat, "N", "S", false)} · {dms(lng, "E", "O", false)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
