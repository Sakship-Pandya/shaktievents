import { getTranslations } from 'next-intl/server';
import { WhatsAppIcon } from '@/components/brand/icons';
import { NavLink } from '@/components/site/nav-link';
import { buildWhatsAppUrl } from '@/lib/contact-links';
import { getSiteConfig } from '@/lib/settings';

/**
 * Desktop/tablet floating WhatsApp button. Hidden on small screens, where
 * MobileActionBar already pins WhatsApp to the thumb.
 */
export async function WhatsAppFloat() {
  const [t, config] = await Promise.all([getTranslations('Common'), getSiteConfig()]);

  const href = config.whatsappNumber
    ? buildWhatsAppUrl(config.whatsappNumber, config.whatsappDefaultMessage)
    : null;

  const className =
    'group fixed right-6 bottom-6 z-50 hidden size-14 place-items-center rounded-full bg-emerald text-ivory shadow-[0_18px_40px_-14px_rgba(0,0,0,0.8)] ring-1 ring-gold/30 transition-transform duration-300 hover:scale-105 motion-safe:animate-pulse-once md:grid';

  const content = (
    <>
      <WhatsAppIcon className="size-7" />
      <span className="sr-only">{t('whatsapp')}</span>
    </>
  );

  if (!href) {
    return (
      <NavLink href="/contact" data-cta="whatsapp" className={className} title={t('whatsapp')}>
        {content}
      </NavLink>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cta="whatsapp"
      title={t('whatsapp')}
      className={className}
    >
      {content}
    </a>
  );
}
