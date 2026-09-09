// Genera versiones WebP responsive + placeholder (LQIP) de las fotos del homenaje.
// Uso: node scripts/optimize-images.mjs
// Requiere ImageMagick 7 (comando `magick`) en el PATH.
// Salida: public/gallery/<slug>-<w>.webp  +  src/data/gallery-generated.json

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'src/assets');
const OUT = resolve(ROOT, 'public/gallery');
const MANIFEST = resolve(ROOT, 'src/data/gallery-generated.json');

const WIDTHS = [480, 960, 1440];
const QUALITY = 72;

// slug -> archivo original. El orden define el orden de la galería.
const IMAGES = {
  'plantel-docente': 'WhatsApp Image 2026-09-08 at 2.33.52 PM.jpeg',
  juan: 'juanchi/juan.jpeg',
};

function identify(file) {
  const out = execFileSync('magick', ['identify', '-format', '%w %h', file], {
    encoding: 'utf8',
  });
  const [w, h] = out.trim().split(' ').map(Number);
  return { w, h };
}

function toWebp(src, dest, width) {
  execFileSync('magick', [
    src,
    '-auto-orient',
    '-resize', `${width}>`,
    '-strip',
    '-quality', String(QUALITY),
    '-define', 'webp:method=6',
    dest,
  ]);
}

function lqip(src) {
  const buf = execFileSync('magick', [
    src,
    '-auto-orient',
    '-resize', '24x24',
    '-strip',
    '-quality', '40',
    'webp:-',
  ]);
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const manifest = {};
for (const [slug, name] of Object.entries(IMAGES)) {
  const src = resolve(SRC, name);
  const { w, h } = identify(src);
  // Cada ancho objetivo se recorta al ancho real de la foto; sin duplicados.
  const widths = [...new Set(WIDTHS.map((x) => Math.min(x, w)))].sort(
    (a, b) => a - b,
  );

  for (const width of widths) {
    toWebp(src, resolve(OUT, `${slug}-${width}.webp`), width);
  }

  manifest[slug] = {
    widths,
    aspectRatio: Number((w / h).toFixed(4)),
    placeholder: lqip(src),
  };
  console.log(`ok  ${slug}  (${w}x${h} -> ${widths.join(', ')})`);
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\nManifest: ${MANIFEST}`);
