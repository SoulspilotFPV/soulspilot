"use client";

import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";

/**
 * Footer "a tenda", tutto in CSS: il footer è fisso in fondo allo schermo, dentro un contenitore
 * che scorre con la pagina e ritaglia (clip-path) tutto ciò che sta fuori dalla sua area.
 * Man mano che il contenitore entra, il footer si scopre dal basso, come una tenda che si alza.
 * Gli angoli sono quelli di sempre: la pagina è arrotondata sopra il verde (due orecchi verdi ai lati).
 * Il rimbalzo elastico di iPhone a fine pagina sfalserebbe la tenda: si disattiva in globals.css (overscroll-behavior).
 * Non c'è nessun calcolo a ogni scroll: la tenda è sincronizzata con la pagina per costruzione,
 * anche su iPhone dove lo scroll è gestito dal sistema e la barra del browser cambia l'altezza.
 */
export default function FooterCurtain({ scene }: { scene: string }) {
  const content = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);
  const [tall, setTall] = useState(false);

  useEffect(() => {
    const c = content.current!;
    const measure = () => {
      setH(c.offsetHeight);
      // schermi bassi: se il footer è più alto dello schermo non può restare fisso, scorre normalmente
      setTall(c.offsetHeight > window.innerHeight * 0.98);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(c);
    // l'altezza della finestra cambia di continuo su telefono (barra del browser): conta solo la larghezza
    let w = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== w) {
        w = window.innerWidth;
        measure();
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // i due "orecchi" verdi sopra il bordo: è la pagina ad avere gli angoli arrotondati, non il footer.
  // Ognuno è un quadrato verde da cui si toglie un quarto di cerchio, e scorre insieme alla pagina.
  const ear = (side: "left" | "right") => ({
    WebkitMask: `radial-gradient(circle var(--r) at ${side === "left" ? "100%" : "0"} 0, transparent calc(var(--r) - .5px), #000 var(--r))`,
    mask: `radial-gradient(circle var(--r) at ${side === "left" ? "100%" : "0"} 0, transparent calc(var(--r) - .5px), #000 var(--r))`,
  });

  return (
    <div data-scene={scene} className={`relative [--r:40px] md:[--r:56px] ${tall ? "" : "h-[var(--h)]"}`} style={{ "--h": tall ? "auto" : `${h || 0}px` } as React.CSSProperties}>
      <span aria-hidden className="pointer-events-none absolute left-0 top-[calc(var(--r)*-1)] z-[6] h-[var(--r)] w-[var(--r)] bg-[#1c3227]" style={ear("left")} />
      <span aria-hidden className="pointer-events-none absolute right-0 top-[calc(var(--r)*-1)] z-[6] h-[var(--r)] w-[var(--r)] bg-[#1c3227]" style={ear("right")} />
      {/* il ritaglio dritto: mostra del footer fisso solo la parte dentro questa area */}
      <div className={tall ? "relative" : "absolute inset-0 [clip-path:inset(-1px_0_0_0)]"}>
        <div className={tall ? "relative" : "fixed inset-x-0 bottom-0 z-[5]"}>
          <div ref={content}>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
