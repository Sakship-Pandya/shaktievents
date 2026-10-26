'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { loginSchema } from '@/lib/schemas/auth';

export type LoginState = { error: string | null };

/** Only ever redirect back inside the admin panel — never to a URL the form supplied. */
function safeRedirect(raw: FormDataEntryValue | null): string {
  const value = typeof raw === 'string' ? raw : '';
  return value.startsWith('/admin') && !value.startsWith('//') ? value : '/admin';
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { error: 'Enter a valid email address and your password.' };
  }

  try {
    await signIn('credentials', {
      ...parsed.data,
      redirectTo: safeRedirect(formData.get('callbackUrl')),
    });
  } catch (error) {
    // A successful sign-in throws NEXT_REDIRECT, which must propagate.
    if (error instanceof AuthError) {
      return {
        error:
          'Those details did not match, or the account is locked after too many attempts. Try again in a few minutes.',
      };
    }
    throw error;
  }

  return { error: null };
}
