import { describe, expect, it } from 'vitest';
import { mapInstagramMedia } from '@/lib/instagram-media';
import { daysUntil, nextMuhurat } from '@/lib/muhurat';
import { DEFAULT_FLAGS, featureFlagsSchema, muhuratDatesSchema } from '@/lib/schemas/feature-flags';

const dates = [
  { date: '2026-02-14', labelEn: 'Vasant Panchami', labelGu: 'વસંત પંચમી' },
  { date: '2025-11-20', labelEn: 'Past', labelGu: '' },
  { date: '2026-11-30', labelEn: 'Later', labelGu: '' },
];

describe('featureFlagsSchema', () => {
  it('defaults every flag to off', () => {
    expect(featureFlagsSchema.parse({})).toEqual(DEFAULT_FLAGS);
    expect(Object.values(DEFAULT_FLAGS).every((v) => v === false)).toBe(true);
  });

  it('ignores a flag that no longer exists rather than failing', () => {
    // A flag removed from the code should not break a settings row that still
    // has it stored.
    const parsed = featureFlagsSchema.safeParse({ popup: true, removedFlag: true });
    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data.popup).toBe(true);
  });
});

describe('nextMuhurat', () => {
  const now = new Date('2026-01-15T00:00:00Z');

  it('picks the soonest date that has not passed', () => {
    expect(nextMuhurat(dates, now)?.date).toBe('2026-02-14');
  });

  it('includes today', () => {
    expect(nextMuhurat([{ date: '2026-01-15', labelEn: '', labelGu: '' }], now)?.date).toBe(
      '2026-01-15',
    );
  });

  it('returns null once every date has passed', () => {
    expect(nextMuhurat([{ date: '2020-01-01', labelEn: '', labelGu: '' }], now)).toBeNull();
  });

  it('returns null for an empty calendar', () => {
    expect(nextMuhurat([], now)).toBeNull();
  });
});

describe('daysUntil', () => {
  const now = new Date('2026-01-15T18:30:00Z');

  it('counts whole days regardless of the time of day', () => {
    expect(daysUntil('2026-01-16', now)).toBe(1);
  });

  it('is zero for today', () => {
    expect(daysUntil('2026-01-15', now)).toBe(0);
  });

  it('never goes negative', () => {
    expect(daysUntil('2020-01-01', now)).toBe(0);
  });

  it('crosses a month boundary correctly', () => {
    expect(daysUntil('2026-02-01', now)).toBe(17);
  });
});

describe('muhuratDatesSchema', () => {
  it('rejects a date that is not yyyy-mm-dd', () => {
    expect(muhuratDatesSchema.safeParse([{ date: '14/02/2026' }]).success).toBe(false);
  });

  it('accepts an entry with no label', () => {
    expect(muhuratDatesSchema.safeParse([{ date: '2026-02-14' }]).success).toBe(true);
  });
});

describe('mapInstagramMedia', () => {
  it('keeps the first line of a caption and drops the hashtag tail', () => {
    const [post] = mapInstagramMedia([
      {
        id: '1',
        caption: 'Mandap at Limbdi\n\n#mandap #surendranagar #wedding',
        media_type: 'IMAGE',
        media_url: 'https://cdn/1.jpg',
        permalink: 'https://instagram.com/p/1',
      },
    ]);
    expect(post?.caption).toBe('Mandap at Limbdi');
  });

  it('uses the thumbnail for a video, whose media_url is an mp4', () => {
    const [post] = mapInstagramMedia([
      {
        id: '2',
        media_type: 'VIDEO',
        media_url: 'https://cdn/2.mp4',
        thumbnail_url: 'https://cdn/2.jpg',
        permalink: 'https://instagram.com/p/2',
      },
    ]);
    expect(post?.imageUrl).toBe('https://cdn/2.jpg');
  });

  it('drops anything without both an image and a permalink', () => {
    expect(
      mapInstagramMedia([
        { id: '3', media_type: 'IMAGE', permalink: 'https://instagram.com/p/3' },
        { id: '4', media_type: 'IMAGE', media_url: 'https://cdn/4.jpg' },
        { media_type: 'IMAGE', media_url: 'https://cdn/5.jpg', permalink: 'https://ig/5' },
      ]),
    ).toEqual([]);
  });

  it('truncates a very long single-line caption', () => {
    const [post] = mapInstagramMedia([
      {
        id: '6',
        caption: 'x'.repeat(400),
        media_type: 'IMAGE',
        media_url: 'https://cdn/6.jpg',
        permalink: 'https://ig/6',
      },
    ]);
    expect(post?.caption).toHaveLength(140);
  });
});
