import * as THREE from "three";

/*
  Nuvole volumetriche (raymarching) riutilizzabili dal viaggio.
  Forma: Perlin-Worley 3D + mappa meteo, eroso da Worley ad alta frequenza.
  Luce: Beer-Lambert verso il sole, fase a doppio lobo, powder, prospettiva aerea.
*/

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const CLOUD_FRAG = /* glsl */ `
  precision highp float;
  precision highp sampler3D;
  varying vec2 vUv;
  uniform sampler3D uShape;
  uniform sampler3D uDetail;
  uniform float uTime;
  uniform float uZ;
  uniform float uCamY;
  uniform float uPitch;
  uniform float uCoverage;
  uniform vec2 uRes;
  uniform vec2 uPtr;

  #define BOTTOM -1.5
  #define TOP 3.2
  #define SIGMA 5.0
  #define PI 3.14159265

  uniform vec3 uSun;
  uniform vec3 uSunCol;
  uniform float uDusk;
  uniform sampler2D uHeight;
  uniform float uInside;
  uniform vec3 uMtn;
  #define MSIZE 84.0
  #define MHEIGHT 36.0
  #define SUN uSun
  #define SUN_COL uSunCol

  float remap(float v, float a, float b, float c, float d) {
    return c + (v - a) / (b - a) * (d - c);
  }

  vec3 skyColor(vec3 rd) {
    vec3 zenith = mix(vec3(0.05, 0.17, 0.50), vec3(0.10, 0.14, 0.38), uDusk);
    vec3 horizon = mix(vec3(0.50, 0.62, 0.78), vec3(0.78, 0.56, 0.64), uDusk);
    float up = max(rd.y, 0.0);
    vec3 col = mix(horizon, zenith, pow(up, 0.33));
    // cintura di Venere: la fascia rosa sopra l'orizzonte, dalla parte opposta al sole
    vec2 hd = normalize(rd.xz + 1e-5), sd = normalize(SUN.xz + 1e-5);
    float anti = max(dot(hd, -sd), 0.0);
    col += uDusk * vec3(0.62, 0.27, 0.34) * exp(-pow((rd.y - 0.07) / 0.075, 2.0)) * (0.35 + 0.65 * anti);
    // sotto l'orizzonte: foschia sopra la terra
    vec3 ground = vec3(0.20, 0.25, 0.28);
    col = mix(col, mix(horizon * 0.9, ground, smoothstep(0.0, -0.45, rd.y)), step(rd.y, 0.0));
    float s = max(dot(rd, SUN), 0.0);
    col += SUN_COL * (pow(s, 6.0) * 0.12 + pow(s, 64.0) * 0.35) * vec3(1.0, 0.8, 0.6);
    col += SUN_COL * smoothstep(0.99955, 0.99985, s) * 4.0;
    return col;
  }

  // rotazione fissa per il dettaglio: evita che la ripetizione della texture si veda
  const mat3 ROT = mat3(0.80, 0.36, -0.48, -0.60, 0.48, -0.64, 0.0, 0.80, 0.60);

  float density(vec3 p, bool detail) {
    float h = (p.y - BOTTOM) / (TOP - BOTTOM);
    if (h < 0.0 || h > 1.0) return 0.0;
    vec3 wind = vec3(uTime * 0.035, 0.0, uTime * 0.018);

    // mappa meteo: ammassi di nuvole e spazi di cielo aperto, a grande scala
    vec2 wp = (p.xz + wind.xz * 0.5) * 0.011;
    float w1 = texture(uShape, vec3(wp, 0.31)).r;
    float w2 = texture(uShape, vec3(wp * 2.3 + 0.17, 0.73)).g;
    float weather = smoothstep(0.38, 0.78, w1 * 0.75 + w2 * 0.25);
    float cov = uCoverage * weather;
    if (cov <= 0.01) return 0.0;

    // profilo verticale: dove la mappa è piena, le nuvole crescono più alte
    float topH = mix(0.45, 1.0, weather);
    float hg = smoothstep(0.0, 0.08, h) * smoothstep(topH, topH * 0.45, h);
    if (hg <= 0.0) return 0.0;

    vec4 s = texture(uShape, (p + wind) * 0.03);
    float wf = s.g * 0.625 + s.b * 0.25 + s.a * 0.125;
    float base = remap(s.r, wf - 1.0, 1.0, 0.0, 1.0);
    base = clamp(remap(base * hg, 1.0 - cov, 1.0, 0.0, 1.0), 0.0, 1.0);
    if (base <= 0.0 || !detail) return base;

    vec3 dp = ROT * (p + wind * 1.8) * 0.34;
    vec3 d = texture(uDetail, dp).rgb;
    float df = d.r * 0.625 + d.g * 0.25 + d.b * 0.125;
    // in basso sfilacciato, in alto a cavolfiore
    float m = mix(df, 1.0 - df, clamp(h * 5.0, 0.0, 1.0));
    return clamp(remap(base, m * 0.62, 1.0, 0.0, 1.0), 0.0, 1.0) * 1.8;
  }

  float lightMarch(vec3 p) {
    float sum = 0.0;
    float st = 0.22;
    for (int i = 0; i < LSTEPS; i++) {
      p += SUN * st;
      sum += density(p, i < 2) * st;
      st *= 1.55;
    }
    return sum;
  }

  // ---------- montagna (campo d'altezza) ----------
  float mtnH(vec2 xz, bool micro) {
    vec2 q = (xz - uMtn.xz) / MSIZE + 0.5;
    if (q.x <= 0.0 || q.y <= 0.0 || q.x >= 1.0 || q.y >= 1.0) return -100.0;
    float h = texture(uHeight, q).r;
    if (micro) {
      float m = texture(uHeight, q * 6.0 + 0.31).r + texture(uHeight, q * 17.0 + 0.73).r * 0.5;
      h += (m - 0.5) * 0.016 * smoothstep(0.04, 0.3, h);
    }
    return uMtn.y + h * MHEIGHT;
  }

  float mtnHit(vec3 ro, vec3 rd, float tMax) {
    vec3 bmin = vec3(uMtn.x - MSIZE * 0.5, uMtn.y, uMtn.z - MSIZE * 0.5);
    vec3 bmax = vec3(uMtn.x + MSIZE * 0.5, uMtn.y + MHEIGHT, uMtn.z + MSIZE * 0.5);
    vec3 inv = 1.0 / (rd + vec3(1e-6));
    vec3 ta = (bmin - ro) * inv, tb = (bmax - ro) * inv;
    vec3 t1v = min(ta, tb), t2v = max(ta, tb);
    float tn = max(max(t1v.x, t1v.y), t1v.z), tf = min(min(t2v.x, t2v.y), t2v.z);
    if (tf < max(tn, 0.0)) return -1.0;
    float t = max(tn, 0.0);
    float lastT = t;
    for (int i = 0; i < 260; i++) {
      vec3 p = ro + rd * t;
      float d = p.y - mtnH(p.xz, false);
      if (d < 0.0) {
        float a = lastT, b = t;
        for (int k = 0; k < 10; k++) {
          float m = 0.5 * (a + b);
          vec3 pm = ro + rd * m;
          if (pm.y - mtnH(pm.xz, false) < 0.0) b = m; else a = m;
        }
        return b;
      }
      lastT = t;
      t += max(0.003 * t + 0.015, d * 0.28);
      if (t > tf || t > tMax) break;
    }
    return -1.0;
  }

  vec3 mtnShade(vec3 p, vec3 rd, float t, vec3 haze) {
    float e = MSIZE / 2000.0;
    float hL = mtnH(p.xz - vec2(e, 0.0), true), hR = mtnH(p.xz + vec2(e, 0.0), true);
    float hD = mtnH(p.xz - vec2(0.0, e), true), hU = mtnH(p.xz + vec2(0.0, e), true);
    vec3 n = normalize(vec3(hL - hR, 2.0 * e, hD - hU));
    float hn = (p.y - uMtn.y) / MHEIGHT;
    float slope = 1.0 - n.y;
    float var = texture(uHeight, (p.xz - uMtn.xz) / MSIZE * 11.0).r;
    float var2 = texture(uHeight, (p.xz - uMtn.xz) / MSIZE * 37.0 + 0.5).r;
    // neve sui pendii meno ripidi e in quota, roccia scura sulle pareti
    float snow = smoothstep(0.34, 0.2, slope + (var - 0.45) * 0.4 + (var2 - 0.5) * 0.18) * smoothstep(0.22, 0.4, hn + var * 0.08);
    vec3 rock = mix(vec3(0.055, 0.05, 0.048), vec3(0.16, 0.135, 0.11), var * 0.6 + var2 * 0.4);
    vec3 alb = mix(rock, vec3(0.84, 0.87, 0.92), snow);
    // ombre proiettate dalla montagna stessa
    float sh = 1.0;
    float ts = 0.12;
    for (int i = 0; i < 32; i++) {
      vec3 q = p + SUN * ts;
      if (q.y > uMtn.y + MHEIGHT) break;
      float d = q.y - mtnH(q.xz, false);
      sh = min(sh, clamp(10.0 * d / ts, 0.0, 1.0));
      if (sh < 0.01) break;
      ts += max(0.06, d * 0.45);
    }
    float ndl = max(dot(n, SUN), 0.0);
    vec3 skyAmb = mix(vec3(0.30, 0.44, 0.72), vec3(0.26, 0.27, 0.46), uDusk) * (0.55 + 0.45 * n.y);
    vec3 cloudBounce = mix(vec3(0.9, 0.92, 0.95), vec3(0.75, 0.62, 0.72), uDusk) * clamp(0.25 - n.y * 0.5, 0.0, 1.0) * 0.7;
    vec3 col = alb * (SUN_COL * ndl * sh + skyAmb * 0.9 + cloudBounce);
    vec3 hv = normalize(SUN - rd);
    col += SUN_COL * pow(max(dot(n, hv), 0.0), 48.0) * 0.06 * snow * sh;
    return mix(col, haze, 1.0 - exp(-t * 0.0036));
  }

  float hg(float c, float g) {
    float g2 = g * g;
    return (1.0 - g2) / (4.0 * PI * pow(1.0 + g2 - 2.0 * g * c, 1.5));
  }

  vec3 aces(vec3 x) {
    return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uRes.x / uRes.y;

    vec3 ro = vec3(sin(uTime * 0.05) * 0.2 + uPtr.x * 0.25, uCamY, -uZ);
    vec3 rd = normalize(vec3(uv, -1.6));
    float pitch = uPitch - uPtr.y * 0.04;
    float cp = cos(pitch), sp = sin(pitch);
    rd = vec3(rd.x, rd.y * cp - rd.z * sp, rd.y * sp + rd.z * cp);
    float yaw = uPtr.x * 0.04 + sin(uTime * 0.04) * 0.012;
    float cy = cos(yaw), sy = sin(yaw);
    rd = vec3(rd.x * cy - rd.z * sy, rd.y, rd.x * sy + rd.z * cy);

    vec3 sky = skyColor(rd);
    vec3 haze = skyColor(normalize(vec3(rd.x, 0.02, rd.z)));

    // intersezione con lo strato di nuvole
    float t0 = 0.0, t1 = 0.0;
    bool hit = true;
    if (ro.y > TOP) {
      if (rd.y > -0.0005) hit = false;
      else { t0 = (TOP - ro.y) / rd.y; t1 = (BOTTOM - ro.y) / rd.y; }
    } else if (ro.y < BOTTOM) {
      if (rd.y < 0.0005) hit = false;
      else { t0 = (BOTTOM - ro.y) / rd.y; t1 = (TOP - ro.y) / rd.y; }
    } else {
      t1 = rd.y > 0.0005 ? (TOP - ro.y) / rd.y : rd.y < -0.0005 ? (BOTTOM - ro.y) / rd.y : 1e4;
    }

    // dentro la nuvola la montagna non esiste: si risparmia anche il calcolo
    float tM = uInside > 0.99 ? -1.0 : mtnHit(ro, rd, 260.0);
    vec3 L = vec3(0.0);
    float T = 1.0;
    if (hit && t0 < MAXD) {
      t1 = min(t1, min(t0 + MAXLEN, MAXD));
      float st = max((t1 - t0) / float(STEPS), 0.045);
      float jitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
      float t = t0 + st * jitter;
      float cosT = dot(rd, SUN);
      float phase = mix(hg(cosT, 0.72), hg(cosT, -0.22), 0.3) * 4.0 * PI;
      phase = min(phase, 6.0);

      for (int i = 0; i < STEPS; i++) {
        if (t > t1 || (tM > 0.0 && t > tM)) break;
        vec3 p = ro + rd * t;
        float coarse = density(p, false);
        if (coarse > 0.0) {
          float d = density(p, true);
          if (d > 0.002) {
            float ld = lightMarch(p);
            float beer = exp(-ld * SIGMA * 0.95);
            float ms = exp(-ld * SIGMA * 0.12) * 0.32; // scattering multiplo, schiarisce l'interno
            float powder = 1.0 - exp(-d * SIGMA * 2.4);
            float light = (beer + ms) * mix(1.0, powder, 0.55);
            float h = (p.y - BOTTOM) / (TOP - BOTTOM);
            vec3 amb = mix(vec3(0.22, 0.26, 0.33), vec3(0.55, 0.64, 0.80), h) * 0.8;
            amb = mix(amb, vec3(0.30, 0.29, 0.44) + h * vec3(0.12, 0.08, 0.14), uDusk);
            vec3 S = SUN_COL * light * phase + amb;
            // prospettiva aerea
            S = mix(S, haze, 1.0 - exp(-t * 0.012));
            float tr = exp(-d * SIGMA * st);
            L += T * S * (1.0 - tr);
            T *= tr;
            if (T < 0.015) break;
          }
        }
        t += st;
      }
    }

    // sfondo: la montagna, oppure il mare di nuvole che continua fino all'orizzonte
    vec3 bg = sky;
    float PH = BOTTOM + 0.62 * (TOP - BOTTOM);
    if (ro.y > PH && rd.y < 0.0) {
      float tp = (PH - ro.y) / rd.y;
      vec3 pp = ro + rd * tp;
      float w = texture(uShape, vec3((pp.xz + vec2(uTime * 0.0175, uTime * 0.009)) * 0.011, 0.31)).r;
      float far = smoothstep(MAXD * 0.45, MAXD * 0.95, tp);
      vec3 sea = (SUN_COL * (0.15 + 0.12 * SUN.y) + vec3(0.42, 0.50, 0.64) * 0.55) * (0.9 + w * 0.16);
      sea = mix(sea, haze, 1.0 - exp(-tp * 0.012));
      bg = mix(bg, sea, far);
      if (tM > 0.0) {
        vec3 pm = ro + rd * tM;
        float wisp = texture(uShape, vec3(pm.xz * 0.05 + uTime * 0.004, 0.6)).r;
        float above = smoothstep(PH - 1.5, PH + 2.2 + wisp * 1.5, pm.y);
        bg = mix(bg, mtnShade(pm, rd, tM, haze), tM < tp ? 1.0 : above);
      }
    } else if (tM > 0.0) {
      bg = mtnShade(ro + rd * tM, rd, tM, haze);
    }
    // dentro la nuvola i varchi non mostrano cielo né montagna: solo il bianco diffuso della nuvola
    vec3 interior = mix(vec3(0.80, 0.84, 0.90), vec3(1.0, 1.0, 1.02), smoothstep(-0.6, 0.8, rd.y)) * 1.05;
    bg = mix(bg, interior, uInside);
    vec3 col = L + T * bg;
    col = aces(col * 0.85);
    col = pow(col, vec3(1.0 / 2.2));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export type CloudView = { camY: number; pitch: number; dusk: number; coverage: number; z: number; inside?: number };

function make3D(data: Uint8Array, n: number) {
  const tex = new THREE.Data3DTexture(data, n, n, n);
  tex.format = THREE.RGBAFormat;
  tex.type = THREE.UnsignedByteType;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = tex.wrapR = THREE.RepeatWrapping;
  tex.unpackAlignment = 1;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

const sstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Noise = { shape: Uint8Array; detail: Uint8Array; half: Uint16Array; N: number; M: number; K: number };
let noiseCache: Promise<Noise> | null = null;

/** Mappa d'altezza pre-generata (scripts/gen-height.cjs): Uint16 con codifica delta per riga, gzip. */
async function fetchHeight(K: number): Promise<Uint16Array> {
  const res = await fetch(`/noise/height${K}.bin.gz`);
  if (!res.ok) throw new Error("mappa non disponibile");
  let buf = await res.arrayBuffer();
  // alcuni server la decomprimono già da soli: si decomprime solo se c'è ancora la firma gzip
  const b = new Uint8Array(buf, 0, 2);
  if (b[0] === 0x1f && b[1] === 0x8b) {
    if (typeof DecompressionStream === "undefined") throw new Error("decompressione non supportata");
    buf = await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
  }
  const d = new Uint16Array(buf);
  if (d.length !== K * K) throw new Error("mappa incompleta");
  const half = new Uint16Array(K * K);
  for (let j = 0; j < K; j++) {
    let v = 0;
    for (let i = 0; i < K; i++) {
      v = (v + d[j * K + i]) & 0xffff;
      half[j * K + i] = THREE.DataUtils.toHalfFloat(v / 65535);
    }
  }
  return half;
}

/**
 * Texture del cielo, preparate una volta sola e tenute in memoria tra le pagine.
 * Nuvole: generate nel worker. Montagna: file statico (in parallelo); se non arriva, la calcola il worker.
 */
function loadNoise(small: boolean) {
  if (noiseCache) return noiseCache;
  const HK = small ? 1024 : 1536;
  const run = (K: number) =>
    new Promise<{ shape: Uint8Array; detail: Uint8Array; height: Float32Array; N: number; M: number; K: number }>((resolve) => {
      const worker = new Worker(new URL("../cloudNoise.worker.ts", import.meta.url));
      worker.onmessage = (e) => {
        worker.terminate();
        resolve(e.data);
      };
      worker.postMessage({ N: small ? 64 : 96, M: 32, K });
    });
  noiseCache = (async () => {
    const [clouds, height] = await Promise.all([run(0), fetchHeight(HK).catch(() => null)]);
    if (height) return { shape: clouds.shape, detail: clouds.detail, half: height, N: clouds.N, M: clouds.M, K: HK };
    // riserva: la montagna calcolata nel worker, a risoluzione ridotta
    const fb = await run(512);
    const half = new Uint16Array(fb.height.length);
    for (let i = 0; i < half.length; i++) half[i] = THREE.DataUtils.toHalfFloat(fb.height[i]);
    return { shape: clouds.shape, detail: clouds.detail, half, N: clouds.N, M: clouds.M, K: fb.K };
  })();
  return noiseCache;
}

export function createClouds(small: boolean) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: CLOUD_FRAG,
    depthTest: false,
    depthWrite: false,
    defines: { STEPS: small ? 64 : 110, LSTEPS: small ? 4 : 6, MAXD: "60.0", MAXLEN: "34.0" },
    uniforms: {
      uShape: { value: null },
      uDetail: { value: null },
      uTime: { value: 0 },
      uZ: { value: 0 },
      uCamY: { value: 6 },
      uPitch: { value: -0.2 },
      uCoverage: { value: 0.8 },
      uSun: { value: new THREE.Vector3(0, 0.1, -1).normalize() },
      uSunCol: { value: new THREE.Vector3(4.6, 2.7, 1.2) },
      uDusk: { value: 1 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uPtr: { value: new THREE.Vector2(0, 0) },
      uHeight: { value: null },
      uInside: { value: 0 },
      // montagna: a destra, lontana, con la base sotto il mare di nuvole
      uMtn: { value: new THREE.Vector3(46, -9, -108) },
    },
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  scene.add(quad);

  let shape: THREE.Data3DTexture | null = null;
  let detail: THREE.Data3DTexture | null = null;
  let heightTex: THREE.DataTexture | null = null;
  const ready = loadNoise(small).then((d) => {
    shape = make3D(d.shape, d.N);
    detail = make3D(d.detail, d.M);
    heightTex = new THREE.DataTexture(d.half, d.K, d.K, THREE.RedFormat, THREE.HalfFloatType);
    heightTex.minFilter = THREE.LinearFilter;
    heightTex.magFilter = THREE.LinearFilter;
    heightTex.wrapS = heightTex.wrapT = THREE.RepeatWrapping;
    heightTex.needsUpdate = true;
    material.uniforms.uShape.value = shape;
    material.uniforms.uDetail.value = detail;
    material.uniforms.uHeight.value = heightTex;
  });

  const u = material.uniforms;
  return {
    scene,
    camera,
    ready,
    setRes(w: number, h: number) {
      u.uRes.value.set(w, h);
      u.uMtn.value.x = Math.min(46, 10 + (w / h) * 27);
    },
    setPtr(x: number, y: number, k: number) {
      u.uPtr.value.x += (x - u.uPtr.value.x) * k;
      u.uPtr.value.y += (y - u.uPtr.value.y) * k;
    },
    update(time: number, v: CloudView) {
      u.uTime.value = time;
      u.uCamY.value = v.camY;
      u.uPitch.value = v.pitch;
      u.uCoverage.value = v.coverage;
      u.uZ.value = v.z;
      u.uDusk.value = v.dusk;
      u.uInside.value = v.inside ?? 0;
      // sole: alto e di lato di giorno, basso e davanti al tramonto
      const d = v.dusk;
      u.uSun.value.set(-0.72 - d * 0.2, 0.5 - d * 0.42, -0.2 + d * 0.5).normalize();
      u.uSunCol.value.set(4.3 + d * 0.2, 4.0 - d * 1.55, 3.6 - d * 1.35);
    },
    /** Cielo d'apertura: sopra il mare di nuvole con la montagna, poi giù dentro il bianco. */
    skyView(t: number, time: number): CloudView {
      const down = sstep(0.3, 1.0, t);
      return { camY: 6.2 - down * 5.6, pitch: -0.1 + down * 0.08, dusk: 0, coverage: 0.82 + down * 0.1, z: t * 10 + time * 0.06, inside: sstep(0.78, 1.0, t) };
    },
    /** Dentro le nuvole: fa da sfondo e da passaggio tra le riprese. */
    insideView(index: number, t: number, time: number): CloudView {
      return { camY: 0.7 + Math.sin(time * 0.1) * 0.2, pitch: 0.02, dusk: 0, coverage: 1.0, z: 40 + (index + t) * 9 + time * 0.12, inside: 1 };
    },
    /** Sopra le nuvole, fermi davanti alla montagna (pagine dei progetti). */
    aboveView(t: number, time: number): CloudView {
      return { camY: 5.6, pitch: -0.08, dusk: 0, coverage: 0.84, z: 2 + t * 5 + time * 0.04 };
    },
    /** Quiete finale: di nuovo sopra le nuvole, davanti alla montagna. */
    restView(t: number, time: number): CloudView {
      const up = sstep(0.0, 0.07, t);
      return { camY: 1.2 + up * 4.4, pitch: 0.02 - up * 0.1, dusk: 0, coverage: 0.84, z: 2 + t * 6 + time * 0.05 };
    },
    dispose() {
      quad.geometry.dispose();
      material.dispose();
      shape?.dispose();
      detail?.dispose();
      heightTex?.dispose();
    },
  };
}

export type Clouds = ReturnType<typeof createClouds>;
