import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { Texture } from '@/components/brand/texture';
import { PanoramaGate } from '@/components/features/gates';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ClosingCta } from '@/components/sections/closing-cta';
import { QuoteCta, WhatsAppCta } from '@/components/site/action-buttons';
import { BeforeAfter } from '@/components/site/before-after';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { GalleryLightbox } from '@/components/site/gallery-lightbox';
import { JsonLd } from '@/components/site/json-ld';
import { ProjectCard } from '@/components/site/project-card';
import { NavLink } from '@/components/site/nav-link';
import { routing } from '@/i18n/routing';
import { resolveLocale } from '@/lib/locale';
import { getProjectDetail, getProjectList, getProjectSlugs } from '@/lib/projects-data';
import { breadcrumbSchema, projectEventSchema, imageGallerySchema } from '@/lib/schema-org';
import { pageMetadata } from '@/lib/seo';
import { servicePath } from '@/lib/services';
import { getSiteConfig, toContactInfo } from '@/lib/settings';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const project = await getProjectDetail(slug, locale);
  if (!project) return {};

  const description =
    project.brief.paragraphs[0] ??
    project.eventType?.name ??
    '';

  const seoTitle = locale === 'gu' ? project.seo.titleGu : project.seo.titleEn;
  const seoDescription = locale === 'gu' ? project.seo.descriptionGu : project.seo.descriptionEn;

  return pageMetadata({
    locale,
    path: `/portfolio/${slug}`,
    title: seoTitle ?? project.title,
    description: (seoDescription ?? description).slice(0, 180),
    noindex: project.seo.noindex,
    ...(project.cover ? { image: project.cover.url } : {}),
  });
}

function Block({
  title,
  children,
  tone = 'dark',
}: {
  title: string;
  children: React.ReactNode;
  tone?: 'dark' | 'light';
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
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export default async function ProjectDetailPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  setRequestLocale(locale);

  const project = await getProjectDetail(slug, locale);
  if (!project) notFound();

  const [t, tNav, tCommon, format, config, similar] = await Promise.all([
    getTranslations('Portfolio'),
    getTranslations('Nav'),
    getTranslations('Common'),
    getFormatter(),
    getSiteConfig(),
    getProjectList(locale, {
      eventType: project.eventType?.slug,
      page: 1,
    }),
  ]);

  const contact = toContactInfo(config);
  const others = similar.projects.filter((p) => p.slug !== slug).slice(0, 3);
  const usesPlaceholders =
    project.cover?.isPlaceholder || project.gallery.some((item) => item.isPlaceholder);

  const trail = [
    { name: tNav('home'), path: '/' },
    { name: tNav('portfolio'), path: '/portfolio' },
    { name: project.title, path: `/portfolio/${slug}` },
  ];

  const scale = [
    project.guests
      ? { label: t('scaleGuests'), value: project.guests.toLocaleString('en-IN') }
      : null,
    project.days ? { label: t('scaleDays'), value: String(project.days) } : null,
    project.areaSqft
      ? { label: t('scaleArea'), value: `${project.areaSqft.toLocaleString('en-IN')} sq ft` }
      : null,
    project.venue ? { label: t('scaleVenue'), value: project.venue } : null,
    project.eventDate
      ? {
          label: t('scaleDate'),
          value: format.dateTime(new Date(project.eventDate), 'short'),
        }
      : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  return (
    <>
      <JsonLd
        schemas={[
          projectEventSchema({
            name: project.title,
            description: project.brief.paragraphs[0] ?? project.title,
            path: `/portfolio/${slug}`,
            locale,
            startDate: project.eventDate,
            areaName: config.city,
            config,
            imageUrls: [project.cover?.url, ...project.gallery.map((g) => g.url)].filter(
              (u): u is string => Boolean(u),
            ),
          }),
          imageGallerySchema({
            name: project.title,
            path: `/portfolio/${slug}`,
            locale,
            images: project.gallery.map((g) => ({ url: g.url, caption: g.alt })),
          }),
          breadcrumbSchema(locale, trail),
        ]}
      />

      {/* Hero */}
      <section className="relative hero-under-header overflow-hidden pt-14 pb-14 md:pt-20">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-20%,color-mix(in_oklab,var(--color-maroon)_70%,transparent)_0%,transparent_65%)]"
        />
        <Texture opacity={0.06} />
        <div className="relative container-site">
          <Breadcrumbs trail={trail} />
          <h1 className="mt-7 max-w-3xl font-display text-display-lg font-medium text-ivory">
            {project.title}
          </h1>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.eventType ? (
              <NavLink
                href={`/portfolio?eventType=${project.eventType.slug}`}
                className="rounded-full border border-gold/35 px-4 py-1.5 text-[0.8rem] text-ivory/85 transition-colors hover:border-gold hover:text-marigold"
              >
                {project.eventType.name}
              </NavLink>
            ) : null}
          </div>

          {project.cover ? (
            <div className="relative mt-10 aspect-16/9 overflow-hidden rounded-2xl border border-gold/25">
              <Image
                src={project.cover.url}
                alt={project.cover.alt}
                fill
                sizes="(max-width: 1440px) 100vw, 1440px"
                priority
                className="object-cover"
              />
            </div>
          ) : null}

          {usesPlaceholders ? (
            <p className="mt-4 rounded-lg border border-warning/40 bg-warning/8 px-4 py-3 text-sm text-gold-soft">
              {t('placeholderNotice')}
            </p>
          ) : null}
        </div>
      </section>

      {/* The event */}
      {project.brief.paragraphs.length > 0 ? (
        <section className="theme-light section-pad">
          <div className="container-site">
            <Reveal className="max-w-3xl">
              <h2 className="eyebrow text-maroon">{t('brief')}</h2>
              {project.brief.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-5 text-base leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Scale */}
      {scale.length > 0 ? (
        <section className="border-y border-gold/20 bg-ink-800">
          <dl className="container-site grid grid-cols-2 divide-gold/15 md:grid-cols-5 md:divide-x">
            {scale.map((row) => (
              <div
                key={row.label}
                className="border-t border-gold/15 px-1 py-6 md:border-t-0 md:px-6"
              >
                <dt className="eyebrow text-gold-soft">{row.label}</dt>
                <dd className="mt-2 font-display text-display-sm text-ivory tabular">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {/* What we did */}
      {project.work.did.length > 0 ? (
        <Block title={t('whatWeDid')}>
          <RevealGroup className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {project.work.did.map((item) => (
              <RevealItem key={item}>
                <p className="flex gap-3 border-b border-gold/15 pb-4 text-[0.95rem] text-ivory/85">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-marigold" />
                  {item}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          {project.services.length > 0 ? (
            <Reveal className="mt-12">
              <h3 className="eyebrow text-gold">{t('servicesUsed')}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.services.map((service) => (
                  <li key={service.slug}>
                    <NavLink
                      href={servicePath(service.slug)}
                      className="inline-flex rounded-full border border-gold/40 px-4 py-1.5 text-[0.85rem] text-ivory/85 transition-colors hover:border-gold hover:bg-gold/10 hover:text-marigold"
                    >
                      {service.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </Block>
      ) : null}

      {/* Challenges */}
      {project.work.challenges.length > 0 ? (
        <Block title={t('challenges')} tone="light">
          <RevealGroup className="grid gap-5 md:grid-cols-2">
            {project.work.challenges.map((item) => (
              <RevealItem key={item.problem}>
                <div className="h-full rounded-2xl border border-gold/40 bg-card p-6">
                  <p className="eyebrow text-maroon">{t('challengeProblem')}</p>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink">{item.problem}</p>
                  <p className="mt-5 eyebrow text-maroon">{t('challengeSolution')}</p>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {item.solution}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Block>
      ) : null}

      {/* Before / after */}
      {project.before && project.after ? (
        <Block title={t('beforeAfter')}>
          <Reveal className="mx-auto max-w-4xl">
            <BeforeAfter
              before={project.before}
              after={project.after}
              beforeLabel={t('before')}
              afterLabel={t('after')}
            />
          </Reveal>
        </Block>
      ) : null}

      {/* Gallery */}
      {project.gallery.length > 0 ? (
        <Block title={t('gallery')}>
          <Reveal>
            <GalleryLightbox items={project.gallery} label={t('galleryItem')} />
          </Reveal>
        </Block>
      ) : null}

      {/* 360° — only on projects with a panorama, only while the flag is on. */}
      <PanoramaGate url={project.panoramaUrl} />

      {/* Client quote */}
      {project.clientQuote ? (
        <section className="theme-light section-pad">
          <div className="container-site">
            <Reveal className="mx-auto max-w-3xl text-center">
              <blockquote className="font-display text-display-sm leading-snug font-medium text-ink">
                “{project.clientQuote}”
              </blockquote>
              {project.clientName ? (
                <p className="mt-6 text-sm tracking-[0.08em] text-muted-foreground uppercase">
                  {project.clientName}
                </p>
              ) : null}
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Similar */}
      {others.length > 0 ? (
        <Block title={t('similar')}>
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => (
              <RevealItem key={other.slug}>
                <ProjectCard project={other} guestsLabel={t('guests')} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Block>
      ) : null}

      <section className="bg-ink pb-16 md:pb-20">
        <div className="container-site flex flex-wrap gap-3">
          <QuoteCta label={tCommon('getQuote')} size="lg" />
          <WhatsAppCta
            label={tCommon('whatsapp')}
            size="lg"
            contact={contact}
            message={`Namaste Shree Shakti! I saw "${project.title}" on your site and would like something similar. Date: ___  Town: ___  Guests: ___`}
          />
        </div>
      </section>

      <ClosingCta showCallButton />
    </>
  );
}
