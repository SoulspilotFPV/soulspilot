/** Il simbolo soulspilot, il drone-loto: quattro petali che sono anche le eliche di un drone visto dall'alto. */
export function LotusMark({ color = "currentColor", size = 24, stroke = 2.6 }: { color?: string; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="9 9 46 46" fill="none" className="block shrink-0" aria-hidden>
      <g stroke={color} strokeWidth={stroke} transform="rotate(45 32 32)">
        <ellipse cx="32" cy="15.5" rx="6.5" ry="10" />
        <ellipse cx="32" cy="48.5" rx="6.5" ry="10" />
        <ellipse cx="15.5" cy="32" rx="10" ry="6.5" />
        <ellipse cx="48.5" cy="32" rx="10" ry="6.5" />
      </g>
      <circle cx="32" cy="32" r="3.3" fill={color} />
    </svg>
  );
}

/** Il simbolo su un tondo verde scuro, come l'icona dell'app: è il logo nella barra in alto. */
export function BrandIcon({ size = 36 }: { size?: number }) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#1c3227]" style={{ width: size, height: size }} aria-hidden>
      <LotusMark color="#9fd3ae" size={size * 0.6} stroke={3.4} />
    </span>
  );
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      {light ? <LotusMark color="#9fd3ae" size={34} stroke={2.8} /> : <BrandIcon />}
      <span className={`text-[16px] font-semibold tracking-[-0.02em] ${light ? "text-white" : "text-ink"}`}>
        souls<span className="accent text-[18px]">pilot</span>
      </span>
    </span>
  );
}
