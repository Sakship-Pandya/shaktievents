import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import type { Role } from '@/lib/generated/prisma/enums';

export type SessionUser = {
  id: string;
  role: Role;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

/**
 * Server-side gate for admin pages and server actions. The middleware already
 * redirects anonymous requests, but actions and route handlers are reachable
 * without a page navigation, so every one of them calls this too.
 */
export async function requireUser(): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user?.id) redirect('/admin/login');
  return session.user as SessionUser;
}

/** Non-redirecting variant for route handlers, which should answer 401. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  return session?.user?.id ? (session.user as SessionUser) : null;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== 'ADMIN') redirect('/admin?denied=1');
  return user;
}
