'use client';

import { ChevronDown, PhoneIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { serviceIcons } from '@/components/brand/icons';
import { Logo } from '@/components/brand/logo';
import { Texture } from '@/components/brand/texture';
import { LocaleSwitcher } from '@/components/site/locale-switcher';
import { MobileNav } from '@/components/site/mobile-nav';
import { QuoteCta } from '@/components/site/action-buttons';
import { usePathname } from '@/i18n/navigation';
import { NavLink } from '@/components/site/nav-link';
import { buildTelUrl } from '@/lib/contact-links';
import { eventTypePath } from '@/lib/event-types';
import { primaryNav, type NavMenuId } from '@/lib/nav';
import { servicePath } from '@/lib/services';
import type { ServiceListItem } from '@/lib/services-data';
import type { EventTypeCard } from '@/lib/catalogue-data';
import type { Locale } from '@/i18n/routing';
import type { ContactInfo } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Transparent over the hero, ink glass once the page scrolls. Dropdowns open
 * on hover for pointers and on click/Enter for keyboards, and close on Escape
 * or when focus leaves the header.
 */
export function SiteHeader({
  contact,
  services = [],
  eventTypes = [],
}: {
  contact: ContactInfo;
  services?: ServiceListItem[];
  eventTypes?: EventTypeCard[];
}) {
  const t = useTranslations('Nav');
  const tCommon = useTranslations('Common');
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<NavMenuId | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Route change closes whatever was open.
  useEffect(() => setOpenMenu(null), [pathname]);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openMenu]);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  const tel = contact.phone ? buildTelUrl(contact.phone) : null;

  return (
    <header
      ref={headerRef}
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        if (!headerRef.current?.contains(e.relatedTarget as Node | null)) setOpenMenu(null);
      }}
      className={cn(
        'sticky top-0 z-40 h-[var(--header-h)] border-b transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled || openMenu
          ? 'border-gold/20 bg-ink/85 backdrop-blur-xl'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="container-site flex h-full items-center justify-between gap-4">
        <NavLink href="/" className="shrink-0 rounded-md" aria-label={tCommon('brandName')}>
          <Logo
            name={tCommon('brandName')}
            tagline={tCommon('brandTagline')}
            className="max-md:hidden"
          />
          <Logo name={tCommon('brandName')} compact className="md:hidden" />
        </NavLink>

        <nav aria-label={t('menuTitle')} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => {
              const isOpen = item.menu != null && openMenu === item.menu;
              const label = t(item.key);

              return (
                <li
                  key={item.key}
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMenu(item.menu ?? null);
                  }}
                >
                  <NavLink
                    href={item.href}
                    aria-expanded={item.menu ? isOpen : undefined}
                    onClick={() => setOpenMenu(null)}
                    onKeyDown={(e) => {
                      if (item.menu && (e.key === 'ArrowDown' || e.key === ' ')) {
                        e.preventDefault();
                        setOpenMenu(isOpen ? null : item.menu!);
                      }
                    }}
                    onFocus={() => setOpenMenu(item.menu ?? null)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.9rem] font-medium transition-colors duration-200',
                      isOpen ? 'text-marigold' : 'text-ivory/85 hover:text-marigold',
                    )}
                  >
                    {label}
                    {item.menu ? (
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          'size-3.5 transition-transform duration-300',
                          isOpen && 'rotate-180',
                        )}
                      />
                    ) : null}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LocaleSwitcher className="max-sm:hidden" />

          {tel ? (
            <a
              href={tel}
              data-cta="call"
              title={t('call')}
              className="hidden size-10 place-items-center rounded-full border border-gold/30 text-gold transition-colors hover:border-gold hover:bg-gold/10 hover:text-marigold md:grid"
            >
              <PhoneIcon className="size-4" />
              <span className="sr-only">{t('call')}</span>
            </a>
          ) : null}

          <QuoteCta label={t('quote')} size="sm" className="max-md:hidden" />
          <MobileNav
            contact={contact}
            services={services}
            eventTypes={eventTypes}
          />
        </div>
      </div>

      {/* --- Dropdown panels ---------------------------------------------
          Render into the HTML even when closed, so a crawler sees every
          service and event type link from any page. `invisible` keeps
          their links out of the tab order until the panel opens. */}
      {(['services', 'events'] as const).map((menu) => (
        <div
          key={menu}
          onMouseEnter={cancelClose}
          className={cn(
            'absolute inset-x-0 top-full hidden origin-top border-b border-gold/20 bg-ink-800/95 backdrop-blur-xl transition-all duration-300 ease-[var(--ease-expo)] lg:block',
            openMenu === menu
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none invisible -translate-y-2 opacity-0',
          )}
        >
          <Texture opacity={0.05} />
          <div className="relative container-site py-9">
            {menu === 'services' ? (
              <div className="grid grid-cols-[1fr_minmax(0,17rem)] gap-10">
                <ul className="grid grid-cols-2 gap-x-8 gap-y-1">
                  {services.map((service) => {
                    const Icon =
                      (service.icon && serviceIcons[service.icon as keyof typeof serviceIcons]) ||
                      serviceIcons.mandap;
                    return (
                      <li key={service.slug}>
                        <NavLink
                          href={servicePath(service.slug)}
                          className="group/item flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gold/8"
                        >
                          <Icon className="size-5 shrink-0 text-gold transition-colors group-hover/item:text-marigold" />
                          <span className="text-[0.9rem] text-ivory/85 transition-colors group-hover/item:text-ivory">
                            {service.name}
                          </span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
                <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gold/25 bg-[radial-gradient(120%_100%_at_50%_0%,var(--color-maroon)_0%,var(--color-ink)_70%)] p-6">
                  <Texture opacity={0.08} />
                  <p className="relative font-display text-display-sm text-ivory">
                    {t('servicesPanelTitle')}
                  </p>
                  <NavLink
                    href="/services"
                    className="relative mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-marigold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-marigold-300"
                  >
                    {t('allServices')}
                  </NavLink>
                </div>
              </div>
            ) : null}

            {menu === 'events' ? (
              <ul className="grid grid-cols-3 gap-2">
                {eventTypes.map((event) => (
                  <li key={event.slug}>
                    <NavLink
                      href={eventTypePath(event.slug)}
                      className="group/item block rounded-xl px-4 py-3 transition-colors hover:bg-gold/8"
                    >
                      <span className="font-display text-lg text-ivory">
                        {event.name}
                      </span>
                      <span className="mt-1 block text-[0.8rem] leading-relaxed text-ivory-muted">
                        {event.blurb}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ))}
    </header>
  );
}
