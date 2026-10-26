import { getLocale, getTranslations } from 'next-intl/server';
import { getActiveAnnouncement } from '@/lib/announcements';
import { buildTelUrl } from '@/lib/contact-links';
import { Link } from '@/i18n/navigation';
import { getSiteConfig } from '@/lib/settings';
import { display } from '@/lib/site';

/**
 * Seasonal booking strip, managed at /admin/announcements. Renders nothing
 * when no announcement is active — the sticky header below still carries the
 * phone and the quote CTA.
 */
export async function AnnouncementBar() {
  const [t, config, announcement, locale] = await Promise.all([
    getTranslations('Announcement'),
    getSiteConfig(),
    getActiveAnnouncement(),
    getLocale(),
  ]);

  if (!announcement) return null;

  const text = locale === 'gu' ? announcement.textGu : announcement.textEn;
  const tel = config.phonePrimary ? buildTelUrl(config.phonePrimary) : null;
  const callLabel = t('call', { phone: display(config.phonePrimary) });

  return (
    <div className="relative z-50 border-b border-gold/20 bg-[linear-gradient(90deg,var(--color-maroon)_0%,var(--color-ink-800)_45%,var(--color-ink-800)_55%,var(--color-maroon)_100%)]">
      <div className="container-site flex h-9 items-center justify-center gap-3 text-[0.7rem] tracking-[0.08em] text-gold-soft/90 sm:text-[0.75rem]">
        <span className="hidden size-1.5 shrink-0 rounded-full bg-marigold sm:block" />
        {announcement.href ? (
          <Link href={announcement.href} className="truncate transition-colors hover:text-marigold">
            {text}
          </Link>
        ) : (
          <p className="truncate">{text}</p>
        )}
        <span aria-hidden className="hidden text-gold/40 sm:inline">
          ·
        </span>
        {tel ? (
          <a
            href={tel}
            data-cta="call"
            className="hidden shrink-0 font-semibold text-marigold underline-offset-4 transition-colors hover:text-marigold-300 hover:underline sm:inline"
          >
            {callLabel}
          </a>
        ) : (
          <span className="hidden shrink-0 font-semibold text-gold-soft/60 sm:inline">
            {callLabel}
          </span>
        )}
      </div>
    </div>
  );
}
