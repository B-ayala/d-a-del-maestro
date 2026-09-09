// Guion completo de la experiencia 3D "La Escuela Mágica".
// Editar acá cambia los textos y los nombres que aparecen en el mundo.

export const KIDS = [
  'Miqueas',
  'Santi',
  'Tomi',
  'Juana',
  'Alexia',
  'Manu',
  'Nico',
  'Valen',
] as const;

// Docentes reconocidas individualmente. Hay dos "Mica": son dos personas
// distintas y las dos tienen que estar. No combinar, no quitar.
export const TEACHERS_MAIN = ['Camila', 'Matilda'] as const;
export const TEACHERS_TARDE = ['Jony', 'Mica', 'Mica', 'Yani', 'Vicky'] as const;
export const TEACHERS_ALL = [...TEACHERS_MAIN, ...TEACHERS_TARDE] as const;

// Raíces del árbol de las huellas.
export const ROOT_WORDS = [
  'amor',
  'paciencia',
  'aprendizaje',
  'confianza',
  'alegría',
  'acompañamiento',
] as const;

export type Beat = {
  readonly id: string;
  /** Rango de progreso [0..1] en el que este texto está visible. */
  readonly at: readonly [number, number];
  readonly kicker?: string;
  readonly lines: readonly string[];
  /** Momento emocional: se muestra más grande y con más aire. */
  readonly feature?: boolean;
};

export const BEATS: readonly Beat[] = [
  {
    id: 'intro',
    at: [0.0, 0.12],
    kicker: '🍎 ¡Feliz Día del Maestro!',
    lines: [
      'Gracias por enseñar con el corazón y dejar huellas para toda la vida.',
      'Hay lugares donde se aprende…',
    ],
  },
  {
    id: 'approach',
    at: [0.13, 0.29],
    lines: ['…y lugares donde también se aprende a crecer.'],
  },
  {
    id: 'gratitude-1',
    at: [0.42, 0.55],
    lines: [
      'Queremos agradecerles de corazón por todo el amor, la dedicación y la paciencia que ponen cada día en su tarea.',
    ],
  },
  {
    id: 'gratitude-2',
    at: [0.56, 0.67],
    lines: [
      'Gracias por acompañar a nuestros hijos e hijas en cada aprendizaje, por alentarlos, escucharlos, contenerlos y ayudarlos a crecer.',
    ],
  },
  {
    id: 'teach-1',
    at: [0.68, 0.76],
    feature: true,
    lines: ['Enseñar no es solamente transmitir conocimientos…'],
  },
  {
    id: 'teach-2',
    at: [0.77, 0.86],
    feature: true,
    lines: ['…también es dejar huellas.'],
  },
  {
    id: 'final-1',
    at: [0.9, 0.955],
    lines: ['Una escuela no se construye solamente con paredes.'],
  },
  {
    id: 'final-2',
    at: [0.955, 0.99],
    feature: true,
    lines: [
      'Se construye con las huellas que ustedes dejan en cada niño.',
      '❤️ Gracias por dejar huellas.',
    ],
  },
  {
    id: 'sign',
    at: [0.99, 1.0001],
    kicker: 'INSTITUTO ARMONÍA',
    lines: ['¡Feliz Día del Maestro! 🍎✨'],
  },
] as const;

/** Foto individual del mundo: siempre juan (nunca otra). */
export const JUAN_SRC = '/gallery/juan-960.webp';
