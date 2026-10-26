'use client';

import { KeyRound, LoaderCircle, ShieldCheck, Trash2, UserPlus } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import {
  createUser,
  deleteUser,
  resetPassword,
  setActive,
  setRole,
  type UserState,
} from './actions';
import { Field, Select } from '@/components/admin/form-bits';

const initial: UserState = { ok: false, message: null };

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
  isActive: boolean;
  lastLoginAt: string | null;
  isSelf: boolean;
};

/**
 * A generated password is shown exactly once, here, and then never again —
 * only its bcrypt hash is stored. Hiding it behind a click means it does not
 * sit on screen in an office where somebody else can read it.
 */
function PasswordOnce({ password, onDone }: { password: string; onDone: () => void }) {
  const [shown, setShown] = useState(false);

  return (
    <div className="mt-4 rounded-xl border border-gold bg-sand/70 p-5">
      <p className="text-sm font-semibold text-ink">
        Write this password down now. It cannot be shown again.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <code className="rounded-lg border border-border bg-background px-4 py-2 font-mono text-sm text-ink">
          {shown ? password : '•'.repeat(password.length)}
        </code>
        <button
          type="button"
          onClick={() => setShown((v) => !v)}
          className="text-[0.8rem] font-semibold text-maroon hover:underline"
        >
          {shown ? 'Hide' : 'Show'}
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(password);
              toast.success('Password copied.');
            } catch {
              setShown(true);
            }
          }}
          className="text-[0.8rem] font-semibold text-maroon hover:underline"
        >
          Copy
        </button>
        <button
          type="button"
          onClick={onDone}
          className="ml-auto text-[0.8rem] font-semibold text-muted-foreground hover:text-ink"
        >
          I have written it down
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Send it to them in person or by SMS, not on WhatsApp. Ask them to change it after they sign
        in.
      </p>
    </div>
  );
}

function Submit({ label, icon }: { label: string; icon: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-maroon px-6 text-[0.85rem] font-semibold text-ivory transition-colors hover:bg-maroon-600 disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : icon}
      {label}
    </button>
  );
}

function ResetButton({ id, onPassword }: { id: string; onPassword: (p: string) => void }) {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        if (!confirm('Give this person a new password? Their old one stops working at once.'))
          return;
        setBusy(true);
        const result = await resetPassword(id);
        setBusy(false);
        if (result.ok && result.password) {
          onPassword(result.password);
          toast.success(result.message ?? 'Password reset.');
        } else {
          toast.error(result.message ?? 'Could not reset that password.');
        }
      }}
      title="Give a new password"
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-ink transition-colors hover:bg-sand disabled:opacity-60"
    >
      {busy ? (
        <LoaderCircle className="size-3.5 animate-spin" />
      ) : (
        <KeyRound className="size-3.5" />
      )}
      New password
    </button>
  );
}

export function UserList({ users }: { users: UserRow[] }) {
  const [state, action] = useActionState(createUser, initial);
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
      if (state.password) setPassword(state.password);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  const activeAdmins = users.filter((u) => u.role === 'ADMIN' && u.isActive).length;

  return (
    <>
      <ul className="grid gap-3">
        {users.map((user) => {
          // The last active admin cannot be demoted or switched off from here,
          // because there would then be nobody who could switch anything back.
          const lastAdmin = user.role === 'ADMIN' && user.isActive && activeAdmins === 1;
          const locked = user.isSelf || lastAdmin;

          return (
            <li key={user.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold text-ink">
                    {user.name}
                    {user.isSelf ? (
                      <span className="rounded-full bg-sand px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                        You
                      </span>
                    ) : null}
                    {user.isActive ? null : (
                      <span className="rounded-full bg-error/10 px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.08em] text-error uppercase">
                        Switched off
                      </span>
                    )}
                  </p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{user.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {user.lastLoginAt ? `Last signed in ${user.lastLoginAt}` : 'Never signed in'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <form action={setRole.bind(null, user.id)}>
                    <select
                      name="role"
                      defaultValue={user.role}
                      disabled={locked}
                      onChange={(e) => e.currentTarget.form?.requestSubmit()}
                      className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs disabled:opacity-50"
                    >
                      <option value="ADMIN">Admin — can do everything</option>
                      <option value="EDITOR">Editor — content only</option>
                    </select>
                  </form>

                  <ResetButton id={user.id} onPassword={setPassword} />

                  <form action={setActive.bind(null, user.id)}>
                    <input type="hidden" name="isActive" value={String(!user.isActive)} />
                    <button
                      type="submit"
                      disabled={locked && user.isActive}
                      className="h-8 rounded-lg border border-border px-3 text-xs font-semibold text-ink transition-colors hover:bg-sand disabled:opacity-50"
                    >
                      {user.isActive ? 'Switch off' : 'Switch on'}
                    </button>
                  </form>

                  {user.isSelf ? null : (
                    <form action={deleteUser.bind(null, user.id)}>
                      <button
                        type="submit"
                        title="Remove this account"
                        aria-label={`Remove ${user.email}`}
                        onClick={(e) => {
                          if (
                            !confirm(
                              `Remove ${user.email} for good? Switching the account off is usually the better answer — it keeps their name on what they changed.`,
                            )
                          )
                            e.preventDefault();
                        }}
                        className="grid size-8 place-items-center rounded-lg border border-border text-error transition-colors hover:border-error/40 hover:bg-error/10"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {locked && user.isActive ? (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5 shrink-0 text-gold" />
                  {user.isSelf
                    ? 'You cannot switch off or demote your own account.'
                    : 'The only admin left — make somebody else an admin first.'}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

      {password ? <PasswordOnce password={password} onDone={() => setPassword(null)} /> : null}

      <form action={action} className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-display-sm font-medium text-ink">Add somebody</h2>
        <p className="mt-1.5 mb-5 text-sm text-muted-foreground">
          A password is generated and shown to you once. Editors can change everything on the public
          site; only an admin can add people or see the audit log.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field name="name" label="Name" value="" required />
          <Field name="email" label="Email" value="" type="email" required />
          <Select
            name="role"
            label="Role"
            value="EDITOR"
            options={[
              { value: 'EDITOR', label: 'Editor' },
              { value: 'ADMIN', label: 'Admin' },
            ]}
          />
        </div>
        <div className="mt-6">
          <Submit label="Create account" icon={<UserPlus className="size-4" />} />
        </div>
      </form>
    </>
  );
}
