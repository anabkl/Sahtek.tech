import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/utils/cn';

export interface NavTarget {
  /** Visible pill label. */
  label: string;
  /** Spoken/screen-reader prefix, e.g. "Previous" or "Next". */
  aria: string;
  onActivate: () => void;
}

interface NavArrowsProps {
  prev: NavTarget | null;
  next: NavTarget | null;
  /** Re-keys the AnimatePresence so labels re-animate on context change (page or tab). */
  transitionKey: string;
}

const PILL =
  'fixed bottom-[72px] z-[60] flex h-11 max-w-[120px] items-center gap-1.5 rounded-full border border-primary-200 bg-white/95 px-4 text-xs font-black text-primary-700 shadow-xl backdrop-blur-md transition-shadow hover:shadow-2xl md:bottom-6 md:max-w-[180px] md:text-sm';

/**
 * Two fixed corner pills for sequential navigation. The "previous" pill sits on
 * the leading edge (left in LTR, right in RTL); "next" on the trailing edge.
 * Chevrons and slide-in directions flip with the active language.
 */
export function NavArrows({ prev, next, transitionKey }: NavArrowsProps) {
  const { isRTL } = useLanguage();

  const prevSide = isRTL ? 'right-4' : 'left-4';
  const nextSide = isRTL ? 'left-4' : 'right-4';

  return (
    <>
      <AnimatePresence mode="wait">
        {prev && (
          <motion.button
            key={`prev-${transitionKey}-${prev.label}`}
            type="button"
            aria-label={`${prev.aria}: ${prev.label}`}
            onClick={prev.onActivate}
            className={cn(PILL, prevSide)}
            initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? 40 : -40 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {isRTL ? <ChevronRight size={18} className="shrink-0" /> : <ChevronLeft size={18} className="shrink-0" />}
            <span className="truncate">{prev.label}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {next && (
          <motion.button
            key={`next-${transitionKey}-${next.label}`}
            type="button"
            aria-label={`${next.aria}: ${next.label}`}
            onClick={next.onActivate}
            className={cn(PILL, nextSide)}
            initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? -40 : 40 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <span className="truncate">{next.label}</span>
            {isRTL ? <ChevronLeft size={18} className="shrink-0" /> : <ChevronRight size={18} className="shrink-0" />}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
