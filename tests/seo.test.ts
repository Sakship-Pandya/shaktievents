import { describe, expect, it } from 'vitest';
import { alternatesFor, localizedPath } from '@/lib/seo';

describe('localizedPath', () => {
  it('leaves English paths unprefixed', () => {
    expect(localizedPath('en', '/services/sound')).toBe('/services/sound');
  });

  it('prefixes Gujarati paths with /gu', () => {
    expect(localizedPath('gu', '/services/sound')).toBe('/gu/services/sound');
  });

  it('maps the Gujarati home to /gu without a trailing slash', () => {
    expect(localizedPath('gu', '/')).toBe('/gu');
  });
});

describe('alternatesFor', () => {
  it('sets the canonical to the current locale and lists both languages plus x-default', () => {
    expect(alternatesFor('gu', '/about')).toEqual({
      canonical: '/gu/about',
      languages: {
        'en-IN': '/about',
        'gu-IN': '/gu/about',
        'x-default': '/about',
      },
    });
  });

  it('uses the root as the English canonical for the home page', () => {
    expect(alternatesFor('en', '/').canonical).toBe('/');
  });
});
