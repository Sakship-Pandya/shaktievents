import { unstable_cache } from 'next/cache';
import { db } from './db';

export type ActiveAnnouncement = {
  textEn: string;
  textGu: string;
  href: string | null;
};

/**
 * The banner currently in force: active, and inside its date window if one is
 * set. Returns null when nothing applies, which hides the bar entirely.
 */
async function loadActiveAnnouncement(): Promise<ActiveAnnouncement | null> {
  try {
    const now = new Date();
    const row = await db.announcement.findFirst({
      where: {
        isActive: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      orderBy: { updatedAt: 'desc' },
      select: { textEn: true, textGu: true, href: true },
    });

    return row;
  } catch (error) {
    console.error('[announcements] hiding the bar:', error);
    return null;
  }
}

export const getActiveAnnouncement = unstable_cache(loadActiveAnnouncement, ['announcement'], {
  tags: ['announcements'],
  revalidate: 3600,
});
