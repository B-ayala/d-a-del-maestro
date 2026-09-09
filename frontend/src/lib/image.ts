// Helpers para construir las URLs de /public/gallery generadas por el script.

const BASE = '/gallery';

export function srcFor(slug: string, width: number): string {
  return `${BASE}/${slug}-${width}.webp`;
}

export function srcSetFor(slug: string, widths: readonly number[]): string {
  return widths.map((w) => `${srcFor(slug, w)} ${w}w`).join(', ');
}

/** URL por defecto para el atributo src (la más chica sirve de fallback). */
export function fallbackSrc(slug: string, widths: readonly number[]): string {
  return srcFor(slug, widths[0] ?? 480);
}
