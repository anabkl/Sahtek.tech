import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Languages } from 'lucide-react';
import { LANGUAGE_META, SUPPORTED_LANGUAGES } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';
import type { Language } from '@/types/api';
import { cn } from '@/utils/cn';

interface LanguageSwitchProps {
  /**
   * 'menu'   — icon button + popover. For the navbar.
   * 'inline' — a flat row of options, always visible. For the drawer/footer.
   */
  variant?: 'menu' | 'inline';
  className?: string;
}

/**
 * Language switch. Darija first, then French, then English — the order comes
 * from SUPPORTED_LANGUAGES, which encodes the product's language priority.
 *
 * Changing language flips `dir` app-wide (handled in Layout), so the menu is
 * built with logical properties and needs no RTL special-casing.
 *
 * @example
 * <LanguageSwitch />                     // navbar popover
 * <LanguageSwitch variant="inline" />    // drawer / footer
 */
export function LanguageSwitch({ variant = 'menu', className }: LanguageSwitchProps) {
  const { t, lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (code: Language) => {
    setLang(code);
    setOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)} role="group" aria-label={t.settings.language}>
        {SUPPORTED_LANGUAGES.map((code) => {
          const active = code === lang;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-pressed={active}
              className={cn(
                'focus-ring min-h-11 rounded-pill border px-4 text-body-sm font-bold transition',
                active
                  ? 'border-transparent bg-brand-cta text-white shadow-petal'
                  : 'border-line bg-card text-muted hover:border-primary-200 hover:text-ink',
              )}
            >
              {LANGUAGE_META[code].native}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t.settings.language}: ${LANGUAGE_META[lang].native}`}
        className="focus-ring flex min-h-11 items-center gap-1.5 rounded-pill border border-line bg-card px-3 text-body-sm font-bold text-ink shadow-petal transition hover:border-primary-200 active:scale-95"
      >
        <Languages size={16} className="text-accent-text" aria-hidden />
        <span className="hidden sm:inline">{LANGUAGE_META[lang].native}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            aria-label={t.settings.language}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute end-0 top-[calc(100%+8px)] z-50 min-w-[11rem] overflow-hidden rounded-xl border border-line bg-elevated p-1.5 shadow-e3"
          >
            {SUPPORTED_LANGUAGES.map((code) => {
              const active = code === lang;
              return (
                <li key={code} role="none">
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => choose(code)}
                    className={cn(
                      'focus-ring flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 text-body-sm font-bold transition',
                      active ? 'bg-accent-soft text-accent-text' : 'text-muted hover:bg-sunken hover:text-ink',
                    )}
                  >
                    <span>{LANGUAGE_META[code].native}</span>
                    {active && <Check size={16} aria-hidden />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
