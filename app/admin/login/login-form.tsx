'use client';

import { LoaderCircle, LockKeyhole } from 'lucide-react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login, type LoginState } from './actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialState: LoginState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-maroon text-sm font-semibold text-ivory transition-colors hover:bg-maroon-600 disabled:opacity-60"
    >
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <LockKeyhole className="size-4" />
      )}
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  );
}

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-error/30 bg-error/8 px-4 py-3 text-sm text-error"
        >
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
