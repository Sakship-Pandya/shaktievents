import type { Metadata } from 'next';
import { NewVideoForm, VideoCard, type VideoValues } from './video-form';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Videos' };
export const dynamic = 'force-dynamic';

export default async function VideosAdminPage() {
  const rows = await db.video.findMany({ orderBy: [{ status: 'asc' }, { order: 'asc' }] });

  const values: VideoValues[] = rows.map((row) => ({
    id: row.id,
    titleEn: row.titleEn,
    titleGu: row.titleGu,
    youtubeId: row.youtubeId,
    category: row.category ?? '',
    order: String(row.order),
    status: row.status,
  }));

  return (
    <div className="mx-auto max-w-4xl">

      <h1 className="font-display text-display-md font-medium text-ink">Videos</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">
        Embedded through youtube-nocookie, so an embed does not set a tracking cookie before a
        visitor has done anything.
      </p>

      {values.length > 0 ? (
        <ul className="mb-6 grid gap-3">
          {values.map((row) => (
            <VideoCard key={row.id} values={row} />
          ))}
        </ul>
      ) : null}

      <NewVideoForm />
    </div>
  );
}
