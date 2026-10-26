import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { NavLink } from '@/components/site/nav-link';
import { getFeatures } from '@/lib/features';
import { getInstagramPosts } from '@/lib/instagram';
import { getProjectList } from '@/lib/projects-data';
import { getSiteConfig } from '@/lib/settings';

/**
 * The latest Instagram posts, with the portfolio as the fallback.
 *
 * A token that has quietly expired is the normal end state of an Instagram
 * integration, so the section falls back to published project covers rather
 * than going blank — and it relabels itself when it does. Showing our own
 * photographs under an "Instagram" heading would be a small lie told on every
 * page load.
 */
/** lucide dropped its brand icons; one path is cheaper than a new dependency. */
function InstagramGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="mr-3 inline size-7 fill-marigold align-[-0.15em]"
    >
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38.66-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.93 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
    </svg>
  );
}

export async function InstagramFeed({ limit = 6 }: { limit?: number }) {
  const { flags } = await getFeatures();
  if (!flags.instagram) return null;

  const [t, locale, posts, config] = await Promise.all([
    getTranslations('Features'),
    getLocale(),
    getInstagramPosts(),
    getSiteConfig(),
  ]);

  const handleUrl = config.socials.instagram;

  if (posts.length > 0) {
    return (
      <section className="border-t border-gold/20 bg-ink-800 section-pad">
        <Reveal className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-display-md font-medium text-ivory">
              <InstagramGlyph />
              {t('instagram')}
            </h2>
            {handleUrl ? (
              <a
                href={handleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-marigold hover:underline"
              >
                {t('instagramCta')}
                <ExternalLink className="size-3.5" />
              </a>
            ) : null}
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {posts.slice(0, limit).map((post) => (
              <li key={post.id}>
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-xl border border-gold/20"
                >
                  <Image
                    src={post.imageUrl}
                    alt={post.caption || t('instagram')}
                    width={400}
                    height={400}
                    sizes="(min-width: 1024px) 15vw, (min-width: 640px) 30vw, 45vw"
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    );
  }

  // Fallback: the manual gallery. Published projects only, so nothing a
  // visitor sees here is a draft.
  const { projects } = await getProjectList(locale, { page: 1 });
  const covers = projects.filter((project) => project.cover).slice(0, limit);
  if (covers.length === 0) return null;

  return (
    <section className="border-t border-gold/20 bg-ink-800 section-pad">
      <Reveal className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-display-md font-medium text-ivory">
            {t('galleryFallback')}
          </h2>
          <NavLink
            href="/portfolio"
            className="text-[0.9rem] font-semibold text-marigold hover:underline"
          >
            {t('galleryFallbackCta')}
          </NavLink>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {covers.map((project) => (
            <li key={project.slug}>
              <NavLink
                href={`/portfolio/${project.slug}`}
                className="group block overflow-hidden rounded-xl border border-gold/20"
              >
                <Image
                  src={project.cover!.url}
                  alt={project.cover!.alt || project.title}
                  width={400}
                  height={400}
                  sizes="(min-width: 1024px) 15vw, (min-width: 640px) 30vw, 45vw"
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </NavLink>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
