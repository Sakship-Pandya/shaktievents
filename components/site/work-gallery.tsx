'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import { cn } from '@/lib/utils';
import type { WorkPhoto, WorkTag } from '@/lib/work-photos';

export type GalleryFilter = { key: string; label: string; tags: readonly WorkTag[] };

/**
 * A masonry wall of photographs that opens into a lightbox.
 *
 * Columns rather than a cropped grid: the set mixes tall entrance tunnels with
 * wide ground shots, and cropping either to a common ratio throws away the
 * thing the photograph was taken to show. Filters are plain buttons over data
 * already on the page — no request, no URL state to keep in sync.
 */
export function WorkGallery({
  photos,
  filters,
  allLabel,
  itemLabel,
  moreLabel,
  tone = 'dark',
  initial = 16,
  layout = 'masonry',
}: {
  photos: WorkPhoto[];
  filters?: GalleryFilter[];
  allLabel?: string;
  itemLabel: string;
  moreLabel?: string;
  tone?: 'dark' | 'light';
  initial?: number;
  /** `grid` crops to 4:3 — for short sets, where masonry leaves ragged columns. */
  layout?: 'masonry' | 'grid';
}) {
  const [active, setActive] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [index, setIndex] = useState(-1);

  const shown = useMemo(() => {
    const filter = filters?.find((f) => f.key === active);
    return filter ? photos.filter((p) => p.tags.some((t) => filter.tags.includes(t))) : photos;
  }, [photos, filters, active]);

  const paged = expanded || !moreLabel ? shown : shown.slice(0, initial);
  // A cropped grid only looks finished in whole rows of four (two on phones).
  const visible =
    layout === 'grid' && paged.length > 4
      ? paged.slice(0, paged.length - (paged.length % 4))
      : paged;
  const isLight = tone === 'light';

  const chip = (selected: boolean) =>
    cn(
      'inline-flex rounded-full border px-4 py-2 text-[0.8rem] font-medium transition-colors',
      selected
        ? isLight
          ? 'border-maroon bg-maroon text-ivory'
          : 'border-marigold bg-marigold text-ink'
        : isLight
          ? 'border-gold/50 text-ink hover:border-maroon'
          : 'border-gold/35 text-ivory/85 hover:border-gold hover:text-marigold',
    );

  return (
    <>
      {filters && filters.length > 0 ? (
        <div role="group" className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={active === null}
            onClick={() => setActive(null)}
            className={chip(active === null)}
          >
            {allLabel}
          </button>
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              aria-pressed={active === filter.key}
              onClick={() => {
                setActive(filter.key);
                setExpanded(false);
              }}
              className={chip(active === filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      ) : null}

      <ul
        className={
          layout === 'grid'
            ? 'grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4'
            : 'columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4'
        }
      >
        {visible.map((photo, i) => (
          <li
            key={photo.slug}
            className={layout === 'grid' ? undefined : 'mb-3 break-inside-avoid md:mb-4'}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block w-full overflow-hidden rounded-xl border border-gold/20 bg-ink-700 transition-colors hover:border-gold/60 focus-visible:border-gold"
              style={{
                aspectRatio: layout === 'grid' ? '4 / 3' : `${photo.width} / ${photo.height}`,
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                placeholder="blur"
                blurDataURL={photo.blur}
                className="object-cover transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.04]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent px-3 pt-10 pb-3 text-left text-[0.75rem] leading-snug text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
              >
                {photo.alt}
              </span>
              <span className="sr-only">{`${itemLabel} ${i + 1}: ${photo.alt}`}</span>
            </button>
          </li>
        ))}
      </ul>

      {moreLabel && !expanded && shown.length > initial ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className={cn(
              'rounded-full border px-6 py-3 text-sm font-semibold transition-colors',
              isLight
                ? 'border-maroon/30 text-maroon hover:border-maroon hover:bg-maroon hover:text-ivory'
                : 'border-gold/40 text-ivory hover:border-marigold hover:text-marigold',
            )}
          >
            {moreLabel} ({shown.length - initial})
          </button>
        </div>
      ) : null}

      <Lightbox
        open={index >= 0}
        index={Math.max(0, index)}
        close={() => setIndex(-1)}
        slides={visible.map((photo) => ({
          src: photo.src,
          alt: photo.alt,
          width: photo.width,
          height: photo.height,
          description: photo.alt,
        }))}
        plugins={[Counter, Zoom]}
        styles={{ container: { backgroundColor: 'rgba(20, 16, 13, 0.96)' } }}
      />
    </>
  );
}
