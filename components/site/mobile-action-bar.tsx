import { MessageSquareQuote, PhoneIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { WhatsAppIcon } from '@/components/brand/icons';
import { NavLink } from '@/components/site/nav-link';
import { buildTelUrl, buildWhatsAppUrl } from '@/lib/contact-links';
import { getSiteConfig } from '@/lib/settings';

const cell =
  'flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[0.68rem] font-semibold tracking-[0.06em] uppercase transition-colors active:bg-gold/10';

function Cell({ children, tone = 'ivory' }: { children: ReactNode; tone?: 'ivory' | 'marigold' }) {
  return (
    <span className={tone === 'marigold' ? 'text-marigold' : 'text-ivory-muted'}>{children}</span>
  );
}

/** Call · WhatsApp · Quote, always within thumb reach on phones. */
export async function MobileActionBar() {
  const [t, config] = await Promise.all([getTranslations('MobileBar'), getSiteConfig()]);

  const tel = config.phonePrimary ? buildTelUrl(config.phonePrimary) : null;
  const wa = config.whatsappNumber
    ? buildWhatsAppUrl(config.whatsappNumber, config.whatsappDefaultMessage)
    : null;

  return (
    <nav
      aria-label={t('quote')}
      className="fixed inset-x-0 bottom-0 z-50 flex border-t border-gold/25 bg-ink-800/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      {tel ? (
        <a href={tel} data-cta="call" className={cell}>
          <Cell>
            <PhoneIcon className="size-5" />
          </Cell>
          {t('call')}
        </a>
      ) : (
        <NavLink href="/contact" data-cta="call" className={cell}>
          <Cell>
            <PhoneIcon className="size-5" />
          </Cell>
          {t('call')}
        </NavLink>
      )}

      <span aria-hidden className="my-2 w-px bg-gold/20" />

      {wa ? (
        <a href={wa} target="_blank" rel="noopener noreferrer" data-cta="whatsapp" className={cell}>
          <Cell>
            <WhatsAppIcon className="size-5" />
          </Cell>
          {t('whatsapp')}
        </a>
      ) : (
        <NavLink href="/contact" data-cta="whatsapp" className={cell}>
          <Cell>
            <WhatsAppIcon className="size-5" />
          </Cell>
          {t('whatsapp')}
        </NavLink>
      )}

      <span aria-hidden className="my-2 w-px bg-gold/20" />

      <NavLink href="/get-quote" data-cta="quote" className={cell}>
        <Cell tone="marigold">
          <MessageSquareQuote className="size-5" />
        </Cell>
        <span className="text-marigold">{t('quote')}</span>
      </NavLink>
    </nav>
  );
}
