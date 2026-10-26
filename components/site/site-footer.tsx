import { MapPin, Phone } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { WhatsAppIcon } from '@/components/brand/icons';
import { Logo } from '@/components/brand/logo';
import { Texture } from '@/components/brand/texture';
import { LocaleSwitcher } from '@/components/site/locale-switcher';
import { NavLink } from '@/components/site/nav-link';
import { buildTelUrl, buildWhatsAppUrl } from '@/lib/contact-links';
import { eventTypePath } from '@/lib/event-types';
import { servicePath } from '@/lib/services';
import { getServiceList } from '@/lib/services-data';
import { getEventTypeList } from '@/lib/catalogue-data';
import type { Locale } from '@/i18n/routing';
import { getSiteConfig, type SiteConfig } from '@/lib/settings';
import { display } from '@/lib/site';

const columnHeading = 'eyebrow mb-4 text-gold';
const columnLink =
  'block py-1.5 text-[0.875rem] text-ivory-muted transition-colors duration-200 hover:text-marigold';

/** The NAP block here must stay byte-identical to the contact page and the
 *  LocalBusiness JSON-LD — inconsistent NAP is the fastest way to lose local
 *  rankings, so all three read from lib/site.ts. */
async function Nap({ config }: { config: SiteConfig }) {
  const t = await getTranslations('Footer.nap');
  const callPhones = [config.phonePrimary, config.phoneSecondary].filter(
    (n): n is string => Boolean(n),
  );
  const whatsapp = config.whatsappNumber;
  const addressLine = config.addressLine
    ? `${config.addressLine}, ${config.city}, ${config.state} ${config.pin}`
    : `${config.city}, ${config.state} ${config.pin}`;

  return (
    <address className="grid gap-4 not-italic sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <p className={columnHeading}>{t('address')}</p>
        <p className="text-[0.875rem] leading-relaxed text-ivory-muted">{addressLine}</p>
        {config.googleMapsUrl ? (
          <a
            href={config.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-marigold hover:underline"
          >
            <MapPin className="size-3.5" />
            Google Maps
          </a>
        ) : null}
      </div>
      <div>
        <p className={columnHeading}>{t('phone')}</p>
        {callPhones.length || whatsapp ? (
          <div className="flex flex-col gap-1.5">
            {callPhones.map((phone) => {
              const href = buildTelUrl(phone);
              return href ? (
                <a
                  key={phone}
                  href={href}
                  data-cta="call"
                  className="inline-flex items-center gap-2 text-[0.875rem] text-ivory-muted hover:text-marigold"
                >
                  <Phone className="size-3.5 shrink-0 text-gold" />
                  <span>{phone}</span>
                </a>
              ) : (
                <p key={phone} className="inline-flex items-center gap-2 text-[0.875rem] text-ivory-muted">
                  <Phone className="size-3.5 shrink-0 text-gold" />
                  <span>{phone}</span>
                </p>
              );
            })}
            {whatsapp ? (
              <a
                href={
                  buildWhatsAppUrl(whatsapp, config.whatsappDefaultMessage) ??
                  `https://wa.me/${whatsapp}`
                }
                target="_blank"
                rel="noopener noreferrer"
                data-cta="whatsapp"
                className="inline-flex items-center gap-2 text-[0.875rem] text-ivory-muted hover:text-marigold"
              >
                <WhatsAppIcon className="size-3.5 shrink-0 text-[#25D366]" />
                <span>{whatsapp}</span>
              </a>
            ) : null}
          </div>
        ) : (
          <p className="text-[0.875rem] text-ivory-muted">{display(config.phonePrimary)}</p>
        )}
      </div>
      <div>
        <p className={columnHeading}>{t('email')}</p>
        {config.email ? (
          <a
            href={`mailto:${config.email}`}
            className="text-[0.875rem] text-ivory-muted hover:text-marigold"
          >
            {config.email}
          </a>
        ) : (
          <p className="text-[0.875rem] text-ivory-muted">{display(config.email)}</p>
        )}
      </div>
      <div>
        <p className={columnHeading}>{t('hours')}</p>
        <p className="text-[0.875rem] text-ivory-muted">{t('hoursValue')}</p>
      </div>
    </address>
  );
}

export async function SiteFooter() {
  const [t, tNav, tCommon, rawLocale, config] = await Promise.all([
    getTranslations('Footer'),
    getTranslations('Nav'),
    getTranslations('Common'),
    getLocale(),
    getSiteConfig(),
  ]);
  const locale = rawLocale as Locale;
  const [services, eventTypes] = await Promise.all([
    getServiceList(locale),
    getEventTypeList(locale),
  ]);
  const year = new Date().getFullYear();
  const featured = services.filter((s) => s.featured);
  const footerServices = featured.length > 0 ? featured : services.slice(0, 6);

  return (
    <footer className="relative overflow-hidden border-t border-gold/25 bg-ink-800">
      <Texture opacity={0.05} />

      <div className="relative container-site pt-16 pb-10 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_1fr]">
          <div>
            <Logo name={tCommon('brandName')} tagline={tCommon('brandTagline')} />
            <p className="mt-5 max-w-xs text-[0.875rem] leading-relaxed text-ivory-muted">
              {t('tagline')}
            </p>
            <LocaleSwitcher expanded className="mt-6" />
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:grid-cols-3">
            <div>
              <h2 className={columnHeading}>{t('columns.services')}</h2>
              <ul>
                {footerServices.map((service) => (
                  <li key={service.slug}>
                    <NavLink href={servicePath(service.slug)} className={columnLink}>
                      {service.short || service.name}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <NavLink href="/services" className={`${columnLink} font-semibold text-marigold`}>
                    {tNav('allServices')}
                  </NavLink>
                </li>
              </ul>
            </div>

            <div>
              <h2 className={columnHeading}>{t('columns.events')}</h2>
              <ul>
                {eventTypes.map((event) => (
                  <li key={event.slug}>
                    <NavLink href={eventTypePath(event.slug)} className={columnLink}>
                      {event.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className={columnHeading}>{t('columns.company')}</h2>
              <ul>
                <li>
                  <NavLink href="/about" className={columnLink}>
                    {t('links.about')}
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/portfolio" className={columnLink}>
                    {t('links.portfolio')}
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/testimonials" className={columnLink}>
                    {t('links.testimonials')}
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/blog" className={columnLink}>
                    {t('links.blog')}
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/contact" className={columnLink}>
                    {t('links.contact')}
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-12 hairline" />
        <Nap config={config} />
        <hr className="my-10 hairline" />

        <div className="flex flex-col gap-5 text-[0.78rem] text-ivory-muted/80 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {config.name}. {t('rights')}
            {config.gstNo ? (
              <span className="ml-2">
                {t('gst')} {config.gstNo}
              </span>
            ) : null}
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li>
              <NavLink href="/privacy-policy" className="transition-colors hover:text-marigold">
                {t('privacy')}
              </NavLink>
            </li>
            <li>
              <NavLink href="/terms" className="transition-colors hover:text-marigold">
                {t('terms')}
              </NavLink>
            </li>
            <li>
              <a href="/sitemap.xml" className="transition-colors hover:text-marigold">
                {t('sitemap')}
              </a>
            </li>
            <li className="text-ivory-muted/60">{t('credit')}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
