# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y SemVer.

## [Unreleased]

### Added

- **Experiencia 3D "La Escuela Mágica"** (`src/experience/`): recorrido narrativo
  controlado por scroll (React Three Fiber + drei + GSAP ScrollTrigger + Lenis).
  Del hero a una escuela flotante → puerta que se abre → aula que cobra vida
  (libros, lápices, luces, dibujos, foto de juan) → nombres de los 8 chicos y de
  las docentes (Camila, Matilda; y de la tarde Jony, Mica, Mica, Yani, Vicky)
  integrados en el mundo → los objetos salen → árbol de las huellas → corazón.
- Textos del recorrido en 9 "beats" superpuestos con fade sincronizado al scroll.
- Detección de *tier* de calidad (`high` / `low` / `static`): mobile-first, con
  fallback estático completo (misma narrativa + nombres) para reduced-motion,
  sin-WebGL o gama muy baja.
- Carga diferida del 3D en dos chunks (`Experience`: gsap+lenis; `Scene`: three)
  para no penalizar la primera pantalla; montaje por IntersectionObserver.
- `PerformanceMonitor` + `AdaptiveDpr` + límites de DPR/partículas/sombras/postFX
  por tier; postprocessing (bloom + viñeta sutiles) sólo en `high`.
- Texturas de texto generadas en `<canvas>` (pizarrón, etiquetas, dibujos,
  raíces): sin pedidos de red, compatibles con la CSP.
- Bloque `.sr-only` con la narrativa y todos los nombres para lectores de
  pantalla; `<noscript>` con el mensaje esencial.
- Cierre `Cards`: grilla de tarjetas (foto de Juanchi repetida, blur-up + lazy)
  arriba del pie, con "Instituto Armonía · Hecho con cariño para nuestras seños y
  profes · 11 de septiembre de 2026".
- Landing "Feliz Día del Maestro · Instituto Armonía": homenaje visual de una sola
  página (hero, mensaje, tarjetas de agradecimiento, galería, frase y cierre).
- Pipeline de optimización de imágenes (`npm run images`): genera WebP responsive
  (480/960/1440) y placeholder borroso por foto en `public/gallery/`.
- Componente `GalleryImage` con carga diferida y efecto blur-up.
- Animaciones de aparición al hacer scroll (`Reveal` + IntersectionObserver),
  respetando `prefers-reduced-motion`.
- Botón flotante "volver arriba" (aparece al bajar, scroll suave, accesible).
- Barra de progreso de lectura en el borde superior.
- Decoración flotante temática (lápiz, manzana, libros, estrellas) en hero y frase.
- Parallax suave de la foto del hero y entrada escalonada del título.
- Micro-interacciones: hover en tarjetas y fotos, subrayado animado en los títulos,
  íconos que flotan, aparición escalonada de la galería.
- Firma personalizada del cierre ("Con cariño, Karen Ayala · mamá de Miki").
- Tokens globales de color, tipografía y espaciado en `src/index.css`.
- `netlify.toml` y `public/_headers` (CSP, X-Frame-Options, cache de assets).
- Meta `robots: noindex` para no indexar el homenaje en buscadores.

### Changed

- El scroll de la home ahora es un recorrido 3D con lienzo fijado (pin), en lugar
  de secciones estáticas apiladas. El Hero y su foto original se conservan igual.
- Se reemplazaron las secciones Tribute / Gratitude / Gallery / Quote / Closing
  por la experiencia 3D. `content.ts` queda sólo con los textos del Hero; el
  guion vive en `src/experience/data.ts`.
- Galería "Momentos del Armonía": ahora las 12 tarjetas muestran una única foto
  (`assets/juanchi/juan.jpeg`). El resto de las fotos de aula se quitó; se conserva
  sólo la del plantel docente en el hero.
- Reemplazado el scaffold de Vite + React por la estructura del homenaje.
- `tsconfig.app.json`: `strict` y `resolveJsonModule` habilitados.
- React fijado en 19.2.0 (peer de `@react-three/fiber` 9).

### Removed

- Componentes `Tribute`, `Gratitude`, `Gallery`, `GalleryImage`, `Quote`,
  `Closing`, `Reveal`, `ScrollProgress` y el hook `useReveal` (los reemplaza el
  recorrido 3D).

### Dependencies

- Añadidas: `three`, `@react-three/fiber`, `@react-three/drei`,
  `@react-three/postprocessing`, `postprocessing`, `gsap`, `lenis`.
