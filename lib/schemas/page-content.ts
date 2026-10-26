import { z } from 'zod';

/**
 * Shared Json shapes for the remaining content models. Same pattern as the
 * service and project schemas: structured blocks the template renders, not a
 * free rich-text body, so every page in a set is laid out the same way.
 */

/** EventType.introEn / introGu. */
export const eventIntroSchema = z.object({
  promise: z.string().min(10).max(220),
  paragraphs: z.array(z.string().min(40).max(1200)).min(1).max(4),
  /** What this kind of function needs that others do not. */
  needs: z
    .array(z.object({ title: z.string().max(90), body: z.string().max(400) }))
    .max(8)
    .default([]),
});

export type EventIntro = z.infer<typeof eventIntroSchema>;

export const EMPTY_EVENT_INTRO: EventIntro = { promise: '', paragraphs: [], needs: [] };

