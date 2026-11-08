"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "./shell/TransitionLink";
import Reveal from "./Reveal";
import { fallbackToH264, videoSrc } from "@/lib/video";
import Claim from "./Claim";
import { Arrow, KeyArt, Postmark, Stamp, colorsOf, stampOf } from "./Marks";
import { eyebrow, type WorkArea } from "@/lib/site";

/** Cartolina in arrivo: carta bianca, francobollo tratteggiato, nessuna ripresa. */
function SoonCard({ w }: { w: WorkArea }) {
  const { paper, ink, accent } = colorsOf(w);
  return (
    <div style={{ background: paper, color: ink }} className="relative overflow-hidden rounded-[18px] shadow-[0_30px_70px_-45px_rgba(20,24,26,.45)]">
      <div className="relative aspect-[16/10] border-b border-dashed" style={{ borderColor: `${ink}30` }}>
        <div className="absolute right-6 top-6 flex h-[110px] w-[88px] rotate-[3deg] items-center justify-center rounded-[4px] border-2 border-dashed text-center font-mono text-[9px] uppercase leading-snug tracking-[0.14em] opacity-70" style={{ borderColor: accent, color: accent }}>
          francobollo
          <br />
          in arrivo
        </div>
        <Postmark text={w.mark} color={`${ink}66`} className="absolute right-[110px] top-9 h-[84px] w-[126px] -rotate-6" />
        <p className="accent absolute bottom-5 left-6 text-[44px] leading-none" style={{ color: accent }}>
          {w.title}
        </p>
      </div>
      <div className="px-6 pb-6 pt-5 sm:px-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
          {eyebrow(w)}
        </p>
        <h3 className="mt-4 max-w-[24ch] text-[clamp(22px,2vw,28px)] font-semibold leading-[1.1] tracking-[-0.03em]">
          <Claim text={w.claim} />
        </h3>
        <p className="mt-3 max-w-[50ch] text-[14.5px] leading-snug opacity-75">{w.line}</p>
      </div>
    </div>
  );
}

/**
 * Un progetto: fotografia in alto (passandoci sopra parte il video), poi il suo biglietto.
 * Cartolina: francobollo e timbro sulla foto, "Gira la cartolina". Chiave: fondo chiaro e sobrio, "Apri la porta".
 */
function Card({ w }: { w: WorkArea }) {
  const video = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const still = w.stills ? `${w.stills}/1.avif` : undefined;
  const { paper, ink, accent } = colorsOf(w);
  const isKey = w.kind === "chiave";

  const ensure = () => {
    const v = video.current;
    if (!v || !w.video || v.getAttribute("data-src")) return v;
    v.setAttribute("data-src", "1");
    v.src = videoSrc(w.video);
    v.load();
    return v;
  };
  const play = () => ensure()?.play().catch(() => undefined);
  const stop = () => video.current?.pause();

  useEffect(() => {
    const v = video.current!;
    const off = fallbackToH264(v);
    const on = () => setPlaying(true);
    const offP = () => setPlaying(false);
    v.addEventListener("playing", on);
    v.addEventListener("pause", offP);
    // su touch non c'è il passaggio del mouse: il video (muto) parte quando il riquadro è ben visibile
    let io: IntersectionObserver | undefined;
    if (window.matchMedia("(hover: none)").matches && box.current) {
      io = new IntersectionObserver(([e]) => (e.intersectionRatio > 0.65 ? play() : stop()), { threshold: [0, 0.65, 1] });
      io.observe(box.current);
    }
    return () => {
      off();
      io?.disconnect();
      v.removeEventListener("playing", on);
      v.removeEventListener("pause", offP);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fotogramma corrente come immagine di partenza della transizione
  const capture = () => {
    const v = video.current;
    if (!v || v.readyState < 2 || !playing) return still;
    try {
      const c = document.createElement("canvas");
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      c.getContext("2d")!.drawImage(v, 0, 0);
      return c.toDataURL("image/jpeg", 0.86);
    } catch {
      return still;
    }
  };

  return (
    <TransitionLink
      href={`/progetti/${w.slug}`}
      label={`Rotta: ${w.title}`}
      expand={() => {
        const r = box.current!.getBoundingClientRect();
        return { rect: { top: r.top, left: r.left, width: r.width, height: r.height }, image: capture() };
      }}
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      className="group block"
    >
      <div style={{ background: paper, color: ink }} className="relative overflow-hidden rounded-[18px] shadow-[0_30px_70px_-45px_rgba(20,24,26,.45)]">
        <div ref={box} className="relative aspect-[16/10] overflow-hidden bg-sand">
          {still && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={still} alt={w.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] [transition-timing-function:var(--ease)] group-hover:scale-[1.05]" />
          )}
          <video
            ref={video}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            tabIndex={-1}
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease)] group-hover:scale-[1.05] ${playing ? "opacity-100" : "opacity-0"}`}
          />
          {!isKey && (
            <>
              <Stamp color={accent} className="absolute right-4 top-4 h-[92px] w-[74px] rotate-[3deg] shadow-md">
                {stampOf(w)}
              </Stamp>
              <Postmark text={w.mark} color="rgba(255,255,255,.85)" className="absolute right-[82px] top-6 h-[76px] w-[114px] -rotate-6" />
            </>
          )}
        </div>

        <div className="relative px-6 pb-6 pt-5 sm:px-7">
          {isKey && <KeyArt color={accent} tag={w.slug === "ospitalita"} className="pointer-events-none absolute -bottom-1 right-3 h-24 w-36 opacity-[0.12]" />}
          <p className="relative font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
            {eyebrow(w)}
          </p>
          <p className="accent relative mt-3 text-[34px] leading-none" style={{ color: accent }}>
            {w.title}
          </p>
          <h3 className="relative mt-4 max-w-[24ch] text-[clamp(22px,2vw,28px)] font-semibold leading-[1.1] tracking-[-0.03em]">
            <Claim text={w.claim} />
          </h3>
          <p className="relative mt-3 max-w-[50ch] text-[14.5px] leading-snug opacity-75">{w.line}</p>
          <span className="relative mt-5 inline-flex items-center gap-3 text-[15px] font-semibold" style={{ color: accent }}>
            {isKey ? "Apri la porta" : "Gira la cartolina"}
            <span className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform duration-500 group-hover:-rotate-45" style={{ background: accent }} aria-hidden>
              <Arrow />
            </span>
          </span>
        </div>
      </div>
    </TransitionLink>
  );
}

function Section({ title, intro, items }: { title: string; intro: string; items: WorkArea[] }) {
  return (
    <section aria-label={title} className="mt-14 first:mt-0 md:mt-20">
      <Reveal className="mb-8 flex flex-col gap-2 md:mb-10 md:flex-row md:items-end md:justify-between">
        <h2 className="text-[clamp(34px,4.4vw,56px)] font-semibold leading-none tracking-[-0.04em] text-ink">
          <span className="accent">{title}</span>
        </h2>
        <p className="max-w-[40ch] text-[15px] text-ink/70">{intro}</p>
      </Reveal>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
        {items.map((w) => (
          <Reveal as="li" key={w.slug}>
            {w.status === "in-arrivo" ? <SoonCard w={w} /> : <Card w={w} />}
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

/** I progetti in due sezioni: cartoline e chiavi. Pochi elementi, quindi niente filtri. */
export default function ProjectGrid({ works }: { works: WorkArea[] }) {
  return (
    <div>
      <Section title="Cartoline" intro="Luoghi da spedire a chi non c'è ancora: un'immagine, un timbro, la voglia di partire." items={works.filter((w) => w.kind === "cartolina")} />
      <Section title="Chiavi" intro="Spazi da aprire prima di entrarci: la porta si apre sul video, e poi sulla visita." items={works.filter((w) => w.kind === "chiave")} />
    </div>
  );
}
