'use client';

import Image from 'next/image';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import type { MediaItem } from '@/lib/projects-data';

/**
 * Thumbnail grid that opens a keyboard-navigable lightbox. The grid itself is
 * plain links-free buttons so it stays usable if the lightbox JS never loads —
 * the images are already visible.
 */
export function GalleryLightbox({ items, label }: { items: MediaItem[]; label: string }) {
  const [index, setIndex] = useState(-1);

  if (items.length === 0) return null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block aspect-4/3 w-full overflow-hidden rounded-xl border border-gold/25 bg-ink-700 transition-colors hover:border-gold/60 focus-visible:border-gold"
            >
              <Image
                src={item.url}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="sr-only">{`${label} ${i + 1}`}</span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        open={index >= 0}
        index={Math.max(0, index)}
        close={() => setIndex(-1)}
        slides={items.map((item) => ({
          src: item.url,
          alt: item.alt,
          width: item.width ?? undefined,
          height: item.height ?? undefined,
        }))}
        plugins={[Counter, Thumbnails, Zoom]}
        styles={{ container: { backgroundColor: 'rgba(20, 16, 13, 0.96)' } }}
      />
    </>
  );
}
