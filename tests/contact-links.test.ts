import { describe, expect, it } from 'vitest';
import { buildTelUrl, buildWhatsAppUrl, normalizeIndianPhone } from '@/lib/contact-links';

describe('normalizeIndianPhone', () => {
  it('adds the 91 country code to a bare 10-digit mobile number', () => {
    expect(normalizeIndianPhone('9876543210')).toBe('919876543210');
  });

  it('strips spaces, dashes and a leading plus', () => {
    expect(normalizeIndianPhone('+91 98765-43210')).toBe('919876543210');
  });

  it('drops a leading trunk zero', () => {
    expect(normalizeIndianPhone('098765 43210')).toBe('919876543210');
  });

  it('keeps an already-prefixed number unchanged', () => {
    expect(normalizeIndianPhone('919876543210')).toBe('919876543210');
  });

  it('returns null for a number that is not 10 digits after cleaning', () => {
    expect(normalizeIndianPhone('12345')).toBeNull();
    expect(normalizeIndianPhone('')).toBeNull();
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds a wa.me link with the normalized number', () => {
    expect(buildWhatsAppUrl('98765 43210')).toBe('https://wa.me/919876543210');
  });

  it('appends a URL-encoded prefilled message', () => {
    expect(buildWhatsAppUrl('9876543210', 'Hi Shree Shakti, I need a mandap quote')).toBe(
      'https://wa.me/919876543210?text=Hi%20Shree%20Shakti%2C%20I%20need%20a%20mandap%20quote',
    );
  });

  it('encodes newlines so multi-line messages survive', () => {
    expect(buildWhatsAppUrl('9876543210', 'Line 1\nLine 2')).toBe(
      'https://wa.me/919876543210?text=Line%201%0ALine%202',
    );
  });

  it('returns null when the number is invalid', () => {
    expect(buildWhatsAppUrl('12')).toBeNull();
  });
});

describe('buildTelUrl', () => {
  it('builds an international tel: link', () => {
    expect(buildTelUrl('98765 43210')).toBe('tel:+919876543210');
  });

  it('returns null when the number is invalid', () => {
    expect(buildTelUrl('abc')).toBeNull();
  });
});
