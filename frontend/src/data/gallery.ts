import generated from './gallery-generated.json';

type GeneratedEntry = {
  widths: number[];
  aspectRatio: number;
  placeholder: string;
};

const meta = generated as Record<string, GeneratedEntry>;

// Foto del Hero: usar la imagen 'plantel-docente' (foto-portada).
export const HERO_PHOTO = {
  slug: 'plantel-docente',
  alt: 'Foto del plantel docente del Instituto Armonía, reunido y sonriente.',
  ...(meta['plantel-docente'] as GeneratedEntry),
} as const;
