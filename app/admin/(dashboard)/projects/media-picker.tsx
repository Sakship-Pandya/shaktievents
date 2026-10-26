'use client';

import { ArrowLeft, ArrowRight, Check, Loader2, Plus, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export type PickableMedia = {
  id: string;
  url: string;
  alt: string;
  isPlaceholder: boolean;
};

/**
 * Cover, gallery and before/after in one place, because they all pull from the
 * same library and picking them separately means scrolling it three times.
 *
 * Supports direct upload from the device into the project and media library,
 * as well as picking from previously uploaded media.
 */
export function MediaPicker({
  media,
  initialCoverId,
  initialGalleryIds,
  initialBeforeId,
  initialAfterId,
}: {
  media: PickableMedia[];
  initialCoverId: string | null;
  initialGalleryIds: string[];
  initialBeforeId: string | null;
  initialAfterId: string | null;
}) {
  const [items, setItems] = useState<PickableMedia[]>(media);
  const [coverId, setCoverId] = useState(initialCoverId ?? '');
  const [gallery, setGallery] = useState<string[]>(initialGalleryIds);
  const [beforeId, setBeforeId] = useState(initialBeforeId ?? '');
  const [afterId, setAfterId] = useState(initialAfterId ?? '');
  const [query, setQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const byId = new Map(items.map((m) => [m.id, m]));
  const visible = query
    ? items.filter((m) => m.alt.toLowerCase().includes(query.toLowerCase()))
    : items;

  const toggleGallery = (id: string) =>
    setGallery((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );

  const move = (index: number, delta: number) =>
    setGallery((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      const [item] = next.splice(index, 1);
      if (item) next.splice(target, 0, item);
      return next;
    });

  const handleFileUpload = async (fileList: FileList | File[]) => {
    const fileArray = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      toast.error('Please select valid image files (JPG, PNG, WEBP, AVIF).');
      return;
    }

    setUploading(true);
    const toastId = toast.loading(
      `Uploading ${fileArray.length} photo${fileArray.length > 1 ? 's' : ''} from device…`,
    );

    try {
      const formData = new FormData();
      for (const file of fileArray) {
        formData.append('files', file);
      }

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = (await res.json()) as { ok?: boolean; error?: string; media?: PickableMedia[] };
      if (!res.ok || !data.ok || !data.media) {
        throw new Error(data.error || 'Failed to upload photos.');
      }

      const newMedia = data.media;

      // Prepend to visible list
      setItems((prev) => [...newMedia, ...prev]);

      // Automatically add to project gallery
      const newIds = newMedia.map((m) => m.id);
      setGallery((prev) => [...prev, ...newIds]);

      // If no cover chosen yet, set first uploaded as cover
      setCoverId((prev) => (prev ? prev : newIds[0] || ''));

      toast.success(
        `Uploaded ${newMedia.length} photo${newMedia.length > 1 ? 's' : ''} and added to project.`,
        { id: toastId },
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      toast.error(msg, { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-6">
      <input type="hidden" name="coverId" value={coverId} />
      <input type="hidden" name="beforeId" value={beforeId} />
      <input type="hidden" name="afterId" value={afterId} />
      {gallery.map((id) => (
        <input key={id} type="hidden" name="galleryIds" value={id} />
      ))}

      {/* Upload from device area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all',
          isDragging
            ? 'border-maroon bg-maroon/5 ring-2 ring-maroon/20'
            : 'border-border bg-sand/20 hover:border-gold hover:bg-sand/40',
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileUpload(e.target.files);
            }
          }}
          className="sr-only"
          id="project-device-photo-upload"
        />

        <div className="flex size-12 items-center justify-center rounded-full bg-card shadow-xs">
          {uploading ? (
            <Loader2 className="size-6 animate-spin text-maroon" />
          ) : (
            <UploadCloud className="size-6 text-gold" />
          )}
        </div>

        <p className="mt-3 text-sm font-semibold text-ink">
          {uploading ? 'Uploading photos from device…' : 'Upload photos from device'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Drag &amp; drop photos here or click below. PNG, JPG, WEBP, AVIF up to 12MB each.
        </p>

        <div className="mt-4">
          <label
            htmlFor="project-device-photo-upload"
            className={cn(
              'inline-flex cursor-pointer items-center gap-2 rounded-full bg-maroon px-5 py-2.5 text-xs font-semibold text-ivory shadow-xs transition-colors hover:bg-maroon-600',
              uploading && 'pointer-events-none opacity-60',
            )}
          >
            {uploading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Plus className="size-3.5" />
                Select photos from device
              </>
            )}
          </label>
        </div>
      </div>

      {/* Chosen gallery, in order */}
      {gallery.length > 0 ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[0.7rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Selected Gallery Photos ({gallery.length})
            </p>
            <p className="text-xs text-muted-foreground">Drag or use arrows to reorder</p>
          </div>
          <ol className="flex flex-wrap gap-3">
            {gallery.map((id, index) => {
              const item = byId.get(id);
              if (!item) return null;
              const isCover = coverId === id;
              const isBefore = beforeId === id;
              const isAfter = afterId === id;

              return (
                <li key={id} className="w-28">
                  <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-border">
                    <Image
                      src={item.url}
                      alt={item.alt}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                    <span className="absolute top-1 left-1 grid size-5 place-items-center rounded-full bg-maroon text-[0.6rem] font-semibold text-ivory">
                      {index + 1}
                    </span>
                    {isCover ? (
                      <span className="absolute bottom-1 left-1 rounded bg-maroon px-1 text-[0.55rem] font-bold text-ivory">
                        Cover
                      </span>
                    ) : null}
                    {isBefore ? (
                      <span className="absolute bottom-1 left-1 rounded bg-ink px-1 text-[0.55rem] font-bold text-marigold">
                        Before
                      </span>
                    ) : null}
                    {isAfter ? (
                      <span className="absolute bottom-1 left-1 rounded bg-ink px-1 text-[0.55rem] font-bold text-marigold">
                        After
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 flex justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      aria-label="Move earlier"
                      className="grid size-6 place-items-center rounded border border-border text-ink transition-colors hover:bg-sand disabled:opacity-30"
                      disabled={index === 0}
                    >
                      <ArrowLeft className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      aria-label="Move later"
                      className="grid size-6 place-items-center rounded border border-border text-ink transition-colors hover:bg-sand disabled:opacity-30"
                      disabled={index === gallery.length - 1}
                    >
                      <ArrowRight className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleGallery(id)}
                      aria-label="Remove from gallery"
                      className="grid size-6 place-items-center rounded border border-border text-error transition-colors hover:bg-error/10"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      {/* Choose from existing media library */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-xs font-semibold tracking-wider text-ink uppercase">
              Choose from existing photo library
            </p>
            <p className="text-xs text-muted-foreground">
              Click any photo to add/remove it from gallery. Set Cover, Before, or After with the
              buttons below each tile.
            </p>
          </div>
          {items.length > 0 ? (
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search library photos…"
              aria-label="Search media"
              className="h-9 w-56 rounded-lg border border-input bg-background px-3 text-sm"
            />
          ) : null}
        </div>

        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground">
            No photos in the library yet. Click &ldquo;Select photos from device&rdquo; above to
            upload your first photographs.
          </p>
        ) : visible.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground">
            No photos match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {visible.map((item) => {
              const inGallery = gallery.includes(item.id);
              const isCover = coverId === item.id;
              const isBefore = beforeId === item.id;
              const isAfter = afterId === item.id;

              return (
                <li key={item.id} className="rounded-xl border border-border bg-card p-2">
                  <button
                    type="button"
                    onClick={() => toggleGallery(item.id)}
                    className={cn(
                      'relative block aspect-4/3 w-full overflow-hidden rounded-lg border-2 transition-colors',
                      inGallery ? 'border-maroon' : 'border-transparent hover:border-gold/50',
                    )}
                  >
                    <Image
                      src={item.url}
                      alt={item.alt}
                      fill
                      sizes="20vw"
                      className="object-cover"
                    />
                    {inGallery ? (
                      <span className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-maroon text-ivory">
                        <Check className="size-3" />
                      </span>
                    ) : null}
                    {item.isPlaceholder ? (
                      <span className="absolute bottom-1 left-1 rounded bg-ink/85 px-1.5 py-0.5 text-[0.55rem] font-semibold tracking-wide text-marigold uppercase">
                        Placeholder
                      </span>
                    ) : null}
                  </button>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {(
                      [
                        [
                          'Cover',
                          isCover,
                          () => setCoverId(coverId === item.id ? '' : item.id),
                        ],
                        [
                          'Before',
                          isBefore,
                          () => setBeforeId(beforeId === item.id ? '' : item.id),
                        ],
                        [
                          'After',
                          isAfter,
                          () => setAfterId(afterId === item.id ? '' : item.id),
                        ],
                      ] as const
                    ).map(([label, active, onClick]) => (
                      <button
                        key={label}
                        type="button"
                        onClick={onClick}
                        className={cn(
                          'rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold transition-colors',
                          active
                            ? 'border-maroon bg-maroon text-ivory'
                            : 'border-border text-muted-foreground hover:bg-sand',
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
