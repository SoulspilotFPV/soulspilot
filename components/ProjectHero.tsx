"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import VideoScrub from "./VideoScrub";
import ShotOverlay from "./ShotOverlay";
import Claim from "./Claim";
import { works, type WorkArea } from "@/lib/site";
import { useShell } from "./shell/ShellContext";

/**
 * Apertura della pagina progetto: la ripresa a tutto schermo avanza con lo scroll.
 * Alla fine si ritira in un riquadro arrotondato mentre il racconto sale a coprirla.
 */
export default function ProjectHero({ w }: { w: WorkArea }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { booted } = useShell();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const shot = useTransform(p, [0, 0.82], [0, 1]);
  const scale = useTransform(p, [0.7, 1], reduce ? [1, 1] : [1, 0.9]);
  const radius = useTransform(p, [0.7, 1], reduce ? [0, 0] : [0, 36]);
  const dim = useTransform(p, [0.7, 1], [0, 0.35]);
  const osd = useTransform(p, [0, 0.62, 0.74], [1, 1, 0]);

  return (
    <section ref={ref} aria-label={w.title} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          data-covers
          style={{ scale, borderRadius: radius }}
          initial={reduce ? false : { opacity: 0 }}
          animate={booted || reduce ? { opacity: 1 } : undefined}
          transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
          className="absolute inset-0 overflow-hidden bg-dusk"
        >
          {w.video && <VideoScrub src={w.video} progress={shot} trigger={ref} poster={w.stills ? `${w.stills}/1.avif` : undefined} />}
          <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-dusk" />
          <ShotOverlay show={osd}>
            {/* la promessa del progetto, come nei capitoli della landing */}
            <div className="absolute inset-x-7 bottom-12 sm:inset-x-10 sm:bottom-16 md:inset-x-16">
              <p className="mb-5 font-mono text-[12px] uppercase tracking-[0.2em] text-white/80">
                SP{String(works.indexOf(w) + 1).padStart(2, "0")} · {w.category} · {w.place}
              </p>
              <h1 className="max-w-[20ch] text-[clamp(34px,5.4vw,84px)] font-semibold leading-[0.98] tracking-[-0.045em] [text-shadow:0_2px_50px_rgba(0,0,0,.3)]">
                <Claim text={w.claim} />
              </h1>
            </div>
          </ShotOverlay>
        </motion.div>
      </div>
    </section>
  );
}
