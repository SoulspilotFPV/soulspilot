"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useShell } from "./ShellContext";

const easeIO = [0.76, 0, 0.24, 1] as const;
const LIGHTS = 15;

/**
 * Il drone a disco volante, visto di tre quarti: cupola di vetro, scafo metallico,
 * luci sul bordo che si accendono con il caricamento, obiettivo della camera sotto lo scafo.
 */
function Saucer({ progress, done }: { progress: number; done: boolean }) {
  const lit = Math.round(progress * LIGHTS);
  return (
    <svg viewBox="-170 -110 340 220" className="h-[150px] w-[232px] overflow-visible sm:h-[190px] sm:w-[294px]" aria-hidden>
      <defs>
        <linearGradient id="ufo-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfd6da" />
          <stop offset="0.45" stopColor="#7d878d" />
          <stop offset="1" stopColor="#2a3034" />
        </linearGradient>
        <linearGradient id="ufo-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef2f4" />
          <stop offset="1" stopColor="#8b959b" />
        </linearGradient>
        <linearGradient id="ufo-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4246" />
          <stop offset="1" stopColor="#0e1214" />
        </linearGradient>
        <linearGradient id="ufo-dome" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#d9eef8" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#7fb1cc" stopOpacity="0.55" />
          <stop offset="1" stopColor="#2b4b5c" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id="ufo-glow">
          <stop offset="0" stopColor="#d9f2df" stopOpacity="0.9" />
          <stop offset="0.45" stopColor="#4f7a60" stopOpacity="0.38" />
          <stop offset="1" stopColor="#2f5240" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ufo-lens" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#9cc4da" />
          <stop offset="0.4" stopColor="#16252e" />
          <stop offset="1" stopColor="#030506" />
        </radialGradient>
      </defs>

      {/* alone sotto lo scafo */}
      <ellipse cx="0" cy="58" rx="120" ry="26" fill="url(#ufo-glow)" className="ufo-glow" />
      {/* ventre */}
      <ellipse cx="0" cy="18" rx="112" ry="30" fill="url(#ufo-belly)" />
      {/* obiettivo della camera */}
      <ellipse cx="0" cy="40" rx="15" ry="7" fill="#0b0f11" />
      <ellipse cx="0" cy="40" rx="9" ry="4.5" fill="url(#ufo-lens)" />
      {/* bordo dello scafo */}
      <ellipse cx="0" cy="6" rx="150" ry="24" fill="url(#ufo-rim)" />
      <ellipse cx="0" cy="3" rx="146" ry="20" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1" />
      {/* luci sul bordo: si accendono con il caricamento, poi rincorrono */}
      {Array.from({ length: LIGHTS }, (_, i) => {
        const t = Math.PI * (0.08 + (0.84 * i) / (LIGHTS - 1));
        const x = -Math.cos(t) * 138;
        const y = 6 + Math.sin(t) * 18;
        const on = done || i < lit;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={3.1}
            fill={on ? (i % 3 === 1 ? "#ffffff" : "#9fd3ae") : "#2b3236"}
            className={done ? "ufo-chase" : undefined}
            style={{ animationDelay: `${(i / LIGHTS) * 1.2}s`, transition: "fill .3s" }}
          />
        );
      })}
      {/* piano superiore */}
      <ellipse cx="0" cy="-6" rx="104" ry="17" fill="url(#ufo-top)" />
      <ellipse cx="0" cy="-8" rx="98" ry="13" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="0.8" />
      {/* cupola di vetro */}
      <path d="M -50 -10 A 50 44 0 0 1 50 -10 Z" fill="url(#ufo-dome)" stroke="rgba(255,255,255,.6)" strokeWidth="1" />
      <path d="M -30 -32 A 36 30 0 0 1 8 -50" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="0" cy="-10" rx="50" ry="6" fill="rgba(20,30,36,.35)" />
    </svg>
  );
}

// pulviscolo nel fascio: posizione orizzontale, durata, ritardo, dimensione (fissi, niente differenze tra server e browser)
const DUST: [number, number, number, number][] = [
  [30, 2.4, 0.1, 2], [38, 1.9, 0.9, 3], [45, 2.8, 0.4, 2], [52, 2.1, 1.3, 2], [58, 2.6, 0.2, 3], [64, 1.8, 1.1, 2],
  [70, 2.5, 0.6, 2], [34, 2.2, 1.6, 2], [48, 1.7, 0.3, 3], [55, 2.9, 1.8, 2], [61, 2.0, 0.8, 2], [42, 2.7, 1.4, 2],
  [67, 2.3, 1.9, 3], [36, 2.6, 0.5, 2], [50, 2.0, 1.0, 2], [74, 2.4, 1.2, 2],
];

/**
 * Il fascio di luce sotto il disco: un cono morbido con un nucleo più chiaro,
 * bande che scendono e pulviscolo che sale. Si allunga verso il basso e si ritira verso l'alto.
 */
function Beam({ on, delay, duration }: { on: boolean; delay: number; duration: number }) {
  return (
    // il contenitore centra; dentro, il movimento allunga e ritira la luce dall'alto
    <div aria-hidden className="pointer-events-none absolute -bottom-10 left-1/2 top-[calc(var(--saucer-h)*0.64)] w-[min(680px,92vw)] -translate-x-1/2 mix-blend-screen">
      <motion.div
        className="absolute inset-0 origin-top"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={on ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0.4 }}
        transition={on ? { duration: duration * 1.5, delay, ease: [0.16, 1, 0.3, 1] } : { duration: 0.45, ease: [0.55, 0, 0.75, 0.3] }}
      >
        {/* bagliore alla sorgente */}
        <div className="beam-breathe absolute left-1/2 top-0 h-10 w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[rgba(230,250,236,.55)] blur-[14px]" />
        {/* velo largo: la luce si apre e svanisce senza bordi */}
        <div className="beam-breathe absolute inset-0 [clip-path:polygon(42%_0,58%_0,100%_100%,0_100%)] blur-[22px]">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(214,245,224,.34),rgba(159,211,174,.14)_55%,transparent_92%)]" />
        </div>
        {/* nucleo luminoso, morbido */}
        <div className="beam-breathe absolute inset-0 [animation-delay:-1.2s] [clip-path:polygon(46%_0,54%_0,66%_100%,34%_100%)] blur-[10px]">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,.55),rgba(222,248,230,.16)_62%,transparent_88%)]" />
        </div>
        {/* raggi sottili che scivolano piano */}
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_82%),linear-gradient(90deg,transparent,#000_30%,#000_70%,transparent)] [mask-composite:intersect] [-webkit-mask-composite:source-in]">
          <div className="beam-rays absolute inset-0 opacity-70 [clip-path:polygon(40%_0,60%_0,100%_100%,0_100%)]" />
        </div>
        {/* pulviscolo: pochi granelli, lenti e sfocati */}
        <div className="absolute inset-0 [clip-path:polygon(36%_0,64%_0,100%_100%,0_100%)]">
          {DUST.map(([x, d, delay, size], i) => (
            <span
              key={i}
              className="beam-dust absolute rounded-full bg-[#effcf2] shadow-[0_0_10px_rgba(214,245,224,.9)]"
              style={{ left: `${x}%`, width: size + 1, height: size + 1, animationDuration: `${d * 2.4}s`, animationDelay: `${delay}s`, filter: i % 3 ? "none" : "blur(1px)" }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Schermata di caricamento e di transizione: pannello scuro con il disco volante.
 * Al primo ingresso arriva in virata da lontano e le luci del bordo seguono il caricamento vero;
 * poi cala il fascio di luce e accende la scritta, che resta accesa anche quando il fascio si ritira.
 * Per uscire il disco si carica e schizza in alto.
 */
export default function DroneLoader() {
  const { phase, mode, progress, label, introShown } = useShell();
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);

  // avanzamento mostrato: segue quello vero, con una salita lenta mentre il worker lavora
  useEffect(() => {
    if (phase !== "boot") {
      setShown(1);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      const fake = 0.5 * (1 - Math.exp(-(performance.now() - t0) / 1800));
      setShown((s) => Math.max(s, fake, progress));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, progress]);

  const active = mode === "drone" && phase !== "idle";
  const covering = phase === "boot" || phase === "cover" || phase === "wait";
  const booting = phase === "boot" || (phase === "reveal" && label === "Pronti al decollo");

  // arrivo: un'unica curva morbida. x e y hanno andature diverse, così il percorso è un arco senza rimbalzi
  const from = booting
    ? { x: "-56vw", y: "34vh", rotate: -14, scale: 0.32, opacity: 0, filter: "blur(6px)" }
    : { x: "58vw", y: "-20vh", rotate: 12, scale: 0.6, opacity: 0, filter: "blur(4px)" };
  const to = { x: "0vw", y: "0vh", rotate: 0, scale: 1, scaleX: 1, scaleY: 1, opacity: 1, filter: "blur(0px)" };
  const d = booting ? 2.1 : 1.25;
  const arriveT = {
    x: { duration: d, ease: [0.22, 1, 0.36, 1] },
    y: { duration: d, ease: [0.5, 0, 0.18, 1] },
    rotate: { duration: d * 1.1, ease: [0.25, 1, 0.5, 1] },
    scale: { duration: d, ease: [0.22, 1, 0.36, 1] },
    opacity: { duration: d * 0.35, ease: "easeOut" },
    filter: { duration: d * 0.6, ease: "easeOut" },
  };
  // uscita: prima si ritira il fascio, poi il disco accelera dolcemente verso l'alto, appena allungato
  const leave = { x: "0vw", y: "-95vh", rotate: 0, scale: 0.9, scaleX: 0.92, scaleY: 1.12, opacity: 0.7, filter: "blur(1px)" };
  const leaveT = { duration: 0.75, delay: 0.3, ease: [0.55, 0, 0.85, 0.35] };
  // il fascio scende quando il disco è quasi fermo; la scritta si accende dall'alto mentre la luce la raggiunge
  const beamDelay = d - 0.1;
  const beamDur = booting ? 0.6 : 0.35;
  const litDelay = beamDelay + beamDur * 0.5;

  // ogni copertura è un'apparizione nuova: il pannello si rimonta e le animazioni ripartono da capo
  const run = useRef(0);
  const lastPhase = useRef(phase);
  if ((phase === "cover" || phase === "boot") && lastPhase.current !== phase) run.current++;
  lastPhase.current = phase;

  // la scritta accesa sblocca la pagina; se l'animazione resta indietro, ci pensa comunque un timer
  useEffect(() => {
    if (!active || !covering) return;
    if (reduce) {
      introShown();
      return;
    }
    const t = window.setTimeout(introShown, (litDelay + (booting ? 0.7 : 0.4)) * 1000 + 1200);
    return () => window.clearTimeout(t);
    // un timer per apparizione
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, covering, reduce, run.current]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={`panel-${run.current}`}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-dusk text-white"
          initial={phase === "boot" ? false : reduce ? { opacity: 0 } : { y: "100%" }}
          animate={covering ? (reduce ? { opacity: 1 } : { y: "0%" }) : reduce ? { opacity: 0 } : { y: "-100%" }}
          // chiusura immediata: il pannello è già uscito, niente ritardi che lascino una striscia
          exit={{ opacity: 0, transition: { duration: 0.01 } }}
          // in uscita il pannello parte quando il disco ha già preso slancio
          transition={{ duration: covering ? 0.7 : 0.9, ease: easeIO, delay: covering ? 0 : 0.55 }}
          aria-live="polite"
          aria-label="Caricamento"
        >
          <div className="relative flex flex-col items-center [--saucer-h:150px] sm:[--saucer-h:190px]">
            {!reduce && <Beam on={covering} delay={beamDelay} duration={beamDur} />}

            <motion.div
              className="relative"
              // si parte fuori schermo, lontano e sfocato
              initial={reduce ? { opacity: 0 } : from}
              animate={reduce ? { opacity: covering ? 1 : 0 } : covering ? to : leave}
              transition={covering ? arriveT : leaveT}
            >
              <motion.div
                animate={reduce || !covering ? undefined : { y: [0, -5, 0], rotate: [0, 0.8, 0, -0.8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: d }}
              >
                <Saucer progress={booting ? shown : 1} done={!booting || shown >= 0.999} />
              </motion.div>
            </motion.div>

            {/* la scritta: spenta finché la luce non la raggiunge, poi resta accesa */}
            <p className="relative mt-8 whitespace-nowrap text-[clamp(34px,5.4vw,52px)] font-semibold leading-none tracking-[-0.045em]">
              {/* alone sul "pavimento" dove il fascio tocca la scritta */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[220%] w-[170%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(159,211,174,.28),rgba(47,82,64,.08)_65%,transparent)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: covering ? 1 : 0.45 }}
                transition={covering ? { duration: 0.8, delay: reduce ? 0 : litDelay } : { duration: 0.5 }}
              />
              <span className="relative text-white/[0.1]">
                souls<span className="accent">pilot</span>
              </span>
              <motion.span
                className="absolute inset-0 text-white [text-shadow:0_0_26px_rgba(159,211,174,.55),0_0_2px_rgba(255,255,255,.5)]"
                initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                transition={{ duration: booting ? 0.7 : 0.4, delay: reduce ? 0 : litDelay, ease: [0.4, 0, 0.2, 1] }}
                // scritta accesa: il regista può svelare la pagina
                onAnimationComplete={() => covering && introShown()}
              >
                souls<span className="accent">pilot</span>
              </motion.span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
