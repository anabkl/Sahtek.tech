import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Tone = 'primary' | 'high' | 'medium' | 'low' | 'neutral' | 'info';

interface BadgeProps {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const TONES: Record<Tone, string> = {
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-200',
  high: 'bg-red-100 text-risk-high dark:bg-red-500/15 dark:text-red-300',
  medium: 'bg-amber-100 text-risk-moderate dark:bg-amber-500/15 dark:text-amber-300',
  low: 'bg-green-100 text-risk-low dark:bg-green-500/15 dark:text-green-300',
  info: 'bg-blue-100 text-accent-blue dark:bg-blue-500/15 dark:text-blue-300',
  neutral: 'bg-line text-muted',
};

/** Small status pill. */
export function Badge({ tone = 'primary', icon, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
