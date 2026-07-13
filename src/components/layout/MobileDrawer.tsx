import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun, X } from 'lucide-react';
import { LanguageSwitch } from '@/components/ui/LanguageSwitch';
import { LogoLockup } from '@/components/ui/LogoLockup';
import { ZelligeAccent } from '@/components/ui/ZelligeAccent';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import type { Translation } from '@/i18n';
import { cn } from '@/utils/cn';

export interface DrawerLink {
  to: string;
  key: keyof Translation['nav'];
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  links: DrawerLink[];
}

/**
 * The mobile navigation drawer.
 *
 * Slides in from the leading edge, so it opens from the right in Arabic and the
 * left in French/English without any RTL branching — `start-0` handles it.
 *
 * Accessibility: a modal dialog. It locks body scroll, closes on Escape or a
 * backdrop tap, moves focus to the close button on open, and returns focus to
 * whatever opened it on close.
 */
export function MobileDrawer({ open, onClose, links }: MobileDrawerProps) {
  const { t, isRTL } = useLanguage();
  const { resolved, toggle } = useTheme();
  const isDark = resolved === 'dark';
  // The panel is pinned to the logical start edge, which is the RIGHT in Arabic.
  // framer's `x` is physical, so the off-screen side has to flip with direction.
  const offscreenX = isRTL ? '100%' : '-100%';
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    // Focus lands inside the dialog, not left behind on the page.
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(focusTimer);
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <motion.div
            className="absolute inset-0 bg-sand-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.common.menu}
            initial={{ x: offscreenX }}
            animate={{ x: 0 }}
            exit={{ x: offscreenX }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className="absolute bottom-0 start-0 top-0 flex w-[86%] max-w-sm flex-col overflow-hidden border-e border-line bg-elevated shadow-overlay pb-safe pt-safe"
          >
            <ZelligeAccent
              variant="corner"
              tone="gold"
              size={88}
              opacity={0.14}
              className="pointer-events-none absolute end-0 top-0 rotate-90"
            />

            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <LogoLockup />
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={t.common.close}
                className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-pill text-muted transition hover:bg-sunken hover:text-ink"
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <nav aria-label={t.common.menu} className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-1">
                {links.map(({ to, key }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'focus-ring flex min-h-12 items-center rounded-lg px-4 text-body font-bold transition',
                          isActive
                            ? 'bg-accent-soft text-accent-text'
                            : 'text-muted hover:bg-sunken hover:text-ink',
                        )
                      }
                    >
                      {t.nav[key]}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-4 border-t border-line px-5 py-5">
              <div>
                <p className="mb-2 text-overline uppercase text-faint">{t.settings.language}</p>
                <LanguageSwitch variant="inline" />
              </div>

              <button
                type="button"
                onClick={toggle}
                aria-pressed={isDark}
                className="focus-ring flex min-h-12 w-full items-center justify-between rounded-lg border border-line px-4 text-body-sm font-bold text-ink transition hover:bg-sunken"
              >
                <span>{t.settings.theme}</span>
                <span className="flex items-center gap-2 text-accent-text">
                  {isDark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
                  {isDark ? t.settings.dark : t.settings.light}
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
