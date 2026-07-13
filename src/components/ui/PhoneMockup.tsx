import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface PhoneMockupProps {
  /** What shows on the screen — a screenshot, or live JSX. */
  children: ReactNode;
  /** Gentle float. Skipped automatically under prefers-reduced-motion. */
  floating?: boolean;
  /** Brand bloom behind the device. */
  glow?: boolean;
  className?: string;
}

/**
 * A phone frame for marketing shots — landing hero, feature sections.
 *
 * Purely decorative chrome: the frame, notch and buttons are `aria-hidden`, so
 * a screen reader hears only what you put inside. If the screen content is an
 * image, give it a real alt; if it is live JSX, it is read as normal content.
 *
 * @example
 * <PhoneMockup floating glow>
 *   <img src="/screens/self-check.png" alt="The guided self-check" />
 * </PhoneMockup>
 */
export function PhoneMockup({ children, floating, glow, className }: PhoneMockupProps) {
  return (
    <div className={cn('relative mx-auto w-full max-w-[19rem]', className)}>
      {glow && (
        <div
          aria-hidden
          className="absolute inset-6 -z-10 rounded-[3rem] bg-brand-cta opacity-30 blur-3xl"
        />
      )}

      <div
        className={cn(
          'relative rounded-[2.75rem] border-[3px] border-line-strong bg-sand-900 p-2.5 shadow-e4',
          floating && 'motion-safe:animate-ribbon-float',
        )}
        style={floating ? { animationDuration: '9s' } : undefined}
      >
        {/* Side buttons — decoration only. */}
        <span aria-hidden className="absolute -start-1 top-24 h-12 w-1 rounded-pill bg-line-strong" />
        <span aria-hidden className="absolute -start-1 top-40 h-8 w-1 rounded-pill bg-line-strong" />
        <span aria-hidden className="absolute -end-1 top-32 h-16 w-1 rounded-pill bg-line-strong" />

        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.15rem] bg-canvas">
          {/* Notch. Physically centred — `left`, not `start`: with a logical
              property this drifts off-centre when the app flips to RTL. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-pill bg-sand-900"
          />
          <div className="h-full w-full overflow-hidden [&>img]:h-full [&>img]:w-full [&>img]:object-cover">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
