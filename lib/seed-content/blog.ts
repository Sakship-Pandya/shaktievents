import type { Localized } from '../services';

/**
 * The eight SEO articles from the content plan. Seeded as DRAFT with their
 * slugs, titles and excerpts fixed — the slug is the part that must never
 * change once indexed. Bodies are written in step 8 through the Tiptap editor.
 */
export type SeedBlogCategory = { slug: string; name: Localized };

export const blogCategories: SeedBlogCategory[] = [
  { slug: 'costs', name: { en: 'Costs & budgets', gu: 'ખર્ચ અને બજેટ' } },
  { slug: 'planning', name: { en: 'Planning', gu: 'આયોજન' } },
  { slug: 'ideas', name: { en: 'Decoration ideas', gu: 'સજાવટના વિચારો' } },
  { slug: 'technical', name: { en: 'Sound & lighting', gu: 'સાઉન્ડ અને લાઇટિંગ' } },
];

export type SeedBlogPost = {
  slug: string;
  categorySlug: string;
  title: Localized;
  excerpt: Localized;
};

export const blogPosts: SeedBlogPost[] = [
  {
    slug: 'wedding-mandap-cost-surendranagar-2026',
    categorySlug: 'costs',
    title: {
      en: 'What a wedding mandap costs in Surendranagar: a 2026 guide',
      gu: 'સુરેન્દ્રનગરમાં લગ્ન મંડપનો ખર્ચ: 2026ની માર્ગદર્શિકા',
    },
    excerpt: {
      en: 'What actually moves the number on a mandap quote — size, days, season, distance and how much of the work is fresh flowers.',
      gu: 'મંડપના ભાવમાં ખરેખર શું ફેરફાર લાવે છે — સાઇઝ, દિવસ, સિઝન, અંતર અને તાજા ફૂલનું કામ કેટલું છે.',
    },
  },
  {
    slug: 'german-hanger-vs-traditional-pandal',
    categorySlug: 'planning',
    title: {
      en: 'German hanger or traditional pandal: which one your function needs',
      gu: 'જર્મન હેંગર કે પરંપરાગત પંડાલ: તમારા પ્રસંગ માટે કયું?',
    },
    excerpt: {
      en: 'Clear span, waterproofing, setup time and cost compared — with the guest counts and grounds each one suits.',
      gu: 'ક્લિયર સ્પાન, વોટરપ્રૂફિંગ, સેટઅપનો સમય અને ખર્ચની સરખામણી — અને કયું કેટલા મહેમાનો તથા કેવા મેદાન માટે યોગ્ય છે.',
    },
  },
  {
    slug: 'sound-system-watt-guide-by-guest-count',
    categorySlug: 'technical',
    title: {
      en: 'How much sound do you actually need? A watt guide by guest count',
      gu: 'ખરેખર કેટલો સાઉન્ડ જોઈએ? મહેમાનોની સંખ્યા પ્રમાણે વોટની માર્ગદર્શિકા',
    },
    excerpt: {
      en: 'Why the shape of the ground matters more than the headcount, and when delay towers stop being optional.',
      gu: 'સંખ્યા કરતાં મેદાનનો આકાર કેમ વધુ અસર કરે છે, અને ડિલે ટાવર ક્યારે જરૂરી બની જાય છે.',
    },
  },
  {
    slug: 'lagan-season-checklist-gujarati-wedding',
    categorySlug: 'planning',
    title: {
      en: 'Lagan season checklist for a Gujarati wedding',
      gu: 'ગુજરાતી લગ્ન માટે લગનસરાની ચેકલિસ્ટ',
    },
    excerpt: {
      en: 'Everything to lock in before the muhurat, in the order it needs deciding — venue, mandap, sound, catering and the baraat route.',
      gu: 'મુહૂર્ત પહેલાં શું નક્કી કરવું, અને કયા ક્રમમાં — જગ્યા, મંડપ, સાઉન્ડ, કેટરિંગ અને વરઘોડાનો રસ્તો.',
    },
  },
  {
    slug: 'navratri-garba-setup-sound-lighting-safety',
    categorySlug: 'technical',
    title: {
      en: 'Navratri garba setup: sound, lighting and safety on the ground',
      gu: 'નવરાત્રિ ગરબા સેટઅપ: સાઉન્ડ, લાઇટિંગ અને મેદાનની સલામતી',
    },
    excerpt: {
      en: 'Even coverage around the circle, lighting that lets dancers see their footing, and the crowd-safety points organisers forget.',
      gu: 'વર્તુળે સરખો અવાજ, રમનારને પગ દેખાય એવી લાઇટ, અને આયોજકો ભૂલી જાય એવા ભીડ-સલામતીના મુદ્દા.',
    },
  },
  {
    slug: 'bhagwat-katha-pandal-planning-guide',
    categorySlug: 'planning',
    title: {
      en: 'Planning a Bhagwat Katha pandal: seating, sound and shade',
      gu: 'ભાગવત કથાનો પંડાલ: બેઠક, સાઉન્ડ અને છાંયડાનું આયોજન',
    },
    excerpt: {
      en: 'Sizing the pandal for a week of daily audiences, keeping the maharaj clearly audible, and planning for the afternoon sun.',
      gu: 'અઠવાડિયા સુધી રોજ આવતા શ્રોતાઓ પ્રમાણે પંડાલનું માપ, મહારાજનો અવાજ સ્પષ્ટ રાખવો, અને બપોરના તડકાનું આયોજન.',
    },
  },
  {
    slug: 'kathiawadi-wedding-decoration-ideas',
    categorySlug: 'ideas',
    title: {
      en: '12 Kathiawadi wedding decoration ideas that photograph well',
      gu: 'ફોટામાં સુંદર લાગે એવા 12 કાઠિયાવાડી લગ્ન સજાવટના વિચારો',
    },
    excerpt: {
      en: 'Bandhani, brass, mirror work and marigold used the way they are meant to be — not as a backdrop print.',
      gu: 'બાંધણી, પિત્તળ, આભલા ભરત અને ગલગોટા — જે રીતે વપરાવા જોઈએ એ રીતે, બેકડ્રોપની પ્રિન્ટ તરીકે નહીં.',
    },
  },
  {
    slug: 'how-to-book-mandap-contractor-questions-to-ask',
    categorySlug: 'planning',
    title: {
      en: 'Booking a mandap contractor: 10 questions to ask first',
      gu: 'મંડપ કોન્ટ્રાક્ટર બુક કરતાં પહેલાં પૂછવાના 10 સવાલ',
    },
    excerpt: {
      en: 'The questions that separate a written quote you can hold someone to from a number said over the phone.',
      gu: 'કયા સવાલો પૂછવાથી ખબર પડે કે તમને લેખિત, જવાબદારીવાળો ક્વોટ મળી રહ્યો છે કે ફોન પર કહેલો આંકડો.',
    },
  },
];
