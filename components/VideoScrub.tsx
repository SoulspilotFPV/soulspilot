"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { fallbackToH264, isPortrait, videoSrc } from "@/lib/video";

type Props = {
  /** percorso senza suffisso: si carica `${src}-d.mp4` (desktop) o `${src}-m.mp4` (telefono) */
  src: string;
  /** avanzamento della ripresa, da 0 a 1 */
  progress: MotionValue<number>;
  /** elemento che, avvicinandosi allo schermo, fa partire il caricamento */
  trigger: React.RefObject<HTMLElement>;
  poster?: string;
};

/**
 * Ripresa che avanza e torna indietro con lo scroll, alla frequenza reale del video.
 * La posizione segue lo scroll con un leggero ammortizzamento, come una camera stabilizzata;
 * il video non va mai in riproduzione da solo.
 */
export default function VideoScrub({ src, progress, trigger, poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current!;
    // su schermo verticale il poster è il primo fotogramma della versione 9:16
    if (poster && isPortrait()) v.poster = poster.replace(/\/1\.avif$/, "/1m.avif");
    let dur = 0;
    let cur = 0;
    let raf = 0;
    let near = false;
    let loaded = false;
    let last = performance.now();

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (dur > 0) {
        const target = Math.min(1, Math.max(0, progress.get())) * (dur - 0.05);
        cur += (target - cur) * Math.min(1, dt * 9);
        if (Math.abs(target - cur) < 0.002) cur = target;
        // una richiesta alla volta: si aspetta che il decoder abbia finito la precedente
        if (!v.seeking && Math.abs(v.currentTime - cur) > 0.012) v.currentTime = cur;
        if (Math.abs(target - cur) > 0.002 || v.seeking) loop();
      }
    };
    const loop = () => {
      if (!raf && near) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const load = () => {
      if (loaded) return;
      loaded = true;
      v.src = videoSrc(src);
      v.load();
    };
    const onMeta = () => {
      dur = v.duration || 0;
      // su iOS il primo fotogramma compare solo dopo un play: si avvia e si ferma subito
      v.play().then(() => v.pause()).catch(() => undefined);
      loop();
    };
    const offFallback = fallbackToH264(v);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("seeked", loop);

    const io = new IntersectionObserver(
      (es) => {
        near = es.some((e) => e.isIntersecting);
        if (near) {
          load();
          loop();
        }
      },
      { rootMargin: "120% 0px" },
    );
    if (trigger.current) io.observe(trigger.current);
    const unsub = progress.on("change", loop);

    return () => {
      io.disconnect();
      offFallback();
      unsub();
      cancelAnimationFrame(raf);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("seeked", loop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, progress, trigger]);

  return (
    <video
      ref={ref}
      muted
      playsInline
      preload="none"
      poster={poster}
      tabIndex={-1}
      disablePictureInPicture
      aria-hidden
      className="pointer-events-none block h-full w-full object-cover"
    />
  );
}
