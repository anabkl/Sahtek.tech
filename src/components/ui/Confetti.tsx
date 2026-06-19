import { motion, useReducedMotion } from 'framer-motion';

const COLORS = ['#D63384', '#FF5C95', '#16A34A', '#F97316', '#14B8A6', '#E0A458'];

/** Radial particle burst for celebratory moments. Mount inside a `relative` parent. */
export function Confetti({ count = 20, originY = '50%' }: { count?: number; originY?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const dist = 70 + Math.random() * 55;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 h-2 w-2 rounded-[2px]"
            style={{ top: originY, backgroundColor: COLORS[i % COLORS.length] }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 0.4, rotate: Math.random() * 360 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}
