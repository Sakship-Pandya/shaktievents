import { getTranslations } from 'next-intl/server';

export type EventMarqueeProps = {
  speedSeconds: number;
};

/**
 * Infinite strip of the functions we set up. The track holds two identical
 * copies and slides by -50%, which lands exactly one copy along — that is what
 * makes the loop seamless. The second copy is aria-hidden so screen readers
 * hear the list once.
 */
export async function EventMarquee({ speedSeconds }: EventMarqueeProps) {
  const t = await getTranslations('Marquee');
  const items = t.raw('items') as string[];

  return (
    <section className="border-y border-gold/20 bg-ink-800 py-5">
      <div className="flex overflow-hidden mask-fade-x">
        <div
          className="flex shrink-0 motion-safe:animate-marquee"
          style={{ animationDuration: `${speedSeconds}s` }}
        >
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex shrink-0 items-center"
            >
              {items.map((item) => (
                <li
                  key={item}
                  className="flex shrink-0 items-center gap-10 pr-10 font-display text-lg whitespace-nowrap text-ivory/70 md:text-xl"
                >
                  {item}
                  <span aria-hidden className="size-1.5 rounded-full bg-marigold/70" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
