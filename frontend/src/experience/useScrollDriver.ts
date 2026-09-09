// Conecta el scroll real de la página con `scrollStore`.
// Fija (pin) el lienzo mientras dura la narrativa y expone el progreso 0–1.

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { scrollStore } from './scrollStore';
import { prefersReducedMotion } from './lib/quality';

gsap.registerPlugin(ScrollTrigger);

/** Cuántos "viewports" de scroll dura la experiencia una vez fijada. */
const SCROLL_LENGTH = 9;

export function useScrollDriver(pinRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    const smooth = !prefersReducedMotion();
    const lenis = smooth
      ? new Lenis({ lerp: 0.12, wheelMultiplier: 0.9, touchMultiplier: 1.4 })
      : null;

    const onLenisScroll = () => ScrollTrigger.update();
    lenis?.on('scroll', onLenisScroll);

    const tick = (time: number) => lenis?.raf(time * 1000);
    if (lenis) {
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const trigger = ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: () => `+=${window.innerHeight * SCROLL_LENGTH}`,
      pin: true,
      pinSpacing: true,
      scrub: smooth ? 0.6 : true,
      invalidateOnRefresh: true,
      onUpdate: (self) => scrollStore.set(self.progress),
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('resize', onResize);
      trigger.kill();
      lenis?.off('scroll', onLenisScroll);
      if (lenis) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, [pinRef]);
}
