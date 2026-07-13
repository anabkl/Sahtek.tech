import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 'soft'   — default frosted panel. Use over the page canvas.
   * 'strong' — denser blur. Use only over imagery or a gradient, where a soft
   *            panel would let too much noise through and hurt legibility.
   */
  tone?: 'soft' | 'strong';
  /** Hover lift. Only for cards that are actually clickable. */
  interactive?: boolean;
  padded?: boolean;
  /** Adds the brand bloom behind the card. One per view, at most. */
  glow?: boolean;
}

/**
 * Frosted surface built on the `.glass-panel` utility.
 *
 * HOUSE RULE (CLAUDE.md §4.3): glass is selective. One panel per view, never
 * stacked glass-on-glass — it goes muddy and contrast collapses. Text inside
 * must be `ink`/`muted`; `faint` is not legible on a translucent surface.
 *
 * @example
 * <GlassCard tone="strong" className="p-6">
 *   <h3 className="text-h4 text-ink">Private by default</h3>
 * </GlassCard>
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(function GlassCard(
  { tone = 'soft', interactive, padded = true, glow, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'glass-panel',
        tone === 'strong' && 'glass-strong',
        padded && 'p-5 sm:p-6',
        glow && 'glow-brand',
        interactive &&
          'cursor-pointer transition duration-base ease-soft hover:-translate-y-1 hover:shadow-e4 active:translate-y-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
