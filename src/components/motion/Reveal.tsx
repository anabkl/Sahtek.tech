import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';
import { DURATION, EASE_SOFT, VIEWPORT, fadeUp, staggerContainer, staggerItem } from '@/motion/motion';

type RevealProps = {
  children: ReactNode;
  /** Seconds. Use sparingly — a delay on a scroll reveal is a delay she waits through. */
  delay?: number;
  /** Any element. `section`, `ul`, `li`, `article`… */
  as?: ElementType;
  className?: string;
} & Omit<HTMLMotionProps<'div'>, 'children' | 'variants' | 'initial' | 'whileInView' | 'viewport'>;

/**
 * A block that fades up as it scrolls into view.
 *
 * This replaces the hand-written `initial/whileInView/viewport/transition` block
 * that was copy-pasted into ~28 components — where it had already drifted into
 * three different distances, two easings and two viewport thresholds.
 *
 * Reduced motion needs no handling here: <MotionConfig reducedMotion="user"> in
 * App.tsx strips the transform and leaves the fade.
 *
 * @example
 * <Reveal as="section" className="py-12">…</Reveal>
 */
export function Reveal({ children, delay = 0, as = 'div', className, ...props }: RevealProps) {
  const Component = motion[as as 'div'] ?? motion.div;

  return (
    <Component
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      transition={delay ? { duration: DURATION.slow, ease: EASE_SOFT, delay } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}

type GroupProps = {
  children: ReactNode;
  /** Seconds between children. Keep it small: 0.04–0.08. */
  stagger?: number;
  as?: ElementType;
  className?: string;
} & Omit<HTMLMotionProps<'div'>, 'children' | 'variants' | 'initial' | 'whileInView' | 'viewport'>;

/**
 * A list whose children arrive one after another. Pair with <RevealItem>.
 *
 * @example
 * <RevealGroup as="ul" stagger={0.04} className="grid gap-4">
 *   {items.map((item) => <RevealItem as="li" key={item.id}>…</RevealItem>)}
 * </RevealGroup>
 */
export function RevealGroup({ children, stagger = 0.05, as = 'div', className, ...props }: GroupProps) {
  const Component = motion[as as 'div'] ?? motion.div;

  return (
    <Component
      className={className}
      variants={staggerContainer(stagger)}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      {...props}
    >
      {children}
    </Component>
  );
}

/** A child of <RevealGroup>. Inherits the parent's stagger — no props needed. */
export function RevealItem({
  children,
  as = 'div',
  className,
  ...props
}: Omit<GroupProps, 'stagger'>) {
  const Component = motion[as as 'div'] ?? motion.div;

  return (
    <Component className={className} variants={staggerItem} {...props}>
      {children}
    </Component>
  );
}
