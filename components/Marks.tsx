import { useId } from "react";

/** Francobollo dentellato, con la sagoma del luogo disegnata al tratto. */
export function Stamp({ color, className = "", children }: { color: string; className?: string; children?: React.ReactNode }) {
  const id = useId().replace(/:/g, "");
  const W = 64, H = 80, step = 8;
  const dots: [number, number][] = [];
  for (let x = step / 2; x < W; x += step) dots.push([x, 0], [x, H]);
  for (let y = step / 2; y < H; y += step) dots.push([0, y], [W, y]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden>
      <defs>
        <mask id={id}>
          <rect width={W} height={H} fill="#fff" />
          {dots.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.6" fill="#000" />
          ))}
        </mask>
      </defs>
      <g mask={`url(#${id})`}>
        <rect width={W} height={H} fill="#fbf6ec" />
        <rect x="6" y="6" width={W - 12} height={H - 12} fill="none" stroke={color} strokeWidth="1.2" />
        <g transform="translate(10 18)" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          {children}
        </g>
        <text x={W / 2} y={H - 11} textAnchor="middle" fontSize="6.5" fontFamily="var(--font-mono)" letterSpacing="1.2" fill={color}>
          ITALIA
        </text>
      </g>
    </svg>
  );
}

/** Sagome per i francobolli (44 x 36): una per ogni cartolina. */
export const stampArt = {
  castello: (
    <>
      <path d="M2 34c10-4 18-5 40 0" />
      <path d="M8 30V14h5V9h4v5h4V9h4v5h5v16" />
      <path d="M19 30v-6a3 3 0 0 1 6 0v6" />
    </>
  ),
  montagna: (
    <>
      <path d="M2 32 16 10l8 10 6-9 12 21" />
      <path d="M12 17l4 3 4-3" />
      <path d="M2 34h40" />
    </>
  ),
};

/** Timbro postale circolare, con il nome del luogo che gira intorno. */
export function Postmark({ text, color, className = "" }: { text: string; color: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden>
      <defs>
        <path id={id} d="M60 14a26 26 0 1 1 0 52a26 26 0 1 1 0-52" />
      </defs>
      <g fill="none" stroke={color} strokeWidth="1.6">
        <circle cx="60" cy="40" r="35" />
        <circle cx="60" cy="40" r="22" strokeWidth="1" />
        <path d="M96 30c8 0 14 0 20 0M96 40c8 0 14 0 20 0M96 50c8 0 14 0 20 0" strokeLinecap="round" />
      </g>
      <text fontSize="9" fontFamily="var(--font-mono)" letterSpacing="2" fill={color}>
        <textPath href={`#${id}`} startOffset="0">
          {text.toUpperCase()} · {text.toUpperCase()} ·
        </textPath>
      </text>
      <text x="60" y="44" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill={color}>
        {new Date().getFullYear()}
      </text>
    </svg>
  );
}

/** Chiave. Con `tag` ha l'etichetta della stanza, lasciata bianca: nessun numero ancora assegnato. */
export function KeyArt({ color, tag = false, className = "" }: { color: string; tag?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden>
      <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="30" cy="30" r="14" />
        <circle cx="30" cy="30" r="5" />
        <path d="M44 30h56M84 30v12M96 30v9" />
        {tag && (
          <>
            <path d="M30 44v8" />
            <rect x="14" y="52" width="34" height="22" rx="4" />
            <circle cx="22" cy="58" r="1.6" fill={color} />
          </>
        )}
      </g>
    </svg>
  );
}

export const Arrow = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/** Colori delle due famiglie: carta e inchiostro caldi per le cartoline, fondo chiaro e sobrio per le chiavi. */
export const palette = {
  cartolina: { paper: "#f3e7d4", ink: "#2b1a17", accent: "#7a2e2a" },
  cartolinaNatura: { paper: "#e3eae2", ink: "#18241d", accent: "#2f5240" },
  chiave: { paper: "#f6f4ef", ink: "#1f2421", accent: "#2f5240" },
};

export function colorsOf(w: { kind: string; slug: string }) {
  return w.kind === "chiave" ? palette.chiave : w.slug === "tenerife" ? palette.cartolinaNatura : palette.cartolina;
}
export function stampOf(w: { slug: string }) {
  return w.slug === "tenerife" ? stampArt.montagna : stampArt.castello;
}
