import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

/**
 * Hand-drawn line icon set for the service catalogue. 24×24, 1.5px stroke,
 * `currentColor` so a parent can tint them gold. Decorative by default —
 * pass a `title` only when the icon carries meaning on its own.
 */
type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Icon({ className, title, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      className={cn('size-6', className)}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

/** Vidhi mandap: four posts under a domed canopy. */
export function MandapIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 11a8 8 0 0 1 16 0" />
      <path d="M4 11h16" />
      <path d="M6.5 11v9M17.5 11v9" />
      <path d="M3 20h18" />
      <path d="M9 11c.9-2.2 1.9-3.3 3-3.3s2.1 1.1 3 3.3" />
      <path d="M12 4.2v1.6" />
    </Icon>
  );
}

/** German hanger: clear-span tent, no centre pole. */
export function HangerIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2 20V13l10-7 10 7v7" />
      <path d="M2 13h20" />
      <path d="M7 20v-4.5h10V20" />
      <path d="M1 20h22" />
    </Icon>
  );
}

/** PA speaker cabinet. */
export function SpeakerIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <circle cx="12" cy="9" r="3" />
      <circle cx="12" cy="16.75" r="1.75" />
    </Icon>
  );
}

/** DJ deck: platter, tone arm, fader. */
export function DjIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="9.5" cy="10.5" r="6" />
      <circle cx="9.5" cy="10.5" r="1.25" />
      <path d="M16.5 5.5 19 3" />
      <path d="M4 19h16" />
      <path d="M9 17.5v3" />
    </Icon>
  );
}

/** Stage with a backdrop panel. */
export function StageIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 4h16v9H4z" />
      <path d="M2 16h20v3H2z" />
      <path d="M5 19v2M19 19v2" />
      <path d="M8.5 13V8.5l3.5 2 3.5-2V13" />
    </Icon>
  );
}

/** Marigold bloom. */
export function FlowerIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="11" r="2.4" />
      <path d="M12 8.6c0-2.3.9-3.6 2.4-4.6-.3 1.8.1 3.2 1.2 4.2" />
      <path d="M14.4 11c2.3 0 3.6.9 4.6 2.4-1.8-.3-3.2.1-4.2 1.2" />
      <path d="M12 13.4c0 2.3-.9 3.6-2.4 4.6.3-1.8-.1-3.2-1.2-4.2" />
      <path d="M9.6 11c-2.3 0-3.6-.9-4.6-2.4 1.8.3 3.2-.1 4.2-1.2" />
      <path d="M12 18v3" />
    </Icon>
  );
}

/** Par can throwing light. */
export function LightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 3h6l-.75 5.5h-4.5z" />
      <path d="M12 2v1" />
      <path d="M8.25 8.5h7.5L12 21z" />
      <path d="M10.5 12.5h3" />
    </Icon>
  );
}

/** Rangoli diamond — themed decoration. */
export function ThemeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 2.5 21.5 12 12 21.5 2.5 12z" />
      <path d="M12 7.5 16.5 12 12 16.5 7.5 12z" />
      <path d="M12 11.2v1.6M11.2 12h1.6" />
    </Icon>
  );
}

/** Banquet chair. */
export function ChairIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 3h10v8H7z" />
      <path d="M5.5 11h13l-.75 5H6.25z" />
      <path d="M6.5 16v5M17.5 16v5" />
      <path d="M9.5 6.5h5" />
    </Icon>
  );
}

/** Live counter: cloche over a plate. */
export function CateringIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 14a8 8 0 0 1 16 0" />
      <path d="M2.5 14h19" />
      <path d="M12 6V4.5" />
      <path d="M5 17.5h14" />
      <path d="M7 20.5h10" />
    </Icon>
  );
}

/** Silent DG set. */
export function GeneratorIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.5" y="6.5" width="19" height="11" rx="2" />
      <path d="M12.5 9 10 12.75h3L10.5 16" />
      <path d="M17 9.5v5M19 9.5v5" />
      <path d="M6 17.5v2M18 17.5v2" />
    </Icon>
  );
}

/** Entry gate arch. */
export function GateIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 21V10a8 8 0 0 1 16 0v11" />
      <path d="M8 21v-7a4 4 0 0 1 8 0v7" />
      <path d="M2.5 21h19" />
      <path d="M12 3.5V2" />
    </Icon>
  );
}

/** Dhol for the baraat / varghodo. */
export function DholIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="7.5" width="17" height="9" rx="4.5" />
      <path d="M7.5 8.2v7.6M16.5 8.2v7.6" />
      <path d="m7.5 9.5 9 5M16.5 9.5l-9 5" />
      <path d="M12 4.5v3M12 16.5v3" />
    </Icon>
  );
}

/** Turnkey event management: dated plan, ticked off. */
export function EventIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9.5h18" />
      <path d="M8 3v4M16 3v4" />
      <path d="m8.75 15 2.25 2.25L15.5 12.5" />
    </Icon>
  );
}

export const serviceIcons = {
  mandap: MandapIcon,
  hanger: HangerIcon,
  speaker: SpeakerIcon,
  dj: DjIcon,
  stage: StageIcon,
  flower: FlowerIcon,
  light: LightIcon,
  theme: ThemeIcon,
  chair: ChairIcon,
  catering: CateringIcon,
  generator: GeneratorIcon,
  gate: GateIcon,
  dhol: DholIcon,
  event: EventIcon,
} as const;

export type ServiceIconName = keyof typeof serviceIcons;

/** Chat bubble with a handset — the "talk to us on WhatsApp" affordance. */
export function WhatsAppIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 11.6a8.6 8.6 0 0 1-12.9 7.5L3.5 20.5l1.4-4.5A8.6 8.6 0 1 1 21 11.6Z" />
      <path d="M9.1 8.4c.3-.1.6 0 .8.3l.8 1.3c.1.2.1.5 0 .7l-.5.7c.5 1 1.3 1.8 2.3 2.3l.7-.5c.2-.1.5-.2.7 0l1.3.8c.3.2.4.5.3.8-.3.8-1.1 1.3-2 1.1-2.8-.6-5-2.8-5.6-5.6-.2-.9.4-1.7 1.2-1.9Z" />
    </Icon>
  );
}
