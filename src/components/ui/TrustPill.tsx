import type { ComponentType, ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Tone = 'calm' | 'brand' | 'gold' | 'neutral';

interface TrustPillProps {
  /** A lucide icon component, e.g. `LockKeyhole`. */
  icon?: ComponentType<{ size?: number | string; className?: string }>;
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

/* Every pairing below is an AA-safe text-on-soft-background combination from
   the token layer — no raw colours, no guessing. */
const TONES: Record<Tone, string> = {
  calm: 'bg-calm-soft text-calm-text',
  brand: 'bg-accent-soft text-accent-text',
  gold: 'bg-gold-soft text-gold-text',
  neutral: 'bg-sunken text-muted',
};

/**
 * A quiet reassurance chip — "Private", "No account needed", "Free".
 *
 * This is presentational, not a status: it renders as plain text in a pill.
 * For a live status value (risk band, step count) use `Badge` instead.
 *
 * @example
 * <TrustPill icon={LockKeyhole} tone="calm">Stays on your device</TrustPill>
 */
export function TrustPill({ icon: Icon, children, tone = 'calm', className }: TrustPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-caption font-bold',
        TONES[tone],
        className,
      )}
    >
      {Icon && <Icon size={14} aria-hidden />}
      {children}
    </span>
  );
}
