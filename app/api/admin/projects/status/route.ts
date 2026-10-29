import { NextResponse, after } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getSessionUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { recordAudit } from '@/lib/audit';
import { locales } from '@/i18n/routing';
import { localizedPath } from '@/lib/seo';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: { id?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { id, status } = body;
  if (!id || (status !== 'PUBLISHED' && status !== 'DRAFT' && status !== 'ARCHIVED')) {
    return NextResponse.json({ ok: false, error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    // Single atomic database query to update status and retrieve slug
    const updated = await db.project.update({
      where: { id },
      data: { status },
      select: { slug: true },
    });

    // Schedule all audit logging and cache revalidations in the background
    // so the HTTP response is dispatched immediately without waiting
    after(() => {
      try {
        recordAudit({
          userId: user.id,
          action: 'update',
          entity: 'Project',
          entityId: id,
          meta: { status },
        });
        revalidatePath('/admin/projects');
        revalidatePath('/admin/portfolio');
        revalidateTag('projects');
        for (const locale of locales) {
          revalidatePath(localizedPath(locale, `/portfolio/${updated.slug}`));
        }
      } catch (err) {
        console.error('[status api after] background task error:', err);
      }
    });

    return NextResponse.json({ ok: true, status });
  } catch (error) {
    console.error('[status api] update error:', error);
    return NextResponse.json({ ok: false, error: 'Database update failed' }, { status: 500 });
  }
}
