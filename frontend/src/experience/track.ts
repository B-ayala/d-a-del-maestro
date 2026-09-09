// Trayectoria cinematográfica de la cámara a lo largo del progreso 0–1.
// Mundo: la escuela flota en el origen; el aula está detrás de la puerta
// (z negativo); el árbol/corazón está muy por debajo (y negativo).

import type { CamKey } from './lib/math';

export const CAMERA_TRACK: readonly CamKey[] = [
  { p: 0.0, pos: [0, 3.6, 17], tgt: [0, 1.4, 0] }, // diorama completo, lejos
  { p: 0.12, pos: [0, 1.9, 7.4], tgt: [0, 1.2, 1] }, // acercándose a la puerta
  { p: 0.24, pos: [0, 1.35, 3.4], tgt: [0, 1.25, 0] }, // frente a la puerta
  { p: 0.34, pos: [0, 1.45, 0.4], tgt: [0, 1.4, -3.2] }, // cruzando el umbral
  { p: 0.46, pos: [0, 1.6, -0.7], tgt: [0, 1.45, -3.4] }, // dentro, hacia el pizarrón
  { p: 0.58, pos: [1.35, 1.55, -0.5], tgt: [-1.1, 1.3, -3.4] }, // paneo: dibujos de los chicos
  { p: 0.7, pos: [-0.5, 1.6, -0.6], tgt: [0.7, 1.55, -3.5] }, // pizarrón: docentes
  { p: 0.8, pos: [0, 2.4, 3.2], tgt: [0, 1, 0] }, // saliendo del aula
  { p: 0.88, pos: [0, -2.4, 12], tgt: [0, -6.5, 0] }, // la escuela se hace chiquita
  { p: 0.95, pos: [0, -11, 25], tgt: [0, -15, 0] }, // aparece el árbol entero
  { p: 1.0, pos: [0, -13.5, 41], tgt: [0, -14.5, 0] }, // el corazón, completo
] as const;
