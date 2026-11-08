"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useShell } from "./shell/ShellContext";
import TransitionLink from "./shell/TransitionLink";
import { navCta } from "@/lib/site";

const TITLE = [
  { text: "Il" },
  { text: "desiderio" },
  { text: "comincia" },
  { text: "prima", accent: true },
  { text: "della" },
  { text: "visita." },
];
const ease = [0.2, 0.7, 0.2, 1] as const;

export default function Hero() {
  const { booted: loaded } = useShell();
  const reduce = useReducedMotion();
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
        Racconto luoghi con voli lenti e il suono registrato sul posto, perché chi guarda senta di esserci già.
      </motion.p>

      <motion.div
        className="mt-10 flex flex-col items-center gap-4"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={show ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1, delay: 1.2, ease }}
      >
        <TransitionLink href={navCta.href} label="Rotta: Prenota" className="btn btn-dark !h-14 !px-8 !text-[16px]">
          {navCta.label} <span className="dot" aria-hidden />
        </TransitionLink>
      </motion.div>

      {/* invito a scorrere */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        initial={reduce ? false : { opacity: 0 }}
        animate={show ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 1.8 }}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink/60">scorri</span>
        <span className="relative block h-10 w-px overflow-hidden bg-ink/15">
          <span className="scroll-cue absolute left-0 top-0 h-4 w-px bg-ink/70" />
        </span>
      </motion.div>
    </section>
  );
}
