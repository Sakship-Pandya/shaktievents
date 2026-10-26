import type { Metadata } from 'next';
import { Logo } from '@/components/brand/logo';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Sign in' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <main className="grid min-h-svh place-items-center bg-[radial-gradient(90%_70%_at_50%_0%,var(--color-sand)_0%,var(--color-ivory)_65%)] px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-9 flex justify-center">
          <span className="text-maroon">
            <Logo name="Shree Shakti" tagline="Admin panel" className="[&_span]:text-ink" />
          </span>
        </div>

        <div className="rounded-2xl border border-gold/40 bg-ivory p-7 shadow-[0_28px_60px_-38px_rgba(20,16,13,0.5)]">
          <h1 className="font-display text-display-sm font-medium text-ink">Sign in</h1>
          <p className="mt-2 mb-7 text-sm text-muted-foreground">
            Manage projects, enquiries and site content.
          </p>
          <LoginForm callbackUrl={callbackUrl ?? '/admin'} />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Locked out? Ask an administrator to reset your password.
        </p>
      </div>
    </main>
  );
}
