'use client';

import { useEffect, useRef } from 'react';
import { TBD } from '@/lib/display';
import { cn } from '@/lib/utils';

type CountUpProps = {
  value: number | null;
  suffix?: string;
  className?: string;
};

const format = (n: number) => Math.round(n).toLocaleString('en-IN');

/** Same easing as the CSS reveals, so the two feel like one animation. */
const easeExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Server-renders the final number, then counts up from zero when it scrolls
 * into view. The number is correct in the HTML before any JS runs, so a
 * crawler and a reader with JS disabled both see the real figure.
 */
export function CountUp({ value, suffix = '', className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || value === null) return;

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        const duration = 1800;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          element.textContent = format(value * easeExpo(progress));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
      },
      { rootMargin: '-15% 0px' },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  if (value === null) {
    return <span className={cn('text-gold-soft/70', className)}>{TBD}</span>;
  }

  return (
    <span className={cn('tabular', className)}>
      <span ref={ref}>{format(value)}</span>
      {suffix}
    </span>
  );
}
