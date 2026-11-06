const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

/** Coordinata in gradi, primi e (se richiesti) secondi: 44°37′12.0″ N */
export function dms(v: number, pos: string, neg: string, seconds = true) {
  const a = Math.abs(v);
  const d = Math.floor(a);
  const m = Math.floor((a - d) * 60);
  const s = ((a - d) * 60 - m) * 60;
  return `${d}°${pad(m)}′${seconds ? `${s.toFixed(1).padStart(4, "0")}″` : ""} ${v >= 0 ? pos : neg}`;
}
