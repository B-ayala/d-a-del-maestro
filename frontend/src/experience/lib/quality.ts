// Detección de "tier" de calidad. Mobile-first: el objetivo real es 'low'.

export type Tier = 'high' | 'low' | 'static';

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}

type NavLike = Navigator & {
  deviceMemory?: number;
  hardwareConcurrency?: number;
};

export function detectTier(): Tier {
  if (typeof window === 'undefined') return 'static';
  if (prefersReducedMotion() || !hasWebGL()) return 'static';

  const nav = navigator as NavLike;
  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = window.innerWidth < 768;

  if (memory <= 4 || cores <= 4 || (coarse && small)) return 'low';
  return 'high';
}

export type TierSettings = {
  readonly dpr: [number, number];
  readonly motes: number;
  readonly leaves: number;
  readonly desks: number;
  readonly shadows: boolean;
  readonly postFx: boolean;
  readonly clouds: number;
};

export const SETTINGS: Record<Exclude<Tier, 'static'>, TierSettings> = {
  high: { dpr: [1, 2], motes: 420, leaves: 620, desks: 6, shadows: true, postFx: true, clouds: 5 },
  low: { dpr: [1, 1.5], motes: 130, leaves: 240, desks: 3, shadows: false, postFx: false, clouds: 3 },
};
