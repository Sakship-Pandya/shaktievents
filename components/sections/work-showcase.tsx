import { ArrowUpRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { Texture } from '@/components/brand/texture';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { WorkImage } from '@/components/site/work-image';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { workPhoto, type WorkPhotoSlug } from '@/lib/work-photos';

export type WorkShowcaseProps = {
  showLink: boolean;
};

/**
 * Seven photographs in an uneven grid, so the homepage shows the work before
 * it describes it. Server-rendered with no lightbox: this band is a doorway to
 * the portfolio gallery, and keeping it JS-free keeps the homepage light.
 *
 * Tall frames (the tunnel) take two rows; the mandap takes the corner block.
 * `grid-flow-dense` lets the small tiles tuck in around them at every width.
 */
const tiles: { slug: WorkPhotoSlug; label: string; span: string }[] = [
  { slug: 'white-mandap-dusk', label: 'stage', span: 'col-span-2 row-span-2' },
  { slug: 'fairy-light-tunnel', label: 'entrance', span: 'row-span-2' },
  { slug: 'peacock-theme-stage', label: 'stage', span: '' },
  { slug: 'haldi-stage-lights', label: 'haldi', span: '' },
  { slug: 'banquet-stage-gold', label: 'stage', span: 'col-span-2' },
  { slug: 'drape-tunnel-chandeliers', label: 'entrance', span: '' },
  { slug: 'lotus-seat-floral-ring', label: 'stage', span: '' },
];

export async function WorkShowcase({ showLink }: WorkShowcaseProps) {
  const [t, locale] = await Promise.all([getTranslations('Work'), getLocale() as Promise<Locale>]);

  return (
    <section className="relative overflow-hidden bg-ink section-pad">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(60%_80%_at_85%_0%,color-mix(in_oklab,var(--color-maroon)_45%,transparent)_0%,transparent_70%)]"
      />
      <Texture opacity={0.05} />

      <div className="relative container-site">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-gold">{t('eyebrow')}</p>
            <h2 className="mt-4 font-display text-display-lg font-medium text-ivory">
              {t('title')}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ivory-muted">{t('body')}</p>
          </div>
          {showLink ? (
            <Link
              href="/portfolio#photographs"
              className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:border-marigold hover:text-marigold md:self-auto"
            >
              {t('cta')}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ) : null}
        </Reveal>

        <RevealGroup className="mt-12 grid grid-flow-dense auto-rows-[9.5rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] md:mt-14 md:auto-rows-[13.5rem] md:grid-cols-4 md:gap-4">
          {tiles.map((tile, i) => {
            const photo = workPhoto(tile.slug, locale);
            return (
              <RevealItem key={tile.slug} className={tile.span}>
                <Link
                  href="/portfolio#photographs"
                  className="group relative block size-full overflow-hidden rounded-2xl border border-gold/20 bg-ink-700 transition-colors duration-500 hover:border-gold/60"
                >
                  <WorkImage
                    photo={photo}
                    sizes={
                      i === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'
                    }
                    className="transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.06]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 md:p-4">
                    <span className="eyebrow text-[0.6rem] text-gold-soft md:text-eyebrow">
                      {t(`categories.${tile.label}` as 'categories.stage')}
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 shrink-0 translate-y-1 text-marigold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                    />
                  </span>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
