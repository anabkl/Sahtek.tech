import type { Variants } from 'framer-motion';

/**
 * The motion system.
 *
 * One set of durations, one easing curve, one distance. Everything on the site
 * enters the same way, which is what makes motion read as "premium" rather than
 * as a pile of individually-tasteful animations that do not agree with each
 * other.
 *
 * RULES (CLAUDE.md §4.3):
 * - Entrances are short and soft: opacity + a small rise, 0.3-0.5s, ease-out.
 * - Ambient loops are slow (6-9s) and never demand attention.
 * - Never bounce, never spin for delight.
 * - Animate ONLY `opacity` and `transform`. Both are composited on the GPU.
 *   Animating `filter`, `width`, `height` or `box-shadow` repaints every frame
 *   and is what makes a mid-range Android phone stutter.
 *
 * REDUCED MOTION is handled globally by <MotionConfig reducedMotion="user"> in
 * App.tsx: framer then drops every transform and layout animation and keeps
 * only opacity, so the variants below soften automatically and no component has
 * to remember. The two things MotionConfig cannot reach — scroll-linked
 * transforms (useParallax) and CSS keyframes — are guarded at their own source.
 */

/** Matches --ease-soft in tokens.css. */
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.2,
  base: 0.35,
  slow: 0.5,
} as const;

/** The rise. Small on purpose — 24px is a gesture, 60px is a slide. */
export const RISE = 16;

/**
 * Default viewport for scroll reveals.
 *
 * `amount: 0.1` — reveal as soon as a sliver is on screen. A stricter threshold
 * risks content that is visibly in view but "not in view enough", which leaves
 * a section sitting at opacity 0 forever. Fail toward showing the content.
 *
 * `once: true` — never re-animate. Re-entering elements that fade on every
 * scroll-by is the noisiest thing a site can do.
 */
export const VIEWPORT = { once: true, amount: 0.1 } as const;

/** A section, or any single block, entering. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: RISE },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_SOFT },
  },
};

/** Opacity only — for things that should appear without moving. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: DURATION.slow, ease: EASE_SOFT } },
};

/**
 * A list whose children arrive one after another.
 *
 * Keep `stagger` small (0.04-0.08). Across a 12-card grid, 0.15 means the last
 * card lands nearly two seconds after the first, which stops feeling elegant and
 * starts feeling broken.
 */
export function staggerContainer(stagger = 0.05): Variants {
  return {
    hidden: {},
    shown: { transition: { staggerChildren: stagger } },
  };
}

/** The child of a staggerContainer. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: RISE },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_SOFT },
  },
};
