'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Scroll reveals, done with an IntersectionObserver and the CSS keyframes
 * already in the theme. This replaced a 100 kB animation library that was
 * loaded on every page for three components — on a site whose visitors are
 * mostly on 4G, that trade was not worth making.
 *
 * Content is visible in the server HTML and only hidden once JS confirms it can
 * animate it back in (the `js-reveal` class, set by an inline script that also
 * checks prefers-reduced-motion). If the script never runs, or the observer is
 * unavailable, everything simply shows.
 */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || inView) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-12% 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [inView]);

  return { ref, inView };
}

/** Fade + rise + un-blur on scroll into view. Use once per block. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn('reveal', inView && 'is-visible', className)}
      style={delay ? { animationDelay: `${delay * 1000}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/** Wrap several <RevealItem>s to stagger them 60ms apart. */
export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={cn('reveal-group', inView && 'is-visible', className)}>
      {children}
    </div>
  );
}

/** A child of RevealGroup. The stagger comes from its position, in CSS. */
export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
