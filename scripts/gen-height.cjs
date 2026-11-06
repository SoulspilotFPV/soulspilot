// Genera la mappa d'altezza della montagna come file statico compresso.
// Uso: node scripts/gen-height.cjs [risoluzione=1536; 1024 per i telefoni]
// Formato: Uint16 per punto, codifica delta per riga, poi gzip (si decomprime nel browser con DecompressionStream).
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const ts = require("typescript");

const K = Number(process.argv[2] || 1536);
const root = path.join(__dirname, "..");
let src = fs.readFileSync(path.join(root, "components/cloudNoise.worker.ts"), "utf8").replace(/self\.onmessage[\s\S]*$/, "");
src += "\nmodule.exports = { buildHeight };";
const js = ts.transpileModule(src, { compilerOptions: { module: 1, target: 7 } }).outputText;
const mod = { exports: {} };
new Function("module", "exports", js)(mod, mod.exports);

const h = mod.exports.buildHeight(K);
const d = new Uint16Array(h.length);
for (let j = 0; j < K; j++) {
  let prev = 0;
  for (let i = 0; i < K; i++) {
    const v = Math.round(h[j * K + i] * 65535);
    d[j * K + i] = (v - prev) & 0xffff;
    prev = v;
  }
}
const out = path.join(root, `public/noise/height${K}.bin.gz`);
fs.writeFileSync(out, zlib.gzipSync(Buffer.from(d.buffer), { level: 9 }));
console.log(`${out}: ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
