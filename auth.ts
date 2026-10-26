import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { db } from '@/lib/db';
import { loginSchema } from '@/lib/schemas/auth';

const MAX_ATTEMPTS = 5;
const BLOCK_MINUTES = 15;

/** A real bcrypt hash to compare against when the email doesn't exist, so a
 *  wrong email and a wrong password take the same time to fail. */
const DUMMY_HASH = '$2b$12$t47rBk2BHmB7.LJviQx3yOn4fdMuvl4f113GyfUHelHyoy0H12kZW';

async function isBlocked(key: string): Promise<boolean> {
  const row = await db.loginAttempt.findUnique({ where: { key } });
  if (!row?.blockedAt) return false;

  const unblockAt = new Date(row.blockedAt.getTime() + BLOCK_MINUTES * 60_000);
  if (unblockAt > new Date()) return true;

  await db.loginAttempt.update({ where: { key }, data: { count: 0, blockedAt: null } });
  return false;
}

async function recordFailure(key: string): Promise<void> {
  const row = await db.loginAttempt.upsert({
    where: { key },
    update: { count: { increment: 1 } },
    create: { key, count: 1 },
  });

  if (row.count >= MAX_ATTEMPTS && !row.blockedAt) {
    await db.loginAttempt.update({ where: { key }, data: { blockedAt: new Date() } });
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        if (await isBlocked(email)) return null;

        const user = await db.user.findUnique({ where: { email } });
        const hash = user?.passwordHash ?? DUMMY_HASH;
        const passwordMatches = await bcrypt.compare(password, hash);

        if (!user || !user.passwordHash || !user.isActive || !passwordMatches) {
          await recordFailure(email);
          return null;
        }

        await db.$transaction([
          db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
          db.loginAttempt.deleteMany({ where: { key: email } }),
          db.auditLog.create({
            data: { userId: user.id, action: 'login', entity: 'User', entityId: user.id },
          }),
        ]);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      if (token.role) session.user.role = token.role;
      return session;
    },
  },
});
