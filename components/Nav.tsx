"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LotusMark } from "./Logo";
import TransitionLink from "./shell/TransitionLink";
import { nav, navCta } from "@/lib/site";

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/**
 * Barra di navigazione che si trasforma:
 * in cima è un tutt'uno con lo sfondo (a tutta larghezza, senza fondo, logo con il nome);
 * appena si scorre si raccoglie in una pillola di vetro e resta solo il simbolo.
 */
export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pill = scrolled || open;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        className="pointer-events-auto mx-auto transition-[padding] duration-700 [transition-timing-function:var(--ease)]"
        style={{ padding: pill ? "16px 16px 0" : "0" }}
      >
        <nav
          aria-label="Principale"
          className={`relative mx-auto flex items-center justify-between transition-all duration-700 [transition-timing-function:var(--ease)] ${
            pill
              ? "h-14 rounded-full border border-white/50 bg-white/85 md:bg-white/45 pl-3 pr-2 shadow-[0_8px_32px_-12px_rgba(20,24,26,.18)] backdrop-blur-xl backdrop-saturate-150"
              : "h-[76px] rounded-none border border-transparent bg-transparent px-5 shadow-none sm:px-8 md:px-10"
          }`}
          style={{ maxWidth: pill ? 880 : 1920 }}
        >
          <TransitionLink href="/" label="Rotta: inizio" aria-label="soulspilot, torna all'inizio" className="flex items-center gap-3">
            {/* solo il simbolo, senza tondo: si fonde con il cielo */}
            <span className="flex h-10 w-10 items-center justify-center">
              <LotusMark color="#2f5240" size={pill ? 30 : 34} stroke={2.8} />
            </span>
            {/* il nome si ritira quando la barra diventa pillola */}
            <span
              className="overflow-hidden whitespace-nowrap text-[17px] font-semibold tracking-[-0.02em] text-ink transition-all duration-500 [transition-timing-function:var(--ease)]"
              style={{ maxWidth: pill ? 0 : 140, opacity: pill ? 0 : 1 }}
            >
              souls<span className="accent text-[19px]">pilot</span>
            </span>
          </TransitionLink>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {nav.map((n) => {
              const active = pathname.startsWith(n.href);
              return (
                <li key={n.href}>
                  <TransitionLink
                    href={n.href}
                    label={`Rotta: ${n.label}`}
                    className={`relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-300 ${
                      active ? "text-ink" : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    {n.label}
                    {active && <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-verde" aria-hidden />}
                  </TransitionLink>
                </li>
              );
            })}
          </ul>

          <TransitionLink
            href={navCta.href}
            label="Rotta: Contatti"
            className={`hidden items-center gap-2.5 rounded-full bg-white font-semibold text-ink shadow-[0_6px_20px_-10px_rgba(20,24,26,.35)] transition-all duration-500 hover:bg-verde hover:text-white md:inline-flex ${
              pill ? "h-10 px-5 text-[14px]" : "h-12 px-6 text-[15px]"
            }`}
          >
            {navCta.label} <Arrow />
          </TransitionLink>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/60 text-ink md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Chiudi il menu" : "Apri il menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </nav>
      </div>

      <div
        id="menu-mobile"
        className={`pointer-events-auto fixed inset-0 -z-10 flex flex-col justify-center bg-white/75 px-8 backdrop-blur-2xl transition-all duration-500 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-2">
          {nav.map((n) => (
            <li key={n.href}>
              <TransitionLink href={n.href} label={`Rotta: ${n.label}`} className="block py-2 text-[44px] font-semibold leading-tight tracking-tight">
                {n.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <TransitionLink href={navCta.href} label="Rotta: Contatti" className="btn btn-dark mt-8 self-start">
          {navCta.label} <Arrow />
        </TransitionLink>
      </div>
    </header>
  );
}
