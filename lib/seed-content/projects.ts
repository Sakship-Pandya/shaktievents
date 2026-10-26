import type { Localized } from '../services';

/**
 * Sample portfolio rows so the admin tables, filters and relation pickers are
 * not empty on day one, and so the public template can be exercised.
 *
 * They are seeded as DRAFT and never published — the client replaces them with
 * real events and photographs. Every figure is a round sample number, not a
 * claim about work done, and the covers are the generated placeholders from
 * scripts/generate-placeholders.mjs, flagged isPlaceholder so they can be swept
 * before launch.
 */
export type SeedProject = {
  slug: string;
  title: Localized;
  eventTypeSlug: string;
  areaSlug: string;
  serviceSlugs: string[];
  guests: number;
  days: number;
  areaSqft: number;
  venue: string;
  /** ISO date. Sample events are dated in the recent past. */
  eventDate: string;
  brief: Localized;
  did: { en: string[]; gu: string[] };
  clientQuote: Localized | null;
  clientName: string | null;
  /** 1-based placeholder file numbers. */
  cover: number;
  gallery: number[];
  beforeAfter: [number, number] | null;
};

export const sampleProjects: SeedProject[] = [
  {
    slug: 'sample-wedding-mandap-wadhwan',
    title: { en: 'Sample — wedding mandap, Wadhwan', gu: 'નમૂનો — લગ્ન મંડપ, વઢવાણ' },
    eventTypeSlug: 'weddings',
    areaSlug: 'wadhwan',
    serviceSlugs: [
      'wedding-mandap-decoration-surendranagar',
      'stage-backdrop-decoration-surendranagar',
      'lighting-illumination-surendranagar',
    ],
    guests: 800,
    days: 3,
    areaSqft: 9000,
    venue: 'Sample venue',
    eventDate: '2026-02-14',
    brief: {
      en: 'A three-day wedding on a private ground, with the haldi and sangeet under the same cover as the vidhi. This is a sample record showing how a project reads once it is filled in.',
      gu: 'ખાનગી મેદાનમાં ત્રણ દિવસનાં લગ્ન, હળદી અને સંગીત વિધિ જેવા જ કવર નીચે. આ નમૂનારૂપ નોંધ છે, જે બતાવે છે કે ભરાયા પછી પ્રોજેક્ટ કેવો દેખાય છે.',
    },
    did: {
      en: [
        'Vidhi mandap with a fresh floral canopy',
        'Stage and backdrop with a floral wall',
        'Warm lighting across the mandap and dining area',
        'Ground reset between the haldi, sangeet and vidhi',
      ],
      gu: [
        'તાજા ફૂલોની છત સાથે વિધિ મંડપ',
        'ફૂલોની દીવાલ સાથે સ્ટેજ અને બેકડ્રોપ',
        'મંડપ અને જમણની જગ્યા પર ગરમ લાઇટિંગ',
        'હળદી, સંગીત અને વિધિ વચ્ચે મેદાનની ફેરગોઠવણ',
      ],
    },
    clientQuote: null,
    clientName: null,
    cover: 1,
    gallery: [1, 2, 5],
    beforeAfter: [7, 8],
  },
  {
    slug: 'sample-bhagwat-katha-limbdi',
    title: { en: 'Sample — Bhagwat Katha pandal, Limbdi', gu: 'નમૂનો — ભાગવત કથા પંડાલ, લીંબડી' },
    eventTypeSlug: 'religious-katha',
    areaSlug: 'limbdi',
    serviceSlugs: [
      'german-hanger-pandal-tent-surendranagar',
      'sound-system-pa-service-surendranagar',
      'furniture-seating-rental-surendranagar',
    ],
    guests: 2500,
    days: 7,
    areaSqft: 22000,
    venue: 'Sample ground',
    eventDate: '2026-01-08',
    brief: {
      en: 'A week of daily katha sessions under a clear-span hanger, with the same setup standing throughout and checked before each day. Sample record.',
      gu: 'ક્લિયર-સ્પાન હેંગર નીચે અઠવાડિયા સુધી રોજની કથા, એ જ સેટઅપ આખો સમય ઊભું અને દરેક દિવસ પહેલાં ચકાસાયેલું. નમૂનારૂપ નોંધ.',
    },
    did: {
      en: [
        '25 m clear-span hanger with side walls',
        'Line array with delay towers down the length',
        'Ground seating with carpets and bolsters',
        'Daily soundcheck before each session',
      ],
      gu: [
        'બાજુની દીવાલો સાથે 25 મીટર ક્લિયર-સ્પાન હેંગર',
        'લંબાઈમાં ડિલે ટાવર સાથે લાઇન એરે',
        'કાર્પેટ અને તકિયા સાથે નીચે બેઠક',
        'દરેક સત્ર પહેલાં રોજનો સાઉન્ડચેક',
      ],
    },
    clientQuote: null,
    clientName: null,
    cover: 2,
    gallery: [2, 5],
    beforeAfter: null,
  },
  {
    slug: 'sample-navratri-garba-surendranagar',
    title: {
      en: 'Sample — Navratri garba ground, Surendranagar',
      gu: 'નમૂનો — નવરાત્રિ ગરબા મેદાન, સુરેન્દ્રનગર',
    },
    eventTypeSlug: 'navratri-garba',
    areaSlug: 'surendranagar',
    serviceSlugs: [
      'dj-music-lighting-surendranagar',
      'sound-system-pa-service-surendranagar',
      'lighting-illumination-surendranagar',
    ],
    guests: 3000,
    days: 9,
    areaSqft: 30000,
    venue: 'Sample ground',
    eventDate: '2025-10-02',
    brief: {
      en: 'Nine nights of garba on an open ground, with sound placed around the circle rather than at one end. Sample record.',
      gu: 'ખુલ્લા મેદાનમાં નવ રાત ગરબા, અને સાઉન્ડ એક છેડે નહીં પણ વર્તુળની ફરતે. નમૂનારૂપ નોંધ.',
    },
    did: {
      en: [
        'Speaker stacks placed around the full circle',
        'Lighting bright enough for dancers to see their footing',
        'Dhol-tasha mixed live each night',
        'Rig left standing and checked before each night',
      ],
      gu: [
        'આખા વર્તુળે ફરતે ગોઠવેલા સ્પીકર',
        'રમનારને પગ દેખાય એટલી લાઇટ',
        'દરરોજ રાત્રે લાઇવ ઢોલ-તાશા મિક્સિંગ',
        'સિસ્ટમ ઊભી રહી અને દરેક રાત પહેલાં ચકાસાઈ',
      ],
    },
    clientQuote: null,
    clientName: null,
    cover: 3,
    gallery: [3, 5],
    beforeAfter: null,
  },
  {
    slug: 'sample-samuh-lagan-dhrangadhra',
    title: { en: 'Sample — samuh lagan, Dhrangadhra', gu: 'નમૂનો — સમૂહ લગ્ન, ધ્રાંગધ્રા' },
    eventTypeSlug: 'social-community',
    areaSlug: 'dhrangadhra',
    serviceSlugs: [
      'german-hanger-pandal-tent-surendranagar',
      'catering-counter-setup-surendranagar',
      'generator-power-cooling-surendranagar',
    ],
    guests: 5000,
    days: 1,
    areaSqft: 40000,
    venue: 'Sample ground',
    eventDate: '2026-02-22',
    brief: {
      en: 'A single-day samuh lagan for five thousand guests, where the catering flow mattered more than the decoration. Sample record.',
      gu: 'પાંચ હજાર મહેમાનો માટે એક દિવસનું સમૂહ લગ્ન, જ્યાં સજાવટ કરતાં જમણનો પ્રવાહ વધુ મહત્ત્વનો હતો. નમૂનારૂપ નોંધ.',
    },
    did: {
      en: [
        '30 m clear-span hanger over the seating',
        'Catering counters split into islands to avoid one queue',
        'Silent DG sized against the full load',
        'Mist fans along the open sides',
      ],
      gu: [
        'બેઠક ઉપર 30 મીટર ક્લિયર-સ્પાન હેંગર',
        'એક જ લાઇન ન બને એ માટે અલગ ટાપુમાં કેટરિંગ કાઉન્ટર',
        'પૂરા લોડ પ્રમાણે સાઇલન્ટ DG',
        'ખુલ્લી બાજુઓ પર મિસ્ટ ફેન',
      ],
    },
    clientQuote: null,
    clientName: null,
    cover: 4,
    gallery: [4, 2],
    beforeAfter: null,
  },
  {
    slug: 'sample-political-sabha-chotila',
    title: { en: 'Sample — public sabha stage, Chotila', gu: 'નમૂનો — જાહેર સભાનું સ્ટેજ, ચોટીલા' },
    eventTypeSlug: 'political-government',
    areaSlug: 'chotila',
    serviceSlugs: [
      'stage-backdrop-decoration-surendranagar',
      'sound-system-pa-service-surendranagar',
      'generator-power-cooling-surendranagar',
    ],
    guests: 4000,
    days: 1,
    areaSqft: 25000,
    venue: 'Sample ground',
    eventDate: '2025-12-11',
    brief: {
      en: 'A public sabha with a same-day turnaround, where the speaker order changed twice during the afternoon. Sample record.',
      gu: 'એક જ દિવસમાં તૈયાર થયેલી જાહેર સભા, જ્યાં બપોરે વક્તાઓનો ક્રમ બે વાર બદલાયો. નમૂનારૂપ નોંધ.',
    },
    did: {
      en: [
        'Raised stage with a printed backdrop',
        'Delay towers down a long ground',
        'Podium mics set for a shared lectern',
        'Generator with a planned changeover',
      ],
      gu: [
        'પ્રિન્ટેડ બેકડ્રોપ સાથે ઊંચું સ્ટેજ',
        'લાંબા મેદાનમાં ડિલે ટાવર',
        'સહિયારા પોડિયમ માટે ગોઠવેલા માઇક',
        'નક્કી કરેલા ચેન્જઓવર સાથે જનરેટર',
      ],
    },
    clientQuote: null,
    clientName: null,
    cover: 5,
    gallery: [5, 6],
    beforeAfter: null,
  },
  {
    slug: 'sample-school-annual-day-sayla',
    title: { en: 'Sample — school annual day, Sayla', gu: 'નમૂનો — શાળાનો વાર્ષિકોત્સવ, સાયલા' },
    eventTypeSlug: 'corporate-school',
    areaSlug: 'sayla',
    serviceSlugs: [
      'stage-backdrop-decoration-surendranagar',
      'sound-system-pa-service-surendranagar',
      'furniture-seating-rental-surendranagar',
    ],
    guests: 1200,
    days: 1,
    areaSqft: 12000,
    venue: 'Sample school ground',
    eventDate: '2025-12-20',
    brief: {
      en: 'An annual day with a fixed programme, where the setup had to fit around rehearsals running until the afternoon. Sample record.',
      gu: 'નક્કી કાર્યક્રમ સાથે વાર્ષિકોત્સવ, જ્યાં બપોર સુધી ચાલતી રિહર્સલની આસપાસ સેટઅપ ગોઠવવું પડ્યું. નમૂનારૂપ નોંધ.',
    },
    did: {
      en: [
        'Stage with steps and a side ramp',
        'Theatre seating with wide aisles',
        'Wireless mics for compere and performers',
        'Setup worked around the rehearsal schedule',
      ],
      gu: [
        'પગથિયાં અને બાજુના રેમ્પ સાથે સ્ટેજ',
        'પહોળા માર્ગ સાથે થિયેટર બેઠક',
        'સંચાલક અને કલાકારો માટે વાયરલેસ માઇક',
        'રિહર્સલના સમયપત્રકની આસપાસ ગોઠવાયેલું સેટઅપ',
      ],
    },
    clientQuote: null,
    clientName: null,
    cover: 6,
    gallery: [6, 5],
    beforeAfter: null,
  },
];

/** Placeholder files written by scripts/generate-placeholders.mjs. */
export const placeholderMedia = [
  { n: 1, alt: 'Placeholder image for a wedding mandap setup' },
  { n: 2, alt: 'Placeholder image for a katha pandal' },
  { n: 3, alt: 'Placeholder image for a garba ground' },
  { n: 4, alt: 'Placeholder image for a samuh lagan' },
  { n: 5, alt: 'Placeholder image for a sabha stage' },
  { n: 6, alt: 'Placeholder image for a school function' },
  { n: 7, alt: 'Placeholder image, before the setup' },
  { n: 8, alt: 'Placeholder image, after the setup' },
];

export function placeholderPath(n: number): string {
  return `/placeholders/placeholder-${String(n).padStart(2, '0')}.jpg`;
}

export function placeholderPublicId(n: number): string {
  return `placeholder-${String(n).padStart(2, '0')}`;
}
