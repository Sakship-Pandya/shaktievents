'use client';

import { lazy, Suspense, type ComponentProps } from 'react';
import type { EnquiryPopup } from './enquiry-popup';
import type { PanoramaViewer } from './panorama-viewer';
import type { StyleExplorer } from './style-explorer';

/**
 * Client-side split points for the flagged features.
 *
 * Importing a client component from a server component — with `next/dynamic`,
 * with `await import()`, however it is written — puts that component in the
 * route's client graph, because the bundler resolves the reference at build
 * time either way. Measured on this project, the three feature components
 * landed in a chunk every page downloads, costing about 5 kB with every flag
 * off.
 *
 * `React.lazy` inside a client module is a real split point: the chunk is only
 * fetched when the component renders, and the flags are read on the server, so
 * a flag that is off never renders its wrapper. The cost of a feature nobody
 * has switched on is these three stubs.
 *
 * The trade-off is that a lazy component does not server-render. That is fine
 * for all three — the popup appears after a delay, the viewer needs a canvas,
 * and the explorer's copy is the service summaries, which are already indexed
 * on the service pages.
 */
const Popup = lazy(() => import('./enquiry-popup').then((m) => ({ default: m.EnquiryPopup })));
const Explorer = lazy(() => import('./style-explorer').then((m) => ({ default: m.StyleExplorer })));
const Panorama = lazy(() =>
  import('./panorama-viewer').then((m) => ({ default: m.PanoramaViewer })),
);

export function LazyEnquiryPopup(props: ComponentProps<typeof EnquiryPopup>) {
  return (
    <Suspense fallback={null}>
      <Popup {...props} />
    </Suspense>
  );
}

export function LazyStyleExplorer(props: ComponentProps<typeof StyleExplorer>) {
  return (
    <Suspense fallback={null}>
      <Explorer {...props} />
    </Suspense>
  );
}

export function LazyPanoramaViewer(props: ComponentProps<typeof PanoramaViewer>) {
  return (
    <Suspense fallback={null}>
      <Panorama {...props} />
    </Suspense>
  );
}
