import { memo } from 'react';
import styles from './FloatingDecor.module.css';

type Item = {
  icon: string;
  top: string;
  left: string;
  size: number;
  delay: number;
  duration: number;
};

// Objetos "de maestro" que flotan suavemente de fondo.
const ITEMS: readonly Item[] = [
  { icon: '✏️', top: '12%', left: '8%', size: 34, delay: 0, duration: 13 },
  { icon: '📚', top: '68%', left: '5%', size: 40, delay: 2.5, duration: 16 },
  { icon: '🍎', top: '22%', left: '86%', size: 32, delay: 1.2, duration: 14 },
  { icon: '⭐', top: '52%', left: '92%', size: 26, delay: 3.4, duration: 12 },
  { icon: '📝', top: '80%', left: '78%', size: 34, delay: 0.8, duration: 15 },
  { icon: '✨', top: '38%', left: '15%', size: 24, delay: 4, duration: 11 },
];

type Props = { tone?: 'light' | 'dark' };

export const FloatingDecor = memo(function FloatingDecor({ tone = 'dark' }: Props) {
  return (
    <div className={`${styles.layer} ${styles[tone]}`} aria-hidden="true">
      {ITEMS.map((it) => (
        <span
          key={it.icon + it.top}
          className={styles.item}
          style={{
            top: it.top,
            left: it.left,
            fontSize: `${it.size}px`,
            animationDelay: `${it.delay}s`,
            animationDuration: `${it.duration}s`,
          }}
        >
          {it.icon}
        </span>
      ))}
    </div>
  );
});
