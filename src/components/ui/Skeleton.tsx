import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
  rounded?: string;
}

/** Shimmering loading placeholder. */
export function Skeleton({ className, rounded = 'rounded-2xl' }: SkeletonProps) {
  return (
    <div className={cn('relative overflow-hidden bg-line', rounded, className)}>
      <div className="absolute inset-0 -translate-x-full motion-safe:animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10" />
    </div>
  );
}

/** A few stacked skeleton lines — handy as a card placeholder. */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          rounded="rounded-full"
          className={cn('h-3.5', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}
