// Genera texturas desde <canvas> 2D (usa fuentes del sistema, sin pedidos externos).

import * as THREE from 'three';
import { makeRng } from './math';

type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

export function canvasTexture(width: number, height: number, draw: DrawFn): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/** Pizarrón: tiza sobre verde oscuro con los nombres de las docentes. */
export function blackboardTexture(
  mainTeachers: readonly string[],
  eveningTeachers: readonly string[],
): THREE.CanvasTexture {
  return canvasTexture(1024, 512, (ctx, w, h) => {
    ctx.fillStyle = '#20372b';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    const rng = makeRng(31);
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.moveTo(rng() * w, rng() * h);
      ctx.lineTo(rng() * w, rng() * h);
      ctx.stroke();
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fdf6e3';
    ctx.font = "600 46px 'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive";
    ctx.fillText('¡Gracias, seños y profes!', w / 2, 78);

    ctx.font = "500 40px 'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive";
    ctx.fillStyle = '#ffe6a8';
    ctx.fillText(mainTeachers.join('   ·   '), w / 2, 190);

    ctx.font = "400 22px system-ui, sans-serif";
    ctx.fillStyle = 'rgba(253,246,227,0.7)';
    ctx.fillText('docentes de la tarde', w / 2, 260);

    ctx.font = "500 36px 'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive";
    ctx.fillStyle = '#fdf6e3';
    ctx.fillText(eveningTeachers.join('   ·   '), w / 2, 320);

    ctx.font = "400 26px system-ui, sans-serif";
    ctx.fillStyle = 'rgba(253,246,227,0.85)';
    ctx.fillText('Enseñar también es dejar huellas', w / 2, 430);
  });
}

/** Cartelito / etiqueta con un nombre. Fondo transparente. */
export function labelTexture(
  text: string,
  opts: { bg?: string; color?: string; font?: string } = {},
): THREE.CanvasTexture {
  const { bg = 'rgba(255,255,255,0.94)', color = '#2c2620', font = "600 60px system-ui, sans-serif" } = opts;
  return canvasTexture(512, 256, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    if (bg !== 'transparent') {
      const r = 28;
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.roundRect(24, 64, w - 48, h - 128, r);
      ctx.fill();
    }
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2);
  });
}

/** "Dibujo de nene": papel con garabatos simples y el nombre abajo. */
export function drawingTexture(name: string, hue: number): THREE.CanvasTexture {
  return canvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#fffaf0';
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';

    ctx.strokeStyle = `hsl(${hue}, 70%, 55%)`;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 - 30, 90, 0, Math.PI * 2); // sol / cara
    ctx.stroke();

    ctx.strokeStyle = `hsl(${(hue + 120) % 360}, 65%, 45%)`;
    ctx.beginPath();
    ctx.moveTo(60, h - 90);
    ctx.lineTo(w - 60, h - 90); // suelo
    ctx.moveTo(120, h - 90);
    ctx.lineTo(140, 150);
    ctx.moveTo(w - 130, h - 90);
    ctx.lineTo(w - 150, 170); // "casa"/tallos
    ctx.stroke();

    ctx.fillStyle = '#2c2620';
    ctx.font = "600 54px 'Segoe Script', 'Comic Sans MS', cursive";
    ctx.textAlign = 'center';
    ctx.fillText(name, w / 2, h - 26);
  });
}
