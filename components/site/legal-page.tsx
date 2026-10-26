import { getFormatter, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { JsonLd } from '@/components/site/json-ld';
import { PageHero } from '@/components/site/page-shell';
import { buildTelUrl } from '@/lib/contact-links';
import { display } from '@/lib/display';
import type { Locale } from '@/i18n/routing';
import { breadcrumbSchema } from '@/lib/schema-org';
import type { LegalDocument } from '@/lib/seed-content/legal';
import { t as pick } from '@/lib/services';
import { getSiteConfig } from '@/lib/settings';

/**
 * Both legal pages, which differ only in their text.
 *
 * The contact block at the bottom reads from settings rather than repeating an
 * address, so it can never drift from the footer and the JSON-LD — and so an
 * unset phone number shows [TBD] here too instead of a plausible-looking
 * number nobody can answer.
 */
export async function LegalPage({ doc, locale }: { doc: LegalDocument; locale: Locale }) {
  const [tNav, tLegal, format, config] = await Promise.all([
    getTranslations('Nav'),
    getTranslations('Legal'),
    getFormatter(),
    getSiteConfig(),
  ]);

  const title = pick(doc.title, locale);
  const trail = [
    { name: tNav('home'), path: '/' },
    { name: title, path: doc.path },
  ];
  const tel = config.phonePrimary ? buildTelUrl(config.phonePrimary) : null;
  const address = config.addressLine
    ? `${config.addressLine}, ${config.city}, ${config.state} ${config.pin}`
    : `${config.city}, ${config.state} ${config.pin}`;

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(locale, trail)]} />

      <PageHero trail={trail} title={title} intro={pick(doc.intro, locale)}>
        <p className="mt-8 text-[0.8rem] tracking-[0.08em] text-gold-soft uppercase">
          {tLegal('updated')} {format.dateTime(new Date(`${doc.updated}T00:00:00Z`), 'long')}
        </p>
      </PageHero>

      <section className="theme-light section-pad">
        <div className="container-site">
          <div className="mx-auto max-w-2xl">
            {doc.sections.map((section) => (
              <Reveal key={section.heading.en} className="mt-12 first:mt-0">
                <h2 className="font-display text-display-sm font-medium text-ink">
                  {pick(section.heading, locale)}
                </h2>
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.en}
                    className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground"
                  >
                    {pick(paragraph, locale)}
                  </p>
                ))}
              </Reveal>
            ))}

            <Reveal className="mt-14 rounded-2xl border border-border bg-sand/60 p-7">
              <h2 className="font-display text-lg font-medium text-ink">{tLegal('contactUs')}</h2>
              <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-[0.7rem] tracking-[0.12em] text-muted-foreground uppercase">
                    {tLegal('business')}
                  </dt>
                  <dd className="mt-1.5 text-[0.9rem] text-ink">{config.name}</dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] tracking-[0.12em] text-muted-foreground uppercase">
                    {tLegal('address')}
                  </dt>
                  <dd className="mt-1.5 text-[0.9rem] text-ink">{address}</dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] tracking-[0.12em] text-muted-foreground uppercase">
                    {tLegal('phone')}
                  </dt>
                  <dd className="mt-1.5 text-[0.9rem] text-ink">
                    {tel ? (
                      <a
                        href={tel}
                        data-cta="call"
                        className="font-semibold text-maroon hover:underline"
                      >
                        {config.phonePrimary}
                      </a>
                    ) : (
                      display(config.phonePrimary)
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] tracking-[0.12em] text-muted-foreground uppercase">
                    {tLegal('email')}
                  </dt>
                  <dd className="mt-1.5 text-[0.9rem] text-ink">
                    {config.email ? (
                      <a
                        href={`mailto:${config.email}`}
                        className="font-semibold text-maroon hover:underline"
                      >
                        {config.email}
                      </a>
                    ) : (
                      display(config.email)
                    )}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
