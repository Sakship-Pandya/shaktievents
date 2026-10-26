'use client';

import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { deleteMedia, updateMediaAlt } from './actions';
import { Input } from '@/components/ui/input';

export type MediaItem = {
  id: string;
  url: string;
  altEn: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  createdAt: string;
};

function formatBytes(bytes: number | null) {
  if (!bytes) return '—';
  return bytes > 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)} MB`
    : `${Math.round(bytes / 1000)} KB`;
}

export function MediaCard({ item }: { item: MediaItem }) {
  const router = useRouter();
  const [alt, setAlt] = useState(item.altEn ?? '');
  const [pending, startTransition] = useTransition();

  const saveAlt = () => {
    if (alt === (item.altEn ?? '')) return;
    startTransition(async () => {
      const result = await updateMediaAlt({ id: item.id, altEn: alt || null, altGu: null });
      if (result.ok) toast.success('Alt text saved');
      else toast.error(result.error);
    });
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const confirmDelete = () => {
    startTransition(async () => {
      const result = await deleteMedia(item.id);
      if (result.ok) {
        toast.success('Media deleted successfully');
        setShowConfirm(false);
        router.refresh();
      } else {
        toast.error(result.error);
        setShowConfirm(false);
      }
    });
  };

  return (
    <>
      <figure className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="relative aspect-4/3 bg-sand">
          <Image
            src={item.url}
            alt={item.altEn ?? ''}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover"
          />
        </div>
        <figcaption className="space-y-2 p-3">
          <Input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            onBlur={saveAlt}
            placeholder="Alt text — describe the photo"
            aria-label="Alt text"
            className="h-9 text-xs"
          />
          <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground">
            <span>
              {item.width && item.height ? `${item.width}×${item.height}` : '—'} ·{' '}
              {formatBytes(item.bytes)}
            </span>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={pending}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-error transition-colors hover:bg-error/10 disabled:opacity-50"
              title="Delete media"
            >
              <Trash2 className="size-3.5" />
              <span className="sr-only">Delete</span>
            </button>
          </div>
        </figcaption>
      </figure>

      {showConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity"
          onClick={() => !pending && setShowConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-error/10 text-error">
                <Trash2 className="size-5" />
              </div>
              <div className="flex-1">
                <h3 id="confirm-delete-title" className="text-base font-semibold text-ink">
                  Delete media permanently?
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  This file will be permanently removed from Cloudinary and your database. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-ivory/60 p-2.5">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-sand">
                <Image
                  src={item.url}
                  alt={item.altEn ?? ''}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <p className="truncate font-medium text-ink">{item.altEn || 'Untitled image'}</p>
                <p className="text-[0.7rem] text-muted-foreground">
                  {item.width && item.height ? `${item.width}×${item.height}` : '—'} · {formatBytes(item.bytes)}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={pending}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-semibold text-ink transition-colors hover:bg-sand disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={pending}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-error px-4 text-xs font-semibold text-white transition-colors hover:bg-error/90 disabled:opacity-50"
              >
                {pending ? 'Deleting…' : 'Delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
