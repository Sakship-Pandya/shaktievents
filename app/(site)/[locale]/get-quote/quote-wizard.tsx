'use client';

import { ArrowLeft, ArrowRight, Check, LoaderCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { WhatsAppIcon } from '@/components/brand/icons';
import { submitQuote, type QuoteState } from './actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const initial: QuoteState = { status: 'idle' };
const TOTAL_STEPS = 4;

export type WizardOption = { slug: string; name: string; blurb?: string };

export type WizardLabels = Record<string, string>;

export type QuoteWizardProps = {
  eventTypes: WizardOption[];
  services: WizardOption[];
  peakMonths: number[];
  labels: WizardLabels;
};

function Chip({
  selected,
  onClick,
  title,
  blurb,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  blurb?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex h-full flex-col rounded-2xl border p-5 text-left transition-all duration-300',
        selected
          ? 'border-marigold bg-marigold/10 text-ivory'
          : 'border-gold/30 text-ivory/85 hover:border-gold/60 hover:bg-gold/5',
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="font-display text-lg leading-snug font-medium">{title}</span>
        {selected ? <Check className="mt-1 size-4 shrink-0 text-marigold" /> : null}
      </span>
      {blurb ? (
        <span className="mt-2 text-[0.85rem] leading-relaxed text-ivory-muted">{blurb}</span>
      ) : null}
    </button>
  );
}

function SubmitButton({ label, busyLabel }: { label: string; busyLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-13 items-center gap-2 rounded-full bg-marigold px-8 text-[0.95rem] font-semibold text-ink transition-colors hover:bg-marigold-300 disabled:opacity-60 md:h-14"
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
      {pending ? busyLabel : label}
    </button>
  );
}

/**
 * Four steps, with the answers held in component state and mirrored into the
 * URL so a refresh or a shared link keeps the visitor's place. Everything is
 * submitted at once at the end: the estimate is computed on the server, which
 * keeps the pricing rules off the client.
 */
export function QuoteWizard({ eventTypes, services, peakMonths, labels }: QuoteWizardProps) {
  const params = useSearchParams();
  const [state, formAction] = useActionState(submitQuote, initial);

  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState(params.get('eventType') ?? '');
  const [guests, setGuests] = useState(Number(params.get('guests')) || 500);
  const [eventDate, setEventDate] = useState(params.get('date') ?? '');
  const [selected, setSelected] = useState<string[]>(() => {
    const preset = params.get('service');
    return preset ? [preset] : [];
  });
  const [town, setTown] = useState(params.get('town') ?? '');

  // Mirror answers into the URL without adding history entries.
  useEffect(() => {
    const next = new URLSearchParams();
    if (eventType) next.set('eventType', eventType);
    if (guests) next.set('guests', String(guests));
    if (eventDate) next.set('date', eventDate);
    if (town) next.set('town', town);
    const query = next.toString();
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
  }, [eventType, guests, eventDate, town]);

  const isPeak = useMemo(() => {
    if (!eventDate) return false;
    const month = Number(eventDate.slice(5, 7));
    return peakMonths.includes(month);
  }, [eventDate, peakMonths]);

  const errors = state.status === 'error' ? state.fieldErrors : {};

  if (state.status === 'done') {
    const { summary } = state;
    return (
      <div className="rounded-3xl border border-gold/30 bg-ink-800 p-8 md:p-10">
        <h2 className="font-display text-display-md font-medium text-ivory">
          {labels.doneTitle?.replace('{name}', summary.name)}
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory-muted">
          {labels.doneBody}
        </p>
        <p className="mt-5 text-sm text-gold-soft">
          {labels.reference}: <span className="font-semibold tabular">{summary.reference}</span>
        </p>

        <div className="mt-8 rounded-2xl border border-gold/25 bg-ink p-6">
          <p className="eyebrow text-gold">{labels.estimateTitle}</p>
          {summary.estimate ? (
            <>
              <p className="mt-3 font-display text-display-md text-marigold tabular">
                {summary.estimate.formatted}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ivory-muted">
                {labels.estimateNote}
                {summary.estimate.isPeakSeason ? ` ${labels.peakEstimateNote}` : ''}
              </p>
            </>
          ) : (
            <p className="mt-3 text-base leading-relaxed text-ivory-muted">{labels.noEstimate}</p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {summary.whatsappUrl ? (
            <a
              href={summary.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="whatsapp"
              className="inline-flex h-13 items-center gap-2 rounded-full bg-marigold px-7 text-[0.95rem] font-semibold text-ink transition-colors hover:bg-marigold-300"
            >
              <WhatsAppIcon className="size-5" />
              {labels.sendWhatsapp}
            </a>
          ) : null}
          <button
            type="button"
            // A full reload, not a client navigation: the wizard has to come
            // back empty, and useActionState offers no way to reset it.
            onClick={() => window.location.assign(window.location.pathname)}
            className="inline-flex h-13 items-center rounded-full border border-gold/45 px-7 text-[0.95rem] font-semibold text-ivory transition-colors hover:border-gold hover:bg-gold/10"
          >
            {labels.startAgain}
          </button>
        </div>
      </div>
    );
  }

  const canAdvance =
    (step === 1 && eventType !== '') || (step === 2 && guests > 0) || step === 3 || step === 4;

  return (
    <form action={formAction} className="rounded-3xl border border-gold/25 bg-ink-800 p-6 md:p-9">
      {/* Everything answered so far travels with the submit, whichever step it happens on. */}
      <input type="hidden" name="eventType" value={eventType} />
      <input type="hidden" name="guests" value={guests} />
      <input type="hidden" name="eventDate" value={eventDate} />
      <input type="hidden" name="sourcePath" value="/get-quote" />
      {selected.map((slug) => (
        <input key={slug} type="hidden" name="serviceSlugs" value={slug} />
      ))}

      {/* Honeypot: off-screen and out of the tab order, not display:none, which
          some bots detect. A person never sees or reaches it. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">{labels.honeypot}</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow text-gold">
          {labels.stepOf?.replace('{step}', String(step)).replace('{total}', String(TOTAL_STEPS))}
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <span
              key={i}
              className={cn(
                'h-1 w-8 rounded-full transition-colors',
                i < step ? 'bg-marigold' : 'bg-gold/25',
              )}
            />
          ))}
        </div>
      </div>

      <h2 className="mt-5 font-display text-display-sm font-medium text-ivory">
        {[labels.stepEvent, labels.stepScale, labels.stepServices, labels.stepContact][step - 1]}
      </h2>

      <div className="mt-7">
        {step === 1 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {eventTypes.map((item) => (
              <Chip
                key={item.slug}
                title={item.name}
                blurb={item.blurb}
                selected={eventType === item.slug}
                onClick={() => {
                  setEventType(item.slug);
                  setStep(2);
                }}
              />
            ))}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-8">
            <div>
              <Label htmlFor="guest-slider" className="text-ivory">
                {labels.guests}
              </Label>
              <p className="mt-1.5 mb-4 text-sm text-ivory-muted">{labels.guestsHelp}</p>
              <div className="flex items-center gap-5">
                <input
                  id="guest-slider"
                  type="range"
                  min={100}
                  max={10000}
                  step={100}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="h-1.5 flex-1 accent-[var(--color-marigold)]"
                />
                <output className="w-24 shrink-0 text-right font-display text-2xl text-marigold tabular">
                  {guests.toLocaleString('en-IN')}
                </output>
              </div>
            </div>

            <div>
              <Label htmlFor="event-date" className="text-ivory">
                {labels.date}
              </Label>
              <Input
                id="event-date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="mt-2 max-w-xs"
              />
              <p className="mt-1.5 text-sm text-ivory-muted">{labels.dateHelp}</p>
              {isPeak ? (
                <p className="mt-3 rounded-lg border border-marigold/40 bg-marigold/10 px-4 py-2.5 text-sm text-marigold">
                  {labels.peakNotice}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <p className="mb-5 text-sm text-ivory-muted">{labels.servicesHelp}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Chip
                  key={service.slug}
                  title={service.name}
                  selected={selected.includes(service.slug)}
                  onClick={() =>
                    setSelected((current) =>
                      current.includes(service.slug)
                        ? current.filter((s) => s !== service.slug)
                        : [...current, service.slug],
                    )
                  }
                />
              ))}
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="q-name" className="text-ivory">
                {labels.name}
              </Label>
              <Input id="q-name" name="name" required autoComplete="name" className="mt-2" />
              {errors.name ? (
                <p className="mt-1.5 text-xs font-medium text-error">{errors.name[0]}</p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="q-phone" className="text-ivory">
                {labels.phone}
              </Label>
              <Input
                id="q-phone"
                name="phone"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder="98765 43210"
                className="mt-2"
              />
              <p className="mt-1.5 text-xs text-ivory-muted">{labels.phoneHelp}</p>
              {errors.phone ? (
                <p className="mt-1.5 text-xs font-medium text-error">{errors.phone[0]}</p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="q-town" className="text-ivory">
                {labels.town}
              </Label>
              <Input
                id="q-town"
                name="town"
                value={town}
                onChange={(e) => setTown(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="q-email" className="text-ivory">
                {labels.email}
              </Label>
              <Input id="q-email" name="email" type="email" autoComplete="email" className="mt-2" />
              {errors.email ? (
                <p className="mt-1.5 text-xs font-medium text-error">{errors.email[0]}</p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="q-message" className="text-ivory">
                {labels.message}
              </Label>
              <Textarea id="q-message" name="message" rows={3} className="mt-2" />
            </div>
          </div>
        ) : null}
      </div>

      {state.status === 'error' ? (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-sm text-error"
        >
          {state.message}
        </p>
      ) : null}

      <div className="mt-9 flex items-center justify-between gap-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-gold/40 px-6 text-sm font-semibold text-ivory transition-colors hover:border-gold hover:bg-gold/10"
          >
            <ArrowLeft className="size-4" />
            {labels.back}
          </button>
        ) : (
          <span />
        )}

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-marigold px-7 text-sm font-semibold text-ink transition-colors hover:bg-marigold-300 disabled:opacity-40"
          >
            {labels.next}
            <ArrowRight className="size-4" />
          </button>
        ) : (
          <SubmitButton label={labels.submit ?? ''} busyLabel={labels.submitting ?? ''} />
        )}
      </div>
    </form>
  );
}
