import * as THREE from "three";

/*
  Nebbia di passaggio tra una scena e l'altra: un banco di nuvola che avvolge
  la camera. A 0 non c'è, a 1 copre tutto con il bianco caldo dell'interno delle nuvole.
*/
const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uAmount;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec3 uColor;

  float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 7.1; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y);
    // il banco si apre dal centro verso i bordi, come attraversare una nuvola
    float r = length((uv - 0.5) * vec2(uRes.x / uRes.y, 1.0));
    float n = fbm(p * 2.2 + vec2(uTime * 0.05, -uTime * 0.03));
    float n2 = fbm(p * 5.0 - vec2(uTime * 0.08, 0.0));
    float edge = uAmount * 1.9 - 0.45 + r * 0.55 * (1.0 - uAmount);
    float a = smoothstep(0.0, 0.55, edge + (n - 0.5) * 0.9 + (n2 - 0.5) * 0.25);
    a = mix(a, 1.0, smoothstep(0.85, 1.0, uAmount));
    vec3 col = uColor * (0.94 + n * 0.08);
    gl_FragColor = vec4(col * a, a);
  }
`;

export function createFog() {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: FRAG,
    transparent: true,
    premultipliedAlpha: true,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uAmount: { value: 0 },
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uColor: { value: new THREE.Color(0.93, 0.92, 0.9) },
    },
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  scene.add(quad);
  return {
    scene,
    camera,
    set(amount: number, time: number, w: number, h: number) {
      material.uniforms.uAmount.value = amount;
      material.uniforms.uTime.value = time;
      material.uniforms.uRes.value.set(w, h);
    },
    dispose() {
      quad.geometry.dispose();
      material.dispose();
    },
  };
}
