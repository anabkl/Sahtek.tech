import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DURATION, EASE_SOFT } from '@/motion/motion';

/**
 * The page-to-page transition.
 *
 * Opacity and transform ONLY. This used to animate `filter: blur(8px) → 0` on
 * every navigation, which looks lovely on a laptop and forces the compositor to
 * re-rasterise the entire page on every frame of every route change. On a
 * mid-range Android — most of the people this app is for — that is the
 * difference between a transition and a stutter.
 *
 * Reduced motion is handled by <MotionConfig reducedMotion="user"> in App.tsx:
 * the rise is dropped and the cross-fade remains.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: DURATION.base, ease: EASE_SOFT }}
      /* The Footer owns the bottom-nav clearance (pb-28), so main only needs
         breathing room before it. */
      className="mx-auto w-full max-w-content px-4 pb-12 pt-6 sm:px-6"
    >
      {children}
    </motion.main>
  );
}
