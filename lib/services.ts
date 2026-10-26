import type { ServiceIconName } from '@/components/brand/icons';
import type { Locale } from '@/i18n/routing';

/**
 * The service catalogue. This is a stand-in for the `Service` table that
 * arrives in step 2 — the shape deliberately mirrors the Prisma model
 * (slug + name_en/name_gu + summary + order + isActive) so the migration is
 * a straight copy. Slugs carry the primary keyword and must never change
 * once indexed; retire a service with `isActive: false`, never by deleting.
 */
export type Localized = { en: string; gu: string };

export type ServiceSummary = {
  slug: string;
  name: Localized;
  /** Short label for nav and chips, where the full name is too long. */
  short: Localized;
  summary: Localized;
  icon: ServiceIconName;
  featured: boolean;
  isActive: boolean;
};

export const services: ServiceSummary[] = [
  {
    slug: 'wedding-mandap-decoration-surendranagar',
    name: { en: 'Wedding Mandap & Vidhi Mandap', gu: 'લગ્ન મંડપ અને વિધિ મંડપ' },
    short: { en: 'Wedding mandap', gu: 'લગ્ન મંડપ' },
    summary: {
      en: 'Chauri, canopy, fabric and flowers built around your vidhi — with room left for the photographer.',
      gu: 'ચોરી, છત, કાપડ અને ફૂલ — તમારી વિધિ પ્રમાણે, અને ફોટોગ્રાફર માટે પૂરતી જગ્યા સાથે.',
    },
    icon: 'mandap',
    featured: true,
    isActive: true,
  },
  {
    slug: 'german-hanger-pandal-tent-surendranagar',
    name: { en: 'German Hanger, Pagoda & Pandal', gu: 'જર્મન હેંગર, પેગોડા અને પંડાલ' },
    short: { en: 'German hanger', gu: 'જર્મન હેંગર' },
    summary: {
      en: 'Waterproof clear-span structures from 15m to 30m — no centre poles, for 500 to 10,000 guests.',
      gu: '15થી 30 મીટરના વોટરપ્રૂફ ક્લિયર-સ્પાન સ્ટ્રક્ચર — વચ્ચે થાંભલા વગર, 500થી 10,000 મહેમાનો માટે.',
    },
    icon: 'hanger',
    featured: true,
    isActive: true,
  },
  {
    slug: 'sound-system-pa-service-surendranagar',
    name: { en: 'Sound System & PA Service', gu: 'સાઉન્ડ સિસ્ટમ અને PA સર્વિસ' },
    short: { en: 'Sound & PA', gu: 'સાઉન્ડ અને PA' },
    summary: {
      en: 'Line array, delay towers and wireless mics — with an engineer on the console, not just an operator.',
      gu: 'લાઇન એરે, ડિલે ટાવર અને વાયરલેસ માઇક — કન્સોલ પર ખાલી ઓપરેટર નહીં, સાઉન્ડ એન્જિનિયર.',
    },
    icon: 'speaker',
    featured: true,
    isActive: true,
  },
  {
    slug: 'dj-music-lighting-surendranagar',
    name: { en: 'DJ & Music', gu: 'DJ અને મ્યુઝિક' },
    short: { en: 'DJ & music', gu: 'DJ અને મ્યુઝિક' },
    summary: {
      en: 'Garba-ready sound with dhol-tasha mixing, and lights cued to the beat instead of running on a loop.',
      gu: 'ગરબા માટે તૈયાર સાઉન્ડ, ઢોલ-તાશા મિક્સિંગ સાથે — અને બીટ પ્રમાણે ચાલતી લાઇટ.',
    },
    icon: 'dj',
    featured: true,
    isActive: true,
  },
  {
    slug: 'stage-backdrop-decoration-surendranagar',
    name: { en: 'Stage & Backdrop Decoration', gu: 'સ્ટેજ અને બેકડ્રોપ ડેકોરેશન' },
    short: { en: 'Stage & backdrop', gu: 'સ્ટેજ અને બેકડ્રોપ' },
    summary: {
      en: '3D panels, floral walls and LED backdrops, on a stage built at a height that photographs well.',
      gu: '3D પેનલ, ફૂલોની દીવાલ અને LED બેકડ્રોપ — ફોટામાં સારું લાગે એવી ઊંચાઈના સ્ટેજ પર.',
    },
    icon: 'stage',
    featured: true,
    isActive: true,
  },
  {
    slug: 'flower-floral-decoration-surendranagar',
    name: { en: 'Flower & Floral Decoration', gu: 'ફૂલ અને ફ્લોરલ ડેકોરેશન' },
    short: { en: 'Floral work', gu: 'ફૂલ સજાવટ' },
    summary: {
      en: 'Fresh marigold and rose work for the vidhi, or artificial that still looks new on day three.',
      gu: 'વિધિ માટે તાજા ગલગોટા અને ગુલાબનું કામ, અથવા ત્રીજા દિવસે પણ નવું લાગે એવું આર્ટિફિશિયલ.',
    },
    icon: 'flower',
    featured: false,
    isActive: true,
  },
  {
    slug: 'lighting-illumination-surendranagar',
    name: { en: 'Lighting & Illumination', gu: 'લાઇટિંગ અને રોશની' },
    short: { en: 'Lighting', gu: 'લાઇટિંગ' },
    summary: {
      en: 'Façade lighting, pixel LED and sharpy — with the whole baraat route lit from the gate to the mandap.',
      gu: 'ફસાડ લાઇટિંગ, પિક્સેલ LED અને શાર્પી — ગેટથી મંડપ સુધીનો આખો વરઘોડાનો રસ્તો રોશન.',
    },
    icon: 'light',
    featured: true,
    isActive: true,
  },
  {
    slug: 'themed-decoration-surendranagar',
    name: { en: 'Themed Decoration', gu: 'થીમ ડેકોરેશન' },
    short: { en: 'Themes', gu: 'થીમ' },
    summary: {
      en: 'Rajwadi, Kathiawadi, floral, rustic or minimal — chosen to suit your venue, not picked off a catalogue.',
      gu: 'રજવાડી, કાઠિયાવાડી, ફ્લોરલ, રસ્ટિક કે મિનિમલ — કેટલોગમાંથી નહીં, તમારી જગ્યા પ્રમાણે.',
    },
    icon: 'theme',
    featured: false,
    isActive: true,
  },
  {
    slug: 'furniture-seating-rental-surendranagar',
    name: { en: 'Furniture, Seating & Crockery', gu: 'ફર્નિચર, બેઠક અને ક્રોકરી' },
    short: { en: 'Furniture', gu: 'ફર્નિચર' },
    summary: {
      en: 'Chiavari chairs, VIP sofa sets, round tables and carpets — counted and cleaned before they load.',
      gu: 'શિવારી ખુરશી, VIP સોફા સેટ, રાઉન્ડ ટેબલ અને કાર્પેટ — ગણીને અને સાફ કરીને જ ગાડીમાં ચઢે.',
    },
    icon: 'chair',
    featured: false,
    isActive: true,
  },
  {
    slug: 'catering-counter-setup-surendranagar',
    name: { en: 'Catering Counters & Food Stalls', gu: 'કેટરિંગ કાઉન્ટર અને ફૂડ સ્ટોલ' },
    short: { en: 'Catering setup', gu: 'કેટરિંગ સેટઅપ' },
    summary: {
      en: 'Live counter layouts and buffet flow that keeps a 1,000-guest line moving instead of bunching.',
      gu: 'લાઇવ કાઉન્ટરની ગોઠવણ અને બુફે લેઆઉટ — 1,000 મહેમાનોની લાઇન ભીડ વગર ચાલતી રહે.',
    },
    icon: 'catering',
    featured: false,
    isActive: true,
  },
  {
    slug: 'generator-power-cooling-surendranagar',
    name: { en: 'Generator, Power & Cooling', gu: 'જનરેટર, પાવર અને કૂલિંગ' },
    short: { en: 'Power & cooling', gu: 'પાવર અને કૂલિંગ' },
    summary: {
      en: 'Silent DG sized to your load, cabling, mist fans and AC pandals — power that never blinks mid-vidhi.',
      gu: 'લોડ પ્રમાણે સાઇલન્ટ DG, કેબલિંગ, મિસ્ટ ફેન અને AC પંડાલ — વિધિ વચ્ચે લાઇટ ન જાય.',
    },
    icon: 'generator',
    featured: false,
    isActive: true,
  },
  {
    slug: 'entry-gate-passage-decoration-surendranagar',
    name: { en: 'Entry, Gate & Passage Decoration', gu: 'એન્ટ્રી, ગેટ અને પેસેજ ડેકોરેશન' },
    short: { en: 'Gates & passages', gu: 'ગેટ અને પેસેજ' },
    summary: {
      en: 'The gate, walkway and passage set the tone for the whole function before a guest ever sits down.',
      gu: 'ગેટ, રસ્તો અને પેસેજ — મહેમાન બેસે એ પહેલાં જ આખા પ્રસંગનો માહોલ બાંધી દે છે.',
    },
    icon: 'gate',
    featured: false,
    isActive: true,
  },
  {
    slug: 'baraat-varghodo-setup-surendranagar',
    name: { en: 'Baraat & Varghodo Setup', gu: 'જાન અને વરઘોડા સેટઅપ' },
    short: { en: 'Baraat setup', gu: 'વરઘોડો' },
    summary: {
      en: 'Sound trolley, lighting trolley and dhol coordination, walked and timed with the route beforehand.',
      gu: 'સાઉન્ડ ટ્રોલી, લાઇટિંગ ટ્રોલી અને ઢોલનું સંકલન — રસ્તો પહેલેથી ચાલીને, સમય ગોઠવીને.',
    },
    icon: 'dhol',
    featured: false,
    isActive: true,
  },
  {
    slug: 'complete-event-management-surendranagar',
    name: { en: 'Complete Event Management', gu: 'સંપૂર્ણ ઇવેન્ટ મેનેજમેન્ટ' },
    short: { en: 'Turnkey events', gu: 'સંપૂર્ણ ઇવેન્ટ' },
    summary: {
      en: 'One contact, one timeline, one crew — from the first site visit to the last truck leaving the ground.',
      gu: 'એક સંપર્ક, એક ટાઇમલાઇન, એક ટીમ — પહેલી સાઇટ વિઝિટથી છેલ્લી ગાડી નીકળે ત્યાં સુધી.',
    },
    icon: 'event',
    featured: true,
    isActive: true,
  },
];

export const activeServices = services.filter((s) => s.isActive);
export const featuredServices = activeServices.filter((s) => s.featured);

export function servicePath(slug: string): string {
  return `/services/${slug}`;
}

/** Picks the copy for the current locale. Falls back to English if a translation is missing. */
export function t(value: Localized, locale: Locale): string {
  return value[locale] || value.en;
}
