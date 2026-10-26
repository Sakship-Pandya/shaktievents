'use client';

import { ArrowLeft, Check, Link2, RotateCcw, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { WhatsAppIcon } from '@/components/brand/icons';
import { cn } from '@/lib/utils';

export type StyleCard = {
  id: string;
  name: string;
  description: string;
  service: string;
};

export type ExplorerLabels = Record<string, string>;

/**
 * Swipe through mandap and decoration styles, keep the ones you like, send the
 * shortlist on WhatsApp.
 *
 * The shortlist lives in the URL rather than in storage, so it can be shared
 * with the rest of the family — which is how these decisions actually get
 * made — and so returning to a shared link restores exactly what was kept.
 */
export function StyleExplorer({
  cards,
  labels,
  whatsappNumber,
}: {
  cards: StyleCard[];
  labels: ExplorerLabels;
  whatsappNumber: string | null;
}) {
  const [index, setIndex] = useState(0);
  const [kept, setKept] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Restore a shared shortlist on first render.
  useEffect(() => {
    const ids = new URLSearchParams(window.location.search).get('styles');
    if (!ids) return;
    const valid = ids.split(',').filter((id) => cards.some((card) => card.id === id));
    if (valid.length > 0) {
      setKept(valid);
      setIndex(cards.length);
    }
  }, [cards]);

  const sync = useCallback((next: string[]) => {
    const params = new URLSearchParams(window.location.search);
    if (next.length > 0) params.set('styles', next.join(','));
    else params.delete('styles');
    const query = params.toString();
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
  }, []);

  const decide = (keep: boolean) => {
    const card = cards[index];
    if (!card) return;
    if (keep) {
      const next = [...kept, card.id];
      setKept(next);
      sync(next);
    }
    setIndex((i) => i + 1);
  };

  const remove = (id: string) => {
    const next = kept.filter((k) => k !== id);
    setKept(next);
    sync(next);
  };

  const reset = () => {
    setKept([]);
    setIndex(0);
    sync([]);
  };

  const keptCards = useMemo(
    () => kept.map((id) => cards.find((card) => card.id === id)).filter(Boolean) as StyleCard[],
    [kept, cards],
  );

  const waHref = useMemo(() => {
    if (!whatsappNumber || keptCards.length === 0) return null;
    const lines = [
      labels.stylesWaIntro,
      ...keptCards.map((card) => `• ${card.name} (${card.service})`),
    ].join('\n');
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines)}`;
  }, [whatsappNumber, keptCards, labels.stylesWaIntro]);

  const current = cards[index];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
      <div>
        {current ? (
          <div className="rounded-3xl border border-gold/30 bg-ink-800 p-8">
            <p className="eyebrow text-gold">{current.service}</p>
            <h3 className="mt-4 font-display text-display-md font-medium text-ivory">
              {current.name}
            </h3>
            <p className="mt-5 text-base leading-relaxed text-ivory-muted">{current.description}</p>

            <div className="mt-9 flex items-center gap-3">
              <button
                type="button"
                onClick={() => decide(false)}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-gold/40 px-6 text-sm font-semibold text-ivory-muted transition-colors hover:border-gold hover:text-ivory"
              >
                <X className="size-4" />
                {labels.stylesSkip}
              </button>
              <button
                type="button"
                onClick={() => decide(true)}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-marigold px-7 text-sm font-semibold text-ink transition-colors hover:bg-marigold-300"
              >
                <Check className="size-4" />
                {labels.stylesKeep}
              </button>
              {index > 0 ? (
                <button
                  type="button"
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  aria-label={labels.back ?? 'Back'}
                  className="grid size-10 place-items-center rounded-full border border-gold/30 text-ivory-muted transition-colors hover:border-gold hover:text-ivory"
                >
                  <ArrowLeft className="size-4" />
                </button>
              ) : null}
            </div>

            <p className="mt-6 text-xs text-ivory-muted tabular">
              {index + 1} / {cards.length}
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gold/40 p-10 text-center">
            <p className="text-base text-ivory-muted">
              {keptCards.length > 0 ? labels.stylesShortlist : labels.stylesEmpty}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-gold/40 px-6 text-sm font-semibold text-ivory transition-colors hover:border-gold hover:bg-gold/10"
            >
              <RotateCcw className="size-4" />
              {labels.stylesReset}
            </button>
          </div>
        )}
      </div>

      <aside className="rounded-3xl border border-gold/25 bg-ink-800 p-6">
        <h3 className="eyebrow text-gold">{labels.stylesShortlist}</h3>

        {keptCards.length === 0 ? (
          <p className="mt-4 text-sm text-ivory-muted">{labels.stylesEmpty}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {keptCards.map((card) => (
              <li
                key={card.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-gold/25 px-3.5 py-2.5"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[0.9rem] text-ivory">{card.name}</span>
                  <span className="block truncate text-[0.7rem] text-ivory-muted">
                    {card.service}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => remove(card.id)}
                  aria-label={`${labels.stylesSkip} ${card.name}`}
                  className="grid size-7 shrink-0 place-items-center rounded text-ivory-muted transition-colors hover:bg-gold/10 hover:text-ivory"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 space-y-3">
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="whatsapp"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-marigold text-[0.9rem] font-semibold text-ink transition-colors hover:bg-marigold-300"
            >
              <WhatsAppIcon className="size-4" />
              {labels.stylesSend}
            </a>
          ) : null}

          {keptCards.length > 0 ? (
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  // Clipboard can be blocked; the URL is in the address bar anyway.
                }
              }}
              className={cn(
                'inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border text-[0.85rem] font-semibold transition-colors',
                copied
                  ? 'border-marigold text-marigold'
                  : 'border-gold/40 text-ivory hover:border-gold hover:bg-gold/10',
              )}
            >
              <Link2 className="size-4" />
              {copied ? labels.stylesCopied : labels.stylesShare}
            </button>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
