import { z } from 'zod';
import type { SectionSchema } from '@/lib/section-schema';

/**
 * The section catalogue: what the page builder can add, and the shape of each
 * one's props. Kept free of React imports so the admin can load the schemas
 * without pulling every section component into its bundle — the components
 * themselves live in registry.tsx.
 *
 * Every field needs a `.default()`, so a section added with no props renders,
 * and a `.describe()`, which becomes its form label.
 */
export const sectionDefinitions = {
  Hero: {
    label: 'Hero',
    description: 'Full-height opening with the headline, CTAs and stat counters.',
    schema: z.object({
      showStats: z.boolean().default(true).describe('Show the stats strip'),
      showStringLights: z.boolean().default(true).describe('Show the string lights'),
      showPhoto: z.boolean().default(true).describe('Show the photograph behind the headline'),
    }),
  },
  WorkShowcase: {
    label: 'Our work photographs',
    description: 'Mosaic of our own event photographs, linking to the full gallery.',
    schema: z.object({
      showLink: z.boolean().default(true).describe('Show the “See all photographs” link'),
    }),
  },
  EventMarquee: {
    label: 'Event marquee',
    description: 'Scrolling strip of the kinds of functions we set up.',
    schema: z.object({
      speedSeconds: z
        .number()
        .int()
        .min(15)
        .max(180)
        .default(48)
        .describe('Seconds for one full loop'),
    }),
  },
  ServicesGrid: {
    label: 'Services grid',
    description: 'Light band of service cards linking to the service pages.',
    schema: z.object({
      limit: z.number().int().min(3).max(14).default(6).describe('How many service cards'),
      showViewAll: z.boolean().default(true).describe('Show the “All services” link'),
    }),
  },
  MuhuratCountdown: {
    label: 'Muhurat countdown',
    description:
      'Days to the next muhurat date. Shows nothing until the countdown is switched on in Settings › Extra features and a future date is saved there.',
    schema: z.object({
      showUpcoming: z.boolean().default(true).describe('List the dates after the next one'),
    }),
  },
  InstagramFeed: {
    label: 'Instagram feed',
    description:
      'Latest Instagram posts, falling back to published project photos. Shows nothing until the feed is switched on in Settings › Extra features.',
    schema: z.object({
      limit: z.number().int().min(3).max(12).default(6).describe('How many photographs'),
    }),
  },
  ClosingCta: {
    label: 'Closing CTA',
    description: 'Dark band with the marigold glow and the quote / WhatsApp buttons.',
    schema: z.object({
      showCallButton: z.boolean().default(true).describe('Show the call button'),
    }),
  },
} satisfies Record<string, { label: string; description: string; schema: SectionSchema }>;

export type SectionKey = keyof typeof sectionDefinitions;

export const sectionKeys = Object.keys(sectionDefinitions) as SectionKey[];

export function isSectionKey(value: string): value is SectionKey {
  return Object.hasOwn(sectionDefinitions, value);
}
