// Genera le versioni PNG del logo con il motore di immagini incluso in Next.js.
// Uso: node brand-src/build_png.mjs  (dalla cartella portfolio, dopo build_brand.py)
import { readFileSync, writeFileSync } from "node:fs";
import { createElement as h } from "react";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";

const dir = new URL("../public/brand/", import.meta.url);
const uri = (name) => `data:image/svg+xml;base64,${readFileSync(new URL(name, dir)).toString("base64")}`;
const fonts = [
  { name: "Manrope", data: readFileSync(new URL("./fonts/Manrope-SemiBold.ttf", import.meta.url)), weight: 600, style: "normal" },
  { name: "Serif", data: readFileSync(new URL("./fonts/InstrumentSerif-Italic.ttf", import.meta.url)), weight: 400, style: "italic" },
];

async function png(element, width, height, out) {
  const res = new ImageResponse(element, { width, height, fonts });
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log("  ", out.pathname?.split("/").slice(-2).join("/") ?? out);
}

const tile = (size, pad) =>
  h("div", { style: { width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", background: "#1c3227" } },
    h("img", { src: uri("soulspilot-mark-menta.svg"), width: size - pad * 2, height: size - pad * 2 }));

// icona per iPhone (Next la usa da app/apple-icon.png)
await png(tile(180, 34), 180, 180, new URL("../app/apple-icon.png", import.meta.url));
// foto profilo per i social: il simbolo al centro, con margine per il ritaglio rotondo
await png(tile(1080, 270), 1080, 1080, new URL("soulspilot-profilo-1080.png", dir));
// logo su sfondo trasparente, in grande, per documenti e preventivi
await png(h("img", { src: uri("soulspilot-logo.svg"), width: 1950, height: 520 }), 1950, 520, new URL("soulspilot-logo.png", dir));
await png(h("img", { src: uri("soulspilot-logo-white.svg"), width: 1950, height: 520 }), 1950, 520, new URL("soulspilot-logo-white.png", dir));

// anteprima quando si condivide il link (WhatsApp, social): Next la usa da app/opengraph-image.png
await png(
  h("div", { style: { width: 1200, height: 630, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#1c3227", color: "#fff" } },
    h("img", { src: uri("soulspilot-logo-white.svg"), width: 390, height: 104 }),
    h("div", { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { fontFamily: "Manrope", fontSize: 68, lineHeight: 1.05, letterSpacing: -2.5, display: "flex", flexWrap: "wrap" } },
        "Fai vivere il tuo luogo ",
        h("span", { style: { fontFamily: "Serif", fontStyle: "italic", color: "#9fd3ae", margin: "0 14px" } }, "prima"),
        " ancora che arrivino."),
      h("div", { style: { fontFamily: "Manrope", fontSize: 26, marginTop: 28, color: "rgba(255,255,255,.65)" } }, "Riprese aeree e voli FPV · Siti web")),
  ),
  1200, 630, new URL("../app/opengraph-image.png", import.meta.url),
);
