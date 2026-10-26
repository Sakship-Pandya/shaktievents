import { getFormatter, getLocale, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { NavLink } from '@/components/site/nav-link';
import { getFeatures } from '@/lib/features';
import { daysUntil, nextMuhurat } from '@/lib/muhurat';

/**
 * Days to the next muhurat, plus the dates after it.
 *
 * The count is worked out on the server from whole UTC days, not ticked in the
 * browser. A live seconds counter would mean a client component and a
 * re-render every second, for a number that changes once a day.
 *
 * Renders nothing when the flag is off or every saved date has passed — the
 * second case matters, because a client who forgets to refresh the list should
 * get no strip rather than a countdown to a date in the past.
 */
export async function MuhuratCountdown({ showUpcoming = true }: { showUpcoming?: boolean }) {
  const { flags, muhuratDates } = await getFeatures();
  if (!flags.countdown) return null;

  const next = nextMuhurat(muhuratDates);
  if (!next) return null;

  const [t, format, locale] = await Promise.all([
    getTranslations('Features'),
    getFormatter(),
    getLocale(),
  ]);
  const days = daysUntil(next.date);
  const label = locale === 'gu' ? next.labelGu : next.labelEn;
  const upcoming = showUpcoming
    ? muhuratDates
        .filter((entry) => entry.date > next.date)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 6)
    : [];

  return (
    <section className="border-y border-gold/20 bg-ink-800 py-10">
      <Reveal className="container-site flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="eyebrow text-gold">{t('countdownEyebrow')}</p>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-display text-display-md text-marigold tabular">
              {t('countdownDays', { days })}
            </span>
            <span className="text-base text-ivory">
              {format.dateTime(new Date(`${next.date}T00:00:00Z`), 'short')}
              {label ? ` · ${label}` : ''}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:items-end">
          {upcoming.length > 0 ? (
            <div>
              <p className="mb-2 eyebrow text-gold/80">{t('muhuratList')}</p>
              <ul className="flex flex-wrap gap-2 lg:justify-end">
                {upcoming.map((entry) => (
                  <li
                    key={entry.date}
                    className="rounded-full border border-gold/30 px-3.5 py-1.5 text-[0.8rem] text-ivory-muted"
                  >
                    {format.dateTime(new Date(`${entry.date}T00:00:00Z`), 'short')}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <NavLink
            href="/get-quote"
            data-cta="quote"
            className="inline-flex h-12 w-fit items-center rounded-full bg-marigold px-7 text-[0.9rem] font-semibold text-ink transition-colors hover:bg-marigold-300"
          >
            {t('countdownCta')}
          </NavLink>
        </div>
      </Reveal>
    </section>
  );
}
