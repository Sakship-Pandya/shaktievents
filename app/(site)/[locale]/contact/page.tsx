import type { Metadata } from 'next';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Texture } from '@/components/brand/texture';
import { WhatsAppIcon } from '@/components/brand/icons';
import { ClosingCta } from '@/components/sections/closing-cta';
import { QuoteCta, WhatsAppCta } from '@/components/site/action-buttons';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { JsonLd } from '@/components/site/json-ld';
import { buildTelUrl, buildWhatsAppUrl } from '@/lib/contact-links';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema, localBusinessSchema } from '@/lib/schema-org';
import { pageMetadata } from '@/lib/seo';
import { getSiteConfig, toContactInfo } from '@/lib/settings';
import { display } from '@/lib/site';
import { PhotoBackdrop } from '@/components/site/work-image';
import { pagePhotos, workPhoto } from '@/lib/work-photos';
import { ContactForm } from './contact-form';

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'Contact' });
  return pageMetadata({ locale, path: '/contact', title: t('title'), description: t('intro') });
}

const FORM_KEYS = [
  'name',
  'phone',
  'message',
  'submit',
  'submitting',
  'doneTitle',
  'doneBody',
  'reference',
  'honeypot',
] as const;

export default async function ContactPage({ params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  const [t, tQuote, tNav, tFooter, tCommon, config] = await Promise.all([
    getTranslations('Contact'),
    getTranslations('Quote'),
    getTranslations('Nav'),
    getTranslations('Footer.nap'),
    getTranslations('Common'),
    getSiteConfig(),
  ]);

  const contact = toContactInfo(config);
  const callPhones = [config.phonePrimary, config.phoneSecondary].filter(
    (n): n is string => Boolean(n),
  );
  const whatsapp = config.whatsappNumber;
  const areaNames = [config.city];
  const labels = Object.fromEntries(FORM_KEYS.map((k) => [k, tQuote(k)]));

  const address = config.addressLine
    ? `${config.addressLine}, ${config.city}, ${config.state} ${config.pin}`
    : `${config.city}, ${config.state} ${config.pin}`;

  const rows = [
    { icon: MapPin, label: tFooter('address'), value: address, href: config.googleMapsUrl },
    {
      icon: Phone,
      label: tFooter('phone'),
      value:
        callPhones.length || whatsapp ? (
          <span className="flex flex-col gap-1.5">
            {callPhones.map((phone) => {
              const href = buildTelUrl(phone);
              return href ? (
                <a
                  key={phone}
                  href={href}
                  className="inline-flex items-center gap-2 transition-colors hover:text-marigold"
                >
                  <Phone className="size-3.5 shrink-0 text-gold" />
                  <span>{phone}</span>
                </a>
              ) : (
                <span key={phone} className="inline-flex items-center gap-2">
                  <Phone className="size-3.5 shrink-0 text-gold" />
                  <span>{phone}</span>
                </span>
              );
            })}
            {whatsapp ? (
              <a
                href={
                  buildWhatsAppUrl(whatsapp, config.whatsappDefaultMessage) ??
                  `https://wa.me/${whatsapp}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-marigold"
              >
                <WhatsAppIcon className="size-3.5 shrink-0 text-[#25D366]" />
                <span>{whatsapp}</span>
              </a>
            ) : null}
          </span>
        ) : (
          display(config.phonePrimary)
        ),
      href: null,
    },
    {
      icon: Mail,
      label: tFooter('email'),
      value: display(config.email),
      href: config.email ? `mailto:${config.email}` : null,
    },
    { icon: Clock, label: tFooter('hours'), value: tFooter('hoursValue'), href: null },
  ];

  return (
    <>
      <JsonLd
        schemas={[
          localBusinessSchema(config, areaNames),
          breadcrumbSchema(locale, [
            { name: tNav('home'), path: '/' },
            { name: tNav('contact'), path: '/contact' },
          ]),
        ]}
      />

      <section className="relative hero-under-header mb-14 overflow-hidden pt-14 pb-16 md:mb-16 md:pt-20 md:pb-24">
        <PhotoBackdrop photo={workPhoto(pagePhotos.contact, locale)} priority />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-20%,color-mix(in_oklab,var(--color-maroon)_70%,transparent)_0%,transparent_65%)]"
        />
        <Texture opacity={0.06} />
        <div className="relative container-site">
          <Breadcrumbs
            trail={[
              { name: tNav('home'), path: '/' },
              { name: tNav('contact'), path: '/contact' },
            ]}
          />
          <h1 className="mt-7 font-display text-display-lg font-medium text-ivory">{t('title')}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory-muted md:text-lg">
            {t('intro')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <WhatsAppCta label={tCommon('whatsapp')} size="lg" contact={contact} />
            <QuoteCta label={tCommon('getQuote')} size="lg" variant="outline" />
          </div>
        </div>
      </section>

      <section className="bg-ink pb-20 md:pb-24">
        <div className="container-site grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <div>
            <h2 className="font-display text-display-sm font-medium text-ivory">
              {t('detailsHeading')}
            </h2>
            <dl className="mt-6 space-y-5">
              {rows.map((row) => {
                const Icon = row.icon;
                return (
                  // One div between <dl> and its <dt>/<dd> is valid; nesting a
                  // second one is not, and axe rightly flags it.
                  <div key={row.label} className="grid grid-cols-[auto_1fr] gap-x-3.5">
                    <Icon aria-hidden className="col-start-1 mt-0.5 size-4 shrink-0 text-gold" />
                    <dt className="col-start-2 eyebrow text-gold-soft">{row.label}</dt>
                    <dd className="col-start-2 mt-1 text-[0.95rem] leading-relaxed text-ivory-muted">
                      {row.href ? (
                        <a
                          href={row.href}
                          {...(row.href.startsWith('http')
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                          className="transition-colors hover:text-marigold"
                        >
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <h2 className="mt-10 font-display text-display-sm font-medium text-ivory">
              {t('mapHeading')}
            </h2>
            {config.googleMapsUrl ? (
              <a
                href={config.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-sm text-ivory transition-colors hover:border-gold hover:text-marigold"
              >
                <MapPin className="size-4" />
                Google Maps
              </a>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-ivory-muted">{t('mapMissing')}</p>
            )}
          </div>

          <div>
            <h2 className="font-display text-display-sm font-medium text-ivory">
              {t('formHeading')}
            </h2>
            <p className="mt-3 mb-7 text-sm text-ivory-muted">{t('quoteInstead')}</p>
            <ContactForm labels={labels} />
          </div>
        </div>
      </section>

      <ClosingCta showCallButton />
    </>
  );
}
