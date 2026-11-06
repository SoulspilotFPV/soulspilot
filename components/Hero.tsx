"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useShell } from "./shell/ShellContext";

const TITLE = [
  { text: "Fai" },
  { text: "vivere" },
  { text: "il" },
  { text: "tuo" },
  { text: "luogo" },
  { text: "prima", accent: true },
  { text: "ancora" },
  { text: "che" },
  { text: "arrivino." },
];
const ease = [0.2, 0.7, 0.2, 1] as const;

/**
 * Pilota automatico: fa scorrere la pagina da sola lungo tutto il viaggio, a velocità costante,
 * fino all'atterraggio. Basta toccare, scorrere o premere un tasto per riprendere i comandi.
 */
function useAutopilot() {
  const [flying, setFlying] = useState(false);
  const stopRef = useRef<() => void>(() => {});

  const start = () => {
    const end = (document.getElementById("atterraggio")?.getBoundingClientRect().top ?? 0) + window.scrollY - 40;
    let y = window.scrollY;
    let last = performance.now();
    let t = 0;
    let raf = 0;
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    const stop = () => {
      cancelAnimationFrame(raf);
      setFlying(false);
      for (const ev of events) window.removeEventListener(ev, stop);
    };
    stopRef.current = stop;
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      // partenza dolce, poi circa un terzo di schermo al secondo
      const speed = window.innerHeight * 0.36 * Math.min(1, t / 2.5);
      y = Math.min(end, y + speed * dt);
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
      if (y >= end) return stop();
      raf = requestAnimationFrame(step);
    };
    setFlying(true);
    // il click che avvia non deve fermare subito il volo
    setTimeout(() => {
      for (const ev of events) window.addEventListener(ev, stop, { passive: true });
    }, 50);
    raf = requestAnimationFrame(step);
  };

  useEffect(() => () => stopRef.current(), []);
  return { flying, start };
}

export default function Hero() {
  const { booted: loaded } = useShell();
  const reduce = useReducedMotion();
  const { flying, start } = useAutopilot();
  const show = loaded || Boolean(reduce);

  return (
    <section
      id="home"
      data-scene="cielo"
      aria-label="Presentazione"
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pb-24 pt-28 text-center"
    >
      {/* ogni parola emerge dalla nebbia, da sfocata a nitida */}
      <h1 className="mx-auto max-w-[16ch] text-[clamp(42px,7.4vw,96px)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink">
        {TITLE.map((w, i) => (
          <motion.span
            key={i}
            className={`inline-block ${w.accent ? "accent pr-[0.06em]" : ""}`}
            initial={reduce ? false : { opacity: 0, y: 26, filter: "blur(14px)" }}
            animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
            transition={{ duration: 1.3, delay: 0.1 + i * 0.11, ease }}
          >
            {w.text}
            {i < TITLE.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </h1>

      <motion.p
        className="mx-auto mt-7 max-w-[34ch] text-[17px] leading-relaxed text-ink/75 md:text-[19px]"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={show ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1, delay: 1.0, ease }}
      >
        Un volo fluido e immersivo che porta chi guarda dall'alto fin dentro il cuore del luogo. La sensazione viva di esserci già.
      </motion.p>

      <motion.div
        className="mt-10 flex flex-col items-center gap-4"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={show ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1, delay: 1.2, ease }}
      >
        <button type="button" onClick={start} disabled={flying} className="btn btn-dark !h-14 !px-8 !text-[16px] disabled:opacity-80">
          {flying ? "In volo, tocca per riprendere i comandi" : "Fai un giro"} <span className="dot" aria-hidden />
        </button>
      </motion.div>

      {/* invito a scorrere */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        initial={reduce ? false : { opacity: 0 }}
        animate={show ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 1.8 }}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink/60">oppure scorri</span>
        <span className="relative block h-10 w-px overflow-hidden bg-ink/15">
          <span className="scroll-cue absolute left-0 top-0 h-4 w-px bg-ink/70" />
        </span>
      </motion.div>
    </section>
  );
}
