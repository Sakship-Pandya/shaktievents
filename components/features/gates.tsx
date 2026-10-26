import { getLocale, getTranslations } from 'next-intl/server';
import { LazyEnquiryPopup, LazyPanoramaViewer, LazyStyleExplorer } from './lazy';
import { Reveal } from '@/components/motion/reveal';
import { getFeatures } from '@/lib/features';
import { getServiceList } from '@/lib/services-data';
import type { Locale } from '@/i18n/routing';
import { getSiteConfig } from '@/lib/settings';
import type { ExplorerLabels, StyleCard } from './style-explorer';

/**
 * Server-side gates for the three features that need JavaScript in the
 * browser.
 *
 * Each reads the flags on the server and renders nothing when its feature is
 * off, so the browser never asks for the code behind it — see lazy.tsx for how
 * that split is actually achieved, and why the obvious ways do not work.
 * `pnpm verify:features` fails if any of the three ever turns up in a
 * chunk the browser fetches with its flag off.
 */

export async function EnquiryPopupGate() {
  const { flags } = await getFeatures();
  if (!flags.popup) return null;

  const t = await getTranslations('Features');

  return (
    <LazyEnquiryPopup
      title={t('popupTitle')}
      body={t('popupBody')}
      cta={t('popupCta')}
      dismiss={t('popupDismiss')}
    />
  );
}

export async function StyleExplorerGate() {
  const { flags } = await getFeatures();
  if (!flags.styleExplorer) return null;

  const [t, rawLocale, config] = await Promise.all([
    getTranslations('Features'),
    getLocale(),
    getSiteConfig(),
  ]);
  const locale = rawLocale as Locale;
  const services = await getServiceList(locale);

  // Built from the dynamic database service catalogue: these are
  // the things we actually set up, in the client's own words, in both
  // languages.
  const cards: StyleCard[] = services.map((service) => ({
    id: service.slug,
    name: service.name,
    description: service.summary,
    service: service.short,
  }));

  const labels: ExplorerLabels = {
    stylesKeep: t('stylesKeep'),
    stylesSkip: t('stylesSkip'),
    stylesShortlist: t('stylesShortlist'),
    stylesEmpty: t('stylesEmpty'),
    stylesSend: t('stylesSend'),
    stylesReset: t('stylesReset'),
    stylesShare: t('stylesShare'),
    stylesCopied: t('stylesCopied'),
    stylesWaIntro: t('stylesWaIntro'),
    back: t('stylesBack'),
  };

  return (
    <section className="border-t border-gold/20 bg-ink section-pad" id="style-explorer">
      <Reveal className="container-site">
        <h2 className="font-display text-display-md font-medium text-ivory">{t('stylesTitle')}</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ivory-muted">
          {t('stylesIntro')}
        </p>
        <div className="mt-10">
          <LazyStyleExplorer cards={cards} labels={labels} whatsappNumber={config.whatsappNumber} />
        </div>
      </Reveal>
    </section>
  );
}

export async function PanoramaGate({ url }: { url: string | null }) {
  const { flags } = await getFeatures();
  if (!flags.panorama || !url) return null;

  const t = await getTranslations('Features');

  return (
    <section className="theme-light section-pad">
      <div className="container-site">
        <h2 className="mb-8 font-display text-display-md font-medium">{t('panorama')}</h2>
        <LazyPanoramaViewer url={url} hint={t('panoramaHint')} />
      </div>
    </section>
  );
}
