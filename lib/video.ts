/**
 * Sorgente video del progetto per questo schermo e questo browser.
 * - "m" su schermi verticali (versione 9:16 ritagliata dal 4K), "d" altrove (1080p)
 * - AV1 dove il browser lo decodifica (circa metà del peso), altrimenti H.264
 */
let av1: boolean | null = null;

/** schermo verticale: lì il sito usa la versione 9:16 delle riprese */
export const isPortrait = () => window.innerHeight > window.innerWidth * 1.05;

/** Primo fotogramma della ripresa (1.avif o, su schermo verticale, 1m.avif): è quello da cui parte la pagina del progetto. */
export function firstFrame(dir: string) {
  return `${dir}/${isPortrait() ? "1m" : "1"}.avif`;
}

export function videoSrc(base: string) {
  const tag = isPortrait() ? "m" : "d";
  // su telefono sempre H.264 con fotogrammi completi ravvicinati: lo scrub resta pulito e il decoder hardware lo regge
  if (tag === "m") return `${base}-m.mp4`;
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
