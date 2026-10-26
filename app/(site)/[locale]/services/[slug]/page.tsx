import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { serviceIcons, type ServiceIconName } from '@/components/brand/icons';
import { Texture } from '@/components/brand/texture';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ClosingCta } from '@/components/sections/closing-cta';
import { QuoteCta, WhatsAppCta } from '@/components/site/action-buttons';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { ProjectCard } from '@/components/site/project-card';
import { JsonLd } from '@/components/site/json-ld';
import { NavLink } from '@/components/site/nav-link';
import { routing } from '@/i18n/routing';
import { localiseCity } from '@/lib/areas';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema, faqPageSchema, serviceSchema } from '@/lib/schema-org';
import { pageMetadata } from '@/lib/seo';
import { servicePath, t as pick } from '@/lib/services';
import { getProjectsForService } from '@/lib/projects-data';
import { getServiceDetail, getServiceList, getServiceSlugs } from '@/lib/services-data';
import { getSiteConfig, toContactInfo } from '@/lib/settings';
import { WorkGallery } from '@/components/site/work-gallery';
import { WorkImage } from '@/components/site/work-image';
import { servicePhotos } from '@/lib/work-photos';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const service = await getServiceDetail(slug, locale);
  if (!service) return {};

  const [t, config] = await Promise.all([
    getTranslations({ locale, namespace: 'Service' }),
    getSiteConfig(),
  ]);

  const seoTitle = locale === 'gu' ? service.seo.titleGu : service.seo.titleEn;
  const seoDescription = locale === 'gu' ? service.seo.descriptionGu : service.seo.descriptionEn;
  const city = localiseCity(config.city, locale);

  return pageMetadata({
    locale,
    path: servicePath(slug),
    title: seoTitle ?? t('h1', { service: service.name, city }),
    description: seoDescription ?? service.content?.promise ?? service.summary,
    noindex: service.seo.noindex,
    ...(service.seo.ogImage ? { image: service.seo.ogImage } : {}),
  });
}

/** Section shell so every block on the page shares the same rhythm. */
function Block({
  title,
  children,
  tone = 'dark',
  note,
}: {
  title: string;
  children: React.ReactNode;
  tone?: 'dark' | 'light';
  note?: string;
}) {
  return (
    <section className={tone === 'light' ? 'theme-light section-pad' : 'bg-ink section-pad'}>
      <div className="container-site">
        <Reveal>
          <h2
            className={`font-display text-display-md font-medium ${tone === 'light' ? 'text-ink' : 'text-ivory'}`}
          >
            {title}
          </h2>
          {note ? (
            <p
              className={`mt-3 text-sm ${tone === 'light' ? 'text-muted-foreground' : 'text-ivory-muted'}`}
            >
              {note}
            </p>
          ) : null}
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export default async function ServiceDetailPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  setRequestLocale(locale);

  const [service, allServices, projects, t, tNav, tCommon, tPortfolio, config] =
    await Promise.all([
      getServiceDetail(slug, locale),
      getServiceList(locale),
      getProjectsForService(slug, locale, 3),
      getTranslations('Service'),
      getTranslations('Nav'),
      getTranslations('Common'),
      getTranslations('Portfolio'),
      getSiteConfig(),
    ]);

  if (!service) notFound();

  const contact = toContactInfo(config);
  const Icon = serviceIcons[service.icon as ServiceIconName] ?? serviceIcons.event;
  const photos = servicePhotos(slug, locale);
  const tWork = await getTranslations('Work');
  const areaNames = [localiseCity(config.city, locale)];

  const trail = [
    { name: tNav('home'), path: '/' },
    { name: tNav('services'), path: '/services' },
    { name: service.short, path: servicePath(slug) },
  ];

  // Cross-sell: the next four active services, wrapping round the catalogue.
  const index = allServices.findIndex((s) => s.slug === slug);
  const related = [...allServices.slice(index + 1), ...allServices.slice(0, index)].slice(0, 4);

  const whatsappMessage = `Namaste Shree Shakti! I would like a quote for ${service.name}. Date: ___  Town: ___  Guests: ___`;

  return (
    <>
      <JsonLd
        schemas={[
          serviceSchema({
            name: service.name,
            description: service.content?.promise || service.summary,
            path: servicePath(slug),
            locale,
            areas: areaNames,
            config,
          }),
          breadcrumbSchema(locale, trail),
          faqPageSchema(service.faqs),
        ]}
      />

      {/* 1. Hero */}
      <section className="relative hero-under-header overflow-hidden pt-14 pb-16 md:pt-20 md:pb-20">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-20%,color-mix(in_oklab,var(--color-maroon)_70%,transparent)_0%,transparent_65%)]"
        />
        <Texture opacity={0.06} />
        <div className="relative container-site grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16">
          <div className="max-w-3xl">
            <Breadcrumbs trail={trail} />
            <span className="mt-7 grid size-14 place-items-center rounded-full border border-gold/40 text-gold">
              <Icon className="size-7" />
            </span>
            <h1 className="mt-6 font-display text-display-lg font-medium text-ivory">
              {t('h1', { service: service.name, city: localiseCity(config.city, locale) })}
            </h1>
            {service.content?.promise ? (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory-muted md:text-lg">
                {service.content.promise}
              </p>
            ) : null}
            <div className="mt-9 flex flex-wrap gap-3">
              <QuoteCta label={tCommon('getQuote')} size="lg" />
              <WhatsAppCta
                label={tCommon('whatsapp')}
                size="lg"
                contact={contact}
                message={whatsappMessage}
              />
            </div>
          </div>

          {/* An arch-topped frame — the mandap doorway, repeated on the About page. */}
          <figure className="relative mx-auto w-full max-w-[22rem] lg:max-w-none">
            <span aria-hidden className="absolute -inset-3 rounded-t-full border border-gold/25" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-gold/40 bg-ink-700 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)]">
              <WorkImage
                photo={photos.cover}
                decorative
                sizes="(max-width: 1024px) 22rem, 24rem"
                priority
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent"
              />
            </div>
            <figcaption className="mt-5 text-center text-xs leading-relaxed text-ivory-muted">
              {photos.cover.alt}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 2. Intro */}
      {service.content?.intro ? (
        <section className="theme-light section-pad">
          <div className="container-site">
            <Reveal className="max-w-3xl">
              <p className="font-display text-display-sm leading-snug font-medium text-ink">
                {service.content.intro}
              </p>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* 3. What's included */}
      {service.inclusions.length > 0 ? (
        <Block title={t('included')}>
          <RevealGroup className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {service.inclusions.map((item) => (
              <RevealItem key={item.en}>
                <p className="flex gap-3 border-b border-gold/15 pb-4 text-[0.95rem] text-ivory/85">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-marigold" />
                  {locale === 'gu' ? item.gu : item.en}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Block>
      ) : null}

      {/* 4. Options */}
      {service.options.length > 0 ? (
        <Block title={t('options')} tone="light">
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.options.map((option) => (
              <RevealItem key={option.nameEn}>
                <div className="h-full rounded-2xl border border-gold/40 bg-card p-6">
                  <h3 className="font-display text-lg font-medium text-ink">
                    {locale === 'gu' ? option.nameGu : option.nameEn}
                  </h3>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
                    {locale === 'gu' ? option.descGu : option.descEn}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Block>
      ) : null}

      {/* 5. Specs */}
      {service.specs.length > 0 ? (
        <Block title={t('specs')} note={t('specsNote')}>
          <Reveal className="overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left">
              <tbody>
                {service.specs.map((spec) => (
                  <tr key={spec.labelEn} className="border-b border-gold/15">
                    <th
                      scope="row"
                      className="py-4 pr-6 text-[0.85rem] font-medium tracking-[0.04em] text-gold-soft uppercase"
                    >
                      {locale === 'gu' ? spec.labelGu : spec.labelEn}
                    </th>
                    <td className="py-4 text-[0.95rem] text-ivory/85">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </Block>
      ) : null}

      {/* 6. Gallery — published projects tagged with this service */}
      <Block title={projects.length > 0 ? t('gallery') : tWork('serviceGallery')} tone="light">
        {projects.length > 0 ? (
          <>
            <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <RevealItem key={project.slug}>
                  <ProjectCard project={project} guestsLabel={tPortfolio('guests')} />
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal className="mt-8">
              <NavLink
                href={`/portfolio?service=${slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-maroon/30 px-6 py-3 text-sm font-semibold text-maroon transition-colors hover:border-maroon hover:bg-maroon hover:text-ivory"
              >
                {tNav('portfolio')}
              </NavLink>
            </Reveal>
          </>
        ) : null}
        {/* Our own photographs for this kind of setup, whether or not a
            published project is tagged with the service yet. */}
        <div className={projects.length > 0 ? 'mt-14' : undefined}>
          <WorkGallery
            photos={photos.gallery}
            itemLabel={tWork('photo')}
            tone="light"
            layout="grid"
          />
        </div>
      </Block>

      {/* 7. Pricing */}
      {service.pricing ? (
        <Block title={t('pricing')}>
          <Reveal className="max-w-3xl">
            {service.pricing.fromInr ? (
              <p className="font-display text-display-md text-marigold tabular">
                {t('pricingFrom', { amount: service.pricing.fromInr.toLocaleString('en-IN') })}
                <span className="ml-2 font-sans text-base text-ivory-muted">
                  {locale === 'gu' ? service.pricing.unitGu : service.pricing.unitEn}
                </span>
              </p>
            ) : (
              <p className="text-base leading-relaxed text-ivory-muted">{t('pricingUnset')}</p>
            )}

            {service.pricing.factors.length > 0 ? (
              <>
                <h3 className="mt-10 eyebrow text-gold">{t('pricingFactors')}</h3>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {service.pricing.factors.map((factor) => (
                    <li key={factor.en} className="flex gap-3 text-[0.95rem] text-ivory/85">
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-marigold"
                      />
                      {locale === 'gu' ? factor.gu : factor.en}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </Reveal>
        </Block>
      ) : null}

      {/* 8. Process */}
      {service.content?.process.length ? (
        <Block title={t('process')} tone="light">
          <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {service.content.process.map((step, i) => (
              <RevealItem key={step.title}>
                <div className="h-full border-t-2 border-maroon/30 pt-5">
                  <span className="font-display text-2xl text-maroon tabular">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-medium text-ink">{step.title}</h3>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Block>
      ) : null}

      {/* 9. Related services */}
      {related.length > 0 ? (
        <Block title={t('related')}>
          <RevealGroup className="flex flex-wrap gap-3">
            {related.map((item) => {
              const RelatedIcon = serviceIcons[item.icon as ServiceIconName] ?? serviceIcons.event;
              return (
                <RevealItem key={item.slug}>
                  <NavLink
                    href={servicePath(item.slug)}
                    className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 px-5 py-3 text-[0.9rem] text-ivory/85 transition-colors hover:border-gold hover:bg-gold/10 hover:text-ivory"
                  >
                    <RelatedIcon className="size-4 text-gold" />
                    {item.short}
                  </NavLink>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Block>
      ) : null}

      {/* 10. FAQ */}
      {service.faqs.length > 0 ? (
        <Block title={t('faq')} tone="light">
          <div className="max-w-3xl">
            {service.faqs.map((faq) => (
              <details key={faq.question} className="group border-b border-gold/30">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-display text-lg text-ink marker:hidden">
                  {faq.question}
                  <span
                    aria-hidden
                    className="mt-2 grid size-5 shrink-0 place-items-center text-maroon transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-6 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Block>
      ) : null}

      {/* 11. Closing + CTA */}
      {service.content?.closing ? (
        <section className="theme-light pt-0 pb-20 md:pb-24">
          <div className="container-site">
            <Reveal className="max-w-3xl">
              <p className="text-base leading-relaxed text-muted-foreground">
                {service.content.closing}
              </p>
            </Reveal>
          </div>
        </section>
      ) : null}

      <ClosingCta showCallButton />
    </>
  );
}
