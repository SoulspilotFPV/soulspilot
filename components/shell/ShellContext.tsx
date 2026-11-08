"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

/*
  Regista delle transizioni: un'unica macchina a stati per tutto il sito.
  boot   → primo ingresso: il pannello copre, il drone carica il cielo
  reveal → il pannello esce verso l'alto
  idle   → si naviga liberamente
  cover  → si copre lo schermo prima di cambiare pagina
  wait   → la pagina è cambiata sotto la copertura, si aspetta che sia pronta
*/

export type Phase = "boot" | "reveal" | "idle" | "cover" | "wait";
export type Mode = "drone" | "expand";
export type ExpandFrom = { rect: { top: number; left: number; width: number; height: number }; image?: string };

type Ctx = {
  phase: Phase;
  mode: Mode;
  booted: boolean;
  progress: number;
  label: string;
  expand: ExpandFrom | null;
  navigate: (href: string, opts?: { label?: string; expandFrom?: ExpandFrom }) => void;
  setProgress: (p: number) => void;
  canvasReady: () => void;
  /** il disco ha acceso la scritta: si può svelare la pagina */
  introShown: () => void;
};

const ShellCtx = createContext<Ctx | null>(null);

export function useShell() {
  const c = useContext(ShellCtx);
  if (!c) throw new Error("useShell fuori da ShellProvider");
  return c;
}

const COVER_MS = { drone: 750, expand: 950 };
// tempi allineati al disco: ritira il fascio, prende slancio, il pannello sale dopo 0,55 s e dura 0,9 s
const REVEAL_MS = { drone: 1500, expand: 850 };
// la pagina si svela solo dopo che il disco ha acceso la scritta (lo segnala il caricamento),
// più una breve pausa per vederla accesa; se il segnale non arriva, una rete di sicurezza
const LIT_HOLD_MS = 450;
const INTRO_SAFETY_MS = 4500;
const NAV_SAFETY_MS = 5000;
const key = (path: string) => `sp-scroll:${path}`;

/**
 * Salto di scroll istantaneo. Il sito ha lo scroll fluido attivo: senza "instant" la pagina
 * scorrerebbe all'indietro sotto la transizione e si vedrebbe tutto riavvolgersi.
 */
function jumpTo(y: number) {
  window.scrollTo({ top: y, left: 0, behavior: "instant" as ScrollBehavior });
}

/** Dopo il disegno del prossimo fotogramma; se il browser li sospende (scheda in secondo piano), dopo 150 ms. */
function afterPaint(fn: () => void) {
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    fn();
  };
  requestAnimationFrame(() => requestAnimationFrame(go));
  window.setTimeout(go, 150);
}

export function ShellProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  // con trailingSlash il percorso arriva come "/progetti/": lo si confronta sempre senza la barra finale
  const pathname = usePathname().replace(/(.)\/$/, "$1");
  const [phase, setPhase] = useState<Phase>("boot");
  const [mode, setMode] = useState<Mode>("drone");
  const [booted, setBooted] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [label, setLabel] = useState("Pronti al decollo");
  const [expand, setExpand] = useState<ExpandFrom | null>(null);
  const target = useRef<string | null>(null);
  const introDone = useRef(false);
  const pendingReveal = useRef<(() => void) | null>(null);
  const popping = useRef(false);
  const canvasOk = useRef(false);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  // ---------- primo ingresso ----------
  const bootDone = useRef(false);
  const fontsOk = useRef(false);
  const tryFinishBoot = useCallback(() => {
    // scatta una sola volta: dopo il primo ingresso non deve più toccare fase e modalità
    if (bootDone.current || !canvasOk.current || !fontsOk.current || !introDone.current) return;
    bootDone.current = true;
    later(() => {
      setProgressState(1);
      setMode("drone");
      setPhase((p) => (p === "boot" ? "reveal" : p));
      later(() => setBooted(true), 450);
      later(() => setPhase((p) => (p === "reveal" ? "idle" : p)), REVEAL_MS.drone);
    }, LIT_HOLD_MS);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    jumpTo(0);
    // anche i font contano: la prima schermata deve essere già quella giusta
    if (document.fonts) {
      document.fonts.ready.then(() => {
        fontsOk.current = true;
        tryFinishBoot();
      });
    } else fontsOk.current = true;
    // rete di sicurezza: non si resta mai bloccati sul caricamento
    const safety = window.setTimeout(() => {
      canvasOk.current = true;
      fontsOk.current = true;
      introDone.current = true;
      tryFinishBoot();
    }, 5500);
    const t = timers.current;
    return () => {
      window.clearTimeout(safety);
      t.forEach(clearTimeout);
    };
  }, [tryFinishBoot]);

  const canvasReady = useCallback(() => {
    if (canvasOk.current) return;
    canvasOk.current = true;
    tryFinishBoot();
  }, [tryFinishBoot]);

  const introShown = useCallback(() => {
    if (introDone.current) return;
    introDone.current = true;
    tryFinishBoot();
    const go = pendingReveal.current;
    pendingReveal.current = null;
    go?.();
  }, [tryFinishBoot]);

  const setProgress = useCallback((p: number) => setProgressState((old) => Math.max(old, Math.min(0.97, p))), []);

  // ---------- navigazione ----------
  const navigate = useCallback<Ctx["navigate"]>(
    (href, opts) => {
      if (phase !== "idle") return;
      const path = href.split("#")[0] || "/";
      if (path === pathname) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      sessionStorage.setItem(key(pathname), String(window.scrollY));
      const m: Mode = opts?.expandFrom ? "expand" : "drone";
      setMode(m);
      setExpand(opts?.expandFrom ?? null);
      setLabel(opts?.label ?? "In volo");
      setPhase("cover");
      if (m === "drone") {
        introDone.current = false;
        later(() => introShown(), INTRO_SAFETY_MS);
      }
      router.prefetch(path);
      // ultima rete di sicurezza: se dopo 9 s lo schermo è ancora coperto, si carica la pagina in modo classico
      later(() => {
        if (document.documentElement.style.overflow === "hidden") window.location.assign((process.env.NEXT_PUBLIC_BASE_PATH ?? "") + href);
      }, 9000);
      later(() => {
        // lo schermo è coperto: si torna in cima prima di cambiare pagina, così la nuova nasce già dall'alto
        jumpTo(0);
        target.current = path;
        setPhase("wait");
        router.push(path, { scroll: false });
        // rete di sicurezza: se la pagina nuova non arriva (per esempio dopo un aggiornamento del sito
        // con la scheda già aperta), si carica in modo classico invece di restare sotto la copertura
        later(() => {
          if (target.current === path) window.location.assign((process.env.NEXT_PUBLIC_BASE_PATH ?? "") + href);
        }, NAV_SAFETY_MS);
      }, COVER_MS[m]);
    },
    [phase, pathname, router, introShown],
  );

  // la nuova pagina è montata: si parte dall'alto e si svela
  useEffect(() => {
    if (phase === "wait" && target.current === pathname) {
      jumpTo(0);
      const go = () =>
        afterPaint(() => {
          later(() => {
            // ultima verifica prima di scoprire la pagina: deve partire dall'inizio, mai dal footer
            jumpTo(0);
            setPhase("reveal");
            later(() => window.scrollY > 0 && !popping.current && jumpTo(0), 60);
            later(() => {
              setPhase("idle");
              setExpand(null);
            }, REVEAL_MS[mode]);
          }, mode === "drone" ? LIT_HOLD_MS : 280);
        });
      // col disco si aspetta che la scritta sia accesa
      if (mode === "drone" && !introDone.current) pendingReveal.current = go;
      else go();
      target.current = null;
    }
  }, [pathname, phase, mode]);

  // indietro / avanti del browser: si ritrova la posizione
  useEffect(() => {
    const onPop = () => {
      popping.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    if (!popping.current) return;
    popping.current = false;
    const y = Number(sessionStorage.getItem(key(pathname)) ?? 0);
    afterPaint(() => jumpTo(y));
  }, [pathname]);
  // la posizione si salva anche quando si esce con indietro
  useEffect(() => {
    const save = () => sessionStorage.setItem(key(pathname), String(window.scrollY));
    window.addEventListener("pagehide", save);
    window.addEventListener("popstate", save, { capture: true });
    return () => {
      window.removeEventListener("pagehide", save);
      window.removeEventListener("popstate", save, { capture: true });
    };
  }, [pathname]);

  // ---------- scroll bloccato solo mentre lo schermo è coperto ----------
  useEffect(() => {
    const lock = phase === "boot" || phase === "cover" || phase === "wait";
    document.documentElement.style.overflow = lock ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [phase]);

  const value = useMemo(
    () => ({ phase, mode, booted, progress, label, expand, navigate, setProgress, canvasReady, introShown }),
    [phase, mode, booted, progress, label, expand, navigate, setProgress, canvasReady, introShown],
  );
  return <ShellCtx.Provider value={value}>{children}</ShellCtx.Provider>;
}
