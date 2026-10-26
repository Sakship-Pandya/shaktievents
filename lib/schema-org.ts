import type { Locale } from '@/i18n/routing';
import { localeTags } from '@/i18n/routing';
import { absoluteUrl, localizedPath } from './seo';
import type { SiteConfig } from './settings';

/**
 * JSON-LD builders. Everything that appears in more than one graph — the NAP
 * above all — is derived from SiteConfig, so the markup can never disagree
 * with the footer or the contact page.
 */
type Json = Record<string, unknown>;

const ORGANISATION_ID = '#organisation';

export function organisationId(): string {
  return absoluteUrl('/') + ORGANISATION_ID;
}

export function localBusinessSchema(config: SiteConfig, areas: string[]): Json {
  const sameAs = [config.socials.instagram, config.socials.facebook, config.socials.youtube].filter(
    (v): v is string => Boolean(v),
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': organisationId(),
    additionalType: 'https://schema.org/HomeAndConstructionBusiness',
    name: config.name,
    url: absoluteUrl('/'),
    ...(config.logoUrl ? { logo: config.logoUrl } : {}),
    ...(config.phonePrimary ? { telephone: config.phonePrimary } : {}),
    ...(config.email ? { email: config.email } : {}),
    address: {
      '@type': 'PostalAddress',
      ...(config.addressLine ? { streetAddress: config.addressLine } : {}),
      addressLocality: config.city,
      addressRegion: config.state,
      postalCode: config.pin,
      addressCountry: 'IN',
    },
    areaServed: areas.map((name) => ({ '@type': 'City', name })),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(config.googleMapsUrl ? { hasMap: config.googleMapsUrl } : {}),
  };
}

export function serviceSchema(args: {
  name: string;
  description: string;
  path: string;
  locale: Locale;
  areas: string[];
  config: SiteConfig;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: args.name,
    description: args.description,
    url: absoluteUrl(localizedPath(args.locale, args.path)),
    serviceType: args.name,
    provider: { '@id': organisationId(), '@type': 'LocalBusiness', name: args.config.name },
    areaServed: args.areas.map((name) => ({ '@type': 'City', name })),
  };
}

export function breadcrumbSchema(locale: Locale, trail: { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path)),
    })),
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]): Json | null {
  if (faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/**
 * A finished event, marked as past — schema.org/Event with no future date is
 * how Google reads portfolio work rather than a bookable listing.
 */
export function projectEventSchema(args: {
  name: string;
  description: string;
  path: string;
  locale: Locale;
  startDate: string | null;
  areaName: string;
  config: SiteConfig;
  imageUrls: string[];
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: args.name,
    description: args.description,
    url: absoluteUrl(localizedPath(args.locale, args.path)),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(args.startDate ? { startDate: args.startDate.slice(0, 10) } : {}),
    location: {
      '@type': 'Place',
      name: args.areaName,
      address: {
        '@type': 'PostalAddress',
        addressLocality: args.areaName,
        addressRegion: args.config.state,
        addressCountry: 'IN',
      },
    },
    organizer: { '@id': organisationId(), '@type': 'LocalBusiness', name: args.config.name },
    ...(args.imageUrls.length > 0 ? { image: args.imageUrls.map((u) => absoluteUrl(u)) } : {}),
  };
}

export function imageGallerySchema(args: {
  name: string;
  path: string;
  locale: Locale;
  images: { url: string; caption: string }[];
}): Json | null {
  if (args.images.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: args.name,
    url: absoluteUrl(localizedPath(args.locale, args.path)),
    associatedMedia: args.images.map((image) => ({
      '@type': 'ImageObject',
      contentUrl: absoluteUrl(image.url),
      ...(image.caption ? { caption: image.caption } : {}),
    })),
  };
}

/** Article markup for a blog post. */
export function articleSchema(args: {
  headline: string;
  description: string;
  path: string;
  locale: Locale;
  publishedAt: string | null;
  updatedAt: string;
  authorName: string | null;
  imageUrl: string | null;
  config: SiteConfig;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: args.headline.slice(0, 110),
    description: args.description,
    mainEntityOfPage: absoluteUrl(localizedPath(args.locale, args.path)),
    inLanguage: localeTags[args.locale],
    ...(args.publishedAt ? { datePublished: args.publishedAt } : {}),
    dateModified: args.updatedAt,
    author: args.authorName
      ? { '@type': 'Person', name: args.authorName }
      : { '@id': organisationId(), '@type': 'Organization', name: args.config.name },
    publisher: { '@id': organisationId(), '@type': 'Organization', name: args.config.name },
    ...(args.imageUrl ? { image: absoluteUrl(args.imageUrl) } : {}),
  };
}
