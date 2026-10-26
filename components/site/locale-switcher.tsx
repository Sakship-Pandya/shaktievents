'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { locales, localeNames, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const shortName: Record<Locale, string> = { en: 'EN', gu: 'ગુ' };

/**
 * Swaps locale while staying on the same page. Renders real <a> links (not a
 * router push) so both language versions are crawlable from every page.
 */
export function LocaleSwitcher({
  className,
  expanded = false,
}: {
  className?: string;
  expanded?: boolean;
}) {
  const active = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-gold/25 bg-ink-800/60 p-0.5',
        className,
      )}
    >
      {locales.map((locale) => {
        const isActive = locale === active;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            hrefLang={locale}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-200',
              isActive
                ? 'bg-marigold text-ink'
                : 'text-ivory-muted hover:bg-gold/10 hover:text-ivory',
            )}
          >
            {expanded ? localeNames[locale] : shortName[locale]}
          </Link>
        );
      })}
    </div>
  );
}
