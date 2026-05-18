import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Accent = 'none' | 'primary' | 'teal' | 'blue' | 'purple' | 'gold';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Coloured top border indicating the card's category. */
  accent?: Accent;
  /** Adds hover lift — use for clickable cards. */
  interactive?: boolean;
  /** Frosted-glass background instead of solid. */
  glass?: boolean;
  padded?: boolean;
}

const ACCENTS: Record<Accent, string> = {
  none: '',
  primary: 'border-t-4 border-t-primary-500',
  teal: 'border-t-4 border-t-accent-teal',
  blue: 'border-t-4 border-t-accent-blue',
  purple: 'border-t-4 border-t-accent-purple',
  gold: 'border-t-4 border-t-accent-gold',
};

/** Soft, rounded surface — the building block for most of the UI. */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { accent = 'none', interactive, glass, padded = true, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-3xl border border-line shadow-petal',
        glass ? 'glass' : 'bg-card',
        padded && 'p-5',
        interactive &&
          'cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-petal-lg active:translate-y-0',
        ACCENTS[accent],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
