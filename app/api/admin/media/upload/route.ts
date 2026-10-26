import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { getCloudinaryConfig, signParams } from '@/lib/cloudinary';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid form data' }, { status: 400 });
  }

  const files = formData.getAll('files') as File[];
  if (!files || files.length === 0) {
    return NextResponse.json({ ok: false, error: 'No files provided' }, { status: 400 });
  }

  const cloudinaryConfig = getCloudinaryConfig();
  const createdMedia: { id: string; url: string; alt: string; isPlaceholder: boolean }[] = [];

  for (const file of files) {
    if (!file || typeof file.arrayBuffer !== 'function' || file.size === 0) continue;
    if (!file.type.startsWith('image/')) continue;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let url = '';
    let publicId: string | null = null;
    let width: number | null = null;
    let height: number | null = null;
    let format: string | null = null;
    const bytes = buffer.length;

    try {
      const meta = await sharp(buffer).metadata();
      width = meta.width ?? null;
      height = meta.height ?? null;
      format = meta.format ?? null;
    } catch {
      // ignore
    }

    if (cloudinaryConfig) {
      try {
        const timestamp = Math.round(Date.now() / 1000);
        const folder = 'shaktimandap';
        const signature = signParams({ folder, timestamp }, cloudinaryConfig.apiSecret);

        const cloudFormData = new FormData();
        const blob = new Blob([buffer], { type: file.type });
        cloudFormData.append('file', blob, file.name);
        cloudFormData.append('timestamp', String(timestamp));
        cloudFormData.append('folder', folder);
        cloudFormData.append('api_key', cloudinaryConfig.apiKey);
        cloudFormData.append('signature', signature);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
          { method: 'POST', body: cloudFormData },
        );
        if (res.ok) {
          const data = (await res.json()) as {
            secure_url?: string;
            public_id?: string;
            width?: number;
            height?: number;
            format?: string;
          };
          if (data.secure_url) {
            url = data.secure_url;
            publicId = data.public_id ?? null;
            width = data.width ?? width;
            height = data.height ?? height;
            format = data.format ?? format;
          }
        }
      } catch (err) {
        console.error('Cloudinary upload error:', err);
      }
    }

    if (!url) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const ext = path.extname(file.name) || (format ? `.${format}` : '.jpg');
      const safeName = `${Date.now()}-${randomBytes(4).toString('hex')}${ext}`;
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);

      url = `/uploads/${safeName}`;
      publicId = `local_${safeName}`;
    }

    const cleanBaseName = path.basename(file.name, path.extname(file.name)).replace(/[-_]+/g, ' ');

    const media = await db.media.create({
      data: {
        url,
        publicId,
        altEn: cleanBaseName || 'Project photo',
        width,
        height,
        bytes,
        format,
        folder: 'uploads',
        isPlaceholder: false,
      },
    });

    await db.auditLog.create({
      data: { userId: user.id, action: 'create', entity: 'Media', entityId: media.id },
    });

    createdMedia.push({
      id: media.id,
      url: media.url,
      alt: media.altEn ?? '',
      isPlaceholder: false,
    });
  }

  if (createdMedia.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'No valid image files processed' },
      { status: 400 },
    );
  }

  revalidatePath('/admin/media');
  revalidatePath('/admin/projects');

  return NextResponse.json({ ok: true, media: createdMedia });
}
