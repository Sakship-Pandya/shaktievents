import { clientEnv } from './env';

/**
 * Business facts. Everything that is null is a [TBD] the client must supply.
 * In step 2 this moves into the SiteSettings table; keep the shape stable.
 */
export { TBD, display } from './display';

/** The subset a client component needs to render call and WhatsApp links. */
export type ContactInfo = {
  phone: string | null;
  whatsapp: string | null;
  whatsappMessage: string;
};

export type SiteStats = {
  eventsCompleted: number | null;
  years: number | null;
  townsServed: number | null;
  teamSize: number | null;
};

export const site = {
  name: 'Shree Shakti Sound Service & Mandap Contractor',
  shortName: 'Shree Shakti',
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
  city: 'Surendranagar',
  district: 'Surendranagar',
  state: 'Gujarat',
  pin: '363001',
  countryCode: 'IN',
  phonePrimary: clientEnv.NEXT_PUBLIC_PHONE_PRIMARY ?? null,
  phoneSecondary: null as string | null,
  phoneTertiary: null as string | null,
  whatsappNumber: clientEnv.NEXT_PUBLIC_WHATSAPP_NUMBER ?? null,
  email: 'info@shaktieventsdecor.com' as string | null,
  addressLine: 'Near Old Powerhouse, Sonapuri Road, Handloom Chowk' as string | null,
  area: 'Handloom Chowk' as string | null,
  googleMapsUrl: 'https://share.google/9z4NabpDNmTG0oINK' as string | null,
  googleBusinessProfileUrl: null as string | null,
  establishedYear: null as number | null,
  ownerName: null as string | null,
  gstNo: null as string | null,
  socials: {
    instagram: null as string | null,
    facebook: null as string | null,
    youtube: null as string | null,
  },
  stats: {
    eventsCompleted: null,
    years: null,
    townsServed: null,
    teamSize: null,
  } satisfies SiteStats as SiteStats,
  whatsappDefaultMessage:
    'Namaste Shree Shakti! I would like a quote for my event. Date: ___  Town: ___  Guests: ___',
  credit: { label: 'Tankar Solutions', url: null as string | null },
};
