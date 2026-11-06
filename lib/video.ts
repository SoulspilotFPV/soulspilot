/**
 * Sorgente video del progetto per questo schermo e questo browser.
 * - "m" su schermi verticali (versione 9:16 ritagliata dal 4K), "d" altrove (1080p)
 * - AV1 dove il browser lo decodifica (circa metà del peso), altrimenti H.264
 */
let av1: boolean | null = null;

export function videoSrc(base: string) {
  const tag = window.innerHeight > window.innerWidth * 1.05 ? "m" : "d";
  if (av1 === null) {
    const probe = document.createElement("video");
    av1 = probe.canPlayType('video/mp4; codecs="av01.0.08M.08"') === "probably";
  }
  return `${base}-${tag}${av1 ? ".av1" : ""}.mp4`;
}

/** Se la versione AV1 non si apre, si ripiega sull'H.264 (stesso nome senza ".av1"). */
export function fallbackToH264(v: HTMLVideoElement) {
  const onError = () => {
    if (!v.currentSrc.includes(".av1.mp4")) return;
    v.src = v.currentSrc.replace(".av1.mp4", ".mp4");
    v.load();
  };
  v.addEventListener("error", onError);
  return () => v.removeEventListener("error", onError);
}
