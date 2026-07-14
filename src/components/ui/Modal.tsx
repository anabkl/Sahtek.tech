import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

/** Everything a keyboard can land on, in DOM order. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Mobile-first bottom-sheet modal; centred dialog on larger screens.
 *
 * Implements the full dialog contract, not just the look of one: focus moves
 * into the panel on open, Tab is trapped inside it (wrapping at both ends),
 * Escape closes, and focus returns to whatever opened it. Without those, a
 * dialog is a picture of a dialog — it looks modal and behaves like a page with
 * something painted over it.
 */
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const { t } = useLanguage();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    /* Remember who opened us, so focus can go back there on close. Without
       this, dismissing the dialog drops focus to <body> and a keyboard user
       restarts from the top of the page. */
    const opener = document.activeElement as HTMLElement | null;

    /* Move focus INTO the dialog. Previously focus stayed on <body>: the dialog
       appeared, and Tab walked the page *behind* the scrim — the logo, the
       language switch — content the user cannot even see. A screen-reader user
       had no way to reach the dialog's own content or its close button.
       rAF: the panel is mounted by AnimatePresence on the next frame. */
    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const first = panel.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel).focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Trap Tab inside the dialog — wrap at both ends.
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;

      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (!panel.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      opener?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            /* -1: focusable by script (so an empty dialog can still receive
               focus) but never a Tab stop of its own. */
            tabIndex={-1}
            className={cn(
              'relative flex max-h-[88vh] w-full flex-col overflow-hidden bg-card',
              'rounded-t-4xl sm:max-w-lg sm:rounded-4xl',
              'shadow-petal-xl',
              className,
            )}
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.6 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-line sm:hidden" />
            {title && (
              <div className="flex items-center justify-between px-6 pb-2 pt-4">
                <h3 className="text-lg font-bold text-ink">{title}</h3>
                <button
                  onClick={onClose}
                  aria-label={t.common.close}
                  className="focus-ring rounded-full p-1.5 text-muted hover:bg-line"
                >
                  <X size={20} />
                </button>
              </div>
            )}
            <div className="overflow-y-auto px-6 pb-7 pt-2">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
