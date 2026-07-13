import { useId } from 'react';
import { cn } from '@/utils/cn';

interface RibbonMarkProps {
  size?: number;
  className?: string;
  /** Gentle float + sway — used in the hero. */
  animated?: boolean;
  /**
   * 'gradient' (default) draws the rose gradient — for light surfaces.
   * 'current' inherits `currentColor` — use it on a brand-coloured tile,
   * where the gradient would disappear into the background.
   */
  tone?: 'gradient' | 'current';
}

/** The صحّتك pink-ribbon logo mark. */
export function RibbonMark({ size = 40, className, animated, tone = 'gradient' }: RibbonMarkProps) {
  // useId keeps the gradient unique — two marks on one page would otherwise
  // share an id and the second would reference the first's def.
  const gradientId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      className={cn(animated && 'animate-ribbon-float', className)}
      aria-hidden
      focusable="false"
    >
      {tone === 'gradient' && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FF5C95" />
            <stop offset="1" stopColor="#D63384" />
          </linearGradient>
        </defs>
      )}
      <g
        fill="none"
        stroke={tone === 'gradient' ? `url(#${gradientId})` : 'currentColor'}
        strokeWidth="15"
        strokeLinecap="round"
      >
        <path d="M64 30 C52 46 42 54 42 64 C42 80 66 92 86 104" />
        <path d="M64 30 C76 46 86 54 86 64 C86 80 62 92 42 104" />
      </g>
    </svg>
  );
}
