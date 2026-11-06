/*
  Genera le texture 3D di rumore per le nuvole (ripetibili su tutti gli assi).
  shape  (N³, RGBA): R = Perlin-Worley, G/B/A = Worley a frequenze crescenti
  detail (M³, RGBA): R/G/B = Worley a frequenze crescenti, per erodere i bordi
*/

function mulberry(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Worley 3D ripetibile: 1 vicino al punto della cella, 0 lontano. */
function worley(N: number, cells: number, rand: () => number) {
  const pts = new Float32Array(cells * cells * cells * 3);
  for (let i = 0; i < pts.length; i++) pts[i] = rand();
  const out = new Float32Array(N * N * N);
  const wrap = (v: number) => ((v % cells) + cells) % cells;
  let o = 0;
  for (let z = 0; z < N; z++) {
    const pz = ((z + 0.5) / N) * cells;
    const cz = Math.floor(pz);
    for (let y = 0; y < N; y++) {
      const py = ((y + 0.5) / N) * cells;
      const cy = Math.floor(py);
      for (let x = 0; x < N; x++) {
        const px = ((x + 0.5) / N) * cells;
        const cx = Math.floor(px);
        let best = 9;
        for (let dz = -1; dz <= 1; dz++) {
          const nz = cz + dz;
          const iz = wrap(nz);
          for (let dy = -1; dy <= 1; dy++) {
            const ny = cy + dy;
            const iy = wrap(ny);
            for (let dx = -1; dx <= 1; dx++) {
              const nx = cx + dx;
              const k = ((iz * cells + iy) * cells + wrap(nx)) * 3;
              const ddx = nx + pts[k] - px;
              const ddy = ny + pts[k + 1] - py;
              const ddz = nz + pts[k + 2] - pz;
              const d = ddx * ddx + ddy * ddy + ddz * ddz;
              if (d < best) best = d;
            }
          }
        }
        out[o++] = 1 - Math.min(1, Math.sqrt(best));
      }
    }
  }
  return out;
}

/** Perlin 3D ripetibile con periodo intero. */
function makePerlin(rand: () => number) {
  const p = new Uint8Array(512);
  const base = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [base[i], base[j]] = [base[j], base[i]];
  }
  for (let i = 0; i < 512; i++) p[i] = base[i & 255];
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const grad = (h: number, x: number, y: number, z: number) => {
    const g = h & 15;
    const u = g < 8 ? x : y;
    const v = g < 4 ? y : g === 12 || g === 14 ? x : z;
    return ((g & 1) === 0 ? u : -u) + ((g & 2) === 0 ? v : -v);
  };
  return (x: number, y: number, z: number, per: number) => {
    const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    x -= X; y -= Y; z -= Z;
    const xi = X % per, yi = Y % per, zi = Z % per;
    const xn = (xi + 1) % per, yn = (yi + 1) % per, zn = (zi + 1) % per;
    const u = fade(x), v = fade(y), w = fade(z);
    const h = (a: number, b: number, c: number) => p[p[p[a] + b] + c];
    return lerp(
      lerp(
        lerp(grad(h(xi, yi, zi), x, y, z), grad(h(xn, yi, zi), x - 1, y, z), u),
        lerp(grad(h(xi, yn, zi), x, y - 1, z), grad(h(xn, yn, zi), x - 1, y - 1, z), u),
        v,
      ),
      lerp(
        lerp(grad(h(xi, yi, zn), x, y, z - 1), grad(h(xn, yi, zn), x - 1, y, z - 1), u),
        lerp(grad(h(xi, yn, zn), x, y - 1, z - 1), grad(h(xn, yn, zn), x - 1, y - 1, z - 1), u),
        v,
      ),
      w,
    );
  };
}

const remap = (v: number, a: number, b: number, c: number, d: number) => c + ((v - a) / (b - a)) * (d - c);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function buildShape(N: number) {
  const rand = mulberry(1337);
  const w4 = worley(N, 4, rand);
  const w8 = worley(N, 8, rand);
  const w16 = worley(N, 16, rand);
  const w32 = worley(N, 32, rand);
  const perlin = makePerlin(rand);
  const out = new Uint8Array(N * N * N * 4);
  let i = 0;
  for (let z = 0; z < N; z++) {
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        // Perlin fbm, 4 ottave
        let v = 0, amp = 0.5, f = 4;
        for (let o = 0; o < 4; o++) {
          v += amp * perlin((x / N) * f, (y / N) * f, (z / N) * f, f);
          amp *= 0.5;
          f *= 2;
        }
        const pn = clamp01(v * 0.9 + 0.5);
        const wf = w4[i] * 0.625 + w8[i] * 0.25 + w16[i] * 0.125;
        const pw = clamp01(remap(pn, 0, 1, wf, 1)); // Perlin-Worley
        const o4 = i * 4;
        out[o4] = pw * 255;
        out[o4 + 1] = w8[i] * 255;
        out[o4 + 2] = w16[i] * 255;
        out[o4 + 3] = w32[i] * 255;
        i++;
      }
    }
  }
  return out;
}

function buildDetail(M: number) {
  const rand = mulberry(4242);
  const a = worley(M, 4, rand);
  const b = worley(M, 8, rand);
  const c = worley(M, 16, rand);
  const out = new Uint8Array(M * M * M * 4);
  for (let i = 0; i < a.length; i++) {
    out[i * 4] = a[i] * 255;
    out[i * 4 + 1] = b[i] * 255;
    out[i * 4 + 2] = c[i] * 255;
    out[i * 4 + 3] = 255;
  }
  return out;
}

/**
 * Mappa d'altezza della montagna (0..1), ispirata al Monviso: piramide a tre creste,
 * una cima secondaria più bassa, dettaglio roccioso multifrattale che cresce con la quota.
 */
function buildHeight(K: number) {
  const rand = mulberry(99);
  const perlin = makePerlin(rand);
  const out = new Float32Array(K * K);
  const ridged = (x: number, y: number, oct: number) => {
    let v = 0, amp = 0.5, f = 1, w = 1;
    for (let o = 0; o < oct; o++) {
      let n = 1 - Math.abs(perlin(x * f + 17.3, y * f + 3.7, o * 1.31, 256));
      n *= n * w;
      w = Math.min(1, n * 1.8);
      v += amp * n;
      amp *= 0.5;
      f *= 2.03;
    }
    return v;
  };
  for (let j = 0; j < K; j++) {
    for (let i = 0; i < K; i++) {
      const u = (i / (K - 1)) * 2 - 1, v = (j / (K - 1)) * 2 - 1;
      const r = Math.hypot(u, v);
      const a = Math.atan2(v, u);
      // tre facce principali: le creste stanno dove il coseno è minimo
      const tri = r * (0.84 + 0.16 * Math.cos(3 * (a - 0.5)));
      let shape = Math.pow(Math.max(0, 1 - tri * 1.18), 1.7);
      const r2 = Math.hypot(u - 0.34, v + 0.2);
      shape = Math.max(shape, 0.6 * Math.pow(Math.max(0, 1 - r2 * 2.6), 1.6));
      const r3 = Math.hypot(u + 0.42, v - 0.1);
      shape = Math.max(shape, 0.42 * Math.pow(Math.max(0, 1 - r3 * 2.2), 1.5));
      const rid = ridged(u * 2.6, v * 2.6, 8);
      const gully = Math.abs(perlin(u * 9, v * 9, 7.7, 256));
      let h = shape * 0.82 + shape * (rid - 0.45) * 0.42 - shape * gully * 0.05 + rid * 0.035;
      // bordi a zero, così la montagna sparisce sotto le nuvole senza scalini
      h *= Math.min(1, Math.max(0, (1 - r) * 3));
      out[j * K + i] = Math.max(0, Math.min(1, h));
    }
  }
  return out;
}

self.onmessage = (e: MessageEvent<{ N: number; M: number; K: number }>) => {
  const { N, M, K } = e.data;
  const shape = buildShape(N);
  const detail = buildDetail(M);
  // la mappa d'altezza normalmente arriva già pronta come file statico: qui solo come riserva
  const height = K > 0 ? buildHeight(K) : new Float32Array(0);
  (self as unknown as Worker).postMessage({ shape, detail, height, N, M, K }, [shape.buffer, detail.buffer, height.buffer]);
};

export {};
