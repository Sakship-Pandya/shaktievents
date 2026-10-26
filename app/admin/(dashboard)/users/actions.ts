'use server';

import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { recordAudit } from '@/lib/audit';
import { requireAdmin } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

export type UserState = { ok: boolean; message: string | null; password?: string };

const userSchema = z.object({
  name: z.string().trim().min(2, 'Enter a name').max(120),
  email: z.string().trim().email('Enter a valid email address').toLowerCase(),
  role: z.enum(['ADMIN', 'EDITOR']),
});

/** Readable but not guessable: no ambiguous characters, 14 of them. */
function generatePassword(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  return [...randomBytes(14)].map((byte) => alphabet[byte % alphabet.length]).join('');
}

export async function createUser(_prev: UserState, formData: FormData): Promise<UserState> {
  const admin = await requireAdmin();

  const parsed = userSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the details.' };
  }

  const existing = await db.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });
  if (existing) return { ok: false, message: 'Somebody already has that email address.' };

  // Generated here rather than typed by the person creating the account: it is
  // the one moment the password is guaranteed not to be a reused one.
  const password = generatePassword();
  const user = await db.user.create({
    data: { ...parsed.data, passwordHash: await bcrypt.hash(password, 10) },
  });

  recordAudit({
    userId: admin.id,
    action: 'create',
    entity: 'User',
    entityId: user.id,
    meta: { email: parsed.data.email, role: parsed.data.role },
  });

  revalidatePath('/admin/users');
  // Returned so it can be shown once. It is never stored in readable form and
  // cannot be shown again.
  return { ok: true, message: `Account created for ${parsed.data.email}.`, password };
}

export async function resetPassword(id: string): Promise<UserState> {
  const admin = await requireAdmin();

  const target = await db.user.findUnique({ where: { id }, select: { email: true } });
  if (!target) return { ok: false, message: 'That account no longer exists.' };

  const password = generatePassword();
  await db.user.update({ where: { id }, data: { passwordHash: await bcrypt.hash(password, 10) } });
  recordAudit({
    userId: admin.id,
    action: 'reset-password',
    entity: 'User',
    entityId: id,
  });

  revalidatePath('/admin/users');
  return { ok: true, message: `New password for ${target.email}.`, password };
}

export async function setActive(id: string, formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const isActive = formData.get('isActive') === 'true';

  // Locking yourself out is the one mistake with no way back from the browser.
  if (id === admin.id && !isActive) return;

  if (!isActive) {
    const others = await db.user.count({
      where: { role: 'ADMIN', isActive: true, NOT: { id } },
    });
    if (others === 0) return; // Never leave the site with no active admin.
  }

  await db.user.update({ where: { id }, data: { isActive } });
  recordAudit({
    userId: admin.id,
    action: isActive ? 'activate' : 'deactivate',
    entity: 'User',
    entityId: id,
  });
  revalidatePath('/admin/users');
}

/**
 * Removes an account.
 *
 * Switching off is the better answer almost always — it keeps the audit trail
 * attached to a name. This exists for the case switching off does not cover: an
 * email typed wrongly at creation, which would otherwise sit in the list for
 * ever. The trail survives either way: the log's userId is set to null rather
 * than cascaded, and the deletion itself is recorded with the email on it.
 */
export async function deleteUser(id: string): Promise<void> {
  const admin = await requireAdmin();
  if (id === admin.id) return;

  const target = await db.user.findUnique({
    where: { id },
    select: { email: true, role: true, isActive: true },
  });
  if (!target) return;

  if (target.role === 'ADMIN' && target.isActive) {
    const others = await db.user.count({ where: { role: 'ADMIN', isActive: true, NOT: { id } } });
    if (others === 0) return;
  }

  await db.user.delete({ where: { id } });
  recordAudit({
    userId: admin.id,
    action: 'delete',
    entity: 'User',
    entityId: id,
    meta: { email: target.email },
  });
  revalidatePath('/admin/users');
}

export async function setRole(id: string, formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const role = formData.get('role') === 'ADMIN' ? 'ADMIN' : 'EDITOR';

  if (id === admin.id && role !== 'ADMIN') return;
  if (role === 'EDITOR') {
    const others = await db.user.count({ where: { role: 'ADMIN', isActive: true, NOT: { id } } });
    if (others === 0) return;
  }

  await db.user.update({ where: { id }, data: { role } });
  recordAudit({
    userId: admin.id,
    action: 'role',
    entity: 'User',
    entityId: id,
    meta: { role },
  });
  revalidatePath('/admin/users');
}
