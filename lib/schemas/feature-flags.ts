import { z } from 'zod';

/**
 * Optional features, off by default.
 *
 * Every one of these is loaded dynamically at the point of use, so a flag that
 * is off costs nothing in the bundle — which is the whole point of having them
 * behind flags rather than shipping them and hiding them with CSS.
 */
export const featureFlagsSchema = z.object({
  /** Swipeable mandap styles with a shareable shortlist. */
  styleExplorer: z.boolean().default(false),
  /** Pannellum viewer on projects that have a panorama uploaded. */
  panorama: z.boolean().default(false),
  /** Live Instagram grid; falls back to the media library when it cannot load. */
  instagram: z.boolean().default(false),
  /** Muhurat dates with a countdown to the next one. */
  countdown: z.boolean().default(false),
  /** Delayed enquiry popup. Never on the quote or contact pages. */
  popup: z.boolean().default(false),
});

export type FeatureFlags = z.infer<typeof featureFlagsSchema>;

export const DEFAULT_FLAGS: FeatureFlags = {
  styleExplorer: false,
  panorama: false,
  instagram: false,
  countdown: false,
  popup: false,
};

/** Muhurat dates for the countdown, edited in the admin. */
export const muhuratDatesSchema = z
  .array(
    z.object({
      /** ISO date, yyyy-mm-dd. */
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      labelEn: z.string().max(120).default(''),
      labelGu: z.string().max(120).default(''),
    }),
  )
  .max(60);

export type MuhuratDates = z.infer<typeof muhuratDatesSchema>;
