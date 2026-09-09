# Plan de pruebas — Día del Maestro · "La Escuela Mágica"

## Alcance

- **Se prueba:** Hero (foto original intacta), recorrido 3D controlado por scroll
  (cámara, apertura de puerta, entrada al aula, objetos que cobran vida, nombres,
  transformación, árbol, corazón, textos finales), fallback estático
  (reduced-motion / sin WebGL / gama muy baja), responsive 320–1440, performance
  en mobile de gama media, accesibilidad, comportamiento con conexión lenta y con
  muchos accesos simultáneos.
- **No se prueba:** backend (no hay), formularios (no hay), analítica (no hay).

## Pre-condiciones

- `npm ci` en `frontend/`.
- Imágenes generadas: `npm run images` (ya versionadas en `public/gallery/`).
- Build de producción servido: `npm run build && npm run preview`.
- Dispositivos: 1 desktop, 1 Android gama media, 1 iPhone (Safari).

## Casos

```
ID: TC-001
Caso: Carga inicial en desktop
Tipo: happy
Pasos:
  1. Abrir la home en 1280px.
Esperado: el hero ocupa la pantalla, la foto del plantel carga con prioridad,
          el título y la fecha se leen sin scroll. No se descarga el bundle 3D
          hasta acercarse al recorrido (o a los ~3 s de inactividad).
Resultado: parcial — build/lint/tsc OK; verificación visual pendiente.

ID: TC-002
Caso: Carga inicial en mobile (320–390px)
Tipo: happy / edge
Pasos:
  1. Abrir la home a 320px y a 390px.
Esperado: sin scroll horizontal en ninguna sección; el título del hero no se
          corta; el canvas 3D nunca genera overflow lateral.
Resultado: no probado (device real).

ID: TC-003
Caso: Cierre — grilla de tarjetas (componente Cards)
Tipo: happy / edge
Pasos:
  1. Scrollear hasta el final, arriba del pie.
Esperado: 1 columna (<560px), 2 (<900px), 3 (>=900px); 8 tarjetas con la foto de
          Juanchi (proporción 4:5), placeholder borroso → imagen nítida (lazy);
          encabezado "Instituto Armonía" + "Hecho con cariño para nuestras seños
          y profes · 11 de septiembre de 2026"; aparición escalonada al entrar en
          viewport (sin animación si reduced-motion).
Resultado: no probado (device real).

ID: TC-004
Caso: Foto individual dentro del mundo 3D
Tipo: happy
Pasos:
  1. Scrollear hasta entrar al aula (~40–55% del recorrido).
Esperado: la única foto individual que aparece es juan.jpeg (cuadro con marco
          sobre la pared, flotando levemente). No hay otras fotos individuales.
Resultado: no probado.

ID: TC-005
Caso: prefers-reduced-motion
Tipo: a11y
Pasos:
  1. SO/navegador con "reducir movimiento" activado. Recargar y scrollear.
Esperado: no se monta el canvas 3D; se muestra el fallback estático con TODA la
          narrativa, la foto de juan y todos los nombres (8 chicos; Camila,
          Matilda; Jony, Mica, Mica, Yani, Vicky). Sin pin de scroll ni cámara.
Resultado: no probado.

ID: TC-006
Caso: Sin WebGL / gama muy baja
Tipo: failure / edge
Pasos:
  1. Deshabilitar WebGL (o abrir en device con <=4 GB RAM / <=4 núcleos).
Esperado: tier 'static' → mismo fallback que TC-005. La navegación nunca se rompe.
Resultado: no probado.

ID: TC-007
Caso: Lector de pantalla
Tipo: a11y
Pasos:
  1. Recorrer con NVDA/VoiceOver.
Esperado: un solo h1 (hero). El recorrido expone un bloque .sr-only con la
          narrativa completa en orden + todos los nombres + las palabras-raíz.
          El canvas y el overlay decorativo son aria-hidden.
Resultado: no probado.

ID: TC-008
Caso: Contraste de los textos del overlay
Tipo: a11y
Pasos:
  1. Revisar cada beat de texto sobre el fondo 3D con checker WCAG.
Esperado: AA (>=4.5:1). Los textos van en blanco con text-shadow fuerte sobre
          fondo oscuro (#0f2033 / verde nocturno).
Resultado: no probado.

ID: TC-009
Caso: Concurrencia / alto tráfico
Tipo: failure
Pasos:
  1. Deploy en Netlify. `npx autocannon -c 100 -d 20 <url>`.
Esperado: sitio 100% estático desde CDN; el 3D es 100% client-side; sin 5xx;
          TTFB estable; ninguna llamada a API.
Resultado: no probado (post-deploy).

ID: TC-010
Caso: Headers de seguridad + CSP con el bundle 3D
Tipo: security
Pasos:
  1. `curl -I <url>` tras deploy. Abrir la consola durante el recorrido completo.
Esperado: CSP/X-Frame-Options/X-Content-Type-Options/Referrer-Policy presentes;
          `Cache-Control: immutable` en /gallery. Cero violaciones de CSP:
          three/drei/gsap/lenis van bundleados (script-src 'self'); las texturas
          de texto se generan en <canvas> (sin pedidos de red); juan-960.webp es
          same-origin (img-src 'self').
Resultado: no probado (post-deploy).

ID: TC-011
Caso: SEO / privacidad
Tipo: security
Pasos:
  1. Ver el HTML servido.
Esperado: <meta name="robots" content="noindex">; <noscript> con mensaje digno;
          sin apellidos de alumnos ni datos personales en textos o nombres de
          archivo públicos.
Resultado: parcial — HTML OK; falta revisión post-deploy.

ID: TC-012
Caso: Recorrido completo por scroll (happy path narrativo)
Tipo: happy
Pre-condición: desktop, sin reduced-motion.
Pasos:
  1. Desde el hero, scrollear lento hasta el final.
Esperado, en orden:
  - Hero con su foto original, luego "¡Feliz Día del Maestro!" y
    "Hay lugares donde se aprende…".
  - La cámara se acerca a la escuela flotante; "…y lugares donde también se
    aprende a crecer."; la puerta se abre con luz cálida y partículas.
  - La cámara entra al aula: pizarrón, bancos, libros que se abren, lápices que
    flotan, luz que se enciende, dibujos y foto de juan.
  - Aparecen los nombres de los 8 chicos integrados (dibujos + estrellas).
  - Aparecen las docentes: Camila y Matilda + tiza en el pizarrón con
    Jony, Mica, Mica, Yani, Vicky (las dos Mica presentes y separadas).
  - "Queremos agradecerles de corazón…" → "Gracias por acompañar…" →
    "Enseñar no es solamente transmitir conocimientos…" → "…también es dejar
    huellas." (estos dos, momento destacado).
  - Los objetos salen de la escuela; la cámara se aleja; la escuela queda chica.
  - Aparece el árbol; las raíces (amor, paciencia, aprendizaje, confianza,
    alegría, acompañamiento); las hojas se encienden de a una.
  - El árbol forma un CORAZÓN.
  - "Una escuela no se construye solamente con paredes." →
    "Se construye con las huellas que ustedes dejan en cada niño." →
    "❤️ Gracias por dejar huellas." → "INSTITUTO ARMONÍA · ¡Feliz Día del
    Maestro! 🍎✨".
Resultado: no probado.

ID: TC-013
Caso: Scroll hacia atrás y salto de posición
Tipo: edge / concurrencia
Pasos:
  1. A mitad del recorrido, scrollear rápido hacia arriba y abajo.
  2. Usar el botón "volver arriba".
Esperado: la cámara y las animaciones siguen el scroll sin saltos bruscos ni
          estados congelados; el texto correcto aparece para cada tramo; volver
          arriba reinicia el recorrido limpio.
Resultado: no probado.

ID: TC-014
Caso: Performance en mobile de gama media
Tipo: performance
Pasos:
  1. Android gama media (o CPU x4 throttle + "mobile"): recorrer todo.
  2. DevTools Performance / medir FPS.
Esperado: tier 'low' (DPR<=1.5, sin postFX, sin sombras, ~130 partículas,
          ~240 hojas); >=30 FPS sostenido; sin jank al abrir la puerta ni al
          formar el corazón; memoria estable (sin leak al desmontar).
Resultado: no probado.

ID: TC-015
Caso: Tamaño y orden de carga del bundle
Tipo: performance
Pasos:
  1. Build. Revisar chunks y waterfall de red en "Slow 4G".
Esperado: index ~64 kB gz (react + hero), Experience ~52 kB gz (gsap+lenis),
          Scene ~255 kB gz (three) diferido. El hero es interactivo antes de que
          baje el chunk 3D.
Resultado: ok (medido en build); waterfall real pendiente.

ID: TC-016
Caso: Rotar el dispositivo / resize
Tipo: edge
Pasos:
  1. Durante el recorrido, rotar el teléfono; en desktop, redimensionar.
Esperado: ScrollTrigger.refresh() reajusta el pin; el canvas se re-dimensiona;
          no queda contenido tapado ni scroll horizontal.
Resultado: no probado.
```

## Matriz de cobertura

| Módulo             | happy | edge | failure | a11y | security | perf |
|--------------------|:-----:|:----:|:-------:|:----:|:--------:|:----:|
| Hero               | ✔     | ✔    | –       | ✔    | –        | ✔    |
| Recorrido 3D       | ✔     | ✔    | ✔       | ✔    | ✔        | ✔    |
| Fallback estático  | ✔     | –    | ✔       | ✔    | –        | –    |
| Deploy / CDN       | –     | –    | ✔       | –    | ✔        | ✔    |

## Cross-browser / device

- Verificado en build: `tsc -b`, `eslint`, `vite build` (613 módulos, sin errores).
- **Pendiente (bloquea "hecho"):** recorrido visual completo en Chrome desktop,
  Chrome Android gama media y Safari iOS; viewport 320px; reduced-motion real;
  consola sin errores/warnings de CSP durante todo el scroll.
