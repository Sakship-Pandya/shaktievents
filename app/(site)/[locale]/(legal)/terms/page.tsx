import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LegalPage } from '@/components/site/legal-page';
import { resolveLocale } from '@/lib/locale';
import { terms } from '@/lib/seed-content/legal';
import { pageMetadata } from '@/lib/seo';
import { t as pick } from '@/lib/services';

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: terms.path,
    title: pick(terms.title, locale),
    description: pick(terms.intro, locale),
  });
}

export default async function Page({ params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  return <LegalPage doc={terms} locale={locale} />;
}
