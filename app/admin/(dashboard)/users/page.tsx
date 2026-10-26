import type { Metadata } from 'next';
import { UserList, type UserRow } from './user-list';
import { requireAdmin } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Users & roles' };
export const dynamic = 'force-dynamic';

const when = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Kolkata',
});

export default async function UsersPage() {
  // Editors can change the site; only an admin can change who gets in.
  const me = await requireAdmin();

  const rows = await db.user.findMany({
    orderBy: [{ isActive: 'desc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
    },
  });

  const users: UserRow[] = rows.map((row) => ({
    id: row.id,
    name: row.name ?? row.email,
    email: row.email,
    role: row.role,
    isActive: row.isActive,
    lastLoginAt: row.lastLoginAt ? when.format(row.lastLoginAt) : null,
    isSelf: row.id === me.id,
  }));

  return (
    <div className="mx-auto max-w-4xl">

      <h1 className="font-display text-display-md font-medium text-ink">Users &amp; roles</h1>
      <p className="mt-2 mb-8 max-w-2xl text-sm text-muted-foreground">
        Who can sign in to this panel. Give somebody their own account rather than sharing yours —
        the audit log is only useful if it says who actually made a change.
      </p>

      <UserList users={users} />
    </div>
  );
}
