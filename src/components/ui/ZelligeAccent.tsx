import { useId } from 'react';
import { cn } from '@/utils/cn';

/* The khatam — the eight-point star at the heart of Moroccan zellige.
   Built from two overlapping squares, the way the tilework actually is.

   HOUSE RULE (CLAUDE.md §4.3): this is an ACCENT, never a theme. A hairline
   in a corner, a mark on a divider, a whisper behind a hero. It must never
   compete with content, and it must never carry meaning — it is decoration,
   so it is always aria-hidden. Default opacity is deliberately low; if you
   find yourself raising it, you probably want a different element. */

type Variant = 'seal' | 'divider' | 'corner' | 'field';
type Tone = 'brand' | 'gold' | 'muted' | 'current';

interface ZelligeAccentProps {
  variant?: Variant;
  tone?: Tone;
  /** 0–1. Keep it low — understated is the point. */
  opacity?: number;
  /** Square edge in px, for `seal` and `corner`. */
  size?: number;
  className?: string;
}

const TONES: Record<Tone, string> = {
  brand: 'text-primary-500',
  gold: 'text-gold',
  muted: 'text-faint',
  current: '',
};

/** 16 alternating vertices → the classic {8/2} star of two squares. */
function starPoints(cx: number, cy: number, outer: number): string {
  const inner = outer * 0.7654; // cos(45°)/cos(22.5°) — the true khatam ratio
  return Array.from({ length: 16 }, (_, i) => {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI / 8) * i - Math.PI / 2;
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');
}

export function ZelligeAccent({
  variant = 'seal',
  tone = 'gold',
  opacity = 0.18,
  size = 64,
  className,
}: ZelligeAccentProps) {
  const patternId = useId();
  const shared = {
    'aria-hidden': true as const,
    focusable: 'false' as const,
    className: cn(TONES[tone], className),
    style: { opacity },
  };

  if (variant === 'seal') {
    return (
      <svg {...shared} width={size} height={size} viewBox="0 0 100 100" fill="none">
        <polygon points={starPoints(50, 50, 46)} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points={starPoints(50, 50, 30)} stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="13" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }

  if (variant === 'divider') {
    /* A warm hairline that pauses for a small star, then continues. */
    return (
      <svg
        {...shared}
        width="100%"
        height="24"
        viewBox="0 0 400 24"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        className={cn(TONES[tone], 'w-full', className)}
      >
        <line x1="0" y1="12" x2="164" y2="12" stroke="currentColor" strokeWidth="1" strokeDasharray="1 0" />
        <line x1="236" y1="12" x2="400" y2="12" stroke="currentColor" strokeWidth="1" />
        <polygon
          points={starPoints(200, 12, 9)}
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="178" cy="12" r="1.5" fill="currentColor" />
        <circle cx="222" cy="12" r="1.5" fill="currentColor" />
      </svg>
    );
  }

  if (variant === 'corner') {
    /* A quarter rosette. Drop it in an absolutely-positioned corner of a card;
       rotate with `-scale-x-100` / `rotate-90` to serve the other three. */
    return (
      <svg {...shared} width={size} height={size} viewBox="0 0 100 100" fill="none">
        <path d="M0 0 H100" stroke="currentColor" strokeWidth="1" />
        <path d="M0 0 V100" stroke="currentColor" strokeWidth="1" />
        <path d="M0 34 A34 34 0 0 0 34 0" stroke="currentColor" strokeWidth="1" />
        <path d="M0 62 A62 62 0 0 0 62 0" stroke="currentColor" strokeWidth="0.75" />
        <polygon points={starPoints(0, 0, 20)} stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
        <circle cx="0" cy="0" r="7" stroke="currentColor" strokeWidth="0.75" />
      </svg>
    );
  }

  /* field — a tileable star lattice. Use as a faint layer behind a hero or
     inside a banner. Keep opacity ≤ 0.08 or it becomes wallpaper. */
  return (
    <svg
      {...shared}
      width="100%"
      height="100%"
      className={cn(TONES[tone], 'absolute inset-0 h-full w-full', className)}
      fill="none"
    >
      <defs>
        <pattern id={patternId} width="56" height="56" patternUnits="userSpaceOnUse">
          <polygon points={starPoints(28, 28, 15)} stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
          <polygon points={starPoints(0, 0, 7)} stroke="currentColor" strokeWidth="0.75" strokeLinejoin="round" />
          <polygon points={starPoints(56, 0, 7)} stroke="currentColor" strokeWidth="0.75" strokeLinejoin="round" />
          <polygon points={starPoints(0, 56, 7)} stroke="currentColor" strokeWidth="0.75" strokeLinejoin="round" />
          <polygon points={starPoints(56, 56, 7)} stroke="currentColor" strokeWidth="0.75" strokeLinejoin="round" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
