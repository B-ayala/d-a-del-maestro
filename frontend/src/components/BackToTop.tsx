import { useScroll } from '../hooks/useScroll';
import { scrollToTop } from '../lib/scrollToTop';
import styles from './BackToTop.module.css';

/** Flecha flotante para volver arriba. Aparece al bajar ~1.2 pantallas. */
export function BackToTop() {
  const { y } = useScroll();
  const visible = y > 900;

  return (
    <button
      type="button"
      className={`${styles.button} ${visible ? styles.visible : ''}`}
      onClick={scrollToTop}
      aria-label="Volver arriba"
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
        <path
          d="M12 19V5M12 5l-6 6M12 5l6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
