import type { Locale } from '@/i18n/routing';
import { workPhotoData, type WorkPhotoSlug } from './work-photos-data';

/**
 * The client's own event photographs, imported by scripts/import-work-photos.mjs.
 *
 * Unlike project media these are not tied to a named event, so nothing here
 * claims a town, a date or a guest count — the alt text describes what is in
 * the frame and nothing more. Pages pick photographs by slug (a hero) or by tag
 * (a gallery), so replacing a file or re-tagging it never needs a page edit.
 */
export type { WorkPhotoSlug };

export const workTags = [
  'mandap',
  'stage',
  'entrance',
  'seating',
  'dining',
  'pandal',
  'haldi',
  'lighting',
  'floral',
  'themed',
  'lawn',
  'banquet',
  'night',
] as const;
export type WorkTag = (typeof workTags)[number];

type Entry = { en: string; gu: string; tags: WorkTag[] };

const catalogue: Record<WorkPhotoSlug, Entry> = {
  'teal-frame-canopy-dining': {
    en: 'Open-sided canopy with a teal frame and ivory drapes over the dining tables',
    gu: 'ટીલ ફ્રેમ અને આઇવરી પડદા સાથેનો ખુલ્લો કેનોપી, નીચે જમણનાં ટેબલ',
    tags: ['pandal', 'dining', 'lawn'],
  },
  'floral-arch-stage-pink': {
    en: 'Reception stage with a white floral arch, pink lattice panels and a cream sofa',
    gu: 'સફેદ ફૂલોની કમાન, ગુલાબી જાળી પેનલ અને ક્રીમ સોફા સાથેનું રિસેપ્શન સ્ટેજ',
    tags: ['stage', 'floral'],
  },
  'banquet-aisle-floral-stage': {
    en: 'Red-carpet aisle in a banquet hall leading to a floral arch stage',
    gu: 'બેન્ક્વેટ હૉલમાં ફૂલોની કમાનવાળા સ્ટેજ સુધી જતો લાલ કાર્પેટ માર્ગ',
    tags: ['stage', 'entrance', 'banquet'],
  },
  'banquet-aisle-guests': {
    en: 'Guests seated along the red-carpet aisle before the reception stage',
    gu: 'રિસેપ્શન સ્ટેજ સામે લાલ કાર્પેટ માર્ગની બંને બાજુ બેઠેલા મહેમાનો',
    tags: ['stage', 'seating', 'banquet'],
  },
  'draped-pandal-string-lights': {
    en: 'Pandal ceiling of pastel drapes and string lights over an open floor',
    gu: 'ખુલ્લા મેદાન ઉપર પેસ્ટલ પડદા અને સિરીઝ લાઇટવાળી પંડાલની છત',
    tags: ['pandal', 'lighting'],
  },
  'colour-drape-lounge': {
    en: 'Colourful drape ceiling over a low lounge with a wooden frame',
    gu: 'લાકડાની ફ્રેમ અને નીચી બેઠક ઉપર રંગબેરંગી પડદાની છત',
    tags: ['pandal', 'haldi', 'seating'],
  },
  'draped-pandal-hall': {
    en: 'Pandal hall with a colourful fabric ceiling',
    gu: 'રંગીન કાપડની છતવાળો પંડાલ હૉલ',
    tags: ['pandal'],
  },
  'hanger-sofa-lounge': {
    en: 'Large pandal with striped drapes and rows of white sofas on the lawn',
    gu: 'પટ્ટાવાળા પડદા અને લૉન પર સફેદ સોફાની હરોળ સાથેનો મોટો પંડાલ',
    tags: ['pandal', 'seating', 'lawn'],
  },
  'floor-seating-bolsters': {
    en: 'Floor seating with bolsters under a bright drape ceiling',
    gu: 'રંગીન પડદાની છત નીચે તકિયા સાથે નીચે બેઠક',
    tags: ['haldi', 'seating', 'pandal'],
  },
  'venue-walkway-flowers': {
    en: 'Carpeted walkway lined with flower stands under a chandelier',
    gu: 'ઝુમ્મર નીચે ફૂલોનાં સ્ટેન્ડ સાથેનો કાર્પેટવાળો માર્ગ',
    tags: ['entrance', 'floral'],
  },
  'lawn-seating-carpet-aisle': {
    en: 'Lawn seating in two blocks either side of a patterned carpet aisle',
    gu: 'ભાતવાળા કાર્પેટ માર્ગની બંને બાજુ લૉન પર બેઠક',
    tags: ['seating', 'lawn'],
  },
  'peacock-theme-stage': {
    en: 'Peacock-themed stage with blossom trees on the lawn',
    gu: 'લૉન પર ફૂલોનાં ઝાડ સાથે મોર થીમ સ્ટેજ',
    tags: ['stage', 'themed', 'floral', 'lawn'],
  },
  'poolside-floral-walkway': {
    en: 'Floral walkway and arch built across a garden pond',
    gu: 'બગીચાના તળાવ પર બનાવેલો ફૂલોનો માર્ગ અને કમાન',
    tags: ['entrance', 'floral', 'lawn'],
  },
  'poolside-walkway-yellow': {
    en: 'Pond walkway with a yellow carpet and a floral arch',
    gu: 'પીળા કાર્પેટ અને ફૂલોની કમાન સાથે તળાવ પરનો માર્ગ',
    tags: ['entrance', 'floral', 'lawn'],
  },
  'red-white-entry-stairs': {
    en: 'Red and white twin-staircase entry for the couple',
    gu: 'વર-કન્યા માટે લાલ-સફેદ બે સીડીવાળી એન્ટ્રી',
    tags: ['entrance', 'themed'],
  },
  'floral-ring-stage-dusk': {
    en: 'Rose ring backdrop, chandelier and white sofas at dusk',
    gu: 'સંધ્યાએ ગુલાબની રિંગ, ઝુમ્મર અને સફેદ સોફા સાથેનું સ્ટેજ',
    tags: ['stage', 'floral', 'lawn'],
  },
  'lawn-stage-evening': {
    en: 'Lit lawn stage with flower panels in the evening',
    gu: 'સાંજે ફૂલોની પેનલ સાથે પ્રકાશિત લૉન સ્ટેજ',
    tags: ['stage', 'lighting', 'lawn'],
  },
  'floral-wall-stage-lawn': {
    en: 'Floral wall stage with a teal carpet walkway',
    gu: 'ટીલ કાર્પેટ માર્ગ સાથે ફૂલોની દીવાલવાળું સ્ટેજ',
    tags: ['stage', 'floral', 'lawn'],
  },
  'gold-dining-table': {
    en: 'Gold chairs around a glass dining table on a patterned carpet',
    gu: 'ભાતવાળા કાર્પેટ પર કાચના ટેબલ ફરતે સોનેરી ખુરશીઓ',
    tags: ['dining'],
  },
  'floral-stage-sunset': {
    en: 'Floral stage with a rose ring and a carpet aisle at sunset',
    gu: 'સૂર્યાસ્તે ગુલાબની રિંગ અને કાર્પેટ માર્ગ સાથેનું ફૂલોનું સ્ટેજ',
    tags: ['stage', 'floral', 'lawn'],
  },
  'lawn-dining-teal': {
    en: 'Round tables in teal and white spread across a lawn',
    gu: 'લૉન પર ટીલ અને સફેદ ગોળ ટેબલ',
    tags: ['dining', 'lawn'],
  },
  'lawn-round-tables-dusk': {
    en: 'Teal round tables with flower centrepieces at dusk',
    gu: 'સંધ્યાએ ફૂલોની સજાવટ સાથે ટીલ ગોળ ટેબલ',
    tags: ['dining', 'lawn'],
  },
  'banquet-stage-pampas': {
    en: 'Banquet hall stage with pampas grass along the aisle',
    gu: 'માર્ગ પર પમ્પાસ ઘાસ સાથે બેન્ક્વેટ હૉલનું સ્ટેજ',
    tags: ['stage', 'banquet', 'floral'],
  },
  'night-entrance-gate': {
    en: 'Yellow entrance gate and lit passage at night',
    gu: 'રાત્રે પીળો પ્રવેશદ્વાર અને પ્રકાશિત માર્ગ',
    tags: ['entrance', 'lighting', 'night'],
  },
  'fairy-light-tunnel': {
    en: 'Drape tunnel strung with fairy lights',
    gu: 'ફેરી લાઇટથી શણગારેલી પડદાની ટનલ',
    tags: ['entrance', 'lighting', 'night'],
  },
  'purple-lit-entrance': {
    en: 'Purple-lit drape passage with a mandala carpet',
    gu: 'મંડલા કાર્પેટ સાથે જાંબલી પ્રકાશવાળો પડદાનો માર્ગ',
    tags: ['entrance', 'lighting', 'night'],
  },
  'ivory-drape-gate-night': {
    en: 'Ivory drape gate over a paved path at night',
    gu: 'રાત્રે પાકા રસ્તા પર આઇવરી પડદાનો દરવાજો',
    tags: ['entrance', 'night'],
  },
  'drape-tunnel-chandeliers': {
    en: 'Drape tunnel with chandeliers, gold lanterns and a mandala carpet',
    gu: 'ઝુમ્મર, સોનેરી ફાનસ અને મંડલા કાર્પેટ સાથે પડદાની ટનલ',
    tags: ['entrance', 'lighting', 'night'],
  },
  'lit-garden-entrance': {
    en: 'Fairy-lit garden entrance between palms',
    gu: 'તાડનાં વૃક્ષો વચ્ચે ફેરી લાઇટવાળો બગીચાનો પ્રવેશ',
    tags: ['entrance', 'lighting', 'night'],
  },
  'night-lawn-dining': {
    en: 'Dining tables laid across a floodlit lawn at night',
    gu: 'રાત્રે ફ્લડલાઇટવાળી લૉન પર જમણનાં ટેબલ',
    tags: ['dining', 'lawn', 'night'],
  },
  'night-lawn-lounge': {
    en: 'Sofa lounge and chevron walkway on a floodlit lawn',
    gu: 'ફ્લડલાઇટવાળી લૉન પર સોફા લાઉન્જ અને ઝિગઝેગ માર્ગ',
    tags: ['seating', 'lawn', 'night'],
  },
  'venue-lawn-sofa-rows': {
    en: 'Rows of white sofas facing the ceremony area',
    gu: 'વિધિની જગ્યા સામે સફેદ સોફાની હરોળ',
    tags: ['seating', 'lawn'],
  },
  'floral-hanging-corridor': {
    en: 'Corridor of hanging flowers, printed panels and lanterns',
    gu: 'લટકતાં ફૂલો, છાપેલી પેનલ અને ફાનસવાળી પરસાળ',
    tags: ['entrance', 'floral', 'themed'],
  },
  'poolside-lounge-day': {
    en: 'White sofa lounge beside a rose-petal pond',
    gu: 'ગુલાબની પાંખડીવાળા તળાવ પાસે સફેદ સોફા લાઉન્જ',
    tags: ['seating', 'lawn'],
  },
  'lotus-seat-floral-ring': {
    en: 'Lotus seat before a floral ring and chandeliers',
    gu: 'ફૂલોની રિંગ અને ઝુમ્મર સામે કમળ આકારની બેઠક',
    tags: ['stage', 'floral', 'themed'],
  },
  'haldi-stage-yellow': {
    en: 'Yellow haldi stage with floral triangle panels',
    gu: 'ફૂલોની ત્રિકોણ પેનલ સાથે પીળું હળદી સ્ટેજ',
    tags: ['haldi', 'stage'],
  },
  'poolside-vidhi-seating': {
    en: 'Red vidhi platform and guest seating beside a pond',
    gu: 'તળાવ પાસે લાલ વિધિ મંચ અને મહેમાનોની બેઠક',
    tags: ['mandap', 'seating', 'lawn'],
  },
  'ceremony-chair-rows': {
    en: 'Pink and yellow chair rows facing a mandap on the lawn',
    gu: 'લૉન પર મંડપ સામે ગુલાબી અને પીળી ખુરશીઓની હરોળ',
    tags: ['seating', 'lawn'],
  },
  'haldi-stage-lights': {
    en: 'Haldi stage with a triangle of lights and marigold panels',
    gu: 'લાઇટના ત્રિકોણ અને ગલગોટાની પેનલ સાથે હળદી સ્ટેજ',
    tags: ['haldi', 'stage', 'themed'],
  },
  'night-catering-counters': {
    en: 'Catering counters being set out on the ground at night',
    gu: 'રાત્રે મેદાનમાં ગોઠવાતાં કેટરિંગ કાઉન્ટર',
    tags: ['dining', 'night'],
  },
  'haldi-floral-arch': {
    en: 'Haldi backdrop with a floral arch and brass pots',
    gu: 'ફૂલોની કમાન અને પિત્તળના ઘડા સાથે હળદી બેકડ્રોપ',
    tags: ['haldi', 'floral'],
  },
  'truss-canopy-dusk': {
    en: 'Truss canopy with hanging lanterns over lawn seating at dusk',
    gu: 'સંધ્યાએ લૉન બેઠક ઉપર લટકતાં ફાનસ સાથે ટ્રસ કેનોપી',
    tags: ['pandal', 'lighting', 'lawn'],
  },
  'banquet-gold-table': {
    en: 'Gold round table with white chairs in a banquet hall',
    gu: 'બેન્ક્વેટ હૉલમાં સફેદ ખુરશીઓ સાથે સોનેરી ગોળ ટેબલ',
    tags: ['dining', 'banquet'],
  },
  'banquet-stage-globes': {
    en: 'Banquet stage with globe lamps and a blossom-lined aisle',
    gu: 'ગ્લોબ લેમ્પ અને ફૂલોથી સજાવેલા માર્ગ સાથે બેન્ક્વેટ સ્ટેજ',
    tags: ['stage', 'banquet', 'floral'],
  },
  'hanger-dining-hall': {
    en: 'Dining tables with red chair covers under a large hanger',
    gu: 'મોટા હેંગર નીચે લાલ કવરવાળી ખુરશીઓ સાથે જમણનાં ટેબલ',
    tags: ['dining', 'pandal'],
  },
  'banquet-aisle-sofas': {
    en: 'Banquet hall aisle of sofas, globe lamps and blossoms',
    gu: 'સોફા, ગ્લોબ લેમ્પ અને ફૂલોવાળો બેન્ક્વેટ હૉલનો માર્ગ',
    tags: ['seating', 'banquet', 'entrance'],
  },
  'banquet-stage-gold': {
    en: 'Gold drape stage with a floral ring and a carved sofa',
    gu: 'ફૂલોની રિંગ અને કોતરણીવાળા સોફા સાથે સોનેરી પડદાનું સ્ટેજ',
    tags: ['stage', 'banquet', 'floral'],
  },
  'tent-lounge-chandelier': {
    en: 'Sheer tent lounge with a chandelier and white sofas',
    gu: 'ઝુમ્મર અને સફેદ સોફા સાથે પારદર્શક ટેન્ટ લાઉન્જ',
    tags: ['themed', 'seating'],
  },
  'banquet-aisle-lamps': {
    en: 'Lit carpet aisle between blue chairs and globe lamps',
    gu: 'વાદળી ખુરશીઓ અને ગ્લોબ લેમ્પ વચ્ચે પ્રકાશિત કાર્પેટ માર્ગ',
    tags: ['seating', 'banquet', 'lighting'],
  },
  'pink-pandal-ceremony': {
    en: 'Pink and white pandal with a red carpet to the stage',
    gu: 'સ્ટેજ સુધી લાલ કાર્પેટ સાથે ગુલાબી-સફેદ પંડાલ',
    tags: ['pandal', 'seating'],
  },
  'pink-drape-entrance': {
    en: 'Pink drape entrance with floral frames',
    gu: 'ફૂલોની ફ્રેમ સાથે ગુલાબી પડદાનો પ્રવેશ',
    tags: ['entrance', 'floral'],
  },
  'grand-ground-dusk': {
    en: 'Wedding ground at dusk with a mandap, tents and a raised stage',
    gu: 'સંધ્યાએ મંડપ, ટેન્ટ અને ઊંચા સ્ટેજ સાથેનું લગ્નનું મેદાન',
    tags: ['mandap', 'stage', 'night'],
  },
  'tent-lounge-portrait': {
    en: 'Sheer tent lounge on a mandala carpet',
    gu: 'મંડલા કાર્પેટ પર પારદર્શક ટેન્ટ લાઉન્જ',
    tags: ['themed', 'seating'],
  },
  'pink-pandal-aisle': {
    en: 'Pink pandal ceiling over chair rows and a red carpet',
    gu: 'ખુરશીઓની હરોળ અને લાલ કાર્પેટ ઉપર ગુલાબી પંડાલ છત',
    tags: ['pandal', 'seating'],
  },
  'mandap-venue-wide': {
    en: 'Mandap, lounges and seating across a wedding ground at dusk',
    gu: 'સંધ્યાએ લગ્નના મેદાનમાં મંડપ, લાઉન્જ અને બેઠક',
    tags: ['mandap', 'stage', 'night'],
  },
  'mandap-aisle-dusk': {
    en: 'Red carpet aisle leading to the lit mandap',
    gu: 'પ્રકાશિત મંડપ સુધી જતો લાલ કાર્પેટ માર્ગ',
    tags: ['mandap', 'entrance', 'night'],
  },
  'white-mandap-dusk': {
    en: 'White sculpted mandap lit up at dusk',
    gu: 'સંધ્યાએ પ્રકાશિત સફેદ શિલ્પ જેવો મંડપ',
    tags: ['mandap', 'floral', 'night'],
  },
};

export type WorkPhoto = {
  slug: WorkPhotoSlug;
  src: string;
  width: number;
  height: number;
  blur: string;
  alt: string;
  tags: WorkTag[];
};

export function workPhoto(slug: WorkPhotoSlug, locale: Locale): WorkPhoto {
  const data = workPhotoData[slug];
  const entry = catalogue[slug];
  return {
    slug,
    src: `/work/${slug}.jpg`,
    width: data.width,
    height: data.height,
    blur: data.blur,
    alt: locale === 'gu' ? entry.gu : entry.en,
    tags: entry.tags,
  };
}

/**
 * Display order for the full gallery: strongest frames first, and near-identical
 * pairs (the same venue shot twice) kept apart so the wall doesn't stutter.
 */
const galleryOrder: WorkPhotoSlug[] = [
  'white-mandap-dusk',
  'drape-tunnel-chandeliers',
  'peacock-theme-stage',
  'banquet-stage-gold',
  'haldi-stage-lights',
  'floral-wall-stage-lawn',
  'fairy-light-tunnel',
  'banquet-aisle-lamps',
  'lotus-seat-floral-ring',
  'mandap-aisle-dusk',
  'floral-arch-stage-pink',
  'purple-lit-entrance',
  'tent-lounge-chandelier',
  'floral-stage-sunset',
  'pink-pandal-ceremony',
  'banquet-stage-pampas',
  'night-entrance-gate',
  'haldi-floral-arch',
  'floral-hanging-corridor',
  'grand-ground-dusk',
  'hanger-sofa-lounge',
  'poolside-floral-walkway',
  'banquet-stage-globes',
  'red-white-entry-stairs',
  'lit-garden-entrance',
  'haldi-stage-yellow',
  'lawn-round-tables-dusk',
  'pink-drape-entrance',
  'banquet-aisle-floral-stage',
  'night-lawn-lounge',
  'floral-ring-stage-dusk',
  'tent-lounge-portrait',
  'poolside-vidhi-seating',
  'venue-walkway-flowers',
  'banquet-aisle-sofas',
  'truss-canopy-dusk',
  'lawn-stage-evening',
  'ceremony-chair-rows',
  'ivory-drape-gate-night',
  'gold-dining-table',
  'mandap-venue-wide',
  'colour-drape-lounge',
  'poolside-walkway-yellow',
  'banquet-gold-table',
  'pink-pandal-aisle',
  'lawn-seating-carpet-aisle',
  'night-lawn-dining',
  'teal-frame-canopy-dining',
  'draped-pandal-string-lights',
  'poolside-lounge-day',
  'banquet-aisle-guests',
  'floor-seating-bolsters',
  'lawn-dining-teal',
  'hanger-dining-hall',
  'venue-lawn-sofa-rows',
  'draped-pandal-hall',
  'night-catering-counters',
];

export function allWorkPhotos(locale: Locale): WorkPhoto[] {
  return galleryOrder.map((slug) => workPhoto(slug, locale));
}

/** Photographs carrying any of the tags, in gallery order. */
export function workPhotosTagged(tags: WorkTag[], locale: Locale, limit?: number): WorkPhoto[] {
  const matches = allWorkPhotos(locale).filter((photo) =>
    photo.tags.some((tag) => tags.includes(tag)),
  );
  return limit ? matches.slice(0, limit) : matches;
}

/** The gallery's filter chips. Each groups a few tags under one plain label. */
export const galleryCategories = [
  { key: 'stage', tags: ['mandap', 'stage'] },
  { key: 'entrance', tags: ['entrance'] },
  { key: 'seating', tags: ['seating', 'dining'] },
  { key: 'pandal', tags: ['pandal'] },
  { key: 'haldi', tags: ['haldi'] },
  { key: 'night', tags: ['night', 'lighting'] },
] as const satisfies readonly { key: string; tags: readonly WorkTag[] }[];

export type GalleryCategoryKey = (typeof galleryCategories)[number]['key'];

/** One cover and a gallery tag set per service. Unknown slugs fall back. */
const serviceMap: Record<string, { cover: WorkPhotoSlug; tags: WorkTag[] }> = {
  'wedding-mandap-decoration-surendranagar': { cover: 'white-mandap-dusk', tags: ['mandap'] },
  'german-hanger-pandal-tent-surendranagar': { cover: 'hanger-sofa-lounge', tags: ['pandal'] },
  'sound-system-pa-service-surendranagar': { cover: 'grand-ground-dusk', tags: ['night'] },
  'dj-music-lighting-surendranagar': { cover: 'purple-lit-entrance', tags: ['lighting'] },
  'stage-backdrop-decoration-surendranagar': { cover: 'floral-stage-sunset', tags: ['stage'] },
  'flower-floral-decoration-surendranagar': { cover: 'floral-arch-stage-pink', tags: ['floral'] },
  'lighting-illumination-surendranagar': { cover: 'fairy-light-tunnel', tags: ['lighting'] },
  'themed-decoration-surendranagar': { cover: 'peacock-theme-stage', tags: ['themed'] },
  'furniture-seating-rental-surendranagar': { cover: 'banquet-aisle-sofas', tags: ['seating'] },
  'catering-counter-setup-surendranagar': { cover: 'night-lawn-dining', tags: ['dining'] },
  'generator-power-cooling-surendranagar': { cover: 'night-lawn-lounge', tags: ['night'] },
  'entry-gate-passage-decoration-surendranagar': {
    cover: 'drape-tunnel-chandeliers',
    tags: ['entrance'],
  },
  'baraat-varghodo-setup-surendranagar': { cover: 'night-entrance-gate', tags: ['entrance'] },
  'complete-event-management-surendranagar': {
    cover: 'mandap-venue-wide',
    tags: ['mandap', 'stage'],
  },
};

export function servicePhotos(slug: string, locale: Locale, limit = 8) {
  const entry = serviceMap[slug] ?? { cover: 'banquet-stage-gold', tags: ['stage'] };
  return {
    cover: workPhoto(entry.cover, locale),
    gallery: workPhotosTagged(entry.tags, locale)
      .filter((photo) => photo.slug !== entry.cover)
      .slice(0, limit),
  };
}

const eventMap: Record<string, { cover: WorkPhotoSlug; tags: WorkTag[] }> = {
  weddings: { cover: 'mandap-aisle-dusk', tags: ['mandap', 'stage'] },
  'religious-katha': { cover: 'pink-pandal-ceremony', tags: ['pandal'] },
  'navratri-garba': { cover: 'lit-garden-entrance', tags: ['lighting', 'night'] },
  'political-government': { cover: 'ceremony-chair-rows', tags: ['seating'] },
  'corporate-school': { cover: 'banquet-aisle-lamps', tags: ['banquet'] },
  'social-community': { cover: 'hanger-dining-hall', tags: ['dining', 'pandal'] },
};

export function eventPhotos(slug: string, locale: Locale, limit = 8) {
  const entry = eventMap[slug] ?? { cover: 'grand-ground-dusk', tags: ['stage'] };
  return {
    cover: workPhoto(entry.cover, locale),
    gallery: workPhotosTagged(entry.tags, locale)
      .filter((photo) => photo.slug !== entry.cover)
      .slice(0, limit),
  };
}

/** Hero backdrops for the fixed pages, chosen so neighbouring pages differ. */
export const pagePhotos = {
  about: 'poolside-vidhi-seating',
  services: 'banquet-stage-globes',
  events: 'grand-ground-dusk',
  portfolio: 'banquet-stage-gold',
  faq: 'tent-lounge-chandelier',
  testimonials: 'lotus-seat-floral-ring',
  videos: 'lit-garden-entrance',
  blog: 'banquet-aisle-lamps',
  contact: 'night-entrance-gate',
  quote: 'mandap-aisle-dusk',
  notFound: 'ivory-drape-gate-night',
  closing: 'mandap-venue-wide',
} as const satisfies Record<string, WorkPhotoSlug>;

/** Wide, high-resolution frames that hold up as a full-bleed backdrop. */
const rotation: WorkPhotoSlug[] = [
  'white-mandap-dusk',
  'haldi-stage-lights',
  'banquet-stage-gold',
  'floral-arch-stage-pink',
  'lotus-seat-floral-ring',
  'pink-pandal-ceremony',
  'night-lawn-lounge',
  'banquet-aisle-lamps',
  'poolside-lounge-day',
  'pink-drape-entrance',
  'haldi-floral-arch',
  'banquet-stage-globes',
];

/**
 * The photograph at a position in a list. Items that appear together in one
 * grid (blog cards) take consecutive positions, so no two share a frame.
 */
export function photoForIndex(index: number, locale: Locale): WorkPhoto {
  const n = rotation.length;
  return workPhoto(rotation[((index % n) + n) % n]!, locale);
}

/** A stable photograph for items shown one at a time (an area's hero). */
export function rotatingPhoto(key: string, locale: Locale): WorkPhoto {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return workPhoto(rotation[hash % rotation.length]!, locale);
}
