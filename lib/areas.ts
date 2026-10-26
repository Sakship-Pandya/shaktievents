import type { Locale } from '@/i18n/routing';
import type { Localized } from './services';

/**
 * Towns we serve across Surendranagar district. Stand-in for the `Area`
 * table (step 2). Coordinates and travel times stay null until the client
 * confirms them — area pages must not ship invented distances.
 */
export type Area = {
  slug: string;
  name: Localized;
  lat: number | null;
  lng: number | null;
  /** Shown in the nav/footer shortlist. */
  primary: boolean;
  isActive: boolean;
};

export const areas: Area[] = [
  {
    slug: 'surendranagar',
    name: { en: 'Surendranagar', gu: 'સુરેન્દ્રનગર' },
    lat: null,
    lng: null,
    primary: true,
    isActive: true,
  },
  {
    slug: 'wadhwan',
    name: { en: 'Wadhwan', gu: 'વઢવાણ' },
    lat: null,
    lng: null,
    primary: true,
    isActive: true,
  },
  {
    slug: 'limbdi',
    name: { en: 'Limbdi', gu: 'લીંબડી' },
    lat: null,
    lng: null,
    primary: true,
    isActive: true,
  },
  {
    slug: 'dhrangadhra',
    name: { en: 'Dhrangadhra', gu: 'ધ્રાંગધ્રા' },
    lat: null,
    lng: null,
    primary: true,
    isActive: true,
  },
  {
    slug: 'chotila',
    name: { en: 'Chotila', gu: 'ચોટીલા' },
    lat: null,
    lng: null,
    primary: true,
    isActive: true,
  },
  {
    slug: 'sayla',
    name: { en: 'Sayla', gu: 'સાયલા' },
    lat: null,
    lng: null,
    primary: true,
    isActive: true,
  },
  {
    slug: 'thangadh',
    name: { en: 'Thangadh', gu: 'થાનગઢ' },
    lat: null,
    lng: null,
    primary: false,
    isActive: true,
  },
  {
    slug: 'lakhtar',
    name: { en: 'Lakhtar', gu: 'લખતર' },
    lat: null,
    lng: null,
    primary: false,
    isActive: true,
  },
  {
    slug: 'muli',
    name: { en: 'Muli', gu: 'મૂળી' },
    lat: null,
    lng: null,
    primary: false,
    isActive: true,
  },
  {
    slug: 'halvad',
    name: { en: 'Halvad', gu: 'હળવદ' },
    lat: null,
    lng: null,
    primary: false,
    isActive: true,
  },
  {
    slug: 'patdi',
    name: { en: 'Patdi', gu: 'પાટડી' },
    lat: null,
    lng: null,
    primary: false,
    isActive: true,
  },
  {
    slug: 'chuda',
    name: { en: 'Chuda', gu: 'ચૂડા' },
    lat: null,
    lng: null,
    primary: false,
    isActive: true,
  },
];

export const activeAreas = areas.filter((a) => a.isActive);
export const primaryAreas = activeAreas.filter((a) => a.primary);


/**
 * Gujarati page headings need the town name in Gujarati. The settings row
 * stores it in English, so match it against the catalogue and fall back to
 * whatever the client typed if it is not a town we list.
 */
export function localiseCity(name: string, locale: Locale): string {
  const match = activeAreas.find((a) => a.name.en.toLowerCase() === name.trim().toLowerCase());
  return match ? match.name[locale] : name;
}
