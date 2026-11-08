"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { calLink, site, whatsappHref } from "@/lib/site";

type CalApi = ((...args: unknown[]) => void) & {
  ns?: Record<string, (...args: unknown[]) => void>;
  loaded?: boolean;
  q?: unknown[];
  config?: Record<string, unknown>;
};
declare global {
  interface Window {
    Cal?: CalApi;
  }
}

const NS = "chiamata";

/** Caricatore ufficiale dell'embed di Cal.com (carica lo script una sola volta). */
function loadCal() {
  if (window.Cal) return window.Cal;
  /* eslint-disable */
  (function (C: any, A: string, L: string) {
    const p = function (a: any, ar: any) { a.q.push(ar); };
    const d = C.document;
    C.Cal = C.Cal || function () {
      const cal = C.Cal; const ar = arguments;
      if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
      if (ar[0] === L) {
        const api: any = function () { p(api, arguments); };
        const namespace = ar[1]; api.q = api.q || [];
        if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); }
        else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");
  /* eslint-enable */
  const Cal = window.Cal!;
  Cal.config = Cal.config || {};
  Cal.config.forwardQueryParams = true;
  return Cal;
}

const steps = ["Scegli giorno e ora", "Raccontami il luogo", "Ci sentiamo su Google Meet"];


/** Contatti: il calendario di Cal.com, dove si sceglie l'orario e si risponde alle domande. */
export default function Contact() {
  const box = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const Cal = loadCal();
    Cal("init", NS, { origin: "https://app.cal.com" });
    const api = Cal.ns![NS];
    api("inline", {
      elementOrSelector: el,
      calLink,
      config: { layout: "month_view", useSlotsViewOnSmallScreen: "true", theme: "light" },
    });
    api("ui", {
      theme: "light",
      hideEventTypeDetails: false,
      layout: "month_view",
      cssVarsPerTheme: { light: { "cal-brand": "#2f5240" } },
    });
    api("on", { action: "linkReady", callback: () => setReady(true) });
    // se lo script non risponde, il segnaposto non resta per sempre
    const t = setTimeout(() => setReady(true), 6000);
    return () => {
      clearTimeout(t);
      el.innerHTML = "";
    };
  }, []);

  return (
    <section id="contatti" className="section-y">
      <div className="container-page grid gap-12 lg:grid-cols-[4fr_8fr] lg:gap-16">
        <div className="lg:pt-8">
          <Reveal>
            <span className="eyebrow mb-6">Contatti</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="h2 mb-6">
              Parliamone in <span className="accent">30 minuti</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[420px] text-ink2">
              Scegli tu il giorno e l&apos;ora per una chiamata di mezz&apos;ora: mi racconti il luogo e vediamo insieme da dove cominciare.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 text-[15px] font-medium text-ink">Ti rispondo entro 24 ore.</p>
            {(whatsappHref || site.email) && (
              <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-ink2">
                {whatsappHref && (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline decoration-verde/50 underline-offset-4 transition-colors hover:text-verde">
                    Scrivimi su WhatsApp
                  </a>
                )}
                {site.email && (
                  <a href={`mailto:${site.email}`} className="font-medium text-ink underline decoration-verde/50 underline-offset-4 transition-colors hover:text-verde">
                    {site.email}
                  </a>
                )}
              </p>
            )}
          </Reveal>
          <Reveal delay={0.15}>
            <ol className="mt-10 flex flex-col gap-3 font-mono text-[12px] uppercase tracking-[0.16em] text-ink2">
              {steps.map((t, i) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-verde/40 text-[11px] text-verde">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative min-h-[640px] overflow-hidden rounded-big border border-white/70 bg-white/80 p-2 shadow-soft backdrop-blur-xl sm:p-4">
          {!ready && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" aria-live="polite">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-verde/20 border-t-verde" aria-hidden />
              <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink3">Carico il calendario</p>
            </div>
          )}
          <div
            ref={box}
            className={`min-h-[620px] w-full overflow-auto rounded-[20px] transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
          />
        </Reveal>
      </div>
    </section>
  );
}
