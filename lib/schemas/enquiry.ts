import { z } from 'zod';
import { normalizeIndianPhone } from '@/lib/contact-links';

const blankToNull = (v: unknown) => {
  if (typeof v !== 'string') return v;
  const t = v.trim();
  return t === '' ? null : t;
};

export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(120),
  phone: z
    .string()
    .trim()
    .refine((v) => normalizeIndianPhone(v) !== null, 'Enter a 10-digit mobile number'),
  email: z.preprocess(blankToNull, z.email('Enter a valid email').nullable()),
  town: z.preprocess(blankToNull, z.string().max(80).nullable()),
  eventType: z.preprocess(blankToNull, z.string().max(80).nullable()),
  eventDate: z.preprocess(blankToNull, z.string().max(20).nullable()),
  guests: z.preprocess(
    (v) => (blankToNull(v) === null ? null : Number(v)),
    z.number().int().min(1).max(100_000).nullable(),
  ),
  serviceSlugs: z.array(z.string().max(120)).max(20).default([]),
  message: z.preprocess(blankToNull, z.string().max(1500).nullable()),
  sourcePath: z.preprocess(blankToNull, z.string().max(300).nullable()),
  /**
   * Honeypot. Named to look worth filling in to a bot and hidden from people;
   * anything in it means the submission is not from a browser we want.
   */
  website: z.string().max(0, 'Rejected').default(''),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

/** UTM parameters, kept for source attribution. */
export const utmSchema = z
  .object({
    utm_source: z.string().max(120).optional(),
    utm_medium: z.string().max(120).optional(),
    utm_campaign: z.string().max(120).optional(),
    utm_term: z.string().max(120).optional(),
    utm_content: z.string().max(120).optional(),
  })
  .partial();
