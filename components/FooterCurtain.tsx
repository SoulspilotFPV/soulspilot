"use client";

import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";

/** raggio delle curve: è la pagina ad avere gli angoli arrotondati, non il footer */
const RADIUS = { sm: 40, md: 56 };

/**
 * Footer "a tenda": è già fermo in fondo allo schermo, dietro la pagina.
 * In fondo alla pagina c'è uno spazio della sua stessa altezza: man mano che entra,
 * il footer si scopre dal basso, come una tenda che si alza. Il bordo della tenda ha
 * le curve rovesciate, così sembra la pagina che si solleva e scopre il verde sotto.
 */
export default function FooterCurtain({ scene }: { scene: string }) {
  const spacer = useRef<HTMLDivElement>(null);
  const foot = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);

  useEffect(() => {
    const c = content.current!;
    const measure = () => setH(c.offsetHeight);
    const ro = new ResizeObserver(measure);
    ro.observe(c);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const s = spacer.current, f = foot.current, i = inner.current;
      if (!s || !f || !i || !h) return;
      const vh = window.innerHeight;
      const visible = Math.min(h, Math.max(0, vh - s.getBoundingClientRect().top));
      const hidden = h - visible;
      // il bordo visibile è a R + hidden dall'alto del box (sopra c'è la fascia delle curve)
      const R = window.innerWidth >= 768 ? RADIUS.md : RADIUS.sm;
      const r = Math.min(R, visible * 0.8);
      const w = f.offsetWidth;
      const t = R + hidden;
      const bottom = f.offsetHeight;
      f.style.clipPath =
        r < 0.5
          ? `inset(${t}px 0 0 0)`
          : `path('M0 ${t - r} A${r} ${r} 0 0 0 ${r} ${t} L${w - r} ${t} A${r} ${r} 0 0 0 ${w} ${t - r} L${w} ${bottom} L0 ${bottom} Z')`;
      f.style.visibility = visible > 0 ? "visible" : "hidden";
      // il contenuto sale un po' più lento della tenda: profondità. Su schermi bassi il footer è più alto
      // dello schermo: a fine corsa lo scarto deve essere zero, così in fondo c'è la scritta grande
      const over = Math.max(0, h - vh);
      const shown = Math.min(h, vh);
      i.style.transform = `translate3d(0, ${Math.max(0, hidden - over) * 0.35}px, 0)`;
      i.style.opacity = String(0.4 + 0.6 * (visible / shown));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [h]);

  return (
    <>
      <div ref={spacer} data-scene={scene} style={{ height: h || "60vh" }} aria-hidden />
      <div
        ref={foot}
        className="fixed inset-x-0 bottom-0 z-[5] bg-[#1c3227]"
        style={{ clipPath: "inset(100% 0 0 0)", visibility: "hidden" }}
      >
        <div ref={inner} className="will-change-transform">
          {/* fascia verde sopra il footer: si vede solo negli angoli, dove la pagina curva */}
          <div className="h-10 bg-[#1c3227] md:h-14" aria-hidden />
          <div ref={content}>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
