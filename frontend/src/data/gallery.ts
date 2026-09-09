import generated from './gallery-generated.json';

type GeneratedEntry = {
  widths: number[];
  aspectRatio: number;
  placeholder: string;
};

const meta = generated as Record<string, GeneratedEntry>;

// Foto del Hero: el plantel docente. No se reemplaza.
export const HERO_PHOTO = {
  slug: 'plantel-docente',
  alt: 'El plantel docente del Instituto Armonía, reunido y sonriente frente al mural de flores del patio.',
  ...(meta['plantel-docente'] as GeneratedEntry),
} as const;
