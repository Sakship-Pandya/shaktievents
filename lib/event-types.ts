import type { ServiceIconName } from '@/components/brand/icons';
import type { Localized } from './services';

/**
 * Audience landing pages. Stand-in for the `EventType` table (step 2).
 */
export type EventType = {
  slug: string;
  name: Localized;
  blurb: Localized;
  icon: ServiceIconName;
  isActive: boolean;
};

export const eventTypes: EventType[] = [
  {
    slug: 'weddings',
    name: { en: 'Weddings', gu: 'લગ્ન' },
    blurb: {
      en: 'Lagan, vidhi mandap, sangeet, haldi and reception — set up across three or four days without a gap.',
      gu: 'લગન, વિધિ મંડપ, સંગીત, હળદી અને રિસેપ્શન — ત્રણ-ચાર દિવસ, વચ્ચે ખાડો પડ્યા વગર.',
    },
    icon: 'mandap',
    isActive: true,
  },
  {
    slug: 'religious-katha',
    name: { en: 'Katha & Religious', gu: 'કથા અને ધાર્મિક' },
    blurb: {
      en: 'Bhagwat Katha, satsang, havan and Mata ni Chowki — clear speech at the back row, shade at the front.',
      gu: 'ભાગવત કથા, સત્સંગ, હવન અને માતાની ચોકી — છેલ્લી હરોળ સુધી સ્પષ્ટ અવાજ, આગળ છાંયડો.',
    },
    icon: 'speaker',
    isActive: true,
  },
  {
    slug: 'navratri-garba',
    name: { en: 'Navratri & Garba', gu: 'નવરાત્રિ અને ગરબા' },
    blurb: {
      en: 'Nine nights of garba: sound that carries across the ground, lighting that keeps the circle visible.',
      gu: 'નવ રાત ગરબા: આખા મેદાનમાં પહોંચતો સાઉન્ડ, અને ગોળ ફરતું વર્તુળ દેખાય એવી લાઇટિંગ.',
    },
    icon: 'dj',
    isActive: true,
  },
  {
    slug: 'political-government',
    name: { en: 'Political & Government', gu: 'રાજકીય અને સરકારી' },
    blurb: {
      en: 'Sabha, rally and inauguration setups with delay towers, VIP seating and a same-day turnaround.',
      gu: 'સભા, રેલી અને ઉદ્ઘાટન — ડિલે ટાવર, VIP બેઠક અને એક જ દિવસમાં તૈયાર.',
    },
    icon: 'stage',
    isActive: true,
  },
  {
    slug: 'corporate-school',
    name: { en: 'Corporate & School', gu: 'કોર્પોરેટ અને શાળા' },
    blurb: {
      en: 'Annual days, prize functions, launches and exhibitions — on a schedule that respects the programme.',
      gu: 'વાર્ષિકોત્સવ, ઇનામ વિતરણ, લોન્ચ અને પ્રદર્શન — કાર્યક્રમના સમયપત્રકને માન આપતું આયોજન.',
    },
    icon: 'event',
    isActive: true,
  },
  {
    slug: 'social-community',
    name: { en: 'Social & Community', gu: 'સામાજિક અને સમાજ' },
    blurb: {
      en: 'Samuh lagan, samaj melavdo, besnu and anniversaries — the same care at 5,000 guests or at 50.',
      gu: 'સમૂહ લગ્ન, સમાજ મેળાવડો, બેસણું અને વર્ષગાંઠ — 5,000 હોય કે 50, કાળજી એક સરખી.',
    },
    icon: 'chair',
    isActive: true,
  },
];

export const activeEventTypes = eventTypes.filter((e) => e.isActive);

export function eventTypePath(slug: string): string {
  return `/events/${slug}`;
}
