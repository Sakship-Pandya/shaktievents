import { unstable_cache } from 'next/cache';
import { db } from './db';
import type { SectionRow } from '@/components/sections/registry';

/**
 * The sections that make up a page, in order. Cached under the `sections` tag,
 * which the page-builder actions revalidate — reordering a section in the
 * admin updates the live page without a redeploy.
 */

/**
 * Used only when the database cannot be reached. Matches what the seed writes
 * for the home page, so an outage degrades to the intended layout instead of
 * a blank screen.
 */
const FALLBACK_SECTIONS: Record<string, SectionRow[]> = {
  '/': [
    { id: 'fallback-hero', component: 'Hero', props: {} },
    { id: 'fallback-marquee', component: 'EventMarquee', props: {} },
    { id: 'fallback-services', component: 'ServicesGrid', props: {} },
    { id: 'fallback-cta', component: 'ClosingCta', props: {} },
  ],
};

async function loadPageSections(slug: string): Promise<SectionRow[]> {
  try {
    const page = await db.page.findUnique({
      where: { slug },
      select: {
        sections: {
          where: { isVisible: true },
          orderBy: { order: 'asc' },
          select: { id: true, component: true, props: true },
        },
      },
    });

    return page?.sections ?? [];
  } catch (error) {
    console.error(`[pages] falling back to static sections for ${slug}:`, error);
    return FALLBACK_SECTIONS[slug] ?? [];
  }
}

export const getPageSections = unstable_cache(loadPageSections, ['page-sections'], {
  tags: ['sections'],
  revalidate: 3600,
});
