import type { CSSProperties } from "react";

type Props = {
  caption: string;
  a?: string;
  b?: string;
  className?: string;
  round?: boolean;
  top?: boolean;
};

/** Riquadro a righe diagonali (135°) con didascalia mono, per i materiali mancanti. */
export default function Placeholder({ caption, a = "#f4eee3", b = "#ede6d8", className = "", round, top }: Props) {
  const style = { "--stripe-a": a, "--stripe-b": b } as CSSProperties;
  return (
    <div
      className={`stripes flex ${top ? "items-start" : "items-end"} ${round ? "justify-center rounded-full" : ""} ${className}`}
      style={style}
      role="img"
      aria-label={caption}
    >
      <span className="m-4 max-w-[34ch] rounded-full bg-white/70 px-3 py-1 font-mono text-[11px] leading-snug text-ink2 backdrop-blur-sm">
        {caption}
      </span>
    </div>
  );
}
