'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 360° viewer for a project's equirectangular photograph.
 *
 * Pannellum is loaded from a CDN on first render rather than bundled: it is
 * around 60 kB, it is needed on a handful of project pages at most, and the
 * feature is behind a flag that is off by default. If the script does not
 * load, the fallback image is what was already on the page.
 */
const PANNELLUM_JS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
const PANNELLUM_CSS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';

type PannellumGlobal = {
  viewer: (element: HTMLElement, config: Record<string, unknown>) => { destroy: () => void };
};

function loadOnce(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if ((window as unknown as { pannellum?: PannellumGlobal }).pannellum) return Promise.resolve();

  return new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${PANNELLUM_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = PANNELLUM_CSS;
      document.head.appendChild(link);
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PANNELLUM_JS}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('pannellum failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.src = PANNELLUM_JS;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('pannellum failed to load'));
    document.head.appendChild(script);
  });
}

export function PanoramaViewer({ url, hint }: { url: string; hint: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let viewer: { destroy: () => void } | null = null;
    let cancelled = false;

    loadOnce()
      .then(() => {
        if (cancelled || !ref.current) return;
        const pannellum = (window as unknown as { pannellum?: PannellumGlobal }).pannellum;
        if (!pannellum) {
          setFailed(true);
          return;
        }
        viewer = pannellum.viewer(ref.current, {
          type: 'equirectangular',
          panorama: url,
          autoLoad: true,
          showZoomCtrl: true,
          showFullscreenCtrl: true,
          hfov: 100,
        });
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      viewer?.destroy();
    };
  }, [url]);

  if (failed) {
    // The still image is already on the page above this; saying nothing is
    // better than an error box the visitor can do nothing about.
    return null;
  }

  return (
    <figure>
      <div
        ref={ref}
        className="aspect-16/9 w-full overflow-hidden rounded-2xl border border-gold/25 bg-ink-700"
      />
      <figcaption className="mt-3 text-sm text-ivory-muted">{hint}</figcaption>
    </figure>
  );
}
