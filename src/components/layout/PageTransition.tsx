import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      /* The Footer now owns the bottom-nav clearance (pb-28), so main only needs
         breathing room before it. */
      className="mx-auto w-full max-w-content px-4 pb-12 pt-6 sm:px-6"
    >
      {children}
    </motion.main>
  );
}
