// Puntos que rellenan una silueta de corazón (vista frontal, plano XY).

import { makeRng } from './math';

export type LeafPoint = { x: number; y: number; z: number; order: number };

function heartEdge(t: number): { x: number; y: number } {
  const x = 16 * Math.sin(t) ** 3;
  const y =
    13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return { x, y };
}

/**
 * Distribuye `count` hojas dentro del corazón. `order` (0–1) define el orden
 * en que se encienden: de abajo hacia arriba, del tronco a las puntas.
 */
export function heartLeaves(count: number, scale: number): LeafPoint[] {
  const rng = makeRng(0x4152 + count);
  const points: LeafPoint[] = [];
  let minY = Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < count; i++) {
    const t = rng() * Math.PI * 2;
    const edge = heartEdge(t);
    const r = 0.15 + rng() * 0.85; // 0 centro, 1 borde
    const x = edge.x * r * scale + (rng() - 0.5) * 0.4;
    const y = edge.y * r * scale + (rng() - 0.5) * 0.4;
    const z = (rng() - 0.5) * 1.4 * scale;
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    points.push({ x, y, z, order: 0 });
  }

  const span = maxY - minY || 1;
  for (const p of points) {
    // Se encienden de abajo hacia arriba, con algo de ruido para que no sea una línea.
    p.order = (p.y - minY) / span + (rng() - 0.5) * 0.12;
  }
  points.sort((a, b) => a.order - b.order);
  points.forEach((p, i) => (p.order = i / points.length));
  return points;
}
