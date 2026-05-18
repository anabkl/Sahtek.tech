import { cn } from '@/utils/cn';

interface RibbonMarkProps {
  size?: number;
  className?: string;
  /** Gentle float + sway — used in the hero. */
  animated?: boolean;
}

/** The صحّتك pink-ribbon logo mark. */
export function RibbonMark({ size = 40, className, animated }: RibbonMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      className={cn(animated && 'animate-ribbon-float', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF5C95" />
          <stop offset="1" stopColor="#D63384" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke="url(#ribbonGrad)"
        strokeWidth="15"
        strokeLinecap="round"
      >
        <path d="M64 30 C52 46 42 54 42 64 C42 80 66 92 86 104" />
        <path d="M64 30 C76 46 86 54 86 64 C86 80 62 92 42 104" />
      </g>
    </svg>
  );
}
