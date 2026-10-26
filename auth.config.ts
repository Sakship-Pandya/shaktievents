import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-safe slice of the Auth.js config. The middleware runs on the edge and
 * only needs to *decode* the JWT, so this file must not import Prisma,
 * bcrypt or anything else with a Node dependency. The providers and the
 * database adapter live in auth.ts, which only runs in the Node runtime.
 */
export const authConfig = {
  providers: [],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  trustHost: true,
} satisfies NextAuthConfig;
