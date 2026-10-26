'use client';

import { Loader2, UploadCloud } from 'lucide-react';
import { CldUploadWidget, type CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { saveUploadedMedia } from './actions';

/** Cloudinary returns a string id or the full info object depending on the event. */
function toResult(info: string | CloudinaryUploadWidgetInfo | undefined) {
  if (!info || typeof info === 'string') return null;
  if (!info.secure_url || !info.public_id) return null;

  return {
    url: info.secure_url,
    publicId: info.public_id,
    width: info.width ?? null,
    height: info.height ?? null,
    bytes: info.bytes ?? null,
    format: info.format ?? null,
    folder: info.folder || 'uploads',
  };
}

export function MediaUploader({ cloudName }: { cloudName?: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      toast.error('Please select valid image files.');
      return;
    }

    setBusy(true);
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

      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Upload failed.');
      }

      toast.success(
        `Uploaded ${fileArray.length} photo${fileArray.length > 1 ? 's' : ''} successfully.`,
        { id: toastId },
      );
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed.';
      toast.error(msg, { id: toastId });
    } finally {
      setBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // If Cloudinary is configured, provide the Cloudinary widget with fallback to device file input
  if (cloudName) {
    return (
      <CldUploadWidget
        signatureEndpoint="/api/upload/signature"
        options={{
          cloudName,
          folder: 'shaktimandap',
          multiple: true,
          maxFiles: 25,
          sources: ['local', 'camera', 'url'],
          clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp', 'avif'],
          maxFileSize: 12_000_000,
        }}
        onSuccess={async (result) => {
          const payload = toResult(result.info);
          if (!payload) return;

          setBusy(true);
          const saved = await saveUploadedMedia(payload);
          setBusy(false);

          if (saved.ok) {
            toast.success('Uploaded');
            router.refresh();
          } else {
            toast.error(saved.error);
          }
        }}
        onError={() => toast.error('Upload failed. Check your connection and try again.')}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            disabled={busy}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-maroon px-6 text-sm font-semibold text-ivory transition-colors hover:bg-maroon-600 disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
            Upload photos
          </button>
        )}
      </CldUploadWidget>
    );
  }

  // Direct device upload without Cloudinary requirement
  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={busy}
        onChange={handleDeviceUpload}
        className="sr-only"
        id="media-device-upload"
      />
      <label
        htmlFor="media-device-upload"
        className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-maroon px-6 text-sm font-semibold text-ivory shadow-xs transition-colors hover:bg-maroon-600 disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
        {busy ? 'Uploading…' : 'Upload photos from device'}
      </label>
    </div>
  );
}
