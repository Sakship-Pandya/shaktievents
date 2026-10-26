import type { Metadata } from 'next';
import { defaultLocale, locales, localeTags, type Locale } from '@/i18n/routing';
import { site } from './site';

/** Leading slash, no trailing slash. The root becomes an empty string. */
function normalize(path: string): string {
  if (!path || path === '/') return '';
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  return withSlash.endsWith('/') ? withSlash.slice(0, -1) : withSlash;
}

/**
 * English lives at the root and Gujarati under /gu, matching
 * `localePrefix: 'as-needed'` in i18n/routing.ts.
 */
export function localizedPath(locale: Locale, path: string): string {
  const clean = normalize(path);
  if (locale === defaultLocale) return clean || '/';
  return `/${locale}${clean}`;
}

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

export type Alternates = {
  canonical: string;
  languages: Record<string, string>;
};

/**
 * Canonical + hreflang set for one page. Paths stay relative; `metadataBase`
 * on the layout turns them into absolute URLs.
 */
export function alternatesFor(locale: Locale, path: string): Alternates {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[localeTags[l]] = localizedPath(l, path);
  }
  languages['x-default'] = localizedPath(defaultLocale, path);

  return { canonical: localizedPath(locale, path), languages };
}

/** og:locale wants underscores (en_IN), hreflang wants a hyphen (en-IN). */
export function ogLocale(locale: Locale): string {
  return localeTags[locale].replace('-', '_');
}

type PageMetadataArgs = {
  locale: Locale;
  /** Unprefixed path, e.g. `/services/sound-system-pa-service-surendranagar`. */
  path: string;
  title: string;
  description: string;
  /** Absolute or root-relative image URL. Falls back to the brand OG card. */
  image?: string;
  noindex?: boolean;
  /** Skips the layout's "%s | Shree Shakti" template — the home page only. */
  absoluteTitle?: boolean;
};

/**
 * Share cards are generated from the page title rather than served as files —
 * there is no photograph library yet, and an OG card is the one place a
 * missing image is very visible.
 */
export function ogImageUrl(title: string, eyebrow?: string): string {
  const params = new URLSearchParams({ title });
  if (eyebrow) params.set('eyebrow', eyebrow);
  return `/api/og?${params.toString()}`;
}

/**
 * One metadata builder for every public page so titles, canonicals, hreflang
 * and OG tags can never drift apart.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
  noindex = false,
  absoluteTitle = false,
}: PageMetadataArgs): Metadata {
  const alternates = alternatesFor(locale, path);
  const ogImage = image ?? ogImageUrl(title);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates,
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'website',
      siteName: site.name,
      title,
      description,
      url: alternates.canonical,
      locale: ogLocale(locale),
      alternateLocale: locales.filter((l) => l !== locale).map(ogLocale),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}
