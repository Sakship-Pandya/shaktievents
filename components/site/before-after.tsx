'use client';

import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import type { MediaItem } from '@/lib/projects-data';

/**
 * Empty ground on one side, the finished setup on the other. The handle is
 * keyboard-operable out of the box, and both images are real <img> elements so
 * the comparison still makes sense if the slider script fails.
 */
export function BeforeAfter({
  before,
  after,
  beforeLabel,
  afterLabel,
}: {
  before: MediaItem;
  after: MediaItem;
  beforeLabel: string;
  afterLabel: string;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-gold/25">
      <ReactCompareSlider
        itemOne={<ReactCompareSliderImage src={before.url} alt={before.alt || beforeLabel} />}
        itemTwo={<ReactCompareSliderImage src={after.url} alt={after.alt || afterLabel} />}
        style={{ aspectRatio: '3 / 2' }}
      />
      <figcaption className="flex items-center justify-between border-t border-gold/20 bg-ink-800 px-5 py-3 text-[0.7rem] font-semibold tracking-[0.1em] text-gold-soft/90 uppercase">
        <span>{beforeLabel}</span>
        <span>{afterLabel}</span>
      </figcaption>
    </figure>
  );
}
