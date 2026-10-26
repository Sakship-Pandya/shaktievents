import { useId } from 'react';
import { cn } from '@/lib/utils';

type Point = { x: number; y: number };

/** Point on a quadratic Bézier. */
function bezier(p0: Point, p1: Point, p2: Point, t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

const SWAGS: Array<[Point, Point, Point]> = [
  [
    { x: -40, y: 18 },
    { x: 340, y: 150 },
    { x: 720, y: 22 },
  ],
  [
    { x: 720, y: 22 },
    { x: 1100, y: 150 },
    { x: 1480, y: 18 },
  ],
];
const BULBS_PER_SWAG = 9;

/**
 * A pandal string of bulbs that switch on left-to-right, then breathe.
 * Pure CSS/SVG; ~18 circles, no filters. Decorative only.
 */
export function StringLights({ className }: { className?: string }) {
  const id = useId();
  const bulbs: Point[] = [];
  for (const [p0, p1, p2] of SWAGS) {
    for (let i = 1; i <= BULBS_PER_SWAG; i++) {
      bulbs.push(bezier(p0, p1, p2, i / (BULBS_PER_SWAG + 1)));
    }
  }
  const path = SWAGS.map(
    ([p0, p1, p2], i) => `${i === 0 ? `M${p0.x} ${p0.y}` : ''} Q${p1.x} ${p1.y} ${p2.x} ${p2.y}`,
  ).join(' ');

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 180"
      preserveAspectRatio="xMidYMin slice"
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 h-[150px] w-full md:h-[180px]',
        className,
      )}
    >
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor="var(--color-marigold)" stopOpacity="0.55" />
          <stop offset="45%" stopColor="var(--color-marigold)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--color-marigold)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d={path}
        fill="none"
        stroke="var(--color-gold)"
        strokeOpacity="0.35"
        strokeWidth="1.2"
      />
      {bulbs.map((p, i) => {
        const onDelay = 350 + i * 95;
        const breatheDelay = 3200 + i * 180;
        return (
          <g
            key={i}
            style={{
              animation: `light-on 1.3s var(--ease-soft) ${onDelay}ms both, breathe 7s ease-in-out ${breatheDelay}ms infinite`,
            }}
          >
            <line
              x1={p.x}
              y1={p.y}
              x2={p.x}
              y2={p.y + 11}
              stroke="var(--color-gold)"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
            <circle cx={p.x} cy={p.y + 17} r="20" fill={`url(#${id}-glow)`} />
            <circle cx={p.x} cy={p.y + 17} r="4.2" fill="var(--color-marigold-300)" />
          </g>
        );
      })}
    </svg>
  );
}
