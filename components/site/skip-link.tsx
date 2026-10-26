import { useTranslations } from 'next-intl';

export function SkipLink() {
  const t = useTranslations('Common');

  return (
    <a
      href="#main"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-100 focus-visible:rounded-full focus-visible:bg-marigold focus-visible:px-5 focus-visible:py-2.5 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-ink"
    >
      {t('skipToContent')}
    </a>
  );
}
