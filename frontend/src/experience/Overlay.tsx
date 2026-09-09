import { useScrollProgress } from './scrollStore';
import { BEATS, KIDS, TEACHERS_MAIN, TEACHERS_TARDE, ROOT_WORDS } from './data';
import styles from './Overlay.module.css';

export function Overlay() {
  const p = useScrollProgress();

  return (
    <div className={styles.layer} aria-hidden="true">
      {BEATS.map((beat) => {
        const [start, end] = beat.at;
        const active = p >= start - 0.03 && p <= end + 0.01;
        return (
          <div
            key={beat.id}
            className={`${styles.beat} ${beat.feature ? styles.feature : ''} ${
              active ? styles.active : ''
            }`}
          >
            {beat.kicker && <p className={styles.kicker}>{beat.kicker}</p>}
            {beat.lines.map((line) => (
              <p key={line} className={styles.line}>
                {line}
              </p>
            ))}
          </div>
        );
      })}

      <div className={`${styles.hint} ${p < 0.04 ? styles.active : ''}`}>
        <span>Deslizá para entrar</span>
        <span className={styles.arrow} />
      </div>

      <div className={styles.progress}>
        <span style={{ transform: `scaleX(${p})` }} />
      </div>
    </div>
  );
}

/** Narrativa completa en orden, solo para lectores de pantalla y sin-JS. */
export function NarrativeForReaders() {
  return (
    <div className="sr-only">
      <h2>Homenaje del Instituto Armonía por el Día del Maestro</h2>
      {BEATS.map((beat) => (
        <p key={beat.id}>
          {beat.kicker ? `${beat.kicker}. ` : ''}
          {beat.lines.join(' ')}
        </p>
      ))}
      <p>Chicos y chicas del Armonía: {KIDS.join(', ')}.</p>
      <p>
        Gracias a las seños {TEACHERS_MAIN.join(' y ')}, y a las docentes de la tarde{' '}
        {TEACHERS_TARDE.join(', ')}.
      </p>
      <p>Raíces de esta escuela: {ROOT_WORDS.join(', ')}.</p>
    </div>
  );
}
