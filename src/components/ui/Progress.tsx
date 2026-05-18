import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ProgressProps {
  /** 0–100. */
  value: number;
  className?: string;
  tone?: 'primary' | 'low' | 'moderate' | 'high';
}

const TONE_FILL: Record<NonNullable<ProgressProps['tone']>, string> = {
  primary: 'bg-rose-gradient',
  low: 'bg-risk-low',
  moderate: 'bg-risk-moderate',
  high: 'bg-risk-high',
};

/** Horizontal progress bar with an animated fill. */
export function Progress({ value, className, tone = 'primary' }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn('h-2.5 w-full overflow-hidden rounded-full bg-line', className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-700 ease-out', TONE_FILL[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

interface CircularProgressProps {
  /** 0–100. */
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  trackClassName?: string;
  progressClassName?: string;
  children?: ReactNode;
}

/** SVG ring progress with a centred slot for content. */
export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  className,
  trackClassName = 'text-line',
  progressClassName = 'text-primary-500',
  children,
}: CircularProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={trackClassName}
          stroke="currentColor"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={progressClassName}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}
