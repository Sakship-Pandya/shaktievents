import type { Locale } from '@/i18n/routing';
import { getLocale, getTranslations } from 'next-intl/server';
import { StringLights } from '@/components/brand/string-lights';
import { Texture } from '@/components/brand/texture';
import { CountUp } from '@/components/motion/count-up';
import { QuoteCta, WhatsAppCta } from '@/components/site/action-buttons';
import { PhotoBackdrop } from '@/components/site/work-image';
import { getSiteConfig, toContactInfo } from '@/lib/settings';
import { workPhoto } from '@/lib/work-photos';

export type HeroProps = {
  showStats: boolean;
  showStringLights: boolean;
  showPhoto: boolean;
};

/**
 * "The night the pandal lights come on." The headline masks up line by line
 * on a pure CSS animation — no JS, no layout shift, and it degrades to a
 * static headline under prefers-reduced-motion.
 *
 * Behind it, one of our own mandaps at dusk — a portrait entrance tunnel on
 * phones, where a wide ground shot would crop to a sliver of carpet.
 */
export async function Hero({ showStats, showStringLights, showPhoto }: HeroProps) {
  const [t, config, locale] = await Promise.all([
    getTranslations('Hero'),
    getSiteConfig(),
    getLocale() as Promise<Locale>,
  ]);
  const contact = toContactInfo(config);
  const lines = t.raw('titleLines') as string[];

  const stats = [
    { key: 'events', value: config.stats.eventsCompleted, suffix: '+' },
    { key: 'years', value: config.stats.years, suffix: '+' },
    { key: 'towns', value: config.stats.townsServed, suffix: '+' },
    { key: 'team', value: config.stats.teamSize, suffix: '+' },
  ] as const;
  const hasStats = stats.some((stat) => stat.value !== null);

  return (
    <section className="relative hero-under-header flex min-h-svh flex-col justify-between overflow-hidden">
      {showPhoto ? (
        <PhotoBackdrop
          photo={workPhoto('mandap-aisle-dusk', locale)}
          mobile={workPhoto('drape-tunnel-chandeliers', locale)}
          visibility="high"
          priority
        />
      ) : null}
      {/* Layered ground: maroon dusk overhead, a marigold pool low and left. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_-10%,color-mix(in_oklab,var(--color-maroon)_75%,transparent)_0%,transparent_60%),radial-gradient(60%_50%_at_12%_88%,color-mix(in_oklab,var(--color-marigold)_16%,transparent)_0%,transparent_70%)]"
      />
      <Texture opacity={0.06} />
      {showStringLights ? <StringLights className="opacity-90" /> : null}

      <div className="relative container-site flex flex-1 items-center pt-16 pb-14 md:pt-24">
        <div className="grid w-full items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-4xl">
            <p
              className="eyebrow text-gold-soft/90 motion-safe:animate-fade-up"
              style={{ animationDelay: '120ms' }}
            >
              {t('eyebrow')}
            </p>

            <h1 className="mt-6 font-display text-display-xl font-medium text-ivory">
              {lines.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <span
                    className="block motion-safe:animate-rise"
                    // The first line is the largest contentful paint on the
                    // page — delaying it delays the metric, so the stagger
                    // starts from the second line.
                    style={{ animationDelay: `${i * 110}ms` }}
                  >
                    {i === lines.length - 1 ? (
                      <em className="text-gradient-gold not-italic">{line}</em>
                    ) : (
                      line
                    )}
                  </span>
                </span>
              ))}
            </h1>

            <p
              className="mt-7 max-w-xl text-base leading-relaxed text-ivory-muted motion-safe:animate-fade-up md:text-lg"
              style={{ animationDelay: '720ms' }}
            >
              {t('subtitle')}
            </p>

            <div
              className="mt-9 flex flex-wrap gap-3 motion-safe:animate-fade-up"
              style={{ animationDelay: '840ms' }}
            >
              <QuoteCta label={t('primaryCta')} size="lg" />
              <WhatsAppCta label={t('secondaryCta')} size="lg" contact={contact} />
            </div>
          </div>

          {/* Vertical scroll cue — desktop only, sits in the right gutter. */}
          <div className="hidden select-none lg:flex lg:flex-col lg:items-center lg:gap-4">
            <span className="eyebrow text-gold-soft [writing-mode:vertical-rl]">{t('scroll')}</span>
            <span
              aria-hidden
              className="h-16 w-px bg-gold/60 motion-safe:animate-[scroll-cue_2.2s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </div>

      {showStats && hasStats ? (
        <div className="relative border-t border-gold/20 bg-ink/40 backdrop-blur-sm">
          <dl className="container-site grid grid-cols-2 divide-gold/15 md:grid-cols-4 md:divide-x">
            {stats.map((stat, i) => (
              <div
                key={stat.key}
                className={`px-1 py-6 md:px-6 md:py-7 ${i > 1 ? 'border-t border-gold/15 md:border-t-0' : ''} ${i % 2 === 1 ? 'border-l border-gold/15 md:border-l-0' : ''}`}
              >
                <dt className="eyebrow text-gold-soft">{t(`stats.${stat.key}`)}</dt>
                <dd className="mt-2 font-display text-display-sm text-ivory">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </section>
  );
}
