import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { RenderSections } from '@/components/sections/registry';
import { JsonLd } from '@/components/site/json-ld';
import { resolveLocale } from '@/lib/locale';
import { getPageSections } from '@/lib/pages';
import { localBusinessSchema } from '@/lib/schema-org';
import { pageMetadata } from '@/lib/seo';
import { getSiteConfig } from '@/lib/settings';

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'Meta' });

  return pageMetadata({
    locale,
    path: '/',
    title: t('title'),
    description: t('description'),
    absoluteTitle: true,
  });
}

/**
 * Assembled from the PageSection rows for "/", so the client can reorder,
 * hide and configure homepage blocks from /admin/sections without a deploy.
 *
 * The LocalBusiness block is not one of those sections and cannot be turned
 * off. This is the URL a Google Business Profile points at and the one Google
 * treats as the business itself; the schema has to be here whatever the client
 * does to the page above it.
 */
export default async function HomePage({ params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  const [sections, config] = await Promise.all([
    getPageSections('/'),
    getSiteConfig(),
  ]);
  const areaNames = [config.city];

  return (
    <>
      <JsonLd schemas={[localBusinessSchema(config, areaNames)]} />
      <RenderSections sections={sections} />
    </>
  );
}
