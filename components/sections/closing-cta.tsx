import { getLocale, getTranslations } from 'next-intl/server';
import { Texture } from '@/components/brand/texture';
import { Reveal } from '@/components/motion/reveal';
import { CallCta, QuoteCta, WhatsAppCta } from '@/components/site/action-buttons';
import { PhotoBackdrop } from '@/components/site/work-image';
import type { Locale } from '@/i18n/routing';
import { getSiteConfig, toContactInfo } from '@/lib/settings';
import { pagePhotos, workPhoto } from '@/lib/work-photos';

export type ClosingCtaProps = {
  showCallButton: boolean;
};

/**
 * Final dark band with the marigold glow. Every page ends here, over a dim
 * wide shot of one of our grounds at dusk — below the fold, so it lazy-loads.
 */
export async function ClosingCta({ showCallButton }: ClosingCtaProps) {
  const [t, tCommon, config, locale] = await Promise.all([
    getTranslations('Home'),
    getTranslations('Common'),
    getSiteConfig(),
    getLocale() as Promise<Locale>,
  ]);
  const contact = toContactInfo(config);

  return (
    <section className="relative overflow-hidden bg-ink section-pad">
      <PhotoBackdrop
        photo={workPhoto(pagePhotos.closing, locale)}
        align="center"
        visibility="low"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(60%_100%_at_50%_120%,color-mix(in_oklab,var(--color-marigold)_28%,transparent)_0%,transparent_70%)]"
      />
      <Texture opacity={0.05} />

      <Reveal className="relative container-site flex flex-col items-center text-center">
        <p className="eyebrow text-gold">{t('ctaEyebrow')}</p>
        <h2 className="mt-5 max-w-3xl font-display text-display-lg font-medium text-ivory">
          {t('ctaTitle')}
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory-muted">{t('ctaBody')}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <QuoteCta label={tCommon('getQuote')} size="lg" />
          <WhatsAppCta label={tCommon('whatsapp')} size="lg" contact={contact} />
          {showCallButton ? (
            <CallCta label={tCommon('callNow')} size="lg" variant="quiet" contact={contact} />
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
