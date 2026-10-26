import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { EnquiryPopupGate } from '@/components/features/gates';
import { SmoothScroll } from '@/components/providers/smooth-scroll';
import { AnnouncementBar } from '@/components/site/announcement-bar';
import { MobileActionBar } from '@/components/site/mobile-action-bar';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { SkipLink } from '@/components/site/skip-link';
import { WhatsAppFloat } from '@/components/site/whatsapp-float';
import { getEventTypeList } from '@/lib/catalogue-data';
import { fontVariables } from '@/lib/fonts';
import { ogLocale } from '@/lib/seo';
import { getServiceList } from '@/lib/services-data';
import { getSiteConfig, toContactInfo } from '@/lib/settings';
import { routing } from '@/i18n/routing';
import { site } from '@/lib/site';

type LayoutParams = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#14100D',
  colorScheme: 'dark',
};

/**
 * Site-wide defaults only. Canonicals and hreflang are deliberately NOT set
 * here — a page that forgot to override them would otherwise claim the home
 * page as its canonical. Every page calls pageMetadata() instead.
 */
export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const [t, config] = await Promise.all([
    getTranslations({ locale, namespace: 'Meta' }),
    getSiteConfig(),
  ]);

  return {
    metadataBase: new URL(site.url),
    title: { default: t('title'), template: t('titleTemplate') },
    description: t('description'),
    applicationName: config.name,
    formatDetection: { telephone: true, address: true },
    openGraph: {
      type: 'website',
      siteName: config.name,
      locale: ogLocale(locale),
    },
  };
}

export default async function SiteLayout({
  children,
  params,
}: LayoutParams & { children: ReactNode }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [siteConfig, services, eventTypes] = await Promise.all([
    getSiteConfig(),
    getServiceList(locale as any),
    getEventTypeList(locale as any),
  ]);
  const contact = toContactInfo(siteConfig);

  // next-intl serialises whatever it is given into every page's HTML. Only the
  // header and the mobile sheet translate on the client, so only their two
  // namespaces travel — the rest stay on the server where they are used.
  const messages = await getMessages();
  const clientMessages = { Common: messages.Common, Nav: messages.Nav };

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Opts the page into scroll reveals before first paint. Without it the
            content is simply visible, which is what a failed script, an old
            browser and a reduced-motion preference should all get. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-reveal')",
          }}
        />
      </head>
      <body className="bg-ink text-ivory antialiased">
        <NextIntlClientProvider messages={clientMessages}>
          <SmoothScroll />
          <SkipLink />
          <div className="flex min-h-svh flex-col">
            <AnnouncementBar />
            <SiteHeader
              contact={contact}
              services={services}
              eventTypes={eventTypes}
            />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
          {/* Clears the fixed mobile action bar so the footer stays reachable. */}
          <div aria-hidden className="h-[calc(4rem+env(safe-area-inset-bottom))] md:hidden" />
          <MobileActionBar />
          <WhatsAppFloat />
          <EnquiryPopupGate />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
