import { lazy, Suspense } from 'react';
import { Hero } from './components/Hero';
import { Cards } from './components/Cards';
import { SiteFooter } from './components/SiteFooter';
import { BackToTop } from './components/BackToTop';

// La experiencia 3D (three + gsap + lenis) se carga aparte para no pesar
// sobre la primera pantalla, que es lo único crítico al abrir el link.
const Experience = lazy(() =>
  import('./experience/Experience').then((m) => ({ default: m.Experience })),
);

function App() {
  return (
    <>
      <Hero />

      <main>
        <Suspense fallback={<div style={{ minHeight: '100svh' }} aria-hidden="true" />}>
          <Experience />
        </Suspense>
      </main>
      <Cards />
      <SiteFooter />
      <BackToTop />
    </>
  );
}

export default App;
