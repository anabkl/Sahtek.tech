import { useRef } from 'react';
import { useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';

interface Parallax {
  /** Attach to the element that scrolls past. */
  ref: React.RefObject<HTMLDivElement>;
  /** Bind to `style={{ y }}`. A frozen 0 under reduced motion. */
  y: MotionValue<number>;
}

/**
 * Light scroll parallax.
 *
 * IMPORTANT: <MotionConfig reducedMotion="user"> does NOT reach this. It strips
 * transforms from `animate`/variants, but a parallax is a transform driven by a
 * MotionValue through `style` — framer has no way to know it is decorative. So
 * this hook checks the preference itself and returns a constant 0, which is the
 * one motion on the site that could genuinely make someone with vestibular
 * sensitivity feel unwell.
 *
 * `distance` is deliberately tiny. Parallax stops being elegant the moment it is
 * noticeable — 20-40px across a whole hero is the range; 100px is a fairground.
 *
 * @example
 * const { ref, y } = useParallax(24);
 * <div ref={ref}><motion.div style={{ y }}>…</motion.div></div>
 */
export function useParallax(distance = 24): Parallax {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // A spring keeps it from tracking the scroll wheel 1:1, which reads cheap.
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 });

  const shift = useTransform(smooth, [0, 1], [distance, -distance]);
  const still = useTransform(smooth, () => 0);

  return { ref, y: reduce ? still : shift };
}
