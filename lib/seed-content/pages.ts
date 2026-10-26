import type { Localized } from '../services';

/**
 * One Page row per public route, so the admin has somewhere to hang per-page
 * SEO from day one.
 *
 * Sections are only seeded for routes whose components already exist in the
 * registry — currently the home page. Seeding a PageSection that points at an
 * unregistered component would make the renderer throw, so the remaining
 * pages start with an empty section list and get theirs as step 3 grows the
 * registry.
 */
export type SeedSection = { component: string; props?: Record<string, unknown> };

export type SeedPage = {
  slug: string;
  title: Localized;
  /** System pages cannot be deleted from the admin. */
  isSystem: boolean;
  sections: SeedSection[];
};

export const pages: SeedPage[] = [
  {
    slug: '/',
    title: { en: 'Home', gu: 'હોમ' },
    isSystem: true,
    sections: [
      { component: 'Hero' },
      // Both of these render nothing until their flag is switched on in
      // Settings › Extra features, so they are safe to seed in position.
      { component: 'MuhuratCountdown' },
      { component: 'EventMarquee' },
      { component: 'ServicesGrid' },
      { component: 'WorkShowcase' },
      { component: 'InstagramFeed' },
      { component: 'ClosingCta' },
    ],
  },
  { slug: '/about', title: { en: 'About', gu: 'અમારા વિશે' }, isSystem: true, sections: [] },
  { slug: '/services', title: { en: 'Services', gu: 'સેવાઓ' }, isSystem: true, sections: [] },
  {
    slug: '/portfolio',
    title: { en: 'Portfolio', gu: 'અમારું કામ' },
    isSystem: true,
    sections: [],
  },
  { slug: '/events', title: { en: 'Events', gu: 'પ્રસંગો' }, isSystem: true, sections: [] },
  {
    slug: '/testimonials',
    title: { en: 'Testimonials', gu: 'ગ્રાહકોના અભિપ્રાય' },
    isSystem: true,
    sections: [],
  },
  { slug: '/blog', title: { en: 'Blog', gu: 'બ્લોગ' }, isSystem: true, sections: [] },
  { slug: '/videos', title: { en: 'Videos', gu: 'વિડિયો' }, isSystem: true, sections: [] },
  {
    slug: '/faq',
    title: { en: 'FAQ', gu: 'વારંવાર પુછાતા પ્રશ્નો' },
    isSystem: true,
    sections: [],
  },
  { slug: '/contact', title: { en: 'Contact', gu: 'સંપર્ક' }, isSystem: true, sections: [] },
  {
    slug: '/get-quote',
    title: { en: 'Get a quote', gu: 'ક્વોટ મેળવો' },
    isSystem: true,
    sections: [],
  },
  {
    slug: '/privacy-policy',
    title: { en: 'Privacy policy', gu: 'પ્રાઇવસી પોલિસી' },
    isSystem: true,
    sections: [],
  },
  { slug: '/terms', title: { en: 'Terms', gu: 'નિયમો અને શરતો' }, isSystem: true, sections: [] },
];
