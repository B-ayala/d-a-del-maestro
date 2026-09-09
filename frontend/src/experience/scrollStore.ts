// Fuente única del progreso de la experiencia (0 = Hero, 1 = corazón final).
// Vive fuera de React: el bucle de render 3D lo lee cada frame sin re-render.

import { useEffect, useState } from 'react';

type Listener = (progress: number) => void;

let progress = 0;
const listeners = new Set<Listener>();
let invalidate: (() => void) | null = null;

export const scrollStore = {
  get progress(): number {
    return progress;
  },
  set(next: number): void {
    const clamped = next < 0 ? 0 : next > 1 ? 1 : next;
    if (clamped === progress) return;
    progress = clamped;
    invalidate?.();
    for (const l of listeners) l(clamped);
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  /** El canvas registra su invalidador para pedir frames sólo cuando cambia el scroll. */
  bindInvalidate(fn: (() => void) | null): void {
    invalidate = fn;
  },
};

/** Suscribe un componente React al progreso, re-renderizando en cada cambio. */
export function useScrollProgress(): number {
  const [value, setValue] = useState(progress);
  useEffect(() => scrollStore.subscribe(setValue), []);
  return value;
}
