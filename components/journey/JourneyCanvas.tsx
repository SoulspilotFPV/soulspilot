"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import { createClouds, type CloudView } from "./clouds";
import { createFog } from "./fog";

/*
  Il cielo del viaggio. Ogni elemento della pagina con data-scene="nome" dichiara
  quale vista mostrare mentre è sullo schermo; elementi con lo stesso nome formano
  un capitolo.
  - "cielo": sopra il mare di nuvole con la montagna, poi giù dentro il bianco
  - capitoli dei luoghi: dentro le nuvole (la ripresa vera sta sopra, nella pagina)
  - "quiete": di nuovo sopra le nuvole, davanti alla montagna
  Tra capitoli diversi la nebbia avvolge la camera e si riapre sul successivo.
*/

type Region = { name: string; start: number; end: number };

const sstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function readRegions(): Region[] {
  const vh = window.innerHeight;
  const docEnd = document.documentElement.scrollHeight - vh * 0.5;
  const map = new Map<string, Region>();
  document.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => {
    const name = el.dataset.scene!;
    const r = el.getBoundingClientRect();
    const top = r.top + window.scrollY;
    const bottom = top + r.height;
    const cur = map.get(name);
    if (cur) {
      cur.start = Math.min(cur.start, top);
      cur.end = Math.max(cur.end, bottom);
    } else map.set(name, { name, start: top, end: bottom });
  });
  const list = [...map.values()].sort((a, b) => a.start - b.start);
  // la linea di lettura è il centro dello schermo: il primo capitolo parte da lì, l'ultimo finisce col documento
  if (list.length) {
    list[0].start = Math.max(list[0].start, vh * 0.5);
    list[list.length - 1].end = docEnd;
  }
  return list;
}

type Props = {
  /** avanzamento del primo caricamento, 0..1 */
  onProgress?: (p: number) => void;
  /** il cielo è pronto e la risoluzione si è assestata */
  onReady?: () => void;
};

export default function JourneyCanvas({ onProgress, onReady }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // il canvas resta montato tra le pagine: al cambio pagina si rileggono subito i capitoli
  const routeRef = useRef({ path: pathname, changed: false });
  const cb = useRef({ onProgress, onReady });
  cb.current = { onProgress, onReady };
  useEffect(() => {
    if (routeRef.current.path !== pathname) routeRef.current = { path: pathname, changed: true };
  }, [pathname]);

  useEffect(() => {
    const el = host.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    let readySent = false;
    const signalReady = () => {
      if (readySent) return;
      readySent = true;
      cb.current.onProgress?.(1);
      cb.current.onReady?.();
    };

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch {
      signalReady();
      return;
    }
    if (!renderer.capabilities.isWebGL2) {
      renderer.dispose();
      signalReady();
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    // le nuvole sono morbide: oltre questa risoluzione la differenza non si vede, il calore sì
    // su telefono si disegna a risoluzione molto più bassa: le nuvole sono sfumate, il fluido dello scroll conta di più
    const maxRatio = Math.min(dpr, small ? 0.65 : 1.25);
    const minRatio = small ? 0.35 : 0.6;
    let ratio = Math.min(maxRatio, small ? 0.5 : 1);
    renderer.setPixelRatio(ratio);
    el.appendChild(renderer.domElement);

    const clouds = createClouds(small);
    const fog = createFog();

    let W = 1, H = 1;
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // su telefono la barra del browser che compare e scompare cambia solo l'altezza: ridimensionare il cielo
      // lo farebbe lampeggiare. Si ridisegna solo se la larghezza cambia o lo schermo diventa più alto.
      if (small && W > 1 && w === W && h <= H) return;
      W = w;
      H = h;
      renderer.setSize(W, H);
      clouds.setRes(W, H);
    };
    resize();
    window.addEventListener("resize", resize);

    // a pagina ferma il cielo si muove appena: bastano meno fotogrammi
    let lastInput = performance.now();
    const ptr = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      lastInput = performance.now();
      if (e.pointerType !== "mouse") return;
      ptr.x = (e.clientX / window.innerWidth - 0.5) * 2;
      ptr.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let target = window.scrollY;
    let smoothY = target;
    let ready = false;
    let time = 0;
    let regions = readRegions();
    let regionsAt = 0;
    // quando un video copre tutto lo schermo il cielo non si vede: non si disegna
    let covered = false;
    let coveredAt = -1;
    const isCovered = () => {
      for (const c of document.querySelectorAll<HTMLElement>("[data-covers]")) {
        const r = c.getBoundingClientRect();
        if (r.top <= 0.5 && r.left <= 0.5 && r.bottom >= H - 0.5 && r.right >= W - 0.5 && Number(getComputedStyle(c).opacity) >= 0.999) return true;
      }
      return false;
    };

    const draw = (dt: number, snap = false) => {
      if (!ready) return;
      time += dt;
      smoothY = snap ? target : smoothY + (target - smoothY) * Math.min(1, dt * 4);
      clouds.setPtr(ptr.x, ptr.y, Math.min(1, dt * 1.5));

      // le posizioni dei capitoli si rileggono di tanto in tanto (font, immagini, reveal cambiano l'altezza)
      if (routeRef.current.changed) {
        // pagina nuova: niente inseguimento della camera dalla pagina precedente
        routeRef.current.changed = false;
        regionsAt = -1;
        target = window.scrollY;
        smoothY = target;
      }
      if (time - regionsAt > 0.5 || regionsAt < 0) {
        regions = readRegions();
        regionsAt = time;
      }
      const line = smoothY + H * 0.5;
      let idx = regions.findIndex((r) => line >= r.start && line < r.end);
      if (idx < 0) idx = line < (regions[0]?.start ?? 0) ? 0 : regions.length - 1;
      const reg = regions[idx];
      const t = reg ? Math.min(1, Math.max(0, (line - reg.start) / Math.max(1, reg.end - reg.start))) : 0;
      const name = reg?.name ?? "cielo";

      let view: CloudView;
      if (name === "cielo") view = clouds.skyView(t, time);
      else if (name === "quiete") view = clouds.restView(t, time);
      else if (name === "sopra") view = clouds.aboveView(t, time);
      else view = clouds.insideView(idx, t, time);
      if (time - coveredAt > 0.2 || coveredAt < 0 || snap) {
        covered = isCovered();
        coveredAt = time;
      }
      if (covered && !snap) return;
      // tra un video e l'altro siamo dentro la nuvola: niente cielo calcolato, basta la nebbia leggera
      if (name !== "cielo" && name !== "quiete" && name !== "sopra") {
        fog.set(1, time, W, H);
        renderer.render(fog.scene, fog.camera);
        return;
      }
      clouds.update(time, view);
      renderer.render(clouds.scene, clouds.camera);

      // nebbia ai confini: si chiude a fine capitolo, si riapre all'inizio del successivo
      const span = Math.max(1, reg ? reg.end - reg.start : 1);
      const edge = Math.min(0.2, (H * 0.55) / span);
      let fogA = 0;
      if (idx > 0) fogA = Math.max(fogA, 1 - sstep(0, edge, t));
      if (idx < regions.length - 1) fogA = Math.max(fogA, sstep(1 - edge, 1, t));
      if (fogA > 0.001) {
        fog.set(fogA, time, W, H);
        renderer.autoClear = false;
        renderer.render(fog.scene, fog.camera);
        renderer.autoClear = true;
      }
    };

    const onScroll = () => {
      target = window.scrollY;
      lastInput = performance.now();
      if (reduce) draw(0, true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // risoluzione adattiva: su se c'è margine, giù se i frame rallentano
    let raf = 0;
    let last = performance.now();
    let sum = 0;
    let expected = 0;
    let frames = 0;
    let settled = false; // dopo l'ingresso la qualità può solo scendere, mai oscillare
    let warm = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      // 60 fps mentre si scorre (30 su mobile), 30 a pagina ferma
      const active = now - lastInput < 700 || !settled;
      const interval = small || !active ? 1 / 30 : 1 / 60;
      if (now - last < interval * 1000 - 4) return;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      draw(Math.min(dt, 0.05));
      sum += dt;
      expected += interval;
      frames++;
      if (frames === 20) {
        const avg = sum / frames;
        const budget = expected / frames;
        expected = 0;
        let next = ratio;
        if (avg > budget * (settled ? 1.5 : 1.2)) next = Math.max(minRatio, ratio * 0.85);
        else if (!settled && avg < budget * 0.9) next = Math.min(maxRatio, ratio * 1.12);
        if (Math.abs(next - ratio) > 0.01) {
          ratio = next;
          renderer.setPixelRatio(ratio);
          resize();
          draw(0, false); // ridisegna subito: il canvas ridimensionato non deve restare vuoto
        }
        sum = 0;
        frames = 0;
        // la risoluzione si assesta dietro la schermata di caricamento, poi si entra
        if (!settled) cb.current.onProgress?.(0.6 + warm * 0.12);
        if (!settled && ++warm >= 3) {
          settled = true;
          signalReady();
        }
      }
    };
    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVis = () => (document.hidden ? stop() : !reduce && ready && start());
    document.addEventListener("visibilitychange", onVis);

    let cancelled = false;
    clouds.ready.then(() => {
      if (cancelled) return;
      cb.current.onProgress?.(0.6);
      ready = true;
      draw(0.016, true);
      if (!reduce) start();
      else requestAnimationFrame(signalReady);
      // rete di sicurezza: se il dispositivo è lentissimo si entra comunque
      setTimeout(() => {
        if (!settled) {
          settled = true;
          signalReady();
        }
      }, 2600);
    });

    return () => {
      cancelled = true;
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      clouds.dispose();
      fog.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} aria-hidden className="pointer-events-none fixed inset-0 z-0 [&>canvas]:h-full [&>canvas]:w-full" />;
}
