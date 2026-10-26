'use client';

import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NavLink } from '@/components/site/nav-link';

const STORAGE_KEY = 'shaktimandap:popup-seen';
const DELAY_MS = 8000;

/** Pages where interrupting the visitor can only lose the enquiry. */
const SUPPRESSED = ['/get-quote', '/contact'];

/**
 * A delayed enquiry prompt, shown once per browser session.
 *
 * Never shown on the quote or contact pages — interrupting somebody who is
 * already filling in the form is the one place this can only lose you an
 * enquiry. Checked here rather than at the layout, which cannot see the path.
 *
 * sessionStorage rather than a cookie: it should come back on a new visit, not
 * be suppressed for a month, and it never needs to reach the server.
 */
export function EnquiryPopup({
  title,
  body,
  cta,
  dismiss,
}: {
  title: string;
  body: string;
  cta: string;
  dismiss: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const suppressed = SUPPRESSED.some((path) => pathname.endsWith(path));

  useEffect(() => {
    if (suppressed) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      // Private browsing can throw on access; treat it as not yet seen.
    }
    if (seen) return;

    const timer = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [suppressed]);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Nothing to do; it will simply show again next page load.
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="popup-title"
      className="fixed right-4 bottom-20 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-gold/35 bg-ink-800 p-6 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.8)] motion-safe:animate-fade-up md:right-6 md:bottom-24"
    >
      <button
        type="button"
        onClick={close}
        aria-label={dismiss}
        className="absolute top-3 right-3 grid size-8 place-items-center rounded-full text-ivory-muted transition-colors hover:bg-gold/10 hover:text-ivory"
      >
        <X className="size-4" />
      </button>

      <h2 id="popup-title" className="pr-8 font-display text-lg font-medium text-ivory">
        {title}
      </h2>
      <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ivory-muted">{body}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <NavLink
          href="/get-quote"
          data-cta="quote"
          onClick={close}
          className="inline-flex h-11 items-center rounded-full bg-marigold px-6 text-[0.85rem] font-semibold text-ink transition-colors hover:bg-marigold-300"
        >
          {cta}
        </NavLink>
        <button
          type="button"
          onClick={close}
          className="text-[0.85rem] font-semibold text-ivory-muted transition-colors hover:text-marigold"
        >
          {dismiss}
        </button>
      </div>
    </div>
  );
}
