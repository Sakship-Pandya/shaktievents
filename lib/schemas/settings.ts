import { z } from 'zod';
import { normalizeIndianPhone } from '@/lib/contact-links';

/**
 * Site settings validation. Every optional field normalises "" to null so a
 * cleared input actually clears the column — and so display() keeps showing
 * the visible [TBD] marker instead of an empty string.
 */
const blankToNull = (v: unknown) => {
  if (typeof v !== 'string') return v;
  const trimmed = v.trim();
  return trimmed === '' ? null : trimmed;
};

const optionalText = (max = 300) => z.preprocess(blankToNull, z.string().max(max).nullable());
const optionalUrl = z.preprocess(blankToNull, z.url().max(500).nullable());
const optionalEmail = z.preprocess(blankToNull, z.email().max(200).nullable());

const optionalPhone = z.preprocess(
  blankToNull,
  z
    .string()
    .nullable()
    .refine((v) => v === null || normalizeIndianPhone(v) !== null, {
      message: 'Enter a 10-digit Indian mobile number',
    }),
);

const optionalInt = (min: number, max: number) =>
  z.preprocess((v) => {
    const cleaned = blankToNull(v);
    if (cleaned === null) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : cleaned;
  }, z.number().int().min(min).max(max).nullable());

/** Accepts a comma- or newline-separated list and returns clean addresses. */
const emailList = z.preprocess((v) => {
  if (typeof v !== 'string') return [];
  return v
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}, z.array(z.email()).max(10));

const thisYear = new Date().getFullYear();

export const settingsSchema = z.object({
  businessName: z.string().trim().min(2).max(200),
  shortName: z.string().trim().min(2).max(80),
  ownerName: optionalText(120),
  establishedYear: optionalInt(1900, thisYear),
  gstNo: optionalText(20),

  phonePrimary: optionalPhone,
  phoneSecondary: optionalPhone,
  whatsappNumber: optionalPhone,
  email: optionalEmail,

  addressLine: optionalText(300),
  area: optionalText(120),
  city: z.string().trim().min(2).max(80),
  district: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pin: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter a 6-digit PIN code'),
  googleMapsUrl: optionalUrl,
  googleBusinessProfileUrl: optionalUrl,

  instagram: optionalUrl,
  facebook: optionalUrl,
  youtube: optionalUrl,

  eventsCompleted: optionalInt(0, 1_000_000),
  teamSize: optionalInt(0, 10_000),
  townsServed: optionalInt(0, 1_000),

  whatsappDefaultMessage: optionalText(500),
  gaId: optionalText(40),
  gtmId: optionalText(40),
  enquiryToEmails: emailList,
});

export type SettingsInput = z.infer<typeof settingsSchema>;
