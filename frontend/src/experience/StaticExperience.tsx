import { BEATS, KIDS, TEACHERS_MAIN, TEACHERS_TARDE, ROOT_WORDS, JUAN_SRC } from './data';
import styles from './StaticExperience.module.css';

// Fallback ligero: sin 3D ni animaciones agresivas (reduce-motion o sin WebGL).
// Mantiene toda la narrativa y todos los nombres.

export function StaticExperience() {
  return (
    <div className={styles.wrap}>
      {BEATS.map((beat, i) => (
        <section
          key={beat.id}
          className={`${styles.panel} ${beat.feature ? styles.feature : ''}`}
        >
          {beat.kicker && <p className={styles.kicker}>{beat.kicker}</p>}
          {beat.lines.map((line) => (
            <p key={line} className={styles.line}>
              {line}
            </p>
          ))}

          {i === 3 && (
            <figure className={styles.photo}>
              <img src={JUAN_SRC} alt="Juan, alumno del Instituto Armonía, al aire libre." width={960} height={720} loading="lazy" />
            </figure>
          )}

          {i === 4 && (
            <ul className={styles.names}>
              {KIDS.map((n) => (
                <li key={n}>⭐ {n}</li>
              ))}
            </ul>
          )}

          {i === 5 && (
            <div className={styles.teachers}>
              <p>
                <strong>{TEACHERS_MAIN.join(' · ')}</strong>
              </p>
              <p>{TEACHERS_TARDE.join(' · ')}</p>
            </div>
          )}
        </section>
      ))}

      <section className={styles.panel}>
        <p className={styles.line}>
          Raíces de esta escuela: {ROOT_WORDS.join(' · ')}.
        </p>
      </section>
    </div>
  );
}
