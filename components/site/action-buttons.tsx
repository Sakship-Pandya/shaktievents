import { ArrowUpRight, PhoneIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { WhatsAppIcon } from '@/components/brand/icons';
import { NavLink } from '@/components/site/nav-link';
import { buildTelUrl, buildWhatsAppUrl } from '@/lib/contact-links';
import type { ContactInfo } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Brand CTAs. Deliberately prop-driven rather than reading settings directly,
 * because these are used from client components (the header, the mobile sheet)
 * as well as server ones — a data fetch in here would not work in both.
 *
 * Every button carries a `data-cta` attribute for the GA4 click listener in
 * step 7, and degrades to /contact while a number is still [TBD] rather than
 * rendering a dead tel: or wa.me link.
 */
const base =
  'group/cta inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ease-[var(--ease-soft)] outline-none';

const sizes = {
  sm: 'h-10 px-5 text-[0.8rem]',
  default: 'h-12 px-6 text-[0.9rem]',
  lg: 'h-13 px-7 text-[0.95rem] md:h-14 md:px-9 md:text-base',
} as const;

const variants = {
  primary:
    'bg-marigold text-ink hover:bg-marigold-300 hover:shadow-[0_20px_44px_-18px_var(--color-marigold)] active:translate-y-px',
  outline:
    'border border-gold/45 text-ivory backdrop-blur-sm hover:border-gold hover:bg-gold/10 active:translate-y-px',
  quiet: 'text-ivory/80 hover:text-marigold',
} as const;

type CtaProps = {
  label: string;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  className?: string;
  icon?: ReactNode;
};

function ctaClass({ size = 'default', variant = 'primary', className }: Partial<CtaProps>) {
  return cn(base, sizes[size], variants[variant], className);
}

/** Opens the quote wizard page. Becomes a drawer trigger in step 6. */
export function QuoteCta({ label, size, variant = 'primary', className }: CtaProps) {
  return (
    <NavLink href="/get-quote" data-cta="quote" className={ctaClass({ size, variant, className })}>
      {label}
      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
    </NavLink>
  );
}

export function WhatsAppCta({
  label,
  contact,
  message,
  size,
  variant = 'outline',
  className,
}: CtaProps & { contact: ContactInfo; message?: string }) {
  const href = contact.whatsapp
    ? buildWhatsAppUrl(contact.whatsapp, message ?? contact.whatsappMessage)
    : null;

  if (!href) {
    return (
      <NavLink
        href="/contact"
        data-cta="whatsapp"
        className={ctaClass({ size, variant, className })}
      >
        <WhatsAppIcon className="size-[1.15em]" />
        {label}
      </NavLink>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cta="whatsapp"
      className={ctaClass({ size, variant, className })}
    >
      <WhatsAppIcon className="size-[1.15em]" />
      {label}
    </a>
  );
}

export function CallCta({
  label,
  contact,
  size,
  variant = 'outline',
  className,
}: CtaProps & { contact: ContactInfo }) {
  const href = contact.phone ? buildTelUrl(contact.phone) : null;

  if (!href) {
    return (
      <NavLink href="/contact" data-cta="call" className={ctaClass({ size, variant, className })}>
        <PhoneIcon className="size-[1.05em]" />
        {label}
      </NavLink>
    );
  }

  return (
    <a href={href} data-cta="call" className={ctaClass({ size, variant, className })}>
      <PhoneIcon className="size-[1.05em]" />
      {label}
    </a>
  );
}
