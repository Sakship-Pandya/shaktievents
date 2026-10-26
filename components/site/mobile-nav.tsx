'use client';

import { ChevronDown, MenuIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { serviceIcons } from '@/components/brand/icons';
import { CallCta, QuoteCta, WhatsAppCta } from '@/components/site/action-buttons';
import { LocaleSwitcher } from '@/components/site/locale-switcher';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from '@/i18n/navigation';
import { NavLink } from '@/components/site/nav-link';
import { eventTypePath } from '@/lib/event-types';
import { primaryNav, secondaryNav } from '@/lib/nav';
import { servicePath } from '@/lib/services';
import type { ServiceListItem } from '@/lib/services-data';
import type { EventTypeCard } from '@/lib/catalogue-data';
import type { ContactInfo } from '@/lib/site';

/** Native <details> keeps the disclosure keyboard-accessible with no extra JS. */
function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-gold/15">
      <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-display text-lg text-ivory marker:hidden">
        {label}
        <ChevronDown
          aria-hidden
          className="size-4 text-gold transition-transform duration-300 group-open:rotate-180"
        />
      </summary>
      <div className="pb-3">{children}</div>
    </details>
  );
}

export function MobileNav({
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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={t('menu')}
        className="grid size-10 place-items-center rounded-full border border-gold/30 text-gold transition-colors hover:border-gold hover:bg-gold/10 lg:hidden"
      >
        <MenuIcon className="size-5" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[min(22rem,88vw)] overflow-y-auto border-gold/25 bg-ink p-0 sm:max-w-none"
      >
        <div className="flex min-h-full flex-col px-6 pt-5 pb-8">
          <SheetTitle className="mb-4 eyebrow text-gold">{t('menuTitle')}</SheetTitle>

          <nav aria-label={t('menuTitle')} className="flex-1">
            <Group label={t('services')}>
              <ul className="space-y-0.5">
                {services.map((service) => {
                  const Icon =
                    (service.icon && serviceIcons[service.icon as keyof typeof serviceIcons]) ||
                    serviceIcons.mandap;
                  return (
                    <li key={service.slug}>
                      <NavLink
                        href={servicePath(service.slug)}
                        onClick={close}
                        className="flex items-center gap-3 rounded-lg py-2 text-[0.9rem] text-ivory-muted transition-colors hover:text-marigold"
                      >
                        <Icon className="size-4 shrink-0 text-gold" />
                        {service.short || service.name}
                      </NavLink>
                    </li>
                  );
                })}
                <li>
                  <NavLink
                    href="/services"
                    onClick={close}
                    className="mt-1 inline-block text-[0.85rem] font-semibold text-marigold"
                  >
                    {t('allServices')}
                  </NavLink>
                </li>
              </ul>
            </Group>

            <Group label={t('events')}>
              <ul className="space-y-0.5">
                {eventTypes.map((event) => (
                  <li key={event.slug}>
                    <NavLink
                      href={eventTypePath(event.slug)}
                      onClick={close}
                      className="block py-2 text-[0.9rem] text-ivory-muted transition-colors hover:text-marigold"
                    >
                      {event.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </Group>



            <ul>
              {[
                ...primaryNav.filter((i) => !i.menu),
                ...secondaryNav,
                { key: 'contact', href: '/contact' } as const,
              ].map((item) => (
                <li key={item.key} className="border-b border-gold/15">
                  <NavLink
                    href={item.href}
                    onClick={close}
                    className="block py-3.5 font-display text-lg text-ivory transition-colors hover:text-marigold"
                  >
                    {t(item.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 space-y-3">
            <QuoteCta label={t('quote')} className="w-full" />
            <WhatsAppCta label={tCommon('whatsapp')} className="w-full" contact={contact} />
            <CallCta label={t('call')} className="w-full" contact={contact} />
            <div className="pt-3">
              <p className="mb-2 eyebrow text-gold-soft">{t('language')}</p>
              <LocaleSwitcher expanded className="w-full justify-between" />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
