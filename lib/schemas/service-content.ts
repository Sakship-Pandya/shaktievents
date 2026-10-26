import { z } from 'zod';

/**
 * Shapes for the Json columns on Service. The detail page renders discrete
 * blocks rather than a single rich-text body, so the content is stored as
 * structured Json validated here — that keeps every service page laid out the
 * same way and makes the admin form a set of fields rather than a free editor.
 */

/** Service.contentEn / Service.contentGu — one per language. */
export const serviceContentSchema = z.object({
  /** One line under the H1. */
  promise: z.string().min(10).max(220),
  /** ~120 words: who it is for, what is included, why us. */
  intro: z.string().min(120).max(1400),
  /** How this particular service runs, 4-5 steps. */
  process: z
    .array(z.object({ title: z.string().min(3).max(80), body: z.string().min(20).max(400) }))
    .min(3)
    .max(6),
  /** Closing paragraph before the CTA. Optional. */
  closing: z.string().max(900).nullable().default(null),
});

export type ServiceContent = z.infer<typeof serviceContentSchema>;

/** Service.inclusions — the "What's included" checklist. */
export const inclusionsSchema = z
  .array(z.object({ en: z.string().min(3).max(200), gu: z.string().min(3).max(200) }))
  .max(14);

/** Service.options — the styles or variants offered. */
export const optionsSchema = z
  .array(
    z.object({
      nameEn: z.string().min(2).max(80),
      nameGu: z.string().min(2).max(80),
      descEn: z.string().min(20).max(400),
      descGu: z.string().min(20).max(400),
    }),
  )
  .max(8);

/** Service.specs — the sizes / capacities table. */
export const specsSchema = z
  .array(
    z.object({
      labelEn: z.string().min(2).max(80),
      labelGu: z.string().min(2).max(80),
      value: z.string().min(1).max(200),
    }),
  )
  .max(12);

/**
 * Service.pricing. `fromInr` stays null until the client sets a real figure —
 * the page hides the whole block rather than showing a guessed number.
 */
export const pricingSchema = z.object({
  fromInr: z.number().int().positive().nullable().default(null),
  unitEn: z.string().max(60).default(''),
  unitGu: z.string().max(60).default(''),
  /** What moves the price up or down. */
  factors: z.array(z.object({ en: z.string().max(200), gu: z.string().max(200) })).max(8),
});

export type ServicePricing = z.infer<typeof pricingSchema>;

/** Per-page SEO overrides, shared by every model that has a `seo` column. */
export const seoSchema = z.object({
  titleEn: z.string().max(70).nullable().default(null),
  titleGu: z.string().max(70).nullable().default(null),
  descriptionEn: z.string().max(180).nullable().default(null),
  descriptionGu: z.string().max(180).nullable().default(null),
  ogImage: z.string().max(500).nullable().default(null),
  noindex: z.boolean().default(false),
});

export type Seo = z.infer<typeof seoSchema>;

/** Safe parse helpers — a bad Json blob must never take a public page down. */
export function parseOr<T>(schema: z.ZodType<T>, value: unknown, fallback: T): T {
  const parsed = schema.safeParse(value);
  return parsed.success ? parsed.data : fallback;
}

export const EMPTY_SEO: Seo = {
  titleEn: null,
  titleGu: null,
  descriptionEn: null,
  descriptionGu: null,
  ogImage: null,
  noindex: false,
};
