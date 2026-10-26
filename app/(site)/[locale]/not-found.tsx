import { getLocale, getTranslations } from 'next-intl/server';
import { Texture } from '@/components/brand/texture';
import { QuoteCta, WhatsAppCta } from '@/components/site/action-buttons';
import { PhotoBackdrop } from '@/components/site/work-image';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { getSiteConfig, toContactInfo } from '@/lib/settings';
import { pagePhotos, workPhoto } from '@/lib/work-photos';

/** Branded 404 inside the site chrome, so a dead link still offers a way to book. */
export default async function LocaleNotFound() {
  const [t, tCommon, config, locale] = await Promise.all([
    getTranslations('NotFound'),
    getTranslations('Common'),
    getSiteConfig(),
    getLocale() as Promise<Locale>,
  ]);
  const contact = toContactInfo(config);

  return (
    <section className="relative flex min-h-[70svh] items-center overflow-hidden section-pad">
      <PhotoBackdrop photo={workPhoto(pagePhotos.notFound, locale)} priority />
      <Texture opacity={0.05} />
      <div className="relative container-site max-w-2xl">
        <p className="eyebrow text-gold">{t('eyebrow')}</p>
        <h1 className="mt-5 font-display text-display-lg font-medium text-ivory">{t('title')}</h1>
        <p className="mt-6 text-base leading-relaxed text-ivory-muted">{t('body')}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-full bg-marigold px-6 text-[0.9rem] font-semibold text-ink transition-colors hover:bg-marigold-300"
          >
            {t('home')}
          </Link>
          <WhatsAppCta label={tCommon('whatsapp')} contact={contact} />
          <QuoteCta label={tCommon('getQuote')} variant="quiet" />
        </div>
      </div>
    </section>
  );
}
