import type { DefaultSession } from 'next-auth';
import type { Role } from '@/lib/generated/prisma/enums';

/**
 * Carries the admin role through the session. `next-auth/jwt` only re-exports
 * @auth/core/jwt, so the JWT interface has to be augmented on the core module
 * — augmenting the re-export has no effect.
 */
declare module 'next-auth' {
  interface Session {
    user: { id: string; role: Role } & DefaultSession['user'];
  }

  interface User {
    role?: Role;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: Role;
  }
}
