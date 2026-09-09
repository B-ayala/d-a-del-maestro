import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { detectTier, SETTINGS, type Tier } from './lib/quality';
import { useScrollDriver } from './useScrollDriver';
import { Overlay, NarrativeForReaders } from './Overlay';
import { StaticExperience } from './StaticExperience';
import styles from './Experience.module.css';

const Scene = lazy(() => import('./three/Scene'));

function Poster() {
  return (
    <div className={styles.poster} aria-hidden="true">
      <span>Preparando la escuela mágica…</span>
    </div>
  );
}

export function Experience() {
  const [tier] = useState<Tier>(() => detectTier());
  const [mounted, setMounted] = useState(false);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tier === 'static') return;
    const el = pinRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    // Fallback: si nadie scrollea, precargar la escena cuando el hilo está libre.
    const idle = window.setTimeout(() => setMounted(true), 3000);
    return () => {
      io.disconnect();
      window.clearTimeout(idle);
    };
  }, [tier]);

  useScrollDriver(pinRef);

  if (tier === 'static') {
    return <StaticExperience />;
  }

  const settings = SETTINGS[tier];

  return (
    <section className={styles.section} aria-label="Recorrido: la escuela mágica">
      <div ref={pinRef} className={styles.pin}>
        {mounted ? (
          <Suspense fallback={<Poster />}>
            <Scene tier={tier} settings={settings} />
          </Suspense>
        ) : (
          <Poster />
        )}
        <Overlay />
      </div>
      <NarrativeForReaders />
    </section>
  );
}
