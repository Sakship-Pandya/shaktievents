'use client';

import { LoaderCircle, MessageSquarePlus } from 'lucide-react';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { addEnquiryNote, type NoteState } from '../actions';
import { Textarea } from '@/components/ui/textarea';

const initial: NoteState = { ok: false, message: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center gap-2 rounded-full bg-maroon px-5 text-[0.8rem] font-semibold text-ivory transition-colors hover:bg-maroon-600 disabled:opacity-60"
    >
      {pending ? (
        <LoaderCircle className="size-3.5 animate-spin" />
      ) : (
        <MessageSquarePlus className="size-3.5" />
      )}
      {pending ? 'Saving…' : 'Add note'}
    </button>
  );
}

export function NoteForm({ enquiryId }: { enquiryId: string }) {
  const [state, action] = useActionState(addEnquiryNote, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
      formRef.current?.reset();
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="mt-4">
      <input type="hidden" name="enquiryId" value={enquiryId} />
      <Textarea
        name="body"
        rows={3}
        required
        placeholder="Called, site visit booked for Thursday…"
        aria-label="Note"
      />
      <div className="mt-3 flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
