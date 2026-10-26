import { LogOut } from 'lucide-react';
import { signOutAction } from './sign-out';
import type { SessionUser } from '@/lib/auth-helpers';

export function UserMenu({ user }: { user: SessionUser }) {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm leading-tight font-medium text-ink">{user.name ?? user.email}</p>
        <p className="text-[0.7rem] tracking-wide text-muted-foreground uppercase">{user.role}</p>
      </div>
      <form action={signOutAction}>
        <button
          type="submit"
          className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-3.5 text-sm text-ink transition-colors hover:border-maroon/40 hover:bg-sand"
        >
          <LogOut className="size-4" />
          <span className="max-sm:sr-only">Sign out</span>
        </button>
      </form>
    </div>
  );
}
