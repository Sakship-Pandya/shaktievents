import type { Metadata } from 'next';
import { AlertTriangle } from 'lucide-react';
import { MediaCard, type MediaItem } from './media-card';
import { MediaUploader } from './uploader';
import { getCloudinaryConfig } from '@/lib/cloudinary';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Media' };
export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  const config = getCloudinaryConfig();
  const media = await db.media.findMany({ orderBy: { createdAt: 'desc' }, take: 120 });

  const items: MediaItem[] = media.map((m) => ({
    id: m.id,
    url: m.url,
    altEn: m.altEn,
    width: m.width,
    height: m.height,
    bytes: m.bytes,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-6xl">

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-display-md font-medium text-ink">Media</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Photos used across projects, services and the gallery.
          </p>
        </div>
        <MediaUploader cloudName={config?.cloudName} />
      </div>

      {!config ? (
        <div className="mt-8 flex gap-3 rounded-xl border border-warning/40 bg-warning/8 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />
          <div className="text-sm">
            <p className="font-semibold text-ink">Cloudinary credentials not set</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Photos uploaded from your device are being stored in the local server media folder. To host images on Cloudinary CDN, set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.local.
            </p>
          </div>
        </div>
      ) : null}

      {items.length === 0 ? (
        <p className="mt-8 rounded-xl border border-border bg-card px-5 py-14 text-center text-sm text-muted-foreground">
          No photos yet.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
