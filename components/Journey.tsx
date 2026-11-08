"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import VideoScrub from "./VideoScrub";
import ShotOverlay from "./ShotOverlay";
import WorkStub from "./WorkStub";
import Claim from "./Claim";
import { eyebrow, works } from "@/lib/site";

function Chapter({ index, slug }: { index: number; slug: string }) {
  const w = works.find((x) => x.slug === slug)!;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // la ripresa emerge dalle nuvole (sfocata, ingrandita) e ci rientra alla fine
  const shot = useTransform(p, [0.02, 0.98], [0, 1]);
  // il passaggio tra un video e l'altro è breve: 5% della sezione in entrata e 5% in uscita
  const fade = useTransform(p, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  const scale = useTransform(p, [0, 0.06], reduce ? [1, 1] : [1.14, 1]);
  const blur = useTransform(
    p,
    [0, 0.05, 0.95, 1],
    reduce ? ["blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"] : ["blur(18px)", "blur(0px)", "blur(0px)", "blur(18px)"],
  );
  // i testi si accendono quando la ripresa è nitida e si spengono prima della nebbia
  const osd = useTransform(p, [0.06, 0.12, 0.88, 0.94], reduce ? [1, 1, 1, 1] : [0, 1, 1, 0]);
  // due tempi: prima la promessa in grande, poi il luogo con il pulsante
  const claimO = useTransform(p, [0.07, 0.14, 0.46, 0.53], [0, 1, 1, 0]);
  const claimY = useTransform(p, [0.07, 0.16, 0.46, 0.53], reduce ? [0, 0, 0, 0] : [50, 0, 0, -40]);
  const capO = useTransform(p, [0.52, 0.6, 0.88, 0.94], [0, 1, 1, 0]);
  const capY = useTransform(p, [0.52, 0.62], reduce ? [0, 0] : [30, 0]);
  // a testo spento il pulsante non deve restare cliccabile
  const claimV = useTransform(claimO, (v) => (v > 0.01 ? "visible" : "hidden"));
  const capV = useTransform(capO, (v) => (v > 0.01 ? "visible" : "hidden"));

  return (
    <section ref={ref} data-scene={slug} aria-label={w.title} className="relative h-[340vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {w.video && (
          <motion.div data-covers style={{ opacity: fade, scale, filter: blur }} className="absolute inset-0">
            <VideoScrub src={w.video} progress={shot} trigger={ref} poster={w.stills ? `${w.stills}/1.avif` : undefined} />
          </motion.div>
        )}
        <ShotOverlay show={osd}>
          {/* primo tempo: la promessa, in basso a sinistra come nelle pagine dei progetti */}
          <div className="absolute inset-x-7 bottom-12 sm:inset-x-10 sm:bottom-16 md:inset-x-16">
            <motion.div style={{ opacity: claimO, y: claimY, visibility: claimV }}>
              <p className="mb-5 font-mono text-[12px] uppercase tracking-[0.2em] text-white/80">
                {eyebrow(w)}
              </p>
              <h2 className="max-w-[20ch] text-[clamp(34px,5.4vw,84px)] font-semibold leading-[1] tracking-[-0.045em] [text-shadow:0_2px_50px_rgba(0,0,0,.3)]">
                <Claim text={w.claim} />
              </h2>
              <p className="mt-5 max-w-[56ch] text-[15px] leading-snug text-white/85 sm:text-[17px]">{w.line}</p>
            </motion.div>
          </div>
          {/* secondo tempo: la matrice della carta d'imbarco */}
          <motion.div style={{ opacity: capO, y: capY, visibility: capV }} className="absolute inset-x-5 bottom-8 sm:inset-x-10 sm:bottom-12">
            <WorkStub w={w} />
          </motion.div>
        </ShotOverlay>
      </div>
    </section>
  );
}

/** Discesa nelle nuvole e capitoli del viaggio, uno per area di lavoro. */
export default function Journey() {
  const descent = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: descent,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0.25, 0.42, 0.6, 0.75], reduce ? [1, 1, 1, 1] : [0, 1, 1, 0]);
  const blur = useTransform(
    scrollYProgress,
    [0.25, 0.42, 0.6, 0.75],
    reduce ? ["blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"] : ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"],
  );

  return (
    <div id="viaggio">
      {/* la discesa: il cielo si chiude nel bianco delle nuvole */}
      <section ref={descent} data-scene="cielo" aria-label="Discesa" className="relative h-[180vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center px-6">
          <motion.p
            style={{ opacity, filter: blur }}
            className="text-center text-[clamp(34px,5.4vw,68px)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink"
          >
            Ora scendiamo <span className="accent">piano…</span>
          </motion.p>
        </div>
      </section>
      {works.map((w, i) => (
        <Chapter key={w.slug} index={i} slug={w.slug} />
      ))}
    </div>
  );
}
