"use client";

import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";

/**
 * Footer "a tenda", tutto in CSS: il footer è fisso in fondo allo schermo, dentro un contenitore
 * che scorre con la pagina e ritaglia (clip-path) tutto ciò che sta fuori dalla sua area.
 * Man mano che il contenitore entra, il footer si scopre dal basso, come una tenda che si alza.
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

  return (
    <div
      data-scene={scene}
      className="relative [clip-path:inset(0_round_40px_40px_0_0)] md:[clip-path:inset(0_round_56px_56px_0_0)]"
      style={{ height: tall ? undefined : h || "60vh" }}
    >
      <div className={tall ? "relative" : "fixed inset-x-0 bottom-0 z-[5]"}>
        <div ref={content}>
          <Footer />
        </div>
      </div>
    </div>
  );
}
