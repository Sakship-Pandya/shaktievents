import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LegalPage } from '@/components/site/legal-page';
import { resolveLocale } from '@/lib/locale';
import { privacyPolicy } from '@/lib/seed-content/legal';
import { pageMetadata } from '@/lib/seo';
import { t as pick } from '@/lib/services';

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: privacyPolicy.path,
    title: pick(privacyPolicy.title, locale),
    description: pick(privacyPolicy.intro, locale),
  });
}

export default async function Page({ params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  return <LegalPage doc={privacyPolicy} locale={locale} />;
}
