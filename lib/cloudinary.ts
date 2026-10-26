import { createHash } from 'node:crypto';

/**
 * Minimal Cloudinary helpers — signing browser uploads and deleting assets.
 * We sign uploads server-side rather than using an unsigned preset so the
 * upload endpoint cannot be used by anyone who reads the page source.
 */
export type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

/** Cloudinary signs the alphabetically sorted `key=value` pairs plus the secret. */
export function signParams(params: Record<string, string | number>, apiSecret: string): string {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return createHash('sha1')
    .update(payload + apiSecret)
    .digest('hex');
}

/** Removes the asset from Cloudinary so deleting from the library isn't a leak. */
export async function destroyAsset(publicId: string): Promise<boolean> {
  const config = getCloudinaryConfig();
  if (!config) return false;

  const timestamp = Math.round(Date.now() / 1000);
  const signature = signParams({ public_id: publicId, timestamp }, config.apiSecret);

  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: config.apiKey,
    signature,
  });

  const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/destroy`, {
    method: 'POST',
    body,
  });

  if (!res.ok) return false;
  const json = (await res.json()) as { result?: string };
  return json.result === 'ok' || json.result === 'not found';
}
