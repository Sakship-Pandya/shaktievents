import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { ClosingCta } from '@/components/sections/closing-cta';
import { JsonLd } from '@/components/site/json-ld';
import { ContentBlock, FaqList, PageHero } from '@/components/site/page-shell';
import { getAllFaqs } from '@/lib/catalogue-data';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema, faqPageSchema } from '@/lib/schema-org';
import { pageMetadata } from '@/lib/seo';
import { pagePhotos, workPhoto } from '@/lib/work-photos';

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'Faq' });
  return pageMetadata({ locale, path: '/faq', title: t('title'), description: t('intro') });
}

export default async function FaqPage({ params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  const [t, tNav, groups] = await Promise.all([
    getTranslations('Faq'),
    getTranslations('Nav'),
    getAllFaqs(locale),
  ]);

  const trail = [
    { name: tNav('home'), path: '/' },
    { name: t('title'), path: '/faq' },
  ];

  const everyQuestion = groups.flatMap((group) => group.items);

  return (
    <>
      <JsonLd schemas={[faqPageSchema(everyQuestion), breadcrumbSchema(locale, trail)]} />
      <PageHero
        trail={trail}
        title={t('title')}
        intro={t('intro')}
        photo={workPhoto(pagePhotos.faq, locale)}
      />

      {groups.map((group, index) => (
        <ContentBlock
          key={group.heading || 'general'}
          title={group.heading || t('general')}
          tone={index % 2 === 0 ? 'light' : 'dark'}
        >
          <FaqList items={group.items} tone={index % 2 === 0 ? 'light' : 'dark'} />
        </ContentBlock>
      ))}

      <section className="bg-ink pb-16 md:pb-20">
        <div className="container-site">
          <Reveal>
            <p className="max-w-2xl text-base leading-relaxed text-ivory-muted">
              {t('stillStuck')}
            </p>
          </Reveal>
        </div>
      </section>

      <ClosingCta showCallButton />
    </>
  );
}
