import { useEffect, useState } from 'react';

type ScrollState = {
  /** Pixeles scrolleados desde arriba. */
  y: number;
  /** Progreso 0–1 sobre el alto scrolleable de la página. */
  progress: number;
};

/** Estado de scroll compartido, actualizado con requestAnimationFrame. */
export function useScroll(): ScrollState {
  const [state, setState] = useState<ScrollState>({ y: 0, progress: 0 });

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setState({ y, progress: max > 0 ? Math.min(y / max, 1) : 0 });
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(read);
    };

    frame = requestAnimationFrame(read);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}
