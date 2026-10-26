import type { Metadata } from 'next';
import { AnnouncementCard, NewAnnouncementForm, type AnnouncementRow } from './announcement-form';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Announcements' };
export const dynamic = 'force-dynamic';

export default async function AnnouncementsPage() {
  const rows = await db.announcement.findMany({
    orderBy: [{ isActive: 'desc' }, { updatedAt: 'desc' }],
    select: { id: true, textEn: true, textGu: true, href: true, isActive: true },
  });

  return (
    <div className="mx-auto max-w-4xl">

      <h1 className="font-display text-display-md font-medium text-ink">Announcements</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">
        The strip above the navigation. Only one shows at a time — the most recently updated live
        one. Turn them all off to hide the strip.
      </p>

      {rows.length > 0 ? (
        <ul className="mb-6 grid gap-4">
          {rows.map((row: AnnouncementRow) => (
            <AnnouncementCard key={row.id} row={row} />
          ))}
        </ul>
      ) : null}

      <NewAnnouncementForm />
    </div>
  );
}
