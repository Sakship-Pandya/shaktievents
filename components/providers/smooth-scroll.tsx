'use client';

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';

/**
 * Lenis smooth scrolling. Renders nothing, so toggling it on/off for
 * prefers-reduced-motion never remounts the page tree.
 */
export function SmoothScroll() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;

    const setup = () => {
      lenis?.destroy();
      lenis = null;
      if (mq.matches) return;
      lenis = new Lenis({ lerp: 0.08, autoRaf: true, anchors: true });
    };

    setup();
    mq.addEventListener('change', setup);
    return () => {
      mq.removeEventListener('change', setup);
      lenis?.destroy();
    };
  }, []);

  return null;
}
