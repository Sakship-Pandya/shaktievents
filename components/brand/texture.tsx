import { useId } from 'react';
import { cn } from '@/lib/utils';

type TextureProps = {
  className?: string;
  /** 0–1. Keep between 0.04 and 0.07 on dark sections. */
  opacity?: number;
};

/** Bandhani dot-grid texture. Absolutely positioned; parent must be `relative`. */
export function Texture({ className, opacity = 0.055 }: TextureProps) {
  const id = useId();
  return (
    <svg
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full text-gold', className)}
    >
      <defs>
        <pattern
          id={id}
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <circle cx="4" cy="4" r="1.15" fill="currentColor" />
          <circle cx="18" cy="18" r="0.7" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </svg>
  );
}
