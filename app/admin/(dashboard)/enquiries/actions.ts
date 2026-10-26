'use server';

import { after } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { recordAudit } from '@/lib/audit';
import { requireUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

export type NoteState = { ok: boolean; message: string | null };

const STATUSES = ['NEW', 'CONTACTED', 'SITE_VISIT', 'QUOTED', 'BOOKED', 'LOST'] as const;
export type EnquiryStatusValue = (typeof STATUSES)[number];

const statusSchema = z.enum(STATUSES);

function refresh(id: string) {
  revalidatePath('/admin/enquiries');
  revalidatePath(`/admin/enquiries/${id}`);
  after(() => {
    revalidatePath('/admin');
  });
}

export async function setEnquiryStatus(id: string, status: string) {
  const user = await requireUser();
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return;

  await db.enquiry.update({ where: { id }, data: { status: parsed.data } });
  recordAudit({
    userId: user.id,
    action: 'update',
    entity: 'Enquiry',
    entityId: id,
    meta: { status: parsed.data },
  });
  refresh(id);
}

export async function assignEnquiry(id: string, formData: FormData) {
  const user = await requireUser();
  const userId = String(formData.get('userId') ?? '');
  await db.enquiry.update({ where: { id }, data: { assigneeId: userId || null } });
  recordAudit({
    userId: user.id,
    action: 'update',
    entity: 'Enquiry',
    entityId: id,
  });
  refresh(id);
}

export async function addEnquiryNote(_prev: NoteState, formData: FormData): Promise<NoteState> {
  const user = await requireUser();

  const id = String(formData.get('enquiryId') ?? '');
  const body = String(formData.get('body') ?? '').trim();
  if (body.length < 2) return { ok: false, message: 'Write a note first.' };
  if (body.length > 2000) return { ok: false, message: 'That note is too long.' };

  const enquiry = await db.enquiry.findUnique({ where: { id }, select: { id: true } });
  if (!enquiry) return { ok: false, message: 'That enquiry no longer exists.' };

  await db.enquiryNote.create({ data: { enquiryId: id, authorId: user.id, body } });
  refresh(id);
  return { ok: true, message: 'Note added.' };
}
