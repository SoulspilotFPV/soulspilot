"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";

/** Galleria di fotogrammi della ripresa, con ingrandimento a schermo intero. */
export default function ProjectGallery({ dir, picks, title }: { dir: string; picks: number[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const src = (i: number) => `${dir}/${i}.avif`;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % picks.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + picks.length) % picks.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, picks.length]);

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {picks.map((f, i) => (
          <Reveal
            as="li"
            key={f}
            delay={(i % 3) * 0.08}
            className={i === 0 ? "lg:col-span-8 lg:row-span-2" : i === 3 ? "lg:col-span-8" : "lg:col-span-4"}
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block aspect-[16/10] h-full w-full overflow-hidden rounded-[24px] shadow-soft"
              aria-label={`Apri il fotogramma ${i + 1} di ${title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src(f)}
                alt={`${title}, fotogramma ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] [transition-timing-function:var(--ease)] group-hover:scale-[1.05]"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-black/35 px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-white backdrop-blur-sm">
                FRAME {String(f).padStart(2, "0")}
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      {/* sul body, fuori dal contenitore della pagina: così sta sopra la barra e la "x" si può premere */}
      {mounted &&
        createPortal(
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-dusk/85 p-4 backdrop-blur-xl sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${title}, fotogramma ${open + 1}`}
          >
            <motion.img
              key={open}
              src={src(picks[open])}
              alt=""
              initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
              className="max-h-full max-w-full rounded-[20px] shadow-hero"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30"
              aria-label="Chiudi"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.2em] text-white/70">
              {open + 1} / {picks.length} · usa le frecce
            </p>
          </motion.div>
        )}
      </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
