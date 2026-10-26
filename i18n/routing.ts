import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'gu'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** Maps our locales to the BCP-47 tags used for hreflang / og:locale. */
export const localeTags: Record<Locale, string> = {
  en: 'en-IN',
  gu: 'gu-IN',
};

export const localeNames: Record<Locale, string> = {
  en: 'English',
  gu: 'ગુજરાતી',
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  // English lives at the root (/services/...), Gujarati is prefixed (/gu/services/...).
  localePrefix: 'as-needed',
});
