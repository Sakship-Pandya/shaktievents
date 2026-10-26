import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-safe slice of the Auth.js config. The middleware runs on the edge and
 * only needs to *decode* the JWT, so this file must not import Prisma,
 * bcrypt or anything else with a Node dependency. The providers and the
 */

if (process.env.VERCEL && process.env.AUTH_URL?.includes('localhost')) {
  delete process.env.AUTH_URL;
}

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
