'use client';

import { LoaderCircle, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useId, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { saveSettings, type SettingsState } from './actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type SettingsValues = Record<string, string>;

// Lives here, not in actions.ts: a "use server" module may only export async
// functions, so a plain object export breaks the build.
const emptySettingsState: SettingsState = { ok: false, message: null, errors: {} };

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-display text-display-sm font-medium text-ink">{title}</h2>
      {hint ? <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p> : null}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

type FieldProps = {
  name: string;
  label: string;
  value: string;
  errors: SettingsState['errors'];
  type?: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  wide?: boolean;
  multiline?: boolean;
};

function Field({
  name,
  label,
  value,
  errors,
  type = 'text',
  placeholder,
  hint,
  required,
  wide,
  multiline,
}: FieldProps) {
  const id = useId();
  const fieldErrors = errors[name];
  const describedBy = [hint ? `${id}-hint` : null, fieldErrors ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <Label htmlFor={id}>
        {label}
        {required ? <span className="ml-0.5 text-error">*</span> : null}
      </Label>
      {multiline ? (
        <Textarea
          id={id}
          name={name}
          defaultValue={value}
          placeholder={placeholder}
          rows={3}
          className="mt-2"
          aria-invalid={fieldErrors ? true : undefined}
          aria-describedby={describedBy || undefined}
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          className="mt-2"
          aria-invalid={fieldErrors ? true : undefined}
          aria-describedby={describedBy || undefined}
        />
      )}
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {fieldErrors ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-error">
          {fieldErrors[0]}
        </p>
      ) : null}
    </div>
  );
}

function SaveBar() {
  const { pending } = useFormStatus();

  return (
    <div className="sticky bottom-0 -mx-5 mt-8 flex items-center justify-end gap-4 border-t border-border bg-ivory/95 px-5 py-4 backdrop-blur-md lg:-mx-8 lg:px-8">
      <p className="mr-auto text-xs text-muted-foreground">
        Blank fields show as <span className="font-semibold">[TBD]</span> on the public site.
      </p>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-maroon px-7 text-sm font-semibold text-ivory transition-colors hover:bg-maroon-600 disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
        {pending ? 'Saving…' : 'Save settings'}
      </button>
    </div>
  );
}

export function SettingsForm({ values }: { values: SettingsValues }) {
  const router = useRouter();
  const [state, formAction] = useActionState(saveSettings, emptySettingsState);

  useEffect(() => {
    if (state.message) {
      if (state.ok) {
        toast.success(state.message);
        router.push('/admin');
      } else {
        toast.error(state.message);
      }
    }
  }, [state, router]);

  const f = (name: string) => ({ name, value: values[name] ?? '', errors: state.errors });

  return (
    <form action={formAction} className="space-y-6">
      <Section
        title="Business"
        hint="Used in the footer, the contact page and the LocalBusiness schema."
      >
        <Field {...f('businessName')} label="Legal / full business name" required />
        <Field
          {...f('shortName')}
          label="Short name"
          required
          hint="Shown in the navbar and CTAs."
        />
        <Field {...f('ownerName')} label="Owner name" />
        <Field
          {...f('establishedYear')}
          label="Established year"
          type="number"
          placeholder="e.g. 1998"
          hint="Drives “since {year}” in the hero."
        />
        <Field {...f('gstNo')} label="GST number" wide />
      </Section>

      <Section title="Contact" hint="Phone numbers must be 10-digit Indian mobile numbers.">
        <Field {...f('phonePrimary')} label="Primary phone" placeholder="98765 43210" />
        <Field {...f('phoneSecondary')} label="Secondary phone" />
        <Field
          {...f('whatsappNumber')}
          label="WhatsApp number"
          hint="Used for every WhatsApp button."
        />
        <Field {...f('email')} label="Email" type="email" />
        <Field
          {...f('whatsappDefaultMessage')}
          label="Default WhatsApp message"
          wide
          multiline
          hint="Pre-filled when someone taps a WhatsApp button."
        />
      </Section>

      <Section title="Address" hint="This exact wording should match your Google Business Profile.">
        <Field {...f('addressLine')} label="Address line" wide />
        <Field {...f('area')} label="Area / locality" />
        <Field {...f('city')} label="City" required />
        <Field {...f('district')} label="District" required />
        <Field {...f('state')} label="State" required />
        <Field {...f('pin')} label="PIN code" required placeholder="363001" />
        <Field {...f('googleMapsUrl')} label="Google Maps link" wide type="url" />
        <Field
          {...f('googleBusinessProfileUrl')}
          label="Google Business Profile link"
          wide
          type="url"
        />
      </Section>

      <Section title="Social">
        <Field {...f('instagram')} label="Instagram URL" type="url" />
        <Field {...f('facebook')} label="Facebook URL" type="url" />
        <Field {...f('youtube')} label="YouTube URL" type="url" />
      </Section>

      <Section
        title="Numbers"
        hint="Shown as counters in the hero. Leave blank rather than estimating."
      >
        <Field {...f('eventsCompleted')} label="Events completed" type="number" />
        <Field {...f('teamSize')} label="Crew members" type="number" />
        <Field {...f('townsServed')} label="Towns served" type="number" />
      </Section>

      <Section title="Analytics & notifications">
        <Field {...f('gaId')} label="GA4 measurement ID" placeholder="G-XXXXXXXXXX" />
        <Field {...f('gtmId')} label="GTM container ID" placeholder="GTM-XXXXXXX" />
        <Field
          {...f('enquiryToEmails')}
          label="Send enquiries to"
          wide
          multiline
          hint="One address per line, or separated by commas."
        />
      </Section>

      <SaveBar />
    </form>
  );
}
