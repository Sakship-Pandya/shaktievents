/**
 * Helpers for click-to-call and WhatsApp deep links.
 * All numbers are treated as Indian mobile numbers (10 digits, +91).
 */

const INDIA_CC = '91';

/** Returns the number as `91XXXXXXXXXX`, or null if it is not a valid Indian mobile number. */
export function normalizeIndianPhone(input: string): string | null {
  let digits = input.replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 12 && digits.startsWith(INDIA_CC)) digits = digits.slice(2);

  if (digits.length !== 10) return null;
  return INDIA_CC + digits;
}

/** `https://wa.me/91XXXXXXXXXX?text=...` or null if the number is invalid. */
export function buildWhatsAppUrl(number: string, message?: string): string | null {
  const normalized = normalizeIndianPhone(number);
  if (!normalized) return null;

  const base = `https://wa.me/${normalized}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** `tel:+91XXXXXXXXXX` or null if the number is invalid. */
export function buildTelUrl(number: string): string | null {
  const normalized = normalizeIndianPhone(number);
  return normalized ? `tel:+${normalized}` : null;
}
