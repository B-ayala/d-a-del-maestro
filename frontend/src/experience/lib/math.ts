// Utilidades puras de interpolación y easing para la narrativa por scroll.

export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Progreso 0–1 dentro del sub-rango [a, b] del progreso global. */
export const seg = (p: number, a: number, b: number): number =>
  b === a ? (p >= b ? 1 : 0) : clamp01((p - a) / (b - a));

export const easeInOut = (x: number): number =>
  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

/** Interpolación estable respecto al framerate (lambda ~ velocidad). */
export const damp = (
  current: number,
  target: number,
  lambda: number,
  dt: number,
): number => lerp(current, target, 1 - Math.exp(-lambda * dt));

/** PRNG determinista (mulberry32). Estable entre recargas, sin `Math.random`. */
export function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Vec3 = readonly [number, number, number];

export type CamKey = { readonly p: number; readonly pos: Vec3; readonly tgt: Vec3 };

/** Muestrea una trayectoria de cámara (posición + punto de mira) por keyframes. */
export function sampleTrack(
  keys: readonly CamKey[],
  p: number,
): { pos: [number, number, number]; tgt: [number, number, number] } {
  const first = keys[0];
  const last = keys[keys.length - 1];
  if (!first || !last) return { pos: [0, 0, 10], tgt: [0, 0, 0] };
  if (p <= first.p) return { pos: [...first.pos], tgt: [...first.tgt] };
  if (p >= last.p) return { pos: [...last.pos], tgt: [...last.tgt] };

  let a = first;
  let b = last;
  for (let i = 0; i < keys.length - 1; i++) {
    const k0 = keys[i];
    const k1 = keys[i + 1];
    if (k0 && k1 && p >= k0.p && p <= k1.p) {
      a = k0;
      b = k1;
      break;
    }
  }
  const t = easeInOut(seg(p, a.p, b.p));
  return {
    pos: [
      lerp(a.pos[0], b.pos[0], t),
      lerp(a.pos[1], b.pos[1], t),
      lerp(a.pos[2], b.pos[2], t),
    ],
    tgt: [
      lerp(a.tgt[0], b.tgt[0], t),
      lerp(a.tgt[1], b.tgt[1], t),
      lerp(a.tgt[2], b.tgt[2], t),
    ],
  };
}
