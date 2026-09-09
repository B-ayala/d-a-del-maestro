import { HERO_PHOTO } from '../data/gallery';
import { hero, site } from '../data/content';
import { fallbackSrc, srcSetFor } from '../lib/image';
import { useScroll } from '../hooks/useScroll';
import { FloatingDecor } from './FloatingDecor';
import styles from './Hero.module.css';

export function Hero() {
  const lines = hero.title.split('\n');
  const { y } = useScroll();
  // Parallax suave: la foto se mueve menos que el scroll.
  const shift = Math.min(y * 0.2, 120);

  return (
    <header className={styles.hero}>
      <div className={styles.bgWrap} style={{ transform: `translate3d(0, ${shift}px, 0)` }}>
        <img
          className={styles.bg}
          src={fallbackSrc(HERO_PHOTO.slug, HERO_PHOTO.widths)}
          srcSet={srcSetFor(HERO_PHOTO.slug, HERO_PHOTO.widths)}
          sizes="100vw"
          alt={HERO_PHOTO.alt}
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className={styles.veil} aria-hidden="true" />
      <FloatingDecor tone="dark" />

      <div className={styles.content}>
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 className={styles.title}>
          {lines.map((line, i) => (
            <span key={line} className={styles.titleLine} data-line={i}>
              {line}
            </span>
          ))}
        </h1>
        <p className={styles.lead}>{hero.lead}</p>
        <p className={styles.date}>
          {site.place} · {site.date}
        </p>
      </div>

      <div className={styles.hint} aria-hidden="true">
        <span>{hero.scrollHint}</span>
        <span className={styles.arrow} />
      </div>
    </header>
  );
}
