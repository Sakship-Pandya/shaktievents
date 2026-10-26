import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';

/**
 * Next's generated page types require `params` to be `Promise<{ locale: string }>`,
 * so every page awaits it through here to get a narrowed `Locale` back and
 * 404 on anything else.
 */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return locale;
}
