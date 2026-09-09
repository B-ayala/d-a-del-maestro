import { useEffect, useRef, useState } from 'react';
import { closing } from '../data/content';
import { fallbackSrc, srcSetFor } from '../lib/image';
import generated from '../data/gallery-generated.json';
import styles from './Cards.module.css';

// Cierre: la foto de Juanchi repetida en tarjetas, arriba del pie.
const JUAN = (generated as Record<string, { widths: number[]; placeholder: string }>).juan;
const JUAN_SLUG = 'juan';

const CARD_COUNT = 8;
const CAPTIONS = [
  'Un día para celebrar.',
  'Aprender jugando.',
  'Cada logro, una fiesta.',
  'Crecer al aire libre.',
  'Momentos del Armonía.',
  'Con una sonrisa.',
] as const;

const ALT = 'Juan, alumno del Instituto Armonía, disfrutando de un día al aire libre.';

function Card({ index }: { index: number }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <figure className={styles.card}>
      <div className={styles.frame} style={{ backgroundImage: `url(${JUAN.placeholder})` }}>
        <img
          className={`${styles.img} ${loaded ? styles.loaded : ''}`}
          src={fallbackSrc(JUAN_SLUG, JUAN.widths)}
          srcSet={srcSetFor(JUAN_SLUG, JUAN.widths)}
          sizes="(min-width: 900px) 30vw, (min-width: 560px) 45vw, 90vw"
          alt={ALT}
          loading="lazy"
          decoding="async"
          width={960}
          height={1199}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <figcaption className={styles.caption}>
        {CAPTIONS[index % CAPTIONS.length]}
      </figcaption>
    </figure>
  );
}

export function Cards() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`${styles.section} ${visible ? styles.in : ''}`}>
      <p className={styles.title}>{closing.title}</p>
      <p className={styles.line}>{closing.line}</p>
      <div className={styles.grid}>
        {Array.from({ length: CARD_COUNT }, (_, i) => (
          <Card key={i} index={i} />
        ))}
      </div>
    </section>
  );
}
