import type { ReactNode } from 'react';
import { HeartHandshake, LockKeyhole, ShieldCheck, Stethoscope } from 'lucide-react';
import { cn } from '@/utils/cn';

type Variant = 'medical' | 'privacy' | 'care' | 'seeDoctor';

interface SafetyNoteProps {
  /**
   * 'medical'   — the standing "this is not a diagnosis" note.
   * 'privacy'   — "your answers stay on your device".
   * 'care'      — a warm, reassuring aside.
   * 'seeDoctor' — the nudge to seek care. Calm, never alarming (HARD RULE 3):
   *               this is deliberately NOT red.
   */
  variant?: Variant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const STYLES: Record<Variant, { wrap: string; icon: typeof ShieldCheck; iconClass: string }> = {
  medical: { wrap: 'border-line bg-accent-soft', icon: ShieldCheck, iconClass: 'text-accent-text' },
  privacy: { wrap: 'border-line bg-calm-soft', icon: LockKeyhole, iconClass: 'text-calm-text' },
  care: { wrap: 'border-line bg-gold-soft', icon: HeartHandshake, iconClass: 'text-gold-text' },
  seeDoctor: { wrap: 'border-line bg-warn-soft', icon: Stethoscope, iconClass: 'text-warn-text' },
};

/**
 * The safety block. Sahtek gives awareness and guidance — never a diagnosis —
 * so a note like this appears on every page that educates, scores, guides or
 * answers (CLAUDE.md HARD RULE 2).
 *
 * `role="note"` makes it a landmark a screen reader can jump to, rather than a
 * paragraph that gets skimmed past.
 *
 * Prefer `<Disclaimer />` for the standard medical text — it is this component
 * with the copy already wired to i18n.
 *
 * @example
 * <SafetyNote variant="privacy">Your answers never leave this device.</SafetyNote>
 */
export function SafetyNote({ variant = 'medical', title, children, className }: SafetyNoteProps) {
  const { wrap, icon: Icon, iconClass } = STYLES[variant];

  return (
    <div className={cn('flex items-start gap-3 rounded-xl border px-4 py-3.5', wrap, className)} role="note">
      <Icon size={18} className={cn('mt-0.5 shrink-0', iconClass)} aria-hidden />
      <div className="min-w-0">
        {title && <p className="mb-1 text-body-sm font-bold text-ink">{title}</p>}
        <p className="text-caption leading-relaxed text-muted">{children}</p>
      </div>
    </div>
  );
}
