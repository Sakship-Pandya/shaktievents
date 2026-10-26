import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import { Texture } from '@/components/brand/texture';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { JsonLd } from '@/components/site/json-ld';
import { db } from '@/lib/db';
import { getEventTypeList } from '@/lib/catalogue-data';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema } from '@/lib/schema-org';
import { EMPTY_RULES, estimatorRulesSchema } from '@/lib/schemas/estimator';
import { parseOr } from '@/lib/schemas/service-content';
import { pageMetadata } from '@/lib/seo';
import { getServiceList } from '@/lib/services-data';
import { PhotoBackdrop } from '@/components/site/work-image';
import { pagePhotos, workPhoto } from '@/lib/work-photos';
import { QuoteWizard, type WizardLabels } from './quote-wizard';

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'Quote' });

  return pageMetadata({ locale, path: '/get-quote', title: t('title'), description: t('intro') });
}

const LABEL_KEYS = [
  'stepOf',
  'stepEvent',
  'stepScale',
  'stepServices',
  'stepContact',
  'back',
  'next',
  'submit',
  'submitting',
  'guests',
  'guestsHelp',
  'date',
  'dateHelp',
  'peakNotice',
  'servicesHelp',
  'name',
  'phone',
  'phoneHelp',
  'email',
  'town',
  'townOther',
  'message',
  'doneTitle',
  'doneBody',
  'reference',
  'estimateTitle',
  'estimateNote',
  'noEstimate',
  'peakEstimateNote',
  'sendWhatsapp',
  'startAgain',
  'honeypot',
] as const;

export default async function GetQuotePage({ params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  const [t, tNav, services, eventTypes, settings] = await Promise.all([
    getTranslations('Quote'),
    getTranslations('Nav'),
    getServiceList(locale),
    getEventTypeList(locale),
    db.siteSettings.findUnique({ where: { id: 'singleton' }, select: { estimatorRules: true } }),
  ]);

  const rules = parseOr(estimatorRulesSchema, settings?.estimatorRules, EMPTY_RULES);
  const labels = Object.fromEntries(LABEL_KEYS.map((key) => [key, t(key)])) as WizardLabels;

  const trail = [
    { name: tNav('home'), path: '/' },
    { name: tNav('quote'), path: '/get-quote' },
  ];

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(locale, trail)]} />

      <section className="relative hero-under-header overflow-hidden pt-14 pb-20 md:pt-20 md:pb-24">
        <PhotoBackdrop
          photo={workPhoto(pagePhotos.quote, locale)}
          visibility="low"
          priority
          className="[mask-image:linear-gradient(180deg,black_0%,black_45%,transparent_85%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-20%,color-mix(in_oklab,var(--color-maroon)_70%,transparent)_0%,transparent_65%)]"
        />
        <Texture opacity={0.06} />
        <div className="relative container-site">
          <Breadcrumbs trail={trail} />
          <h1 className="mt-7 max-w-3xl font-display text-display-lg font-medium text-ivory">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory-muted md:text-lg">
            {t('intro')}
          </p>

          <div className="relative mt-12 max-w-4xl">
            {/* useSearchParams needs a Suspense boundary to keep the page static. */}
            <Suspense
              fallback={<div className="h-96 rounded-3xl border border-gold/25 bg-ink-800" />}
            >
              <QuoteWizard
                eventTypes={eventTypes.map((e) => ({
                  slug: e.slug,
                  name: e.name,
                  blurb: e.blurb,
                }))}
                services={services.map((s) => ({ slug: s.slug, name: s.short }))}
                peakMonths={rules.peakMonths}
                labels={labels}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
