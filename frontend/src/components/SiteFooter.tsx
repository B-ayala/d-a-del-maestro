import { site } from '../data/content';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.name}>{site.institute}</p>
      <p className={styles.line}>¡Feliz Día del Maestro! · {site.date}</p>
    </footer>
  );
}
