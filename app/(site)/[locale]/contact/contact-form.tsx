'use client';

import { LoaderCircle, Send } from 'lucide-react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitQuote, type QuoteState } from '../get-quote/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const initial: QuoteState = { status: 'idle' };

/**
 * The short form. It posts through the same action as the quote wizard, so
 * validation, rate limiting, duplicate detection and the notification email
 * behave identically — there is only one way an enquiry enters the system.
 */
export function ContactForm({ labels }: { labels: Record<string, string> }) {
  const [state, action] = useActionState(submitQuote, initial);
  const errors = state.status === 'error' ? state.fieldErrors : {};

  if (state.status === 'done') {
    return (
      <div className="rounded-2xl border border-gold/30 bg-ink-800 p-7">
        <h3 className="font-display text-display-sm font-medium text-ivory">
          {labels.doneTitle?.replace('{name}', state.summary.name)}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-ivory-muted">{labels.doneBody}</p>
        <p className="mt-4 text-sm text-gold-soft">
          {labels.reference}:{' '}
          <span className="font-semibold tabular">{state.summary.reference}</span>
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="sourcePath" value="/contact" />
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="c-website">{labels.honeypot}</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <Label htmlFor="c-name" className="text-ivory">
          {labels.name}
        </Label>
        <Input id="c-name" name="name" required autoComplete="name" className="mt-2" />
        {errors.name ? <p className="mt-1.5 text-xs text-error">{errors.name[0]}</p> : null}
      </div>

      <div>
        <Label htmlFor="c-phone" className="text-ivory">
          {labels.phone}
        </Label>
        <Input
          id="c-phone"
          name="phone"
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="98765 43210"
          className="mt-2"
        />
        {errors.phone ? <p className="mt-1.5 text-xs text-error">{errors.phone[0]}</p> : null}
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="c-message" className="text-ivory">
          {labels.message}
        </Label>
        <Textarea id="c-message" name="message" rows={4} className="mt-2" />
      </div>

      {state.status === 'error' ? (
        <p
          role="alert"
          className="rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-sm text-error sm:col-span-2"
        >
          {state.message}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <SubmitButton label={labels.submit ?? ''} busyLabel={labels.submitting ?? ''} />
      </div>
    </form>
  );
}

function SubmitButton({ label, busyLabel }: { label: string; busyLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center gap-2 rounded-full bg-marigold px-7 text-sm font-semibold text-ink transition-colors hover:bg-marigold-300 disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
      {pending ? busyLabel : label}
    </button>
  );
}
