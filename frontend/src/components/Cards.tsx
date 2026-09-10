import { useEffect, useRef, useState } from 'react';
import { closing } from '../data/content';
import styles from './Cards.module.css';

// Cargar todas las imágenes de `src/assets/juanchi` (renombradas a foto-1..)
const imagesMap = import.meta.glob('../assets/juanchi/*.{jpeg,jpg,png,webp,svg}', { eager: true, as: 'url' }) as Record<string, string>;
const JUANCHI_IMAGES = Object.entries(imagesMap)
  .map(([p, url]) => ({ path: p, url }))
  .sort((a, b) => {
    const aNum = (a.path.match(/foto-(\d+)/i) || [])[1];
    const bNum = (b.path.match(/foto-(\d+)/i) || [])[1];
    if (aNum && bNum) return Number(aNum) - Number(bNum);
    if (aNum) return -1;
    if (bNum) return 1;
    return a.url.localeCompare(b.url);
  })
  .map((x) => x.url);

const CARD_COUNT = JUANCHI_IMAGES.length || 8;
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
  const img = JUANCHI_IMAGES[index % JUANCHI_IMAGES.length];
  return (
    <figure className={styles.card}>
      <div className={styles.frame} style={{ backgroundImage: `url(${img})` }}>
        <img
          className={`${styles.img} ${loaded ? styles.loaded : ''}`}
          src={img}
          alt={ALT}
          loading="lazy"
          decoding="async"
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
