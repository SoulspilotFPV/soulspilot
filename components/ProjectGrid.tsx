"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TransitionLink from "./shell/TransitionLink";
import { fallbackToH264, videoSrc } from "@/lib/video";
import Claim from "./Claim";
import { Barcode, Illustration, notchBottom, notchTop } from "./Ticket";
import { LotusMark } from "./Logo";
import { dms } from "@/lib/geo";
import type { WorkArea } from "@/lib/site";

const pad = (n: number) => String(n).padStart(2, "0");

// disposizione editoriale: grande e piccolo si alternano, le colonne sono sfalsate in altezza
const LAYOUT = [
  { span: "md:col-span-7", ratio: "aspect-[16/10]", shift: "" },
  { span: "md:col-span-5", ratio: "aspect-[4/3]", shift: "md:mt-28" },
  { span: "md:col-span-5", ratio: "aspect-[4/3]", shift: "md:-mt-20" },
  { span: "md:col-span-7", ratio: "aspect-[16/10]", shift: "md:mt-10" },
];

/**
 * Un progetto come carta d'imbarco: fotografia in alto (passandoci sopra parte il video),
 * destinazione e promessa nel corpo, matrice con il codice a barre che si stacca appena.
 */
function Card({ w, n, layout }: { w: WorkArea; n: number; layout: (typeof LAYOUT)[number] }) {
  const video = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const still = w.stills ? `${w.stills}/1.avif` : undefined;
  const { paper, ink, accent, icon } = w.ticket;

  const ensure = () => {
    const v = video.current;
    if (!v || !w.video || v.getAttribute("data-src")) return v;
    v.setAttribute("data-src", "1");
    v.src = videoSrc(w.video);
    v.load();
    return v;
  };
  const play = () => ensure()?.play().catch(() => undefined);
  const stop = () => video.current?.pause();

  useEffect(() => {
    const v = video.current!;
    const off = fallbackToH264(v);
    const on = () => setPlaying(true);
    const offP = () => setPlaying(false);
    v.addEventListener("playing", on);
    v.addEventListener("pause", offP);
    // su touch non c'è il passaggio del mouse: il video parte quando il riquadro è ben visibile
    let io: IntersectionObserver | undefined;
    if (window.matchMedia("(hover: none)").matches && box.current) {
      io = new IntersectionObserver(([e]) => (e.intersectionRatio > 0.65 ? play() : stop()), { threshold: [0, 0.65, 1] });
      io.observe(box.current);
    }
    return () => {
      off();
      io?.disconnect();
      v.removeEventListener("playing", on);
      v.removeEventListener("pause", offP);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fotogramma corrente come immagine di partenza della transizione
  const capture = () => {
    const v = video.current;
    if (!v || v.readyState < 2 || !playing) return still;
    try {
      const c = document.createElement("canvas");
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      c.getContext("2d")!.drawImage(v, 0, 0);
      return c.toDataURL("image/jpeg", 0.86);
    } catch {
      return still;
    }
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
      className={`${layout.span} ${layout.shift}`}
    >
      <TransitionLink
        href={`/progetti/${w.slug}`}
        label={`Rotta: ${w.title}`}
        expand={() => {
          const r = box.current!.getBoundingClientRect();
          return { rect: { top: r.top, left: r.left, width: r.width, height: r.height }, image: capture() };
        }}
        onMouseEnter={play}
        onMouseLeave={stop}
        onFocus={play}
        onBlur={stop}
        className="group block"
      >
        {/* corpo: fotografia e destinazione */}
        <div style={{ background: paper, color: ink, ...notchBottom }} className="relative overflow-hidden rounded-t-[26px] shadow-[0_30px_70px_-40px_rgba(20,24,26,.45)]">
          <div ref={box} className={`relative overflow-hidden bg-sand ${layout.ratio}`}>
            {still && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={still}
                alt={`${w.title}, ${w.place}`}
                loading={n < 2 ? "eager" : "lazy"}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] [transition-timing-function:var(--ease)] group-hover:scale-[1.05]"
              />
            )}
            <video
              ref={video}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
              tabIndex={-1}
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease)] group-hover:scale-[1.05] ${
                playing ? "opacity-100" : "opacity-0"
              }`}
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 font-mono text-[11px] tracking-[0.16em] backdrop-blur-sm" style={{ color: accent }}>
              SP{pad(n + 1)}
            </span>
          </div>

          <div className="relative px-6 pb-6 pt-5 sm:px-7">
            {/* filigrana del luogo */}
            <div className="pointer-events-none absolute -bottom-3 -right-3 h-28 w-40 opacity-[0.12]">
              <Illustration icon={icon} color={accent} />
            </div>
            <p className="relative flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
              <LotusMark color={accent} size={14} stroke={3.4} />
              {w.category}
            </p>
            <div className="relative mt-3 flex items-end gap-4">
              <span className="text-[52px] font-semibold leading-[0.85] tracking-[-0.05em] sm:text-[60px]" style={{ color: accent }}>
                {w.code}
              </span>
              <span className="min-w-0 pb-0.5">
                <span className="accent block truncate text-[26px] leading-none">{w.title}</span>
                <span className="mt-1 block truncate text-[12px] opacity-70">{w.place}</span>
              </span>
            </div>
            <h2 className="relative mt-5 max-w-[24ch] text-[clamp(22px,2vw,28px)] font-semibold leading-[1.1] tracking-[-0.03em]">
              <Claim text={w.claim} />
            </h2>
            <p className="relative mt-3 max-w-[50ch] text-[14.5px] leading-snug opacity-75">{w.line}</p>
          </div>
        </div>

        {/* linea di strappo */}
        <div className="relative z-10 h-0" aria-hidden>
          <span className="absolute inset-x-6 top-0 border-t-2 border-dashed" style={{ borderColor: `${ink}30` }} />
        </div>

        {/* matrice: si stacca appena al passaggio */}
        <div
          style={{ background: paper, color: ink, ...notchTop }}
          className="flex origin-top-left items-center justify-between gap-6 rounded-b-[26px] px-6 py-4 transition-transform duration-700 [transition-timing-function:var(--ease)] group-hover:translate-y-1.5 group-hover:rotate-[1deg] sm:px-7"
        >
          <div className="w-[42%] max-w-[180px]">
            <Barcode seed={`SP${pad(n + 1)}${w.code}`} color={ink} />
          </div>
          <span className="flex items-center gap-3">
            <span className="hidden whitespace-nowrap text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] opacity-70 xl:block">
              {dms(w.coords[0], "N", "S", false)}
              <br />
              {dms(w.coords[1], "E", "O", false)}
            </span>
            <span className="text-[15px] font-semibold">Imbarcati</span>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform duration-500 group-hover:-rotate-45"
              style={{ background: accent }}
              aria-hidden
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </span>
        </div>
      </TransitionLink>
    </motion.li>
  );
}

/** Griglia editoriale dei progetti, con filtri per categoria. */
export default function ProjectGrid({ works }: { works: WorkArea[] }) {
  const categories = useMemo(() => ["Tutti", ...Array.from(new Set(works.map((w) => w.category)))], [works]);
  const [filter, setFilter] = useState("Tutti");
  const shown = works.filter((w) => filter === "Tutti" || w.category === filter);

  return (
    <div>
      <div role="group" aria-label="Filtra per categoria" className="mb-12 flex flex-wrap gap-2 md:mb-16">
        {categories.map((c) => {
          const count = c === "Tutti" ? works.length : works.filter((w) => w.category === c).length;
          const on = filter === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={on}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium transition-all duration-300 ${
                on ? "border-ink bg-ink text-white" : "border-ink/15 bg-white/50 text-ink backdrop-blur hover:border-ink/40"
              }`}
            >
              {c}
              <span className={`font-mono text-[11px] ${on ? "text-white/60" : "text-ink3"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-12 md:gap-y-24">
        <AnimatePresence mode="popLayout">
          {shown.map((w, i) => (
            <Card key={w.slug} w={w} n={works.indexOf(w)} layout={LAYOUT[i % LAYOUT.length]} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
